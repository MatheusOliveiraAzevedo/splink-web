/**
 * Fonte única dos planos exibidos no site.
 * Para atualizar preço, velocidade ou condição comercial, altere apenas este arquivo.
 * Os dados estruturados para buscadores são derivados desta mesma fonte.
 */

export interface Plan {
  id: string;
  name: string;
  download: number | null;          // Mbps
  upload: number | null;            // Mbps
  price: number | null;      // mensalidade em R$; null = sob consulta
  highlight?: boolean;       // destaque visual
  badge?: string;
  description: string;
  benefits: string[];
  type: 'residential' | 'custom';
  options?: { id: string; label: string }[];
  subtitle?: string;
}

// Condições provisórias: confirmar uploads, fidelidade, comodato e pacote Watch TV com o marketing.
export const includedInAllPlans = {
  equipment: 'Roteador Wi-Fi 6 em comodato, sem custo adicional',
  installation: 'Instalação gratuita',
  loyalty: 'Fidelidade de 12 meses',
  support: 'Suporte técnico local, com atendimento humano',
};

export const plans: Plan[] = [
  {
    id: '170',
    name: '170 Mega',
    download: 170,
    upload: 85,
    price: 84.9,
    description: 'Internet para o dia a dia, apenas com a velocidade contratada.',
    benefits: ['Sem serviços adicionais (SVA)'],
    type: 'residential',
  },
  {
    id: '250',
    name: '250 Mega',
    download: 250,
    upload: 125,
    price: 99.9,
    description: 'Ótimo para famílias e uso simultâneo.',
    benefits: ['WatchTV incluso'],
    type: 'residential',
  },
  {
    id: '500',
    name: '500 Mega',
    download: 500,
    upload: 250,
    price: 119.9,
    highlight: true,
    badge: 'Plano em destaque',
    description: 'Você escolhe: streaming com WatchTV ou HUB de 5 IAs.',
    benefits: ['Um benefício à sua escolha, pelo mesmo valor'],
    options: [
      { id: 'streaming', label: 'Streaming — WatchTV' },
      { id: 'ia', label: 'IA — HUB de 5 IAs' },
    ],
    type: 'residential',
  },
  {
    id: '750',
    name: '750 Mega',
    download: 750,
    upload: 375,
    price: 145,
    description: 'Alta performance para gamers e uso intenso.',
    benefits: ['WatchTV incluso', 'HUB de IAs incluso', 'Segundo roteador incluso'],
    type: 'residential',
  },
  {
    id: 'custom',
    name: 'Planos personalizados',
    subtitle: 'Chama a gente',
    description: 'Precisa de uma solução diferente para sua casa ou empresa? Chama a gente para montar um plano de acordo com a sua necessidade.',
    benefits: ['Velocidade sob medida', 'Condições definidas com a nossa equipe'],
    type: 'custom',
    download: null,
    upload: null,
    price: null,
  }
];

export interface ServiceCard {
  icon: string;
  title: string;
  highlight: string;
  text: string;
}

export const serviceCards: ServiceCard[] = [
  {
    icon: 'bi-tv',
    title: 'WatchTV',
    highlight: 'canais de TV',
    text: 'Aplicativo de canais de TV com canais ao vivo e conteúdo sob demanda. Incluso no 250 e 750 Mbps; no 500 Mbps, disponível ao escolher a opção Streaming.',
  },
  {
    icon: 'bi-wifi',
    title: 'Wi-Fi 6',
    highlight: 'maior velocidade e capacidade',
    text: `Conecte seus dispositivos com a tecnologia Wi-Fi 6. ${includedInAllPlans.equipment}.`,
  },
];

export const imageWhoWeAre = {
  image: 'assets/fachada/Fachada.jpg',
};

export const configurationCarrousel = [
  { breakpoint: '1100px', numVisible: 2, numScroll: 1 },
  { breakpoint: '768px', numVisible: 1, numScroll: 1 },
];
