import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function UpdatePasswordPage() {
  const { updateUser, signOut } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "As senhas não correspondem",
        description: "Por favor, verifique se as senhas digitadas são iguais.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await updateUser({ password });
    if (error) {
      toast({
        title: "Erro ao atualizar a senha",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Senha atualizada com sucesso!"
      });
      await signOut();
      navigate('/auth');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background max-w-md mx-auto">
        <Card className="w-full card-hover glass-effect border-border">
          <CardHeader className="text-center">
            <CardTitle className="active-link-gradient">Redefinir Senha</CardTitle>
            <p className="text-muted-foreground">Digite sua nova senha abaixo.</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Sua nova senha"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Confirme sua nova senha"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 mr-2" />
                    Atualizar Senha
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
    </div>
  );
}