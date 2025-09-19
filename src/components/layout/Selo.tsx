import React from "react";

export default function Selo({ codigo, nome }) {
  // se não existir, nada será renderizado
  if (!codigo) return null;

  return (
    <div className="flex items-center gap-2">
      <img
        src={`/selos/${codigo}.png`} // caminho direto
        alt={nome}
        className="w-6 h-6"
      />
    </div>
  );
}
