export interface CoverageCity {
  name: string;
  neighborhoods: string[];
}

// Publicar somente os bairros confirmados pela operação.
// Lista vazia significa que a relação ainda não foi fornecida, não ausência de cobertura.
export const coverageCities: CoverageCity[] = [
  { name: 'Tramandaí', neighborhoods: [] },
  { name: 'Imbé', neighborhoods: [] },
];
