import React from 'react';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { XCircle } from 'lucide-react';

export function AgendaDoDia({ selectedDate }) {
  const { agendamentosDoDia, loading, cancelIntimacao } = useIntimacoes();

  if (loading) {
    return <p>Carregando agendamentos...</p>;
  }

  if (agendamentosDoDia.length === 0) {
    return <p>Nenhum agendamento para esta data.</p>;
  }

  const handleCancel = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta intimação?')) {
      try {
        await cancelIntimacao(id);
        // A lista será atualizada automaticamente pelo listener do Supabase
      } catch (error) {
        console.error('Erro ao cancelar intimação:', error);
        alert('Não foi possível cancelar a intimação.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {agendamentosDoDia.map((intimacao) => (
        <div key={intimacao.id} className="bg-background p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="font-bold">{intimacao.nomeIntimado}</p>
            <p className="text-sm text-muted-foreground">{intimacao.horaAgendada}</p>
          </div>
          <button 
            onClick={() => handleCancel(intimacao.id)}
            className="text-red-500 hover:text-red-700"
            title="Cancelar Intimação"
          >
            <XCircle size={24} />
          </button>
        </div>
      ))}
    </div>
  );
}