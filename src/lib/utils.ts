import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helpers para mascarar
export function maskEmail(email: string): string {
  if (!email) return "";
  const [user, domain] = email.split("@");
  return user.substring(0, 3) + "****@" + domain;
}

export function maskCelular(celular: string): string {
  if (!celular) return "";
  return celular.length >= 11
    ? celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-****")
    : celular;
}

export const formatDateTime = (dateString: string, pattern = "dd/MM/yyyy HH:mm:ss") => {
  if (!dateString) return "---";
  const date = new Date(dateString);
  return format(date, pattern, { locale: ptBR });
};
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}