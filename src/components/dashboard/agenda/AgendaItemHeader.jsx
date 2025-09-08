import React from 'react';
import { Clock, User } from 'lucide-react';
import AgendaItemActions from './AgendaItemActions';

/**
 * Componente para o cabeçalho de um item da agenda
 * PRESERVA EXATAMENTE o mesmo comportamento e design
 */
const AgendaItemHeader = ({ 
  intimacao, 
  formatTime, 
  cancellableStatuses, 
  onOpenCancelModal, 
  onComparecimentoChange 
}) => {
  return (
    <div className="w-full">
      <p className="font-bold flex items-center text-foreground">
        <User className="w-4 h-4 mr-2 text-chart-agendadas" />
        {intimacao.intimadoNome}
      </p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-muted-foreground flex items-center">
          <Clock className="w-4 h-4 mr-2 text-chart-entregues" />
          {formatTime(intimacao.horaAgendada)}
        </p>
        <AgendaItemActions
          intimacao={intimacao}
          cancellableStatuses={cancellableStatuses}
          onOpenCancelModal={onOpenCancelModal}
          onComparecimentoChange={onComparecimentoChange}
        />
      </div>
    </div>
  );
};

export default AgendaItemHeader;
