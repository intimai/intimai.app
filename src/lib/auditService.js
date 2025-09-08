import { supabase } from './customSupabaseClient';

/**
 * Serviço de Auditoria para Logs LGPD
 * Registra todas as ações críticas do sistema para conformidade
 */
export const auditService = {
  /**
   * Registra uma ação no log de auditoria
   * @param {Object} params - Parâmetros do log
   * @param {Object} params.user - Dados do usuário (do useAuth)
   * @param {string} params.actionType - Tipo da ação (CREATE_INTIMACAO, CANCEL_INTIMACAO, etc)
   * @param {string} params.resourceType - Tipo do recurso (intimacao, user_terms, etc)
   * @param {string} params.resourceId - ID do recurso afetado
   * @param {Object} params.details - Detalhes adicionais da ação
   */
  async logAction({ user, actionType, resourceType, resourceId, details = {} }) {
    try {
      // Obter IP do cliente (quando possível)
      const ipAddress = await this.getClientIP();
      
      const logData = {
        user_id: user?.id || null,
        user_email: user?.email || null,
        user_nome: user?.nome || null,
        delegacia_nome: user?.delegaciaNome || null,
        action_type: actionType,
        resource_type: resourceType,
        resource_id: resourceId?.toString() || null,
        details: details,
        ip_address: ipAddress,
        user_agent: navigator?.userAgent || null,
      };

      console.log(`📝 [AUDIT] ${actionType} - ${resourceType}:${resourceId}`, logData);

      // Usar service_role key para inserir logs (bypass RLS)
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([logData])
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao registrar log de auditoria:', error);
        // Não falhar a operação principal se o log falhar
        return null;
      }

      console.log('✅ Log de auditoria registrado:', data.id);
      return data;

    } catch (error) {
      console.error('❌ Exceção no serviço de auditoria:', error);
      // Não falhar a operação principal se o log falhar
      return null;
    }
  },

  /**
   * Logs específicos para ações de intimação
   */
  async logCreateIntimacao(user, intimacao) {
    return this.logAction({
      user,
      actionType: 'CREATE_INTIMACAO',
      resourceType: 'intimacao',
      resourceId: intimacao.intimacaoId,
      details: {
        nomeIntimado: intimacao.nomeIntimado,
        documento: intimacao.documento,
        numeroProcesso: intimacao.numeroProcesso,
        tipoIntimacao: intimacao.tipoIntimacao,
        delegaciaId: intimacao.delegaciaId,
      }
    });
  },

  async logCancelIntimacao(user, intimacaoId, motivo) {
    return this.logAction({
      user,
      actionType: 'CANCEL_INTIMACAO',
      resourceType: 'intimacao',
      resourceId: intimacaoId,
      details: {
        motivo: motivo,
        timestamp: new Date().toISOString()
      }
    });
  },

  async logReativarIntimacao(user, intimacaoId) {
    return this.logAction({
      user,
      actionType: 'REATIVAR_INTIMACAO',
      resourceType: 'intimacao',
      resourceId: intimacaoId,
      details: {
        timestamp: new Date().toISOString()
      }
    });
  },

  async logAcceptTerms(user) {
    return this.logAction({
      user,
      actionType: 'ACCEPT_TERMS',
      resourceType: 'user_terms',
      resourceId: user?.userId,
      details: {
        terms_version: '1.0', // Versão dos termos aceitos
        timestamp: new Date().toISOString()
      }
    });
  },

  /**
   * Utilitário para obter IP do cliente
   */
  async getClientIP() {
    try {
      // Em produção, você pode usar um serviço como ipapi.co
      // Por enquanto, retornamos null (será preenchido pelo servidor)
      return null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Buscar logs de auditoria (para dashboard futuro)
   */
  async getLogs({ userId, actionType, limit = 50, offset = 0 } = {}) {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (actionType) {
        query = query.eq('action_type', actionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erro ao buscar logs de auditoria:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ Exceção ao buscar logs:', error);
      return [];
    }
  }
};

export default auditService;
