export const about = {
  name: 'Yash Rokad',
  role: 'Senior Product Designer',
  location: 'Mumbai, working with teams across GMT−8 to GMT+5:30',
  portrait: '/media/portrait.svg',
  /* Full-bleed hero image. Drop a real photograph in at this path — nothing
     else needs to change. */
  heroImage: '/media/hero-backdrop.svg',
  wordmark: 'Yash Rokad',
  heroHeadline: 'I design the software that decides how somebody\u2019s Tuesday goes.',
  heroSub:
    'Ten years inside enterprise verticals nobody puts on a showreel — payables, claims, shop floors, dock yards. The work is figuring out what the people using it are actually afraid of, then removing that.',
  aboutHeadline: 'Ten years spent in the rooms where software gets worked around.',
  introStatement:
    'I work on operational software: the systems people are required to use, on a deadline, often badly lit and rarely willingly. That constraint is the interesting part. When someone cannot walk away from your product, every unclear label becomes a cost the business pays forever.',
  /* The About page ledger — label on the left, answer on the right. */
  ledger: [
    {
      label: 'What I do',
      body: 'I design operational software: the systems people are required to use, on a deadline, often badly lit and rarely willingly. Payables, claims, shop floors, dock yards.',
    },
    {
      label: 'My background',
      body: 'Ten years across agency and in-house, from a Mumbai studio shipping twenty-one projects in two years to leading design on platforms running in fourteen plants and eleven distribution centres.',
    },
    {
      label: 'My approach',
      body: 'Research on the bad day, not the convenient one. Design the explanation, not just the outcome — in enterprise work someone always has to defend the software\u2019s decision to somebody else. One load-bearing rule beats ten guidelines.',
    },
    {
      label: 'Outside work',
      body: 'I restore mechanical watches badly and slowly, which is the only hobby I have found that punishes impatience as reliably as design research does.',
    },
  ],

  philosophy: [
    {
      title: 'Research where the work happens',
      body: 'A month-end close does not look like a month-end close on a Tuesday afternoon in a usability lab. I schedule fieldwork for the bad day, not the convenient one — night shifts, storm response, close week.',
    },
    {
      title: 'Design the explanation, not just the outcome',
      body: 'In enterprise work the user usually has to defend the software’s decision to somebody else. If the interface cannot help them do that, they will quietly redo the work by hand.',
    },
    {
      title: 'One rule beats ten guidelines',
      body: 'The visual systems that survive contact with a real team are the ones carrying a single load-bearing rule — filled means confirmed, amber means state — that anyone can apply without asking me.',
    },
    {
      title: 'Ship it, then go watch',
      body: 'I treat launch as the midpoint. Every project here has post-release numbers because I went back and looked, including at the two sites where it regressed.',
    },
  ],
  timeline: [
    { period: '2022 — Present', role: 'Lead Product Designer', org: 'Halvard Systems', note: 'Leading design on operational platforms across logistics and manufacturing. Built the research practice from one designer to four.' },
    { period: '2019 — 2022', role: 'Senior Product Designer', org: 'Merrowfield Mutual', note: 'Claims and policyholder experience. Rebuilt first notice of loss end to end; ran the first field research programme the team had done.' },
    { period: '2017 — 2019', role: 'Product Designer', org: 'Kestrel Pay', note: 'Payables and reconciliation tooling for mid-market finance teams. Learned to read a general ledger, mostly out of self-defence.' },
    { period: '2015 — 2017', role: 'UI Designer', org: 'Ostrand Studio', note: 'Agency work across SaaS and hospitality. Twenty-one projects in two years — a fast education in what does not survive handoff.' },
  ],
  skills: [
    'Product Strategy', 'Design Systems', 'Contextual Inquiry', 'Service Blueprinting',
    'Interaction Design', 'Journey Mapping', 'Usability Testing', 'Data-Informed Design',
    'Design Ops', 'Enterprise UX', 'Prototyping', 'Workshop Facilitation',
  ],
  tools: [
    { name: 'Figma', use: 'Design, systems, prototyping' },
    { name: 'FigJam & Miro', use: 'Workshops, journey mapping' },
    { name: 'Dovetail', use: 'Research repository' },
    { name: 'Maze & UserTesting', use: 'Unmoderated validation' },
    { name: 'Amplitude & Metabase', use: 'Behavioural and funnel analysis' },
    { name: 'Storybook', use: 'Design-engineering handoff' },
    { name: 'React & CSS', use: 'Enough to build the thing I am arguing for' },
    { name: 'GSAP', use: 'Motion prototyping and production interaction' },
  ],
  capabilities: [
    { slug: 'discovery', title: 'Discovery & Field Research', body: 'I schedule fieldwork for the bad day, not the convenient one.', deliverables: ['Research plan', 'Insight set', 'Opportunity map'], accent: '#ffffff',
    artTone: '#c9c8c5', image: '/media/cap-discovery.svg' },
    { slug: 'service', title: 'Service & Journey Design', body: 'Mapping the whole path, including the parts your product does not own yet.', deliverables: ['Journey maps', 'Service blueprints', 'Moments of truth'], accent: '#ffffff',
    artTone: '#b6b5b2', image: '/media/cap-service.svg' },
    { slug: 'product', title: 'Product & Interaction Design', body: 'End-to-end flows for dense, high-consequence software.', deliverables: ['Flows', 'High-fidelity UI', 'Prototypes'], accent: '#ffffff',
    artTone: '#a3a29f', image: '/media/cap-product.svg' },
    { slug: 'systems', title: 'Design Systems', body: 'Tokens and components built so eight people can move without asking permission.', deliverables: ['Token set', 'Component library', 'Contribution model'], accent: '#ffffff',
    artTone: '#d6d5d2', image: '/media/cap-systems.svg' },
    { slug: 'ops', title: 'Design Ops & Enablement', body: 'Research practice and critique rituals that outlast whoever set them up.', deliverables: ['Research ops', 'Critique cadence', 'Handoff standards'], accent: '#ffffff',
    artTone: '#8f8e8b', image: '/media/cap-ops.svg' },
    { slug: 'vision', title: 'Pre-sales & Vision Work', body: 'Concept work that helps a buyer picture it, without writing cheques delivery cannot cash.', deliverables: ['Vision concepts', 'Pitch narrative', 'Feasibility framing'], accent: '#ffffff',
    artTone: '#bfbebb', image: '/media/cap-vision.svg' },
  ],
  process: [
    { step: '01', title: 'Go and look', body: 'Fieldwork on the real day, in the real room. Everything after this is downstream of what I see here.' },
    { step: '02', title: 'Find the load-bearing problem', body: 'Most backlogs contain thirty problems and one that explains the other twenty-nine. I want that one.' },
    { step: '03', title: 'Make it argue back', body: 'Prototype early and put it in front of the person who will hate it most. Their objection is the brief.' },
    { step: '04', title: 'Build the system, not the screen', body: 'Tokens, patterns and one clear rule, so the twentieth screen costs a tenth of what the first one did.' },
    { step: '05', title: 'Ship and measure', body: 'Post-release instrumentation agreed before launch, so we find out whether it worked instead of debating it.' },
  ],
  stats: [
    { value: 10, suffix: '+', label: 'Years designing operational software', note: 'Agency, in-house, and lead.' },
    { value: 34, suffix: '', label: 'Products shipped to production', note: 'Counted at GA, not at handoff.' },
    { value: 6, suffix: '', label: 'Enterprise verticals', note: 'Fintech, insurance, manufacturing, logistics, hospitality, SaaS.' },
    { value: 240, suffix: '+', label: 'Research sessions run', note: 'Including the ones at 3am on a shop floor.' },
  ],
  personalNote:
    'Outside of work I restore mechanical watches badly and slowly, which is the only hobby I have found that punishes impatience as reliably as design research does.',
  availability: {
    status: 'available',
    label: 'Taking on one new engagement for Q1',
    detail: 'Senior and lead product design roles, plus selective consulting on enterprise design systems and research practice.',
  },
  contact: {
    email: 'hello@yashrokad.design',
    phoneNote: 'Happy to talk live — send a couple of windows and I will confirm one.',
    socials: [
      { label: 'LinkedIn', handle: '/in/yashrokad', href: 'https://www.linkedin.com/in/yashrokad' },
      { label: 'Read.cv', handle: '/yashrokad', href: 'https://read.cv/yashrokad' },
      { label: 'Dribbble', handle: '@yashrokad', href: 'https://dribbble.com/yashrokad' },
      { label: 'GitHub', handle: '@yashrokad', href: 'https://github.com/yashrokad' },
    ],
  },
  faq: [
    { q: 'How do you usually start?', a: 'A paid two-week discovery. I go and watch the work happen, then come back with the one problem worth solving first and what it would take. If that reframes your roadmap, we carry on; if it does not, you have lost two weeks and gained a research artefact.' },
    { q: 'Do you work with in-house teams or replace them?', a: 'Alongside, always. The measure of a good engagement is that your team can keep making these decisions after I leave — which means most of my time goes into the system and the rituals, not the pixels.' },
    { q: 'What do you need from us?', a: 'Access to real users doing the real task, one decision-maker who can say yes, and permission to report what I find even when it is inconvenient. Nothing else is negotiable; everything else is.' },
    { q: 'What is out of scope?', a: 'Brand identity, marketing sites, and illustration — I know good people for all three. I also will not run a research study designed to confirm a decision that has already been made.' },
  ],
  footer: {
    newsletterLabel: 'Newsletter',
    newsletterLine: 'Notes on designing operational software — sent only when there is something worth reading.',
    location: ['Mumbai, Maharashtra', 'Working with teams across GMT\u22128 to GMT+5:30'],
    contacts: [
      { label: 'For new projects', value: 'hello@yashrokad.design' },
      { label: 'For everything else', value: 'studio@yashrokad.design' },
    ],
    credit: 'Built by hand — React, GSAP, Manrope.',
  },

  closingCta: {
    line: 'Have a system that people are required to use and quietly work around?',
    action: 'Start a conversation',
  },
};
