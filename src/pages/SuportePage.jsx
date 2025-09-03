import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { triggerWebhook } from '../lib/webhookService';

const SuportePage = () => {
  const { user, loading } = useAuth();
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const resetForm = () => {
    setAssunto('');
    setMensagem('');
    setTelefone('');
  };
// ... existing code ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error('Erro de autenticação. Por favor, faça login novamente.');
      setIsSubmitting(false);
      return;
    }

    const supportData = {
      assunto: assunto,
      mensagem: mensagem,
      contatoWhatsApp: telefone,
    };

    const { success, error } = await triggerWebhook('SUPORTE', supportData, user);

    if (success) {
      setShowSuccessModal(true);
    } else {
      toast.error(error || 'Erro ao enviar mensagem. Tente novamente mais tarde.');
    }

    setIsSubmitting(false);
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  if (!user) {
    return <div className="text-center p-4">Usuário não autenticado.</div>;
  }

  return (
    <div className="space-y-6">
        <Card className="w-full">
            <CardContent className="p-4">
                <h2 className="text-2xl font-bold active-link-gradient italic">Suporte</h2>
                <p className="text-gray-600 text-sm">Precisa de ajuda? Entre em contato conosco.</p>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="space-y-4 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input
                        id="assunto"
                        value={assunto}
                        onChange={(e) => setAssunto(e.target.value)}
                        placeholder="Ex: Dúvida sobre o sistema"
                        required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone de Contato (Opcional)</Label>
                        <Input
                        id="telefone"
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(XX) XXXXX-XXXX"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mensagem">Mensagem</Label>
                        <Textarea
                        id="mensagem"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                        placeholder="Descreva seu problema ou dúvida."
                        required
                        rows={6}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                </form>
            </CardContent>
        </Card>

        <Dialog open={showSuccessModal} onOpenChange={handleModalClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mensagem Enviada com Sucesso!</DialogTitle>
                    <DialogDescription>
                        Sua solicitação de suporte foi recebida. Nossa equipe entrará em contato com você em breve.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={handleModalClose}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
};

export default SuportePage;