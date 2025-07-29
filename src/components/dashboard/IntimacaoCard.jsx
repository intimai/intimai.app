import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Phone, User, ChevronDown, ChevronUp, X, MessageCircle, ClipboardList, Hash, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { theme } from '@/config/theme';
import { Button } from '@/components/ui/button';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { toast } from '@/components/ui/use-toast';

export function IntimacaoCard({ intimacao }) {
  const [expanded, setExpanded] = useState(false);
  const { cancelIntimacao } = useIntimacoes();

  const statusToThemeKey = {
    'pendente': 'pendentes',
    'entregue': 'entregues',
    'ativa': 'ativas',
    'agendada': 'agendadas',
    'recusada': 'recusadas',
    'cancelada': 'canceladas',
  };

  

    const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getPeriodoLabel = (periodo) => {
    if (!periodo) return 'N/A';
    switch (periodo) {
      case 'manha': return '🌅 Manhã';
      case 'tarde': return '🌆 Tarde';
      case 'ambos': return '🌅🌆 Ambos';
      default: return periodo;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleCancel = async () => {
    try {
      await cancelIntimacao(intimacao.id);
      toast({ title: "Intimação cancelada com sucesso" });
    } catch (error) {
      toast({ title: "Erro ao cancelar intimação", variant: "destructive" });
    }
  };

  return (
    <div className="py-4 px-4 transition-all duration-200 hover:border-b-2 hover:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-normal text-white truncate">{intimacao.intimadoNome}</h3>
            <Badge 
              className="text-xs text-black"
              style={{ backgroundColor: theme.colors.chart[statusToThemeKey[intimacao.status]] || theme.colors.secondary }}
            >
              {getStatusLabel(intimacao.status)}
            </Badge>
          </div>
          <p className="text-xs text-gray-400">Doc: {intimacao.documento}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {intimacao.status === 'ativa' && (
            <Button variant="outline" size="sm" onClick={handleCancel} className="text-red-600 hover:bg-red-50 text-xs px-2 py-1">
              <X className="w-3 h-3 mr-1" />Cancelar
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)} className="h-8 w-8">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
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
            <InfoItem icon={<Clock />} label={getPeriodoLabel(intimacao.periodo)} />
            <InfoItem icon={<ClipboardList />} label={intimacao.tipoProcedimento || 'N/A'} />
            <InfoItem icon={<Hash />} label={intimacao.numeroProcedimento || 'N/A'} />
            <InfoItem icon={<HelpCircle />} label={intimacao.motivo || 'N/A'} />
          </div>
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-gray-700">
              <MessageCircle className="w-4 h-4" />Histórico
            </h4>
            <div className="text-xs text-gray-500">Criado em: {formatDateTime(intimacao.criadoEm)}</div>
          </div>
        </motion.div>
      )}
    </div>
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