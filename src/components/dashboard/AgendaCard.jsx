import React, { useState } from 'react';
import { Clock, User, FileText, Phone, FileType, Hash, X } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Tooltip from '../ui/Tooltip';
import CollapsibleCard from '../ui/CollapsibleCard';
import InfoItem from '../ui/InfoItem';

const AgendaItem = ({ intimacao, refetch }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isNoShowModalOpen, setIsNoShowModalOpen] = useState(false);
  const [isCompareceuModalOpen, setIsCompareceuModalOpen] = useState(false);
  const { cancelIntimacao, marcarComoAusente, marcarComoCompareceu } = useIntimacoes();

  const cancellableStatuses = ['agendada'];

  const handleOpenCancelModal = (e) => {
    e.stopPropagation();
    setIsCancelModalOpen(true);
  };

  const handleOpenNoShowModal = () => {
    setIsNoShowModalOpen(true);
  };
  
  const handleOpenCompareceuModal = () => {
    setIsCompareceuModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelIntimacao(intimacao.id);
      toast({ title: "Solicitação de cancelamento enviada." });
      setIsCancelModalOpen(false);
      if (refetch) refetch();
    } catch (error) {
      toast({ title: "Erro ao solicitar cancelamento", variant: "destructive" });
    }
  };

  const handleConfirmNoShow = async () => {
    try {
      await marcarComoAusente(intimacao.id);
      toast({ title: "Intimação marcada como 'Não Compareceu'." });
      setIsNoShowModalOpen(false);
      if (refetch) refetch();
    } catch (error) {
      toast({ title: "Erro ao marcar como 'Não Compareceu'", variant: "destructive" });
    }
  };
  
  const handleConfirmCompareceu = async () => {
    try {
      await marcarComoCompareceu(intimacao.id);
      toast({ title: "Intimação marcada como 'Compareceu'." });
      setIsCompareceuModalOpen(false);
      if (refetch) refetch();
    } catch (error) {
      toast({ title: "Erro ao marcar como 'Compareceu'", variant: "destructive" });
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    return `${hour}:${minute}`;
  };

  const handleComparecimentoChange = (value) => {
    if (value === 'nao') {
      handleOpenNoShowModal();
    } else if (value === 'sim' && intimacao.status === 'ausente') {
      handleOpenCompareceuModal();
    }
  };

  const renderActionsContent = () => (
    <div className="flex items-center gap-4 justify-end" onClick={(e) => e.stopPropagation()}>
      {intimacao.cancelamentoEmAndamento ? (
        <span className="text-xs text-muted-foreground italic w-full text-right block">Em cancelamento...</span>
      ) : cancellableStatuses.includes(intimacao.status) ? (
        <button
          onClick={handleOpenCancelModal}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-md p-1 -m-1"
        >
          <X style={{ color: '#C12F71' }} className="w-4 h-4" />
          Cancelar
        </button>
      ) : ['finalizada', 'ausente'].includes(intimacao.status) ? (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Compareceu?</span>
            <RadioGroup
              defaultValue={intimacao.status === 'finalizada' ? 'sim' : 'nao'}
              onValueChange={handleComparecimentoChange}
              className="flex items-center"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id={`sim-${intimacao.id}`} />
                <Label htmlFor={`sim-${intimacao.id}`}>Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id={`nao-${intimacao.id}`} />
                <Label htmlFor={`nao-${intimacao.id}`}>Não</Label>
              </div>
            </RadioGroup>
        </div>
      ) : null}
    </div>
  );

  const renderHeader = () => (
    <div className="w-full">
        <p className="font-bold flex items-center text-foreground"><User className="w-4 h-4 mr-2 text-chart-agendadas" />{intimacao.intimadoNome}</p>
        <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-muted-foreground flex items-center"><Clock className="w-4 h-4 mr-2 text-chart-entregues" />{formatTime(intimacao.horaAgendada)}</p>
            {renderActionsContent()}
        </div>
    </div>
  );

  const renderActions = () => null;

  return (
    <li className="bg-card p-4 rounded-lg border shadow transition-transform duration-300 hover:-translate-y-1">
      <CollapsibleCard header={renderHeader()} actions={renderActions()}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <InfoItem icon={<FileText />} label="Documento" value={intimacao.documento} />
          <InfoItem icon={<Phone />} label="Telefone" value={intimacao.telefone} />
          <InfoItem icon={<FileType />} label="Tipo de Procedimento" value={intimacao.tipoProcedimento} />
          <InfoItem icon={<Hash />} label="Nº Procedimento" value={intimacao.numeroProcedimento} />
        </div>
      </CollapsibleCard>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmar Cancelamento"
      >
        <p>Você tem certeza que deseja solicitar o cancelamento desta intimação agendada?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não poderá ser desfeita.</p>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={isNoShowModalOpen}
        onClose={() => setIsNoShowModalOpen(false)}
        onConfirm={handleConfirmNoShow}
        title="Confirmar Ausência"
      >
        <p>Você tem certeza que deseja marcar esta intimação como 'Não Compareceu'?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação mudará o status para 'ausente'.</p>
      </ConfirmationModal>
      
      <ConfirmationModal
        isOpen={isCompareceuModalOpen}
        onClose={() => setIsCompareceuModalOpen(false)}
        onConfirm={handleConfirmCompareceu}
        title="Confirmar Comparecimento"
      >
        <p>Você tem certeza que deseja marcar esta intimação como 'Compareceu'?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação mudará o status para 'finalizada'.</p>
      </ConfirmationModal>
    </li>
  );
};

function AgendaDoDia({ agendamentos, refetch }) {
  if (!agendamentos) {
    return <p>Carregando agendamentos...</p>;
  }

  if (agendamentos.length === 0) {
    return <p>Nenhum agendamento para esta data.</p>;
  }

  return (
    <ul className="space-y-4">
      {agendamentos.map((intimacao) => (
        <AgendaItem key={intimacao.id} intimacao={intimacao} refetch={refetch} />
      ))}
    </ul>
  );
}

export default AgendaDoDia;
