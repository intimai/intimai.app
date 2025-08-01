import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { CreateIntimacaoModal } from './CreateIntimacaoModal';
import { IntimacaoCard } from './IntimacaoCard';


export function IntimacoesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const { intimacoes, loading } = useIntimacoes();

  const statusMap = {
    pendentes: 'pendente',
    entregues: 'entregue',
    ativas: 'ativa',
    agendadas: 'agendada',
    recusadas: 'recusada',
    canceladas: 'cancelada',
  };

  const filteredIntimacoes = useMemo(() => {
    return intimacoes.filter(intimacao => {
      const filterSingular = statusMap[filter] || filter;
      const statusMatch = filter === 'todas' || intimacao.status === filterSingular;
      const searchMatch = searchTerm === '' ||
        (intimacao.intimadoNome && intimacao.intimadoNome.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (intimacao.documento && intimacao.documento.includes(searchTerm));
      return statusMatch && searchMatch;
    });
  }, [intimacoes, filter, searchTerm]);

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
          <h2 className="text-2xl font-bold active-link-gradient italic">Intimações</h2>
          <p className="text-gray-600 text-sm">Visualize e gerencie suas intimações de forma eficiente.</p>
        </CardContent>
      </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou documento..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="btn-primary flex-shrink-0">
                <Plus className="w-4 h-4 mr-2" />
                Nova Intimação
              </Button>
            </div>
            <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap -mb-px gap-x-4">
                  {[
                    { key: 'todas', label: 'Todas' },
                    { key: 'pendentes', label: 'Pendentes' },
                    { key: 'entregues', label: 'Entregues' },
                    { key: 'ativas', label: 'Ativas' },
                    { key: 'agendadas', label: 'Agendadas' },
                    { key: 'recusadas', label: 'Recusadas' },
                    { key: 'canceladas', label: 'Canceladas' },
                  ].map(f => {
                    const textColors = {
                      todas: 'text-white',
                      pendentes: 'text-chart-pendentes',
                      entregues: 'text-chart-entregues',
                      ativas: 'text-chart-ativas',
                      agendadas: 'text-chart-agendadas',
                      recusadas: 'text-chart-recusadas',
                      canceladas: 'text-chart-canceladas',
                    };

                    const borderColors = {
                      todas: 'border-white',
                      pendentes: 'border-chart-pendentes',
                      entregues: 'border-chart-entregues',
                      ativas: 'border-chart-ativas',
                      agendadas: 'border-chart-agendadas',
                      recusadas: 'border-chart-recusadas',
                      canceladas: 'border-chart-canceladas',
                    };

                    const textColorClass = textColors[f.key] || 'text-white';
                    const borderColorClass = filter === f.key ? borderColors[f.key] : 'border-transparent';

                    return (
                      <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`
                          py-2 px-1 text-sm font-medium transition-all duration-200
                          border-b-2 hover:border-gray-300 dark:hover:border-gray-600
                          ${filter === f.key ? 'font-bold' : ''} ${textColorClass} ${borderColorClass}
                        `}
                      >
                        {f.label}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="pt-4">
                {filteredIntimacoes.length === 0 ? (
                <div className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">Nenhuma intimação encontrada</h3>
                    <p className="text-gray-400 mb-4">Tente um filtro diferente ou crie uma nova intimação.</p>
                    <Button onClick={() => setShowCreateModal(true)} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Criar Intimação</Button>
                </div>
                ) : (
                <div className="divide-y divide-gray-100">
                    {filteredIntimacoes.map((intimacao, index) => (
                    <motion.div key={intimacao.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <IntimacaoCard intimacao={intimacao} />
                    </motion.div>
                    ))}
                </div>
                )}
            </div>
          </CardContent>
        </Card>

        <CreateIntimacaoModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}