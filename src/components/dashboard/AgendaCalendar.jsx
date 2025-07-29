import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './AgendaCalendar.css';


export function AgendaCalendar({ selectedDate, setSelectedDate, intimacoes }) {
  const scheduledDays = intimacoes
    .map(i => new Date(i.dataAgendada + 'T00:00:00')) // Avoid timezone issues
    .filter(d => !isNaN(d.getTime()));

  return (
    <>
      <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{ scheduled: scheduledDays }}
          modifiersClassNames={{
            scheduled: 'day-scheduled',
          }}
        />
    </>
  );
}