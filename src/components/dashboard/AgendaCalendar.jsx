import React from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import './AgendaCalendar.css';


export function AgendaCalendar({ selectedDate, setSelectedDate, intimacoes }) {
  const scheduledDays = intimacoes
    .map(i => new Date(i.dataAgendada + 'T00:00:00')) // Avoid timezone issues
    .filter(d => !isNaN(d.getTime()));

  return (
    <>
      <div className="w-[280px]">
        <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ scheduled: scheduledDays }}
            modifiersClassNames={{
              scheduled: 'day-scheduled',
            }}
            locale={ptBR}
            classNames={{
            caption: 'flex justify-between items-center px-4',
          }}
          />
      </div>
    </>
  );
}