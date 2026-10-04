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
  type: 'residential' | 'business';
  subtitle?: string;
}

// Condições provisórias: confirmar uploads, fidelidade, comodato e pacote Watch TV com o marketing.
export const includedInAllPlans = {
  equipment: 'Roteador Wi-Fi 6 em comodato, sem custo adicional',
  tv: {
    name: 'Watch TV',
    description: 'Aplicativo de canais de TV incluso: canais ao vivo e conteúdo sob demanda, no celular, TV ou computador',
  },
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
    description: 'Ideal para uso diário, redes sociais e streaming.',
    benefits: ['Navegação e redes sociais', 'Streaming em Full HD', 'Videochamadas'],
    type: 'residential',
  },
  {
    id: '250',
    name: '250 Mega',
    download: 250,
    upload: 125,
    price: 99.9,
    description: 'Ótimo para famílias e uso simultâneo.',
    benefits: ['Streaming em vários aparelhos ao mesmo tempo', 'Home office e videochamadas', 'Vários dispositivos conectados'],
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
    description: 'Perfeito para streaming 4K, jogos online e casas conectadas.',
    benefits: ['Streaming em 4K', 'Jogos online com baixa latência', 'Home office sem travar', 'Toda a família conectada'],
    type: 'residential',
  },
  {
    id: '750',
    name: '750 Mega',
    download: 750,
    upload: 375,
    price: 139.9,
    description: 'Alta performance para gamers e uso intenso.',
    benefits: ['Downloads pesados em segundos', 'Múltiplas TVs em 4K', 'Casa inteligente e câmeras'],
    type: 'residential',
  },
  {
    id: '1giga',
    name: '1 Giga',
    download: 1000,
    upload: 500,
    price: null,
    description: 'Ultra velocidade para quem exige o máximo desempenho.',
    benefits: ['Máxima velocidade da rede', 'Ideal para criadores de conteúdo', 'Atendimento consultivo'],
    type: 'residential',
  },
  {
    id: 'business',
    name: 'Plano Empresarial',
    subtitle: 'Personalizado',
    description: 'Entre em contato com nossos especialistas e informe sua necessidade. Criamos um plano de acordo com a demanda da sua empresa.',
    benefits: ['Velocidade sob medida', 'Roteador Wi-Fi 6 incluso', 'Suporte prioritário'],
    type: 'business',
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
    title: includedInAllPlans.tv.name,
    highlight: 'canais de TV',
    text: `${includedInAllPlans.tv.name} incluso nos planos residenciais. ${includedInAllPlans.tv.description}.`,
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
