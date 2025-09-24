import React from 'react';
import logo from '../../assets/bensaude.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border/50 text-card-foreground mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          {/* Logo e Copyright */}
          <div className="md:col-span-1">
            <img src={logo} alt="Bensaúde Logo" className="h-8 w-auto mb-4" />
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Bensaúde.</p>
            <p className="text-xs text-muted-foreground">Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
