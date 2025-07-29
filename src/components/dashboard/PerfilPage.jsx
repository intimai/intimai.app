import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export function PerfilPage() {
  const { user, loading: authLoading } = useAuth();
  const [perfil, setPerfil] = useState({ nome: '', delegadoResponsavel: '' });
  const [delegacia, setDelegacia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPerfilData = async () => {
      setLoading(true);
      const { data: perfilData, error: perfilError } = await supabase
        .from('usuarios')
        .select('*, delegacias(*)')
        .eq('userId', user.id)
        .single();

      if (perfilError) {
        toast({ variant: 'destructive', title: 'Erro ao carregar perfil.' });
      } else if (perfilData) {
        const newPerfilState = {
          nome: perfilData.nome || '',
          delegadoResponsavel: perfilData.delegadoResponsavel || ''
        };
        setPerfil(newPerfilState);
        setDelegacia(perfilData.delegacias);
      }
      setLoading(false);
    };

    fetchPerfilData();
  }, [user, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerfil(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    const { error: updatePerfilError } = await supabase
      .from('usuarios')
      .update({ 
        nome: perfil.nome,
        delegadoResponsavel: perfil.delegadoResponsavel 
      })
      .eq('userId', user.id);

    if (updatePerfilError) {
      toast({ variant: 'destructive', title: 'Erro ao salvar delegado.', description: updatePerfilError.message });
    } else {
      toast({ title: 'Perfil salvo com sucesso!' });
    }
  };

  if (loading || authLoading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  if (!user) {
    return <div className="text-center p-4">Usuário não autenticado.</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Perfil</h2>
          <p className="text-gray-600 text-sm">Gerencie suas informações de perfil.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" name="nome" value={perfil.nome} onChange={handleInputChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Delegacia</Label>
            <Input value={delegacia?.nome || 'N/A'} disabled />
          </div>
          <div>
            <Label>Endereço da Delegacia</Label>
            <Input value={delegacia?.endereco || 'N/A'} disabled />
          </div>
          <div>
            <Label htmlFor="delegadoResponsavel">Delegado Responsável</Label>
            <Input id="delegadoResponsavel" name="delegadoResponsavel" value={perfil.delegadoResponsavel} onChange={handleInputChange} />
          </div>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </CardContent>
      </Card>
    </div>
  );
}