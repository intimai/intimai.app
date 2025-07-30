import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InputMask from 'react-input-mask';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIntimacoes } from '@/hooks/useIntimacoes';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  intimadoNome: z.string({ required_error: 'Nome é obrigatório.' }).min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  documento: z.string({ required_error: 'Documento é obrigatório.' }).min(5, 'Documento inválido.'),
  telefone: z.string({ required_error: 'Telefone é obrigatório.' }).refine((val) => /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
    message: 'Formato de telefone inválido. Use (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.',
  }),
  tipoProcedimento: z.string({ required_error: 'Tipo de procedimento é obrigatório.' }).min(1, 'Tipo de procedimento é obrigatório.'),
  numeroProcedimento: z.string({ required_error: 'Número do procedimento é obrigatório.' }).min(1, 'Número do procedimento é obrigatório.'),
  dataAgendada: z.string({ required_error: 'Data é obrigatória.' }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate > today;
  }, {
    message: 'A data não pode ser hoje ou no passado.',
  }),
  periodo: z.enum(['manha', 'tarde', 'ambos'], { required_error: 'Período é obrigatório.' }),
});

export function CreateIntimacaoModal({ open, onClose }) {
  const { createIntimacao } = useIntimacoes();
  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intimadoNome: '',
      documento: '',
      telefone: '',
      tipoProcedimento: '',
      numeroProcedimento: '',
      dataAgendada: '',
      periodo: '',
    },
  });

  const onSubmit = async (formData) => {
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
      reset();
      onClose();
    } catch (error) {
      toast({ title: "Erro ao criar intimação", description: error.message, variant: "destructive" });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="active-link-gradient italic">Nova Intimação</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}><X className="w-5 h-5" /></Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="intimadoNome" label="Nome Completo" error={errors.intimadoNome} register={register} name="intimadoNome" />
                <Field id="documento" label="Documento (CPF/RG)" error={errors.documento} register={register} name="documento" />
              </div>
              <MaskedField id="telefone" label="Telefone" error={errors.telefone} control={control} name="telefone" mask="(99) 99999-9999" placeholder="(XX) XXXXX-XXXX" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="tipoProcedimento" label="Tipo de Procedimento" error={errors.tipoProcedimento} register={register} name="tipoProcedimento" />
                <Field id="numeroProcedimento" label="Número do Procedimento" error={errors.numeroProcedimento} register={register} name="numeroProcedimento" type="text" className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field id="dataAgendada" label="Data" error={errors.dataAgendada} type="date" register={register} name="dataAgendada" className="dark:[color-scheme:dark]" />
                <div>
                  <Label htmlFor="periodo">Período</Label>
                  <Controller
                    name="periodo"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={errors.periodo ? 'border-red-500' : ''}><SelectValue placeholder="Selecione o período" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manha">🌅 Manhã</SelectItem>
                          <SelectItem value="tarde">🌆 Tarde</SelectItem>
                          <SelectItem value="ambos">🌅🌆 Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.periodo && <p className="text-sm text-red-500 mt-1">{errors.periodo.message}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>Cancelar</Button>
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : <><Send className="w-4 h-4 mr-2" />Gerar Intimação</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const Field = ({ id, label, error, register, name, ...props }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} className={`${error ? 'border-red-500' : ''}`} {...register(name)} {...props} />
    {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
  </div>
);

const MaskedField = ({ id, label, error, control, name, ...props }) => {
  const [mask, setMask] = useState('(99) 9999-9999');

  const handleTelefoneChange = (e, onChange) => {
    const unmaskedValue = e.target.value.replace(/[^\d]/g, '');
    if (unmaskedValue.length > 10) {
      setMask('(99) 99999-9999');
    } else {
      setMask('(99) 9999-9999');
    }
    onChange(e);
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputMask
            mask={mask}
            value={field.value}
            onChange={(e) => handleTelefoneChange(e, field.onChange)}
            onBlur={field.onBlur}
          >
            {(inputProps) => <Input id={id} {...inputProps} className={`${error ? 'border-red-500' : ''}`} {...props} />}
          </InputMask>
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};