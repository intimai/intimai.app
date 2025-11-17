import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req)=>{
  try {
    const body = await req.json().catch(()=>null);
    console.log("📩 BODY RECEBIDO:", body);
    if (!body || !body.telefone || !body.status_para_verificar) {
      console.log("❌ Telefone ou status_para_verificar não enviado");
      return respostaVazia();
    }
    // -------------------------------
    // 1) Normalização avançada
    // -------------------------------
    let tel = String(body.telefone).replace(/^\+?55/, "").replace(/\D/g, "");
    console.log("📞 Telefone após normalização inicial:", tel);
    const candidatos = [];
    if (tel.length === 10) {
      console.log("🔎 TELEFONE 10 dígitos detectado");
      candidatos.push(tel);
      candidatos.push(tel.slice(0, 2) + "9" + tel.slice(2));
    } else if (tel.length === 11) {
      console.log("🔎 TELEFONE 11 dígitos detectado");
      candidatos.push(tel);
    } else {
      console.log("❌ Formato inválido:", tel);
      return respostaVazia();
    }
    console.log("📌 Candidatos finais:", candidatos);
    // -------------------------------
    // 2) Gera HMAC para todos
    // -------------------------------
    const hmacKey = Deno.env.get("HMAC_KEY");
    if (!hmacKey) {
      console.log("❌ HMAC_KEY NÃO ENCONTRADA NOS SECRETS");
    }
    const encoder = new TextEncoder();
    const hmacs = [];
    for (const numero of candidatos){
      console.log("🔐 Gerando HMAC para:", numero);
      const key = await crypto.subtle.importKey("raw", encoder.encode(hmacKey), {
        name: "HMAC",
        hash: "SHA-256"
      }, false, [
        "sign"
      ]);
      const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(numero));
      const hashArray = Array.from(new Uint8Array(signature));
      const hmac = hashArray.map((b)=>b.toString(16).padStart(2, "0")).join("");
      console.log("➡️ HMAC gerado:", hmac);
      hmacs.push(hmac);
    }
    console.log("📌 Lista final de HMACs:", hmacs);
    // -------------------------------
    // 3) Consulta Supabase
    // -------------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    console.log("🔑 Service Role carregada?", !!serviceRoleKey);
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    // Define a lista de status a ser usada na consulta
    const statusParaVerificar = body.status_para_verificar;

    console.log("🔍 Status para verificação:", statusParaVerificar);

    const { data, error } = await supabase.from("intimacoes").select("id, status, telefone_hmac").in("telefone_hmac", hmacs).in("status", statusParaVerificar).order("criadoEm", {
      ascending: false
    }).limit(1);
    console.log("📤 Resultado da query:", data);
    console.log("⚠️ Erro da query:", error);
    if (!data || data.length === 0) {
      console.log("❌ Nenhuma intimação encontrada");
      return new Response(JSON.stringify({
        telefone_normalizado: candidatos,
        telefone_hmac: hmacs,
        existe_intimacao: false,
        status_existente: null,
        id_intimacao: null
      }), {
        status: 200
      });
    }
    const resultado = data[0];
    console.log("✅ Intimação encontrada:", resultado);
    return new Response(JSON.stringify({
      telefone_normalizado: candidatos,
      telefone_hmac: hmacs,
      existe_intimacao: true,
      status_existente: resultado.status,
      id_intimacao: resultado.id
    }), {
      status: 200
    });
  } catch (e) {
    console.log("🔥 ERRO GERAL:", e);
    return respostaVazia();
  }
});
function respostaVazia() {
  return new Response(JSON.stringify({
    telefone_normalizado: null,
    telefone_hmac: null,
    existe_intimacao: false,
    status_existente: null,
    id_intimacao: null
  }), {
    status: 200
  });
}
