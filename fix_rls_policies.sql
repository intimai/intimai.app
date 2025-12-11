-- Script COMPLETO de Correção de RLS (Row Level Security)
-- Este script corrige o loop infinito no App Principal e mantém o acesso do Admin.

-- 1. Habilitar RLS (Segurança) nas tabelas críticas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegacias ENABLE ROW LEVEL SECURITY;

-- 2. Limpar todas as políticas antigas para evitar conflitos
-- Removemos regras antigas que podem estar duplicadas ou mal configuradas
DROP POLICY IF EXISTS "delegacias_select_all" ON public.delegacias;
DROP POLICY IF EXISTS "Admins podem ver todas delegacias" ON public.delegacias;
DROP POLICY IF EXISTS "usuarios_ver_proprio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_ler_proprio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_atualizar_proprio_perfil" ON public.usuarios;
DROP POLICY IF EXISTS "ver_minha_delegacia" ON public.delegacias;
DROP POLICY IF EXISTS "admin_gerenciar_tudo" ON public.delegacias;

-- 3. Políticas para a Tabela USUARIOS
-- Regra: Usuário comum só pode ver e editar o SEU próprio perfil
CREATE POLICY "usuarios_ler_proprio_perfil"
ON public.usuarios
FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

CREATE POLICY "usuarios_atualizar_proprio_perfil"
ON public.usuarios
FOR UPDATE
TO authenticated
USING (auth.uid() = "userId");

-- 4. Políticas para a Tabela DELEGACIAS

-- Regra A: Usuário Comum
-- Permite ver APENAS a delegacia à qual ele pertence (via ID no perfil do usuário)
CREATE POLICY "ver_minha_delegacia"
ON public.delegacias
FOR SELECT
TO authenticated
USING (
  "delegaciaId" IN (
    SELECT "delegaciaId" 
    FROM public.usuarios 
    WHERE "userId" = auth.uid()
  )
);

-- Regra B: Administradores (Painel Admin)
-- Permite que Admins vejam e editem TODAS as delegacias.
-- Usa a função is_admin() que já existe no seu banco.
CREATE POLICY "admin_gerenciar_tudo"
ON public.delegacias
FOR ALL
TO authenticated
USING (is_admin());

-- FIM DO SCRIPT
