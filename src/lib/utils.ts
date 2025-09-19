import { clsx, type ClassValue } from "clsx";
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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}