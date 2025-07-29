import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { CreateIntimacaoModal } from './CreateIntimacaoModal';
import StatsChart from './StatsChart';
import { theme } from '@/config/theme';


export function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { intimacoes, loading } = useIntimacoes();

  const statsData = useMemo(() => {
    const counts = {
      pendente: 0,
      realizada: 0,
      cancelada: 0,
      ausente: 0,
    };

    intimacoes.forEach(intimacao => {
      if (counts[intimacao.status] !== undefined) {
        counts[intimacao.status]++;
      }
    });

    const data = [
      { name: 'Pendentes', value: counts.pendente, color: theme.colors.chart.pendentes },
      { name: 'Realizadas', value: counts.realizada, color: theme.colors.chart.realizadas },
      { name: 'Canceladas', value: counts.cancelada, color: theme.colors.chart.canceladas },
      { name: 'Ausentes', value: counts.ausente, color: theme.colors.chart.ausentes },
    ].filter(item => item.value > 0);

    return data;
  }, [intimacoes, theme]);
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