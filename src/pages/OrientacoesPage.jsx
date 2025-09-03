import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrientacoesPage = () => {
  const orientations = [
    {
      title: 'Uso Geral da Plataforma',
      content: 'Explore todas as funcionalidades para otimizar sua rotina. Em caso de dúvidas, consulte nossa documentação ou entre em contato com o suporte.',
    },
    {
      title: 'Status das Intimações e Precisão dos Dados',
      content: 'Monitore regularmente o status das suas intimações para garantir que nenhuma ação seja perdida. Verifique sempre a precisão dos dados extraídos e, se encontrar qualquer inconsistência, ajuste-a imediatamente para garantir a integridade das informações.',
    },
    {
      title: 'Gerenciamento de Agenda',
      content: 'Utilize a agenda para organizar seus prazos e compromissos. Manter a agenda atualizada é crucial para evitar conflitos de agendamento e garantir que você esteja sempre preparado para suas audiências e prazos.',
    },
    {
      title: 'Conectividade da Instância do WhatsApp',
      content: 'A conexão com sua instância do WhatsApp é vital para o recebimento de novas intimações. Verifique periodicamente o status da conexão no painel para assegurar que o serviço esteja ativo e funcionando corretamente.',
    },
    {
      title: 'Consentimento e Direitos dos Titulares (LGPD)',
      content: (
        <>
          A sua privacidade e a proteção dos seus dados são nossa prioridade. Ao se cadastrar, você concordou com nossos Termos de Uso e nossa{' '}
          <Link to="/politica-de-privacidade" className="text-purple-600 hover:underline">
            Política de Privacidade
          </Link>
          , em conformidade com a Lei Geral de Proteção de Dados (LGPD). Nela, detalhamos como seus dados são coletados, usados e protegidos. Você pode revisar esses documentos a qualquer momento para entender seus direitos.
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="p-4">
          <h2 className="text-2xl font-bold active-link-gradient italic">Orientações Importantes</h2>
          <p className="text-gray-600 text-sm">Siga estas diretrizes para garantir o melhor uso da plataforma IntimAI.</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-6">
          {orientations.map((orientation, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg text-chart-recusadas dark:text-chart-recusadas">{orientation.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{orientation.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrientacoesPage;