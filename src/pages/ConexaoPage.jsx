import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

// --- Componentes de Estado ---

const LoadingState = () => (
  <div className="flex items-center space-x-2">
    <Loader2 className="h-5 w-5 animate-spin" />
    <p>Verificando status da conexão...</p>
  </div>
);

const ConnectedState = ({ onDisconnect }) => (
  <div className="text-center">
    <p className="text-green-500 font-bold text-lg mb-6 p-12">✅ Conectado</p>
    <Button onClick={onDisconnect} className="w-full btn-destructive">
      Desconectar
    </Button>
  </div>
);

const DisconnectedState = ({ qrCode, onRetry }) => (
  <div className="text-center">
    <p className="text-yellow-500 font-bold text-lg mb-4">⚠️ Desconectado</p>
    <p className="mb-4">Escaneie o QR Code para conectar.</p>
    {qrCode ? (
      <div className="mt-4 p-4 bg-white rounded-lg inline-block border">
        <img src={qrCode} alt="QR Code para conectar ao WhatsApp" className="w-64 h-64" />
      </div>
    ) : (
      <p className="mt-2 text-sm text-gray-400">Gerando QR Code...</p>
    )}
    <br />
    <Button onClick={onRetry} className="mt-4 btn-primary w-full">
      Atualizar QR Code
    </Button>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="text-center">
    <p className="text-red-500 font-bold text-lg mb-6 pt-8 pb-12 px-12">❌ Erro na Conexão</p>
    <p className="text-sm text-gray-400 -mt-8 mb-4">
      Não foi possível verificar o status. <br />
      Por favor, tente novamente em alguns segundos <br /> ou entre em contato com o suporte.
    </p>
    <Button onClick={onRetry} className="mt-4 w-full btn-destructive">
      Tentar Novamente
    </Button>
  </div>
);


// --- Componente Principal ---

export const ConexaoPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('loading'); // 'loading', 'connected', 'disconnected', 'error'
  const [qrCode, setQrCode] = useState(null);
  
  // MODO DE SIMULAÇÃO: Altere para 'connected', 'disconnected', 'error' ou 'loading' para testar a UI.
  const [simulationMode] = useState(null); // Defina como null para usar a API real

  const checkConnection = useCallback(async () => {
    if (simulationMode) {
        setConnectionStatus(simulationMode);
        if (simulationMode === 'disconnected') {
            // QR Code de exemplo (base64 de uma imagem 1x1 pixel)
            setQrCode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
        }
        return;
    }

    if (!user?.delegaciaId) {
        setConnectionStatus('error');
        // toast({ variant: 'destructive', title: 'Erro', description: 'ID da delegacia não encontrado.' });
        return;
    }

    setConnectionStatus('loading');
    try {
      const { data, error } = await supabase.functions.invoke('manage-evolution-instance', {
        body: { delegaciaId: user.delegaciaId },
      });

      if (error) throw new Error(error.message);

      if (data.instance?.state === 'open') {
        setConnectionStatus('connected');
        setQrCode(null);
      } else if (data.base64) { // Correção: A API retorna o QR code no campo 'base64'
        setConnectionStatus('disconnected');
        setQrCode(data.base64); // Correção: Usar data.base64
      } else {
        // Se a resposta não for o esperado, consideramos um erro de status.
        setConnectionStatus('error');
        console.warn("Resposta inesperada da API:", data);
      }

    } catch (err) {
      setConnectionStatus('error');
      // toast({ variant: 'destructive', title: 'Erro ao verificar status', description: 'A função do servidor pode estar indisponível. Tente novamente mais tarde.' });
      console.error(err);
    }
  }, [user, toast, simulationMode]);

  useEffect(() => {
    checkConnection();
    // O polling pode ser reativado quando a API estiver estável
    // const intervalId = setInterval(checkConnection, 15000); 
    // return () => clearInterval(intervalId);
  }, [checkConnection]);

  const handleDisconnect = () => {
    // Lógica para desconectar a ser implementada
    toast({ title: "Função de desconexão ainda não implementada." });
  }

  const renderStatus = () => {
    switch (connectionStatus) {
      case 'connected':
        return <ConnectedState onDisconnect={handleDisconnect} />;
      case 'disconnected':
        return <DisconnectedState qrCode={qrCode} onRetry={checkConnection} />;
      case 'error':
        return <ErrorState onRetry={checkConnection} />;
      case 'loading':
      default:
        return <LoadingState />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Conexão com o WhatsApp</h2>
          <p className="text-gray-400 text-sm">Gerencie a conexão da sua delegacia com o WhatsApp para o envio de intimações.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold">Status da Conexão</h3>
          {renderStatus()}
        </CardContent>
      </Card>
    </div>
  );
};