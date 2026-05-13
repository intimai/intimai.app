import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';

const RESEND_COOLDOWN_SECONDS = 30;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { passwordRecovery } = useAuth();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const sendRecoveryEmail = async () => {
    setLoading(true);
    const { error } = await passwordRecovery(email);
    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao enviar email de recuperação",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setSent(true);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    toast({
      title: "Email de recuperação enviado!",
      description: "Verifique sua caixa de entrada e a pasta de spam.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRecoveryEmail();
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    await sendRecoveryEmail();
  };

  return (
    <div className="w-full max-w-[448px] mx-auto">
      <Card className="card-hover glass-effect border-border">
        <CardHeader className="text-center">
          <CardTitle className="active-link-gradient">Recuperar Senha</CardTitle>
          <p className="text-muted-foreground">Insira seu email para receber o link de recuperação.</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="seu.email@delegacia.gov.br"
                  required
                />
              </div>
            </div>

            {sent && (
              <div className="text-sm text-center space-y-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Email enviado! Verifique sua caixa de entrada.
                </p>
                <p className="text-xs text-muted-foreground">
                  Se não chegar em 5 minutos, confira a pasta de <strong>spam/lixo eletrônico</strong>.
                  Caso persista, entre em contato com o suporte.
                </p>
              </div>
            )}

            {!sent ? (
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
                  'Enviar Link de Recuperação'
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={cooldown > 0 || loading}
                onClick={handleResend}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar email'}
              </Button>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary hover:underline font-medium flex items-center justify-center w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Login
            </Link>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground mt-4">powered by Aurios AI</p>
    </div>
  );
}