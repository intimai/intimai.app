import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { triggerWebhook } from '@/lib/webhookService';
import { encryptSensitiveData, decryptSensitiveData } from '@/lib/encryptionService';

export function useIntimacoes() {
  const { user } = useAuth();
  const [intimacoes, setIntimacoes] = useState([]);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(20); // Itens por página fixo
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Função para descriptografar dados antes de exibir
  const decryptIntimacoesData = useCallback(async (intimacoesData) => {
    if (!intimacoesData || intimacoesData.length === 0) return intimacoesData;
    
    const decryptedIntimacoes = await Promise.all(
      intimacoesData.map(async (intimacao) => {
        try {
          const decryptedData = await decryptSensitiveData(intimacao);
          return decryptedData;
        } catch (error) {
          console.error('Erro ao descriptografar intimação:', error);
          return intimacao; // Retorna dados originais em caso de erro
        }
      })
    );
    
    return decryptedIntimacoes;
  }, []);

  const fetchIntimacoes = useCallback(async (page = 1, statusFilter = null, searchTerm = '') => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Calcular offset para paginação
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    // Construir query base
    let query = supabase
      .from('intimacoes')
      .select('id, intimadoNome, status, documento, telefone, dataAgendada, horaAgendada, tipoProcedimento, numeroProcedimento, motivo, criadoEm, primeiraDisponibilidade, cancelamentoEmAndamento, reativada', { count: 'exact' })
      .eq('userId', user.id);
    
    // Aplicar filtros se fornecidos
    if (statusFilter && statusFilter !== 'todas') {
      query = query.eq('status', statusFilter);
    }
    
    if (searchTerm) {
      query = query.or(`intimadoNome.ilike.%${searchTerm}%,documento.ilike.%${searchTerm}%`);
    }
    
    // Aplicar ordenação e paginação
    query = query
      .order('criadoEm', { ascending: false })
      .range(from, to);

    const { data, error, count } = await query;

    let decryptedData = [];
    
    if (error) {
      console.error('Erro ao buscar intimações:', error);
      setIntimacoes([]);
      setTotalItems(0);
    } else {
      // Descriptografar dados antes de definir no estado
      decryptedData = await decryptIntimacoesData(data || []);
      
      // Forçar re-render criando um novo array com timestamp
      const timestamp = Date.now();
      setIntimacoes([...decryptedData]);
      setTotalItems(count || 0);
      setRefreshKey(timestamp);
      
      // Calcular informações de paginação
      const totalPages = Math.ceil((count || 0) / itemsPerPage);
      setHasNextPage(page < totalPages);
      setHasPreviousPage(page > 1);
      setCurrentPage(page);
    }
    setLoading(false);
    
    // Retornar os dados para que possam ser usados
    return decryptedData;
  }, [user, itemsPerPage, decryptIntimacoesData]);

  useEffect(() => {
    if (!user) return;

    fetchIntimacoes();

    // Realtime desabilitado temporariamente para evitar erros
    // const channel = supabase
    //   .channel('intimacoes_changes')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'intimacoes' },
    //     () => {
    //       fetchIntimacoes();
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [fetchIntimacoes, user]);

  const createIntimacao = async (intimacaoData) => {
    if (!user) throw new Error("Usuário não autenticado");

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('delegaciaId, delegadoResponsavel')
      .eq('userId', user.id)
      .single();

    if (userError) {
      console.error('Erro ao buscar dados do usuário:', userError);
      throw userError;
    }

    if (!userData) throw new Error("Perfil do usuário não encontrado.");

    // Criptografar dados sensíveis antes de salvar
    const encryptedData = await encryptSensitiveData(intimacaoData);

    const { data, error } = await supabase
      .from('intimacoes')
      .insert([{
        ...encryptedData,
        userId: user.id,
        delegaciaId: userData.delegaciaId,
        delegadoResponsavel: userData.delegadoResponsavel,
        status: 'pendente',
        criadoEm: new Date().toISOString(),
      }])
      .select();

    if (error) {
      console.error('Erro ao inserir intimação:', error);
      throw error;
    }

    // Disparar o webhook após a criação bem-sucedida
    if (data && data.length > 0) {
      try {
        await triggerWebhook("CRIACAO", data[0], user);
      } catch (webhookError) {
        console.error("❌ Erro no webhook (intimação foi salva):", webhookError);
        // Não lançamos erro aqui para não quebrar o fluxo
      }
    }

    return data;
  };

  const reativarIntimacao = async (intimacaoOriginal, novaIntimacaoData) => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // 1. Criar nova intimação
    const { data, error } = await supabase
      .from('intimacoes')
      .insert([{
        ...novaIntimacaoData,
        userId: user.id,
        status: 'pendente',
        reativada: false
      }])
      .select();

    if (error) {
      console.error('Erro ao criar intimação reativada:', error);
      throw error;
    }

    // 2. Atualizar intimação original como reativada
    const { error: updateError } = await supabase
      .from("intimacoes")
      .update({ reativada: true })
      .eq("id", intimacaoOriginal.id);

    if (updateError) {
      console.error("Erro ao atualizar intimação original:", updateError);
      throw updateError;
    }

    // 3. Disparar webhook de REATIVAÇÃO (não de criação)
    if (data && data.length > 0) {
      try {
        await triggerWebhook("REATIVACAO", {
          intimacaoOriginal: intimacaoOriginal,
          intimacaoNova: data[0]
        }, user);
      } catch (webhookError) {
        console.error("❌ Erro no webhook de reativação (intimação foi salva):", webhookError);
        // Não lançamos erro aqui para não quebrar o fluxo
      }
    }

    return data;
  };

  const cancelIntimacao = async (intimacaoId) => {
    const intimacaoToCancel = intimacoes.find(i => i.id === intimacaoId);
    if (!intimacaoToCancel) {
      throw new Error("Intimação não encontrada para cancelamento.");
    }

    const { data, error } = await supabase
      .from('intimacoes')
      .update({ cancelamentoEmAndamento: true })
      .eq('id', intimacaoId)
      .select();

    if (error) {
      console.error("Erro ao atualizar a intimação para cancelamento:", error);
      throw error;
    }

    // Corrigindo a chamada do webhook
    try {
      await triggerWebhook("CANCELAMENTO", intimacaoToCancel, user);
    } catch (error) {
      console.error("Falha ao disparar o webhook de cancelamento:", error);
      // Não vamos lançar um erro para o usuário aqui, pois o cancelamento foi registrado no banco.
      // A falha no webhook deve ser tratada separadamente (ex: logs, monitoramento).
    }

    return data;
  };

  const marcarComoAusente = async (intimacaoId) => {
    const { data, error } = await supabase
      .from('intimacoes')
      .update({ status: 'ausente' })
      .eq('id', intimacaoId)
      .select();

    if (error) throw error;
    return data;
  };

  const marcarComoCompareceu = async (intimacaoId) => {
    const { data, error } = await supabase
      .from('intimacoes')
      .update({ status: 'finalizada' })
      .eq('id', intimacaoId)
      .select();

    if (error) throw error;
    return data;
  };

  const fetchAgendamentos = useCallback(async (date) => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('intimacoes')
      .select('id, intimadoNome, horaAgendada, documento, telefone, tipoProcedimento, numeroProcedimento, status, cancelamentoEmAndamento')
      .eq('userId', user.id)
      .eq('dataAgendada', date)
      .in('status', ['agendada', 'finalizada', 'ausente'])
      .order('horaAgendada', { ascending: true });

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAgendamentosDoDia([]);
    } else {
      // Descriptografar dados antes de definir no estado
      const decryptedData = await decryptIntimacoesData(data || []);
      setAgendamentosDoDia(decryptedData);
    }
    setLoading(false);
  }, [user, decryptIntimacoesData]);

  // Funções de navegação de páginas
  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      fetchIntimacoes(nextPage);
    }
  }, [hasNextPage, currentPage, fetchIntimacoes]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      const prevPage = currentPage - 1;
      fetchIntimacoes(prevPage);
    }
  }, [hasPreviousPage, currentPage, fetchIntimacoes]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= Math.ceil(totalItems / itemsPerPage)) {
      fetchIntimacoes(page);
    }
  }, [totalItems, itemsPerPage, fetchIntimacoes]);

  // Função para buscar com filtros (preserva compatibilidade)
  const fetchIntimacoesWithFilters = useCallback((statusFilter, searchTerm) => {
    fetchIntimacoes(1, statusFilter, searchTerm); // Sempre volta para página 1 ao filtrar
  }, [fetchIntimacoes]);

  return {
    // Dados existentes
    intimacoes,
    agendamentosDoDia,
    loading,
    
    // Funções existentes (mantém compatibilidade)
    fetchIntimacoes,
    fetchAgendamentos,
    createIntimacao,
    reativarIntimacao,
    cancelIntimacao,
    marcarComoAusente,
    marcarComoCompareceu,
    
    // Novos recursos de paginação
    currentPage,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    
    // Funções de navegação
    goToNextPage,
    goToPreviousPage,
    goToPage,
    fetchIntimacoesWithFilters,
    
    // Chave para forçar re-render
    refreshKey,
  };
}