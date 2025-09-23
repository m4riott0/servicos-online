import React from "react";

interface SeloProps {
  codigo: string;
  nome: string;
}

export default function Selo({ codigo, nome }: SeloProps) {
  if (!codigo) return null;

  return (
    //TODO Quando a API sofre alterações na parte de selo,
    //     deve-se alterar também os nomes dos arquivos que têm o código do selo.

    <div className="flex items-center gap-2">
      <img
        src={`/selos/${codigo}.png`} // caminho direto
        alt={nome}
        className="w-6 h-6"
      />
    </div>
  );
}
