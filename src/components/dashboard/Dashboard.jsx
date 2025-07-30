import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { CreateIntimacaoModal } from './CreateIntimacaoModal';
import StatsChart from './StatsChart';
import { chartColors } from '@/config/chartColors';



export function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { intimacoes, loading } = useIntimacoes();

  const statsData = useMemo(() => {
    const counts = {
      pendentes: 0,
      entregues: 0,
      ativas: 0,
      agendadas: 0,
      recusadas: 0,
      canceladas: 0,
    };

    // Mapeia o status da intimação (singular) para a chave de contagem (plural)
    const statusToPlural = {
      pendente: 'pendentes',
      entregue: 'entregues',
      ativa: 'ativas',
      agendada: 'agendadas',
      recusada: 'recusadas',
      cancelada: 'canceladas',
    };

    intimacoes.forEach(intimacao => {
      const pluralStatus = statusToPlural[intimacao.status];
      if (pluralStatus) {
        counts[pluralStatus]++;
      }
    });

    const data = [
      { name: 'Pendentes', value: counts.pendentes, color: chartColors.pendentes },
      { name: 'Entregues', value: counts.entregues, color: chartColors.entregues },
      { name: 'Ativas', value: counts.ativas, color: chartColors.ativas },
      { name: 'Agendadas', value: counts.agendadas, color: chartColors.agendadas },
      { name: 'Recusadas', value: counts.recusadas, color: chartColors.recusadas },
      { name: 'Canceladas', value: counts.canceladas, color: chartColors.canceladas },
    ].filter(item => item.value > 0);

    return data;
  }, [intimacoes]);
  const mesAtual = new Date().toLocaleString('default', { month: 'long' });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Dashboard</h2>
          <p className="text-gray-600 text-sm">Visão Geral das Intimações</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowCreateModal(true)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nova Intimação
            </Button>
          </div>
          <StatsChart data={statsData} />
        </CardContent>
      </Card>

      

      <CreateIntimacaoModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}