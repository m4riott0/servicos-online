import React, { ElementType } from 'react';
import { MapPin, Phone, Shield, FileText, Globe, ExternalLink } from 'lucide-react';
import logo from '../../assets/bensaude.png';

interface Unit {
  name: string;
  address?: string;
  cepCity?: string;
  googleMapsUrl?: string;
}

const units: Unit[] = [
  {
    name: 'Unidade Administrativa',
    address: 'Rua XV de Novembro, 4488 - Redentora',
    cepCity: 'CEP 15015-110 - São José do Rio Preto/SP',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Rua+XV+de+Novembro,+4488+-+Redentora,+São+José+do+Rio+Preto/SP',
  },
  {
    name: 'Unidade de Medicina Preventiva',
    address: 'Rua Redentora, 3140 - Redentora',
    cepCity: 'CEP 15015-780 - São José do Rio Preto/SP',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Rua+Redentora,+3140+-+Redentora,+São+José+do+Rio+Preto/SP',
  },
  {
    name: 'Unidade Comercial',
    address: 'Rua XV de Novembro, 4477 - Redentora',
    cepCity: 'CEP 15015-110 - São José do Rio Preto/SP',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Rua+XV+de+Novembro,+4477+-+Redentora,+São+José+do+Rio+Preto/SP',
  },
  {
    name: 'Unidade Jales',
    address: 'Rua Paulo Marcondes, 1188 - Jardim Romero',
    cepCity: 'CEP 15706-254 - Jales/SP',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Rua+Paulo+Marcondes,+1188+-+Jardim+Romero,+Jales/SP',
  },
  {
    name: 'Unidade de Serviços Ambulatoriais',
    address: ' Rua Redentora, 3140 - Vila Redentora,',
    cepCity: 'CEP 15015-780 - São José do Rio Preto/SP',
    googleMapsUrl: '#'
  },
];

const ansInfo = {
  phone: '0800 701 9656',
  phoneHref: 'tel:08007019656',
  website: 'http://www.ans.gov.br',
  inspectionUrl: 'http://www.ans.gov.br/aans/nossos-enderecos',
};

const privacyInfo = {
  policyUrl: 'https://bensau.de/politicaprivacidade',
  rn: 'RN 593/2023',
};

interface FooterColumnProps {
  title: string;
  icon: ElementType;
  children: React.ReactNode;
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, icon: Icon, children }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Icon className="mr-2 h-5 w-5 flex-shrink-0" />
      <span>{title}</span>
    </h3>
    {children}
  </div>
);

interface FooterLinkProps {
  href: string;
  icon: ElementType;
  text: string;
  isExternal?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, icon: Icon, text, isExternal = true }) => (
  <a href={href} {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })} className="inline-flex items-center gap-2 hover:text-primary transition-colors break-all">
    <Icon className="h-4 w-4 flex-shrink-0" />
    <span>{text}</span>
  </a>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border/50 text-card-foreground mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <img src={logo} alt="Bensaúde Logo" className="h-8 w-auto mb-4" />
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Bensaúde.</p>
            <p className="text-xs text-muted-foreground">Todos os direitos reservados.</p>
          </div>

          <FooterColumn title="Contato e Endereços" icon={MapPin}>
            <div className="space-y-4 text-sm text-muted-foreground">
              {units.map((unit) => (
                <div key={unit.name} className="[&:not(:last-child)]:pb-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/50">
                  <p className="font-semibold text-foreground">{unit.name}</p>
                  {unit.googleMapsUrl ? (
                    <a
                      href={unit.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:text-primary group"
                    >
                      <p>{unit.address}</p>
                      <p className="inline-flex items-center gap-1">
                        {unit.cepCity}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </a>
                  ) : (
                    <p className="text-muted-foreground/80">{unit.address}</p>
                  )}
                </div>
              ))}
            </div>
          </FooterColumn>

          <FooterColumn title="ANS" icon={Shield}>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-col items-start">
                <strong className="text-foreground">Disque ANS:</strong>
                <FooterLink href={ansInfo.phoneHref} icon={Phone} text={ansInfo.phone} isExternal={false} />
              </div>
              <div className="flex flex-col items-start">
                <strong className="text-foreground">Site:</strong>
                <FooterLink href={ansInfo.website} icon={Globe} text="www.ans.gov.br" />
              </div>
              <div className="flex flex-col items-start">
                <strong className="text-foreground">Núcleos de Fiscalização:</strong>
                <FooterLink href={ansInfo.inspectionUrl} icon={ExternalLink} text="Endereços dos núcleos" />
              </div>
            </div>
          </FooterColumn>

          <FooterColumn title="Regulamentação" icon={FileText}>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-col items-start">
                <strong className="text-foreground">Política de Privacidade:</strong>
                <FooterLink href={privacyInfo.policyUrl} icon={ExternalLink} text="Acesse nossa política" />
              </div>
              <div>
                <strong className="text-foreground">Normativa:</strong>
                <p>{privacyInfo.rn}</p>
              </div>
            </div>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
};
