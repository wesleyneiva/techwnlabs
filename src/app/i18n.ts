// Dicionário PT/EN do site. A troca é feita em runtime (signal em App),
// sem recarregar a página. `en` é tipado a partir de `pt` para o compilador
// acusar qualquer chave faltando numa das línguas.

const pt = {
  descriptor: 'Soluções em tecnologia',
  nav: {
    services: 'Serviços',
    edge: 'Diferencial',
    about: 'Sobre',
    cta: 'Fale conosco',
    openMenu: 'Abrir menu',
  },
  hero: {
    badge: 'Software · Dados · IA · Conformidade',
    h1a: 'Sistemas e dados ',
    h1accent: 'com conformidade',
    h1b: ' de ponta a ponta',
    lead:
      'A WN Labs projeta software sob demanda, análise de dados e soluções com IA — ' +
      'e responde pela adequação jurídica do que constrói. Engenharia e Direito Digital ' +
      'na mesma conversa.',
    checks: ['Software sob demanda', 'Dados e IA', 'LGPD desde o projeto'],
    ctaPrimary: 'Fale conosco →',
    ctaSecondary: 'Ver serviços',
    mockNav: ['Painel', 'Relatórios', 'Dados', 'LGPD'],
    mockTitle: 'Visão geral',
    mockStat1: 'disponibilidade',
    mockStat2: 'eficiência',
    floatTitle: 'Conforme à LGPD',
    floatSub: 'desde o primeiro commit',
  },
  services: {
    eyebrow: 'Serviços',
    h2a: 'Tudo o que sua operação precisa, ',
    h2accent: 'em um só lugar',
    lead:
      'Do levantamento de requisitos ao relatório final — com a adequação jurídica ' +
      'embutida no processo, não como etapa extra.',
    dev: {
      title: 'Desenvolvimento de software',
      text:
        'Sistemas web sob demanda, do levantamento de requisitos à publicação. ' +
        'Aplicações pensadas para o seu processo, não o contrário.',
    },
    data: {
      title: 'Dados e IA',
      text:
        'Análise e modelagem de dados, relatórios e automações com inteligência ' +
        'artificial que transformam informação em decisão.',
    },
    qa: {
      title: 'Qualidade e testes',
      text:
        'Planejamento e execução de testes de software. Menos bug em produção, ' +
        'mais confiança em cada entrega.',
    },
    law: {
      title: 'Conformidade e Direito Digital',
      text:
        'Adequação à LGPD, políticas de privacidade, termos de uso e revisão de ' +
        'fluxos de dados — feitos por quem também escreve o código.',
      tag: 'Diferencial',
    },
    support: {
      title: 'Suporte técnico',
      text:
        'Manutenção de computadores e notebooks, instalação de software, formatação ' +
        'e impressoras, para você ou sua empresa.',
    },
  },
  edge: {
    eyebrow: 'O diferencial',
    h2a: 'Engenharia que entende de lei. ',
    h2accent: 'Conformidade que sabe programar.',
    lead:
      'A maioria dos desenvolvedores não domina conformidade — e a maioria de quem domina ' +
      'conformidade não implementa. A WN Labs fica no cruzamento: quem projeta o seu sistema ' +
      'é quem responde pela adequação dele à LGPD, na mesma conversa.',
    bannerTitle: 'Software correto tecnicamente e juridicamente',
    bannerText:
      'Privacidade por padrão, termos e políticas alinhados ao produto, e um único ' +
      'responsável pelas duas pontas.',
    bannerCta: 'Conversar sobre o seu projeto →',
  },
  about: {
    eyebrow: 'Sobre',
    h2: 'Quem está por trás',
    lead:
      'A WN Labs é liderada por <strong>Wesley Neiva</strong> — analista e desenvolvedor de sistemas, ' +
      'pós-graduado em <strong>Direito Digital</strong> e em <strong>Engenharia de Software</strong>. ' +
      'Atua como desenvolvedor, tester, analista de sistemas e analista de dados.',
    mission: {
      title: 'Missão',
      text: 'Construir tecnologia que resolve o problema do cliente com segurança técnica e jurídica.',
    },
    vision: {
      title: 'Visão',
      text: 'Ser referência em software e dados com conformidade nativa, não como remendo posterior.',
    },
    values: {
      title: 'Valores',
      text: 'Transparência, responsabilidade sobre o que entregamos, privacidade por padrão e melhoria contínua.',
    },
  },
  contact: {
    eyebrow: 'Contato',
    h2a: 'Vamos conversar sobre ',
    h2accent: 'o seu projeto',
    lead: 'Conte o que você precisa — retornamos em horário comercial.',
    name: 'Nome',
    namePh: 'Seu nome',
    email: 'E-mail',
    emailPh: 'voce@empresa.com.br',
    phone: 'Telefone / WhatsApp',
    phonePh: '(51) 99999-9999',
    message: 'Mensagem',
    messagePh: 'Conte rapidamente o que você precisa',
    honeypot: 'Empresa',
    consentA: 'Li e concordo com a ',
    consentLink: 'Política de Privacidade',
    submit: 'Enviar mensagem',
    sending: 'Enviando…',
    error: 'Não foi possível enviar. Tente pelo WhatsApp ou e-mail ao lado.',
    note: 'Para suporte técnico, o WhatsApp é o caminho mais rápido.',
  },
  modal: {
    title: 'Mensagem enviada!',
    text: 'Recebemos seu contato e retornamos em horário comercial. Se preferir agilizar, chama no WhatsApp.',
    whatsapp: 'Abrir WhatsApp',
    close: 'Fechar',
  },
  footer: {
    privacy: 'Política de Privacidade',
    tagline: 'WN Labs · Soluções em tecnologia · wnlabs.com.br',
  },
};

const en: typeof pt = {
  descriptor: 'Technology solutions',
  nav: {
    services: 'Services',
    edge: 'Our edge',
    about: 'About',
    cta: 'Contact us',
    openMenu: 'Open menu',
  },
  hero: {
    badge: 'Software · Data · AI · Compliance',
    h1a: 'Systems and data ',
    h1accent: 'with compliance',
    h1b: ' end to end',
    lead:
      'WN Labs designs custom software, data analysis and AI solutions — and stands behind ' +
      'the legal compliance of what it builds. Engineering and Digital Law in the same conversation.',
    checks: ['Custom software', 'Data & AI', 'LGPD by design'],
    ctaPrimary: 'Contact us →',
    ctaSecondary: 'See services',
    mockNav: ['Dashboard', 'Reports', 'Data', 'LGPD'],
    mockTitle: 'Overview',
    mockStat1: 'uptime',
    mockStat2: 'efficiency',
    floatTitle: 'LGPD compliant',
    floatSub: 'from the first commit',
  },
  services: {
    eyebrow: 'Services',
    h2a: 'Everything your operation needs, ',
    h2accent: 'in one place',
    lead:
      'From requirements gathering to the final report — with legal compliance built ' +
      'into the process, not bolted on afterwards.',
    dev: {
      title: 'Software development',
      text:
        'Custom web systems, from requirements to launch. Applications designed around ' +
        'your process, not the other way around.',
    },
    data: {
      title: 'Data & AI',
      text:
        'Data analysis and modeling, reports and AI-powered automations that turn ' +
        'information into decisions.',
    },
    qa: {
      title: 'Quality & testing',
      text:
        'Software test planning and execution. Fewer bugs in production, more confidence ' +
        'in every release.',
    },
    law: {
      title: 'Compliance & Digital Law',
      text:
        'LGPD (Brazilian data protection law) compliance, privacy policies, terms of use ' +
        'and data-flow reviews — done by someone who also writes the code.',
      tag: 'Our edge',
    },
    support: {
      title: 'Tech support',
      text:
        'Computer and notebook maintenance, software installation, formatting and ' +
        'printers, for you or your business.',
    },
  },
  edge: {
    eyebrow: 'Our edge',
    h2a: 'Engineering that understands the law. ',
    h2accent: 'Compliance that knows how to code.',
    lead:
      "Most developers don't master compliance — and most compliance experts don't build. " +
      'WN Labs sits at that intersection: the person who designs your system is the one who ' +
      'answers for its LGPD compliance, in the same conversation.',
    bannerTitle: 'Software that is technically and legally sound',
    bannerText:
      'Privacy by default, terms and policies aligned with the product, and a single ' +
      'person accountable for both ends.',
    bannerCta: "Let's talk about your project →",
  },
  about: {
    eyebrow: 'About',
    h2: "Who's behind it",
    lead:
      'WN Labs is led by <strong>Wesley Neiva</strong> — systems analyst and developer, ' +
      'with postgraduate degrees in <strong>Digital Law</strong> and <strong>Software Engineering</strong>. ' +
      'He works as a developer, tester, systems analyst and data analyst.',
    mission: {
      title: 'Mission',
      text: "Build technology that solves the client's problem with technical and legal safety.",
    },
    vision: {
      title: 'Vision',
      text: 'Be a reference in software and data with compliance built in, not patched on later.',
    },
    values: {
      title: 'Values',
      text: 'Transparency, accountability for what we deliver, privacy by default and continuous improvement.',
    },
  },
  contact: {
    eyebrow: 'Contact',
    h2a: "Let's talk about ",
    h2accent: 'your project',
    lead: 'Tell us what you need — we reply during business hours.',
    name: 'Name',
    namePh: 'Your name',
    email: 'E-mail',
    emailPh: 'you@company.com',
    phone: 'Phone / WhatsApp',
    phonePh: '+55 51 99999-9999',
    message: 'Message',
    messagePh: 'Briefly tell us what you need',
    honeypot: 'Company',
    consentA: 'I have read and agree to the ',
    consentLink: 'Privacy Policy',
    submit: 'Send message',
    sending: 'Sending…',
    error: "Couldn't send. Try WhatsApp or the e-mail on the side.",
    note: 'For tech support, WhatsApp is the fastest way to reach us.',
  },
  modal: {
    title: 'Message sent!',
    text: 'We received your message and will reply during business hours. To speed things up, ping us on WhatsApp.',
    whatsapp: 'Open WhatsApp',
    close: 'Close',
  },
  footer: {
    privacy: 'Privacy Policy',
    tagline: 'WN Labs · Technology solutions · wnlabs.com.br',
  },
};

export type Lang = 'pt' | 'en';
export const I18N: Record<Lang, typeof pt> = { pt, en };
