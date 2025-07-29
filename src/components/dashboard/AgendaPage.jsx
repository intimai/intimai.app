import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AgendaCalendar } from './AgendaCalendar';
import { AgendaDoDia } from './AgendaDoDia';
import { useIntimacoes } from '@/hooks/useIntimacoes';

import { Card, CardContent } from '@/components/ui/card';

export function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { intimacoes, fetchAgendamentos } = useIntimacoes();

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      fetchAgendamentos(formattedDate);
    }
  }, [selectedDate, fetchAgendamentos]);

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Agenda</h2>
          <p className="text-gray-600 text-sm">Visualize e gerencie seus agendamentos.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna do Calendário */}
            <div className="flex justify-center">
              <AgendaCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                intimacoes={intimacoes}
              />
            </div>

            {/* Coluna dos Agendamentos do Dia */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-center lg:text-left">Agendamentos do Dia</h2>
              <div className="max-h-[400px] overflow-y-auto pr-2">
                <AgendaDoDia selectedDate={selectedDate} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}