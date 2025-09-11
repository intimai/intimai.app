import React, { useCallback, useMemo } from 'react';
import { X, RefreshCcw } from 'lucide-react';
import CollapsibleCard from '../ui/CollapsibleCard';
import StatusLabel from '../ui/StatusLabel';
import { Button } from '@/components/ui/button';
import { useMultipleModals } from '@/hooks/useConfirmationModal';
import { IntimacaoItemHeader } from './intimacao/IntimacaoItemHeader';
import { IntimacaoItemContent } from './intimacao/IntimacaoItemContent';
import { IntimacaoModalsGroup } from './intimacao/IntimacaoModalsGroup';

export function IntimacaoCard({ intimacao, onCancel, onReativar }) {
  // Função memoizada para evitar re-renders
  const handleCancelFunction = useCallback(() => onCancel(intimacao.id), [onCancel, intimacao.id]);

  const modalConfig = useMemo(() => ({
    cancel: handleCancelFunction, // MESMA função de cancelamento, agora memoizada
  }), [handleCancelFunction]);
  
  // Hook para gerenciar múltiplos modais - PRESERVA EXATAMENTE a mesma lógica
  const modals = useMultipleModals(modalConfig);

  // Estados para modais customizados (ReativarIntimacaoModal)
  const [isReativarModalOpen, setIsReativarModalOpen] = React.useState(false);

  // PRESERVA EXATAMENTE as mesmas funções
  const handleCancelClick = () => {
    modals.cancel.open(); // Mesma ação, novo hook
  };

  const handleReativarClick = () => {
    setIsReativarModalOpen(true); // MESMA lógica mantida
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
        <IntimacaoItemContent intimacao={intimacao} />
      </CollapsibleCard>
      
      <IntimacaoModalsGroup 
        modals={modals}
        intimacao={intimacao}
        isReativarModalOpen={isReativarModalOpen}
        onReativarModalClose={() => setIsReativarModalOpen(false)}
        onReativarSuccess={onReativar}
      />
    </>
  );
}