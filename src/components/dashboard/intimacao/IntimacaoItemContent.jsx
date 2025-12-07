import React from 'react';
import { Phone, FileType, Hash, FileText, MessageCircle, HelpCircle, Calendar, Clock } from 'lucide-react';
import InfoItem from '../../ui/InfoItem';
import { formatDate, formatTime, formatDateTime } from "@/lib/utils";

export function IntimacaoItemContent({ intimacao }) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
        <InfoItem icon={<Phone />} label="Telefone" value={intimacao.telefone} />
        <InfoItem icon={<Calendar />} label="Data Agendada" value={formatDate(intimacao.dataAgendada)} />
        <InfoItem icon={<Clock />} label="Hora Agendada" value={formatTime(intimacao.horaAgendada)} />
        <InfoItem icon={<FileText />} label="Tipo de Procedimento" value={intimacao.tipoProcedimento} />
        <InfoItem icon={<Hash />} label="Nº Procedimento" value={intimacao.numeroProcedimento} />
        <InfoItem icon={<HelpCircle />} label="Motivo" value={intimacao.motivo} />
      </div>
      
      {/* Histórico - PRESERVA EXATAMENTE a mesma seção */}
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
    </>
  );
}
