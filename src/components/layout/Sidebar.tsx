import React, { ElementType } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  CreditCard,
  Stethoscope,
  HeartPulse,
  BadgeDollarSign,
  Tag,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/home",
    icon: Home,
  },
  {
    name: "Autorizações", 
    href: "/autorizacoes",
    icon: FileText,
  },
  {
    name: "Financeiro", 
    href: "/financeiro",
    icon: CreditCard,
  },
  {
    name: "Comercial", 
    href: "/comercial",
    icon: BadgeDollarSign ,
  },
  {
    name: "Guia Médico", 
    href: "/guia-medico",
    icon: Stethoscope,
  },
  {
    name: "Medicina Preventiva", 
    href: "/medicina-preventiva",
    icon: HeartPulse,
  },
  {
    name: "Clube de benefícios",
    href: "/beneficios",
    icon: Tag,
  }
];

export const Sidebar: React.FC = () => {
  return (
    <nav className="w-64 bg-card border-r border-border/50 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="space-y-2">
          {navigation.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-medical"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>

              {item.children && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-4 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};
