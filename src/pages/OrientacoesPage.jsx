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
      content: 'Monitore regularmente o status das suas intimações para garantir que nenhuma ação seja perdida.',
    },
    {
      title: 'Conectividade da Instância do WhatsApp',
      content: 'A conexão com sua instância do WhatsApp é vital para o envio de novas intimações. Verifique periodicamente a conexão para assegurar que o serviço esteja ativo e funcionando corretamente.',
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
    {
      title: 'Gerenciamento de Agenda',
      content: 'O sistema IntimAI utiliza uma janela de agendamentos de 30 em 30 minutos, tendo como padrão o período de 08:00 às 10:30 para "Manhã" e de 13:00 às 16:30 para "Tarde", com a possibibilidade de escolha de um dos períodos ou ambos no formulário de nova intimação. É recomendável que você gerencie a quantidade de intimações cadastradas por período para que não ultrapassem este limite (6 agendamentos para o período "Manhã" e 8 para o período "Tarde", totalizando 14 horários diários) para a melhor performance do gerenciamento feito pelo IntimAI. Caso sejam cadastradas novas intimações acima deste limite, identificada a exaustão da agenda no(s) período(s) pretendido(s), as intimações excedenmtes serão tratadas como "Canceladas" por motivo "Agenda Cheia", sendo de responsabilidade do usuário solicitar a reativação para outro período futuro. Caso sejam emitidas intimações externas ao sistema IntimAI, por meio eletrônico ou documento oficial entregue presencialmente por oficial competente, priorize sua marcação para entre períodos do sistema (Ex: 08:15; 08:45. 13:15, etc), mantendo sua agenda externa organizada para melhor curso do seu dia=a=dia de trabalho. Em caso de imprevistos que impossibilitem o cumprimento de algum de seus horários já agendados ou marcações equivocadas, utilize a opção "Cancelar" disponível em sua agenda ou na consulta por intimação.Os cancelamentos são possíveis para intimações já agendadas ou em processo de agendamento, cuja comunicação ao intimado será feita também pelo IntimAI. Lembre-se de que suas sugestões sobre melhorias sermpre serão muito bem vindas, já que o propósito do IntimAI é servir de suporte inteligente para o seu trabalho.',
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