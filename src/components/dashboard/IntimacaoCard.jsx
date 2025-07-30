import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, User, X, MessageCircle, ClipboardList, Hash, HelpCircle } from 'lucide-react';
import ExpansionButton from '../ui/ExpansionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusLabel from '../ui/StatusLabel';

import { Button } from '@/components/ui/button';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { toast } from '@/components/ui/use-toast';
import ConfirmationModal from '../ui/ConfirmationModal';
import { formatDate, formatTime, formatDateTime } from '@/lib/utils';

export function IntimacaoCard({ intimacao }) {
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

  return (
    <>
      <div className="py-4 px-4 transition-all duration-200 hover:border-b-2 hover:border-gray-700 cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-normal text-white truncate">{intimacao.intimadoNome}</h3>
            <StatusLabel status={intimacao.status} />

          </div>
          <p className="text-xs text-gray-400">Doc: {intimacao.documento}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="ghost" onClick={handleOpenModal} className="h-auto p-0 flex items-center">
            <X className="w-4 h-4 text-chart-canceladas mr-1" />
            <span className="text-sm text-muted-foreground">Cancelar</span>
          </Button>
          <ExpansionButton isExpanded={expanded} onClick={() => setExpanded(!expanded)} />
        </div>
      </div>
      
      {expanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InfoItem icon={<Phone />} label={intimacao.telefone} />
            <InfoItem icon={<Calendar />} label={formatDate(intimacao.dataAgendada)} />
            <InfoItem icon={<Clock />} label={formatTime(intimacao.horaAgendada)} />
            <InfoItem icon={<ClipboardList />} label={intimacao.tipoProcedimento || 'N/A'} />
            <InfoItem icon={<Hash />} label={intimacao.numeroProcedimento || 'N/A'} />
            <InfoItem icon={<HelpCircle />} label={intimacao.motivo || 'N/A'} />
          </div>
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-gray-700">
              <MessageCircle className="w-4 h-4" />Histórico
            </h4>
            <div className="text-xs text-gray-500">Criado em: {formatDateTime(intimacao.criadoEm)}</div>
            <div className="text-xs text-gray-500">Sugestão de agenda: {formatDate(intimacao.primeiraDisponibilidade)}</div>
          </div>
        </motion.div>
      )}
    </div>
    <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Confirmar Cancelamento"
      >
        <p>Você tem certeza que deseja solicitar o cancelamento desta intimação?</p>
        <p className="text-sm text-gray-500 mt-2">Esta ação não poderá ser desfeita.</p>
      </ConfirmationModal>
    </>
  );
}

const InfoItem = ({ icon, label, value, isBlock }) => (
  <div className={`flex items-start gap-2 ${isBlock ? 'flex-col' : ''}`}>
    <div className="text-gray-400 mt-0.5 flex-shrink-0">{React.cloneElement(icon, { className: 'w-3 h-3' })}</div>
    <div className="min-w-0">
      <span className={`text-xs text-gray-300 ${isBlock ? 'font-medium' : ''}`}>{label}</span>
      {value && <p className="text-xs text-gray-400">{value}</p>}
    </div>
  </div>
);