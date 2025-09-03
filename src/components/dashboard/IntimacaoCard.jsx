import React, { useState } from 'react';
import { Calendar, Clock, Phone, X, MessageCircle, Hash, HelpCircle, FileText, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusLabel from '../ui/StatusLabel';
import CollapsibleCard from '../ui/CollapsibleCard';
import InfoItem from '../ui/InfoItem';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '../ui/ConfirmationModal';
import { ReativarIntimacaoModal } from './ReativarIntimacaoModal';
import { formatDate, formatTime, formatDateTime } from "@/lib/utils";

export function IntimacaoCard({ intimacao, onCancel, onReativar }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReativarModalOpen, setIsReativarModalOpen] = useState(false);

  const handleCancelClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    onCancel(intimacao.id);
    setIsModalOpen(false);
  };

  const handleReativarClick = () => {
    setIsReativarModalOpen(true);
  };

  const renderActionsContent = () => {
    const status = intimacao.status;

    if (intimacao.cancelamentoEmAndamento) {
      return (
        <span className="text-xs text-muted-foreground italic">
          Em cancelamento...
        </span>
      );
    }

    if (status === "cancelada" || status === "ausente") {
      const isReativada = intimacao.reativada === true || String(intimacao.reativada).toLowerCase() === 'true';
    if (isReativada) {
      return (
        <span className="text-xs text-muted-foreground italic">
          Intimação Reativada
        </span>
      );
    }
      return (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-md p-1 -m-1"
          onClick={handleReativarClick}
        >
          <RefreshCcw style={{ color: '#22C55E' }} className="w-4 h-4" />
          Reativar
        </Button>
      );
    }

    const cancellableStatus = ["pendente", "entregue", "ativa", "agendada"];
    if (cancellableStatus.includes(status)) {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:bg-accent rounded-md p-1 -m-1"
          onClick={handleCancelClick}
        >
          <X style={{ color: '#C12F71' }} className="w-4 h-4" />
          Cancelar
        </Button>
      );
    }

    return null;
  };

  const renderHeader = () => (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-base font-bold text-foreground truncate">{intimacao.intimadoNome}</h3>
        <StatusLabel status={intimacao.status} />
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className="text-xs text-gray-400">Doc: {intimacao.documento}</p>
        {renderActionsContent()}
      </div>
    </div>
  );

  const renderActions = () => null;

  return (
    <>
      <CollapsibleCard
        header={renderHeader()}
        actions={renderActions()}
        className="bg-card p-4 rounded-lg border shadow transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
          <InfoItem icon={<Phone />} label="Telefone" value={intimacao.telefone} />
          <InfoItem icon={<Calendar />} label="Data Agendada" value={formatDate(intimacao.dataAgendada)} />
          <InfoItem icon={<Clock />} label="Hora Agendada" value={formatTime(intimacao.horaAgendada)} />
          <InfoItem icon={<FileText />} label="Tipo de Procedimento" value={intimacao.tipoProcedimento} />
          <InfoItem icon={<Hash />} label="Nº Procedimento" value={intimacao.numeroProcedimento} />
          <InfoItem icon={<HelpCircle />} label="Motivo" value={intimacao.motivo} />
        </div>
        <div className="pt-3 mt-3 border-t border-white/20">
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-gray-500">
            <MessageCircle className="w-4 h-4" />
            Histórico
          </h4>
          <div className="text-xs text-gray-500">
            <span>Criado em: {formatDateTime(intimacao.criadoEm)}</span>
            <br />
            <span>Sugestão de agenda: {formatDate(intimacao.primeiraDisponibilidade)}</span>
          </div>
        </div>
      </CollapsibleCard>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmar Cancelamento"
      >
        <p>Você tem certeza que deseja solicitar o cancelamento desta intimação?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não poderá ser desfeita.</p>
      </ConfirmationModal>
      <ReativarIntimacaoModal
        open={isReativarModalOpen}
        onClose={() => setIsReativarModalOpen(false)}
        intimacao={intimacao}
        onSuccess={onReativar}
      />
    </>
  );
}