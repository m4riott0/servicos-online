import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Perfis = {
  BENEFICIARIO_RESPONSAVEL_FINANCEIRO: "BENEFICIARIO RESPONSAVEL FINANCEIRO",
  RESPONSAVEL_FINANCEIRO_NAO_BENEFICIARIO: "RESPONSAVEL FINANCEIRO NAO BENEFICIARIO",
  TITULAR: 'TITULAR',
} as const;

type PerfilUsuario = (typeof Perfis)[keyof typeof Perfis];

/**
 * verifica se o usuário autenticado possui um ou mais perfis permitidos.
 *
 * @param perfisPermitidos - Uma string ou um array de strings com os perfis que têm acesso.
 * @returns boolean - `true` se o usuário tiver um dos perfis permitidos.
 */
export function usePermissao(
  perfisPermitidos: PerfilUsuario | PerfilUsuario[]
): boolean {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user?.tipoPerfil) return false;

    const perfis = Array.isArray(perfisPermitidos)
      ? perfisPermitidos
      : [perfisPermitidos];

    const normalizeString = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

    const perfilDoUsuario = normalizeString(user.tipoPerfil);

    return perfis.some(p => normalizeString(p) === perfilDoUsuario);
  }, [user, perfisPermitidos]);
}

/**
 * Atalho semântico para verificar se o usuário é um Responsável Financeiro.
 *
 * @returns boolean - `true` se o usuário for responsável financeiro.
 */
export function useResponsavelFinanceiro(): boolean {
  return usePermissao([
    Perfis.BENEFICIARIO_RESPONSAVEL_FINANCEIRO,
    Perfis.RESPONSAVEL_FINANCEIRO_NAO_BENEFICIARIO,
    Perfis.TITULAR
  ]);
}
