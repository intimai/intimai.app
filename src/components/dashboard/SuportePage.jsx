import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export function SuportePage() {
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por enquanto, apenas exibimos um toast de sucesso.
    // A integração com o banco de dados será feita no próximo passo.
    toast({
      title: 'Mensagem enviada!',
      description: 'Seu contato foi enviado com sucesso.',
    });
    // Limpa os campos após o envio
    setAssunto('');
    setMensagem('');
    setTelefone('');
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Suporte</h2>
          <p className="text-gray-600 text-sm">Precisa de ajuda? Preencha o formulário abaixo e nossa equipe entrará em contato.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="assunto">Assunto</Label>
              <Input
                id="assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Digite o assunto da sua mensagem"
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone de Contato</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div>
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva seu problema ou dúvida em detalhes"
                required
                rows={6}
              />
            </div>
            <Button type="submit">Enviar Mensagem</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}