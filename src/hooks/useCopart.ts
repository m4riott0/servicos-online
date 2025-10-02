import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface CopartInfo {
  ehCoparticipativo: boolean;
}

/**
 * Verifica se o plano do usuário autenticado é coparticipativo.
 *
 * @returns {CopartInfo} Um objeto contendo `ehCoparticipativo` como booleano.
 */
export function useCopart(): CopartInfo {
  const { user } = useAuth();

  const ehCoparticipativo = useMemo(() => {
    return user?.coparticipativo ?? false;
  }, [user]);

  return { ehCoparticipativo };
}