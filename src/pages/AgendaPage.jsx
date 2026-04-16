import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { AgendaCalendar } from '@/components/dashboard/AgendaCalendar';
import AgendaCard from '@/components/dashboard/AgendaCard';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Card, CardContent } from '@/components/ui/card';

export function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { intimacoes, agendamentosDoDia, fetchAgendamentos, fetchIntimacoes } = useIntimacoes();

  const refetchAgendamentos = useCallback(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      fetchAgendamentos(formattedDate);
    }
  }, [selectedDate, fetchAgendamentos]);

  useEffect(() => {
    refetchAgendamentos();
  }, [refetchAgendamentos]);

  const generateAgendaPDF = () => {
    const doc = new jsPDF();
    const margin = 15;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Agendamentos do Dia', margin, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(format(selectedDate, 'dd/MM/yyyy'), margin, 28);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, 34);
    doc.setTextColor(0);

    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      return timeStr.slice(0, 5);
    };

    const tableData = agendamentosDoDia.map((ag) => [
      ag.intimadoNome || 'N/A',
      formatTime(ag.horaAgendada),
      ag.documento || 'N/A',
      ag.telefone || 'N/A',
      ag.tipoProcedimento || 'N/A',
      ag.numeroProcedimento || 'N/A',
      ag.status || 'N/A',
    ]);

    doc.autoTable({
      startY: 40,
      head: [['Nome', 'Hora', 'Documento', 'Telefone', 'Tipo', 'N Proc.', 'Status']],
      body: tableData,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: margin, right: margin },
    });

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    doc.save(`agenda_${dateStr}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Agenda</h2>
          <p className="page-subtitle">Visualize e gerencie seus agendamentos.</p>
        </CardContent>
      </Card>

      <Card>
                <CardContent className="p-2 sm:p-6 pb-8 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-8">
            {/* Coluna do Calendário */}
            <div className="xl:col-span-2 min-w-0">
              <div className="flex justify-center xl:justify-start">
                <div className="w-full max-w-sm mx-auto xl:mx-0">
                  <AgendaCalendar
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    intimacoes={intimacoes}
                  />
                </div>
              </div>
            </div>

            {/* Coluna dos Agendamentos do Dia */}
            <div className="xl:col-span-3 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-center xl:text-left">Agendamentos do Dia</h2>
                {agendamentosDoDia && agendamentosDoDia.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateAgendaPDF}
                    className="flex items-center gap-2"
                    title="Baixar agenda do dia em PDF"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto pr-2 pt-2">
                <AgendaCard selectedDate={selectedDate} agendamentos={agendamentosDoDia} refetch={refetchAgendamentos} fetchIntimacoes={fetchIntimacoes} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}