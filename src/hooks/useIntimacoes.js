import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useIntimacoes() {
  const { user } = useAuth();
  const [intimacoes, setIntimacoes] = useState([]);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIntimacoes = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('intimacoes')
      .select('id, intimadoNome, status, documento, telefone, dataAgendada, horaAgendada, tipoProcedimento, numeroProcedimento, motivo, criadoEm, primeiraDisponibilidade')
      .eq('userId', user.id)
      .order('criadoEm', { ascending: false });

    if (error) {
      console.error('Erro ao buscar intimações:', error);
    } else {
      setIntimacoes(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchIntimacoes();

    const channel = supabase
      .channel('intimacoes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'intimacoes' },
        (payload) => {
          fetchIntimacoes();
          // The component will be responsible for re-fetching daily appointments
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchIntimacoes]);

  const createIntimacao = async (intimacaoData) => {
    if (!user) throw new Error("Usuário não autenticado");

    const { data: userData } = await supabase
      .from('usuarios')
      .select('delegaciaId, delegadoResponsavel')
      .eq('userId', user.id)
      .single();

    if (!userData) throw new Error("Perfil do usuário não encontrado.");

    const { data, error } = await supabase
      .from('intimacoes')
      .insert([{
        ...intimacaoData,
        userId: user.id,
        delegaciaId: userData.delegaciaId,
        delegadoResponsavel: userData.delegadoResponsavel,
        status: 'pendente',
        criadoEm: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    return data;
  };

  const cancelIntimacao = async (intimacaoId) => {
    const { data, error } = await supabase
      .from('intimacoes')
      .update({ cancelamentoEmAndamento: true })
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
      .select('id, intimadoNome, horaAgendada, documento, telefone, tipoProcedimento, numeroProcedimento')
      .eq('userId', user.id)
      .eq('dataAgendada', date)
      .eq('status', 'agendada')
      .order('horaAgendada', { ascending: true });

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setAgendamentosDoDia([]);
    } else {
      setAgendamentosDoDia(data);
    }
    setLoading(false);
  }, [user]);

  return {
    intimacoes,
    agendamentosDoDia,
    loading,
    fetchAgendamentos,
    createIntimacao,
    cancelIntimacao,
  };
}