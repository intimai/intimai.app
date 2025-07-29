import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, User, Phone, FileText, Send, ClipboardList, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { toast } from '@/components/ui/use-toast';

export function CreateIntimacaoModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    intimadoNome: '',
    documento: '',
    telefone: '',
    tipoProcedimento: '',
    numeroProcedimento: '',
    dataAgendada: '',
    periodo: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { createIntimacao } = useIntimacoes();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.intimadoNome.trim()) newErrors.intimadoNome = 'Nome é obrigatório';
    if (!formData.documento.trim()) newErrors.documento = 'Documento é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.tipoProcedimento.trim()) newErrors.tipoProcedimento = 'Tipo de procedimento é obrigatório';
    if (!formData.numeroProcedimento.trim()) newErrors.numeroProcedimento = 'Número do procedimento é obrigatório';
    if (!formData.dataAgendada) newErrors.dataAgendada = 'Data é obrigatória';
    if (!formData.periodo) newErrors.periodo = 'Período é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { dataAgendada, periodo, ...rest } = formData;
      
      const [year, month, day] = dataAgendada.split('-');
      const dataFormatada = `${day}/${month}/${year}`;

      const periodoMap = {
        manha: 'Manhã',
        tarde: 'Tarde',
        ambos: 'Ambos'
      };
      const periodoFormatado = periodoMap[periodo] || periodo;

      const dadosParaSalvar = {
        ...rest,
        primeiraDisponibilidade: `${dataFormatada} - ${periodoFormatado}`,
      };

      await createIntimacao(dadosParaSalvar);
      toast({ title: "Intimação criada com sucesso!" });
      setFormData({ intimadoNome: '', documento: '', telefone: '', tipoProcedimento: '', numeroProcedimento: '', dataAgendada: '', periodo: '' });
      onClose();
    } catch (error) {
      toast({ title: "Erro ao criar intimação", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="active-link-gradient italic">Nova Intimação</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="intimadoNome" label="Nome Completo" error={errors.intimadoNome} value={formData.intimadoNome} onChange={(e) => setFormData({...formData, intimadoNome: e.target.value})} />
                <Field id="documento" label="Documento (CPF/RG)" error={errors.documento} value={formData.documento} onChange={(e) => setFormData({...formData, documento: e.target.value})} />
              </div>
              <Field id="telefone" label="Telefone" error={errors.telefone} value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} placeholder="(11) 99999-9999" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="tipoProcedimento" label="Tipo de Procedimento" error={errors.tipoProcedimento} value={formData.tipoProcedimento} onChange={(e) => setFormData({...formData, tipoProcedimento: e.target.value})} />
                <Field id="numeroProcedimento" label="Número do Procedimento" error={errors.numeroProcedimento} value={formData.numeroProcedimento} onChange={(e) => setFormData({...formData, numeroProcedimento: e.target.value})} type="number" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="dataAgendada" label="Data" error={errors.dataAgendada} value={formData.dataAgendada} onChange={(e) => setFormData({...formData, dataAgendada: e.target.value})} type="date" />
                <div>
                  <Label htmlFor="periodo">Período</Label>
                  <Select value={formData.periodo} onValueChange={(value) => setFormData({...formData, periodo: value})}>
                    <SelectTrigger className={errors.periodo ? 'border-red-500' : ''}><SelectValue placeholder="Selecione o período" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">🌅 Manhã</SelectItem>
                      <SelectItem value="tarde">🌆 Tarde</SelectItem>
                      <SelectItem value="ambos">🌅🌆 Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.periodo && <p className="text-sm text-red-500 mt-1">{errors.periodo}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                <Button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Enviando...' : <><Send className="w-4 h-4 mr-2" />Gerar Intimação</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const Field = ({ id, label, error, isTextarea, ...props }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {isTextarea ? (
        <textarea id={id} className={`w-full pr-4 py-3 border rounded-lg resize-none input-elegant ${error ? 'border-red-500' : ''}`} {...props} />
      ) : (
        <Input id={id} className={`${error ? 'border-red-500' : ''}`} {...props} />
      )}
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);