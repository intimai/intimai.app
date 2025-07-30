import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, User, FileText, Phone, FileType, Hash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { toast } from '@/components/ui/use-toast';


const AgendaItem = ({ intimacao }) => {
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cancelIntimacao } = useIntimacoes();

  const handleOpenModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelIntimacao(intimacao.id);
      toast({ title: "Solicitação de cancelamento enviada." });
      setIsModalOpen(false);
    } catch (error) {
      toast({ title: "Erro ao solicitar cancelamento", variant: "destructive" });
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    return `${hour}:${minute}`;
  };

  return (
    <li className="bg-background p-4 rounded-lg shadow">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <p className="font-bold flex items-center"><User className="w-4 h-4 mr-2 text-chart-agendadas" />{intimacao.intimadoNome}</p>
                    <div className="flex items-center mt-1">
            <p className="text-sm text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2 text-chart-entregues" />{formatTime(intimacao.horaAgendada)}</p>
            <Button variant="ghost" size="icon" onClick={handleOpenModal} className="h-6 w-6 ml-2">
                <X className="w-4 h-4 text-chart-canceladas" />
              </Button>
          </div>
        </div>
        <button className="focus:outline-none">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoItem icon={<FileText />} value={intimacao.documento} />
            <InfoItem icon={<Phone />} value={intimacao.telefone} />
            <InfoItem icon={<FileType />} value={intimacao.tipoProcedimento} />
            <InfoItem icon={<Hash />} value={intimacao.numeroProcedimento} />
          </div>
        </motion.div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmar Cancelamento"
      >
        <p>Você tem certeza que deseja solicitar o cancelamento desta intimação agendada?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não poderá ser desfeita.</p>
      </ConfirmationModal>
    </li>
  );
};

const InfoItem = ({ icon, value }) => (
    <div className="flex items-center gap-2">
        <div className="text-gray-400">{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
        <div>
            <p className="font-normal text-gray-300">{value || 'N/A'}</p>
        </div>
    </div>
);

export function AgendaDoDia({ agendamentos }) {
  if (!agendamentos) {
    return <p>Carregando agendamentos...</p>;
  }

  if (agendamentos.length === 0) {
    return <p>Nenhum agendamento para esta data.</p>;
  }

  return (
    <ul className="space-y-4">
      {agendamentos.map((intimacao) => (
        <AgendaItem key={intimacao.id} intimacao={intimacao} />
      ))}
    </ul>
  );
}
