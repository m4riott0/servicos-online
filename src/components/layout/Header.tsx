import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut, User, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import logo from "../../assets/bensaude.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigation } from "./Sidebar";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="bg-card border-b border-border/50 shadow-sm sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel className="text-lg">
                  Navegação
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navigation.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <NavLink
                      to={item.href}
                      className="flex items-center w-full text-base py-2"
                    >
                      <item.icon className="h-6 w-6 mr-3" />
                      <span>{item.name}</span>
                    </NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <img src={logo} alt="Bensaúde Logo" className="h-8 w-auto" />
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-accent p-2"
              >
                <User className="h-5 w-5" />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{user?.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    CPF: {user?.cpf}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="sm:hidden">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.nome}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      CPF: {user?.cpf}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
