export const links = {
    whatsapp: 'https://api.whatsapp.com/send?phone=5551995320037&text=Estou%20interessado%20em%20contratar.%20Como%20funciona?',
    instagram: 'https://www.instagram.com/splinktelecom/',
    facebook: 'https://pt-br.facebook.com/splinktelecom/',
    central: 'https://atendimento.sp-link.com.br/sac/login/?sys=SAC',
    contratoLocacao: 'assets/pdfs/Contrato-Locacao-Completo.pdf',
    contratoSVA: 'assets/pdfs/Contrato-de-prestacoes-de-servicos-de-valor-adicionado.pdf',
    contratoServico: 'assets/pdfs/Contrato-de-Prestacoes-de-Servicos-de-Telecomunicacoes.pdf',
    endereco_01: 'https://maps.app.goo.gl/Q6SQeR1cZkE2ZFeW8',
    endereco_02: 'https://maps.app.goo.gl/GjoTA4i3Ftnn7R2M8',
    app_android: 'https://play.google.com/store/apps/details?id=br.com.mksolutions.mksac.splink&pcampaignid=web_share',
    app_iphone: 'https://apps.apple.com/br/app/sp-link-cliente/id6467253864'

  };
  
  export const navBarMenu = [
    {
      label: 'Inicio',
      url: null,
      scrollTo: 'startBanner'
    },
    {
      label: 'Serviços',
      url: null,
      scrollTo: 'services'
    },
    {
      label: 'Planos',
      url: null,
      scrollTo: 'plans'
    },
    {
      label: 'Área de cobertura',
      url: null,
      scrollTo: 'coverage'
    },
    {
      label: 'Central do Assinante',
      url: links.central,
      scrollTo: null
    },
    {
      label: 'Sobre',
      url: null,
      scrollTo: null,
      submenu: [
        {
          label: 'Quem somos',
          url: null,
          scrollTo: 'whoWeAre'
        },
        {
          label: 'Trabalhe conosco',
          url: null,
          scrollTo: 'workUs'
        },
      ]
    },
  ]