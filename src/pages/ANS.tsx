import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookMarked,
  Phone,
  Globe,
  ExternalLink,
  Shield,
  FileText,
} from "lucide-react";

const ansInfo = {
  phone: "0800 701 9656",
  phoneHref: "tel:08007019656",
  website: "http://www.ans.gov.br",
  inspectionUrl: "http://www.ans.gov.br/aans/nossos-enderecos",
};

const privacyInfo = {
  policyUrl: "https://bensau.de/politicaprivacidade",
  rn: "RN 593/2023",
};

const InfoItem: React.FC<{
  label: string;
  href?: string;
  text: string;
  isExternal?: boolean;
  icon: React.ElementType;
}> = ({ label, href, text, isExternal = true, icon: Icon }) => (
  <div className="p-4 bg-muted/50 rounded-lg">
    <p className="text-sm text-muted-foreground">{label}</p>
    {href ? (
      <a
        href={href}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:underline"
      >
        <Icon className="h-4 w-4" />
        <span>{text}</span>
      </a>
    ) : (
      <p className="text-lg font-semibold">{text}</p>
    )}
  </div>
);

export const ANS: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <BookMarked className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Dados ANS</h1>
            <p className="text-muted-foreground text-lg">
              Informações importantes da Agência Nacional de Saúde e
              regulamentações.
            </p>
          </div>
        </div>
      </div>

      <Card className="card-medical">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Agência Nacional de Saúde (ANS)</CardTitle>
          </div>
          <CardDescription>Canais de contato e informações.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="Disque ANS" href={ansInfo.phoneHref} text={ansInfo.phone} icon={Phone} isExternal={false} />
          <InfoItem label="Site" href={ansInfo.website} text="www.ans.gov.br" icon={Globe} />
          <InfoItem label="Núcleos de Fiscalização" href={ansInfo.inspectionUrl} text="Endereços dos núcleos" icon={ExternalLink} />
        </CardContent>
      </Card>

      <Card className="card-medical">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Regulamentação e Privacidade</CardTitle>
          </div>
          <CardDescription>
            Políticas e normativas relevantes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="Política de Privacidade" href={privacyInfo.policyUrl} text="Acesse nossa política" icon={ExternalLink} />
          <InfoItem label="Normativa" text={privacyInfo.rn} icon={FileText} />
        </CardContent>
      </Card>
    </div>
  );
};