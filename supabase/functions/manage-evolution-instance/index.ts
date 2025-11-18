import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define os cabeçalhos CORS para permitir que seu aplicativo chame esta função
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Trata a requisição OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Cria um cliente Supabase com permissões de administrador para bypassar o RLS.
    // Isso é seguro pois a SERVICE_ROLE_KEY só existe no ambiente do servidor.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Adicionado: Obter o endpoint base da Evolution API a partir dos segredos
    const evoEndpoint = Deno.env.get('EVOLUTION_URL');

    if (!evoEndpoint) {
      console.error('A variável de ambiente EVOLUTION_URL não está configurada.');
      return new Response(JSON.stringify({ error: 'Configuração do servidor incompleta.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const { delegaciaId } = await req.json()

    if (!delegaciaId) {
      return new Response(JSON.stringify({ error: 'delegaciaId é obrigatório' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // 1. Buscar dados da delegacia (apiKey e nome da instância) usando o cliente admin
    const { data: delegacia, error: delegaciaError } = await supabaseAdmin
      .from('delegacias')
      .select('evoAPI, evoInstancia') // Removido 'evoEndpoint'
      .eq('delegaciaId', delegaciaId)
      .single()

    if (delegaciaError || !delegacia) {
      console.error('Erro ao buscar delegacia:', delegaciaError);
      return new Response(JSON.stringify({ error: 'Delegacia não encontrada ou erro ao buscar dados.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      })
    }

    const { evoAPI, evoInstancia } = delegacia;

    if (!evoAPI || !evoInstancia) {
        return new Response(JSON.stringify({ error: 'Configuração da instância da Evolution API incompleta para esta delegacia.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    // 2. Chamar a Evolution API para obter o status/QR Code
    const response = await fetch(`${evoEndpoint}/instance/connect/${evoInstancia}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evoAPI,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text(); // Usar .text() para mais detalhes em caso de erro não-JSON
      console.error('Erro da Evolution API:', errorData);
      return new Response(JSON.stringify({ error: 'Erro ao conectar com a Evolution API', details: errorData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      })
    }

    const data = await response.json();

    // 3. Retornar a resposta da Evolution API para o front-end
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erro inesperado na função:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})