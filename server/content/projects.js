/**
 * Seed content. Schema is deliberately flat and named for what each field
 * feeds in the UI, so swapping in real case studies is a content-only edit.
 * See the content-swap guide in README.md.
 */
export const projects = [
  {
    slug: 'ledgerline',
    title: 'Ledgerline',
    tagline: 'Month-end close cut from nine days to four for a 2,400-seat payables floor.',
    summary: 'A reconciliation console that treats matching as a judgement call, not a data-entry chore.',
    industry: 'Fintech',
    year: '2024',
    role: 'Lead Product Designer',
    timeline: '7 months · Discovery → GA',
    team: 'Me, 1 researcher, 2 PMs, 9 engineers',
    tools: ['Figma', 'FigJam', 'Maze', 'Amplitude', 'Storybook'],
    client: 'Kestrel Pay',
    accent: '#ffffff',
    artTone: '#c9c8c5',
    cover: '/media/ledgerline-cover.svg',
    bands: {
      about: '/media/ledgerline-band-about.svg',
      aboutCaption: 'The product in context',
      problem: '/media/ledgerline-band-problem.svg',
      problemCaption: 'Where the work actually happens',
      solution: '/media/ledgerline-band-solution.svg',
      solutionCaption: 'The system, assembled',
    },
    about:
      'Kestrel Pay processed payables for mid-market manufacturers, but its reconciliation console had been grown, not designed — eleven years of finance-team requests bolted onto one table. Close took nine days, and three of those were analysts re-checking work the system had already done. The mandate was to raise auto-match rates without hiding the machine: controllers sign their name to the close, so every automated decision had to be inspectable, reversible, and defensible to an auditor who arrives four months later.',
    metrics: [
      { value: 4, suffix: ' days', label: 'Month-end close', note: 'Down from nine, sustained across two quarters.' },
      { value: 91, suffix: '%', label: 'Auto-match rate', note: 'Up from 62% on identical transaction volume.' },
      { value: 38, suffix: '%', label: 'Fewer support tickets', note: 'Mostly the "why did it match this?" category, now answered in-product.' },
      { value: 12, prefix: '−', suffix: ' clicks', label: 'Per exception resolved', note: 'From 19 clicks to 7 on the median exception path.' },
    ],
    research: {
      intro:
        'Six weeks of fieldwork across four customer finance teams, deliberately timed to land on their close days rather than a quiet Tuesday.',
      methods: [
        { name: 'Contextual inquiry', detail: '11 sessions observed live during month-end close, two of them at 9pm.' },
        { name: 'Support-ticket mining', detail: '2,140 tickets from 18 months, coded into 9 recurring failure shapes.' },
        { name: 'Analytics funnel review', detail: 'Traced 40,000 exception resolutions to find where analysts abandoned mid-task.' },
        { name: 'Artefact analysis', detail: 'Collected the shadow spreadsheets 7 of 11 analysts kept beside the product.' },
      ],
      insight:
        'Analysts did not distrust the matching engine. They distrusted their ability to explain it to an auditor — so they redid its work by hand to have something to point at.',
      insightAttribution: 'Synthesis, week 5',
    },
    painPoints: [
      { label: 'The silent match', detail: 'Auto-matched pairs left no trace of why they matched, so analysts re-derived the logic manually before signing off.' },
      { label: 'Nineteen-click exceptions', detail: 'Resolving one mismatch meant four screens, two of which existed only to confirm you meant it.' },
      { label: 'Shadow spreadsheets', detail: 'Seven of eleven analysts kept a private tracker because the product could not show close progress by owner.' },
      { label: 'Audit panic', detail: 'Reconstructing a decision from four months ago took an average of 25 minutes and a Slack thread.' },
    ],
    competitiveAudit: {
      competitors: [
        { name: 'Bandelier Close', verdict: 'Beautiful dashboards, but every automated decision is a black box you can only accept or reject.' },
        { name: 'Portico ERP module', verdict: 'Total auditability, buried under a 1990s tree navigation nobody opens twice.' },
        { name: 'Netter Reconcile', verdict: 'Fast rules engine aimed at bookkeepers — collapses on multi-entity intercompany volume.' },
      ],
      whitespace:
        'Nobody had made the match itself legible. Explaining a decision was treated as an audit feature bolted on later, never as the thing that lets a controller move quickly in the moment.',
    },
    personas: [
      {
        name: 'Dana Okwuosa',
        role: 'Reconciliation Analyst, 6 years in seat',
        goal: 'Clear her queue by Thursday without leaving anything she cannot defend.',
        frustration: 'Redoes work the system already did, because the system will not show its reasoning.',
        quote: 'I trust it right up until someone asks me why. Then I start again from the bank file.',
      },
      {
        name: 'Marcus Hale',
        role: 'Corporate Controller',
        goal: 'Sign the close on time and survive the audit in April with no restatements.',
        frustration: 'Cannot see whose queue is stuck until the day it makes him late.',
        quote: 'I do not need it faster. I need to know at 4pm on day two whether we are going to be late.',
      },
    ],
    journey: {
      label: 'One month-end close, as it is actually lived',
      stages: [
        { name: 'Bank files land', detail: 'Overnight imports drop 14,000 transactions into the queue.', emotion: 'Braced', tone: 'neutral' },
        { name: 'Triage the queue', detail: 'Dana sorts by amount, not by risk, because risk is not a column.', emotion: 'Focused', tone: 'neutral' },
        { name: 'Re-check the auto-matches', detail: 'Three days spent verifying decisions the engine already made correctly.', emotion: 'Grinding', tone: 'low' },
        { name: 'Fight the exceptions', detail: 'Nineteen clicks each, with two confirmation dialogs that teach nothing.', emotion: 'Frustrated', tone: 'low' },
        { name: 'Chase the stragglers', detail: 'Marcus DMs four analysts to build a picture the product should have shown him.', emotion: 'Anxious', tone: 'low' },
        { name: 'Sign the close', detail: 'Nine days in, with a private spreadsheet as the real source of truth.', emotion: 'Relieved, not confident', tone: 'mid' },
        { name: 'April audit request', detail: 'Reconstruct a single decision from memory, Slack, and luck.', emotion: 'Exposed', tone: 'low' },
      ],
    },
    solutions: [
      {
        name: 'Match Receipts',
        resolves: 'The silent match',
        detail: 'Every automated pair carries a plain-language receipt — the rule that fired, the confidence, the two fields that clinched it — expandable inline and frozen into the audit record.',
      },
      {
        name: 'One-surface exceptions',
        resolves: 'Nineteen-click exceptions',
        detail: 'Exception resolution collapsed into a single split view with keyboard-first actions. Confirmation dialogs were replaced with a seven-second undo.',
      },
      {
        name: 'Close Board',
        resolves: 'Shadow spreadsheets',
        detail: 'A live close view by owner, queue and risk band, so a controller can see a stall on day two instead of day eight.',
      },
      {
        name: 'Time-travel view',
        resolves: 'Audit panic',
        detail: 'Any transaction can be replayed at any past date — what the system knew, what it decided, who overrode it — in one link an auditor can be sent.',
      },
    ],
    visualDesign: {
      statement:
        'Finance software earns trust by being boring in the right places. The language here is high-density and near-monochrome, with a single cool blue reserved exclusively for system-made decisions — so a controller scanning a screen can tell machine judgement from human judgement without reading a word. Numerals are tabular everywhere; nothing shifts as values update.',
      gallery: [
        { src: '/media/ledgerline-ui-1.svg', caption: 'Close Board — progress by owner and risk band' },
        { src: '/media/ledgerline-ui-2.svg', caption: 'Match receipt, expanded inline' },
        { src: '/media/ledgerline-ui-3.svg', caption: 'Single-surface exception resolution' },
        { src: '/media/ledgerline-ui-4.svg', caption: 'Time-travel replay of a matched pair' },
        { src: '/media/ledgerline-ui-5.svg', caption: 'Rule confidence and override history' },
      ],
    },
  },

  {
    slug: 'apten',
    title: 'APTEN',
    tagline: 'PLACEHOLDER — outcome line pending. A structured RFP replaces cold-calling warehouses.',
    summary: 'A B2B marketplace that turns 3PL selection into a structured, evidenced process.',
    industry: 'Logistics',
    year: '2026',
    role: 'PLACEHOLDER — role pending',
    timeline: 'PLACEHOLDER — 8 research phases · timeline pending',
    team: 'PLACEHOLDER — team pending',
    tools: ['Figma', 'FigJam'],
    client: 'APTEN',
    accent: '#ffffff',
    artTone: '#b6b5b2',
    cover: '/media/apten-cover.svg',
    bands: {
      about: '/media/apten-band-about.svg',
      aboutCaption: 'PLACEHOLDER — replace with a real platform shot',
      problem: '/media/apten-band-problem.svg',
      problemCaption: 'PLACEHOLDER — replace with a research or flow artefact',
      solution: '/media/apten-band-solution.svg',
      solutionCaption: 'PLACEHOLDER — replace with the Data Room or RFP flow',
    },
    about:
      'APTEN is a B2B marketplace that connects brands and manufacturers with third-party logistics providers through a structured RFP process. Instead of brands cold-calling warehouses, the platform handles the whole path — profile and volume data intake, algorithmic matching, long list to short list curation, a shared Data Room for evaluation, proposal comparison, and final award and onboarding.',
    metrics: [
      { value: 8, suffix: '', label: 'Research phases', note: 'PLACEHOLDER — replace with a real outcome metric.' },
      { value: 5, suffix: '', label: 'Competitors audited', note: 'PLACEHOLDER — replace with a real outcome metric.' },
      { value: 6, suffix: '', label: 'Sourced problem themes', note: 'PLACEHOLDER — replace with a real outcome metric.' },
      { value: 10, suffix: '', label: 'Problem–solution pairs', note: 'PLACEHOLDER — replace with a real outcome metric.' },
    ],
    research: {
      intro:
        'Desk research against genuine user-generated content and formal industry data, not assumption. Every claim below is traceable to a named source; where evidence was a single anecdote, it is labelled as one rather than generalised.',
      methods: [
        { name: 'Merchant forum mining', detail: 'Shopify Community threads where brands describe 3PL billing and fulfilment failures in their own words.' },
        { name: 'Formal industry survey', detail: 'SCALA UK survey via Fleet News — 20% of UK companies report difficulties with their 3PL.' },
        { name: 'Specialist consultancy analysis', detail: 'Staci Americas and Fulfillrite on how 3PL RFPs are actually run, and the red flags brands miss.' },
        { name: 'Verified review teardown', detail: 'G2 reviews of Clutch and Freightos, read for distrust of the matching platforms themselves.' },
      ],
      insight:
        'Only 35% of customers agree with the 54% of 3PLs who rate their own performance as highly successful — a 19-point gap between what is claimed and what is experienced.',
      insightAttribution: 'SCALA UK industry survey, via Fleet News',
    },
    painPoints: [
      {
        label: 'Rates move after you commit',
        detail: 'Quoted pricing changes once inventory and money are already in. Documented cases moved $10 to $14.50 per order and $8 to $25 per label.',
        evidence: 'Practical Ecommerce (Beardbrand); Shopify Community; Fulfillrite — Theme 1, high severity, three independent sources.',
      },
      {
        label: 'Capability is indistinguishable from sales talk',
        detail: 'Brands cannot separate real operational capacity from a team that says yes to everything, and there is no verified data to check it against before signing.',
        evidence: 'SCALA/Fleet News UK survey; Fulfillrite red-flags analysis — Theme 2, high severity.',
      },
      {
        label: 'The RFP is rushed and shallow',
        detail: 'RFPs get launched reactively as a fix to an existing crisis, sent to too many vendors without pre-filtering, and without the operational data needed to price accurately.',
        evidence: 'Staci Americas — Theme 3, recurring pattern across client engagements.',
      },
      {
        label: 'The matching platforms are themselves distrusted',
        detail: 'Reviewers report pay-for-placement undermining "verified" review claims, and platform fees that only surface at checkout.',
        evidence: 'G2 reviews of Clutch.co and Freightos — Theme 6, formal review data.',
      },
    ],
    competitiveAudit: {
      matrix: {
        caption: 'Where APTEN sits against the incumbents',
        dimensionLabel: 'Dimension',
        columns: [
          { name: 'Fulfill.com' },
          { name: 'W&F.com' },
          { name: 'Freightos' },
          { name: 'Clutch' },
          { name: 'Thomasnet' },
        ],
        rows: [
          { label: 'Domain', values: ['3PL matching', '3PL matching', 'Freight booking', 'B2B services', 'Industrial supply'] },
          { label: 'Self-service browsing', values: ['No', 'No', 'Yes', 'Yes', 'Yes'] },
          { label: 'RFP / proposal tools', values: ['No', 'No', 'Partial', 'No', 'RFI only'] },
          { label: 'Data Room', values: ['No', 'No', 'No', 'No', 'No'] },
          { label: 'Consultant layer', values: ['No', 'No', 'No', 'No', 'No'] },
          { label: 'Post-match contract mgmt', values: ['No', 'No', 'No', 'No', 'No'] },
          { label: 'Verified reviews', values: ['Yes', 'Limited', 'Limited', 'Yes', 'No'] },
        ],
      },
      competitors: [
        { name: 'Fulfill.com', verdict: 'Algorithmic matching plus human consultation, but fully form-gated with no RFP mechanism, no document exchange and a 3–5 day turnaround.' },
        { name: 'WarehousingAndFulfillment.com', verdict: 'Twenty years of curation and an 8% provider approval rate, wrapped in a basic UI with no proposal management and no transparency on how matching works.' },
        { name: 'Clutch.co', verdict: 'The most mature verified-review infrastructure in B2B services — undermined, per its own reviewers, by paid placement.' },
      ],
      whitespace:
        'Every incumbent stops at the introduction. None of them owns the evaluation — no shared document room, no structured proposal comparison, no contract record that holds after signing. That gap is exactly where the documented harm happens.',
    },
    personas: [
      {
        name: 'The Fulfillment Decision-Maker',
        role: 'Operations / Fulfillment Lead',
        company: 'Growing DTC / B2B brand',
        region: 'UK / US',
        tech: 'Moderate–high',
        quote: 'I can’t expect a fulfillment partner to care about my brand as much as I do.',
        goals: [
          'Find a 3PL that genuinely fits their volume and SKU profile without weeks of unstructured comparison.',
          'Lock in pricing and SLA terms that will not change after signing.',
          'See real operational performance data before committing, not just sales claims.',
        ],
        frustrations: [
          'A quoted rate changed materially after signing — real cases moved $10 to $14.50 per order.',
          'Hard to tell real capability from a sales team that says yes to everything.',
          'No pre-commitment visibility into performance, against a measured 19-point claim-versus-experience gap.',
        ],
        note: 'They own the outcome when a 3PL relationship goes wrong — fielding the customer complaints and explaining the billing discrepancies to finance.',
      },
      {
        name: 'The Business Development Lead',
        role: 'Business Development / Sales Lead',
        company: 'Mid-size 3PL provider',
        region: 'UK / US',
        tech: 'Moderate',
        quote: 'Generic pitches about warehouse locations and carrier relationships won’t win business anymore.',
        goals: [
          'Be matched with brands whose volume genuinely fits operational capacity, instead of chasing poor-fit prospects.',
          'Differentiate on real operational outcomes rather than generic infrastructure claims.',
          'Trust that platform fees are transparent and tied to genuinely qualified leads.',
        ],
        frustrations: [
          'The average 3PL sale needs six to eight touchpoints, but most reps give up after two or three.',
          'Consultant and agency referral channels are underused across the industry.',
          'Suspicion that competitors can buy visibility rather than earn it.',
        ],
        note: 'Thinner evidence than persona one — the two trust frustrations are extrapolated from adjacent competitor review data, not confirmed 3PL-side complaints. Primary interviews would strengthen it.',
      },
    ],
    journey: {
      label: 'The brand user, from first search to signed contract',
      stages: [
        {
          name: 'Awareness',
          goal: 'Recognise that the current fulfilment approach will not survive their order volume.',
          actions: 'Searches online, asks peers for referrals — often already mid-crisis with the incumbent.',
          touchpoints: 'Search results, industry blogs, word of mouth, competitor directories',
          pain: 'RFPs get triggered reactively, in response to an active problem, never planned.',
          opportunity: 'Speak directly to the reactive-search moment; help a rushed brand define real requirements before comparing anyone.',
          emotion: 'Overwhelmed', tone: 'low',
        },
        {
          name: 'Consideration',
          goal: 'Decide whether APTEN is a trustworthy way to find a 3PL at all.',
          actions: 'Weighs the value proposition against a manual search and the incumbent platforms.',
          touchpoints: 'Marketing site, landing page',
          pain: 'Matching platforms carry documented distrust; a 19-point claim-versus-experience gap sits behind it.',
          opportunity: 'Surface trust signals early — transparent deposit framing, evidence that matches are not pay-to-play.',
          emotion: 'Sceptical', tone: 'mid',
        },
        {
          name: 'Onboarding & setup',
          goal: 'Get business profile and operational data into the platform accurately.',
          actions: 'Signs up, completes the business profile, uploads order history, builds the product catalog.',
          touchpoints: 'Sign-up, onboarding wizard, Profile module, five-step Volume Profile',
          pain: 'Gathering detailed operational history takes real time, but pricing accuracy later depends on it.',
          opportunity: 'Reinforce graceful degradation — the "insufficient data" fallback belongs throughout onboarding, not only in the Data Room.',
          emotion: 'Focused', tone: 'neutral',
        },
        {
          name: 'Define requirements',
          goal: 'Get matched with 3PLs that genuinely fit, without months of vetting.',
          actions: 'Selects services, sets locations and budget, reviews the RFP dashboard and its matches.',
          touchpoints: 'Define Requirements screen, RFP dashboard, Define Scope wizard, 3PL profiles',
          pain: 'The matching logic is unspecified — the brand has no visibility into why a given 3PL surfaced.',
          opportunity: 'Highest-leverage point to close the trust gap: even a lightweight "why this match" tied to Volume Profile data.',
          emotion: 'Hopeful', tone: 'neutral',
        },
        {
          name: 'Engagement & evaluation',
          goal: 'Verify a shortlisted 3PL’s claims before committing money and inventory.',
          actions: 'Invites 3PLs into the Data Room, reads documents, asks questions, compares proposals.',
          touchpoints: 'Data Room, FAQ and Q&A, Ask a Question modal, proposal review',
          pain: 'Quoted rates have moved after signing — $10 to $14.50 per order, $8 to $25 per label.',
          opportunity: 'Resolve the open question in favour of server-side Cost Summary calculation — it closes a documented harm.',
          emotion: 'Scrutinising', tone: 'mid',
        },
        {
          name: 'Award & handoff',
          goal: 'Formalise the partnership, confident the terms will hold.',
          actions: 'Names a finalist, awards the winner, begins the Fulfilment Contract wizard.',
          touchpoints: 'Award action, Fulfilment Contract wizard, Relationships kanban',
          pain: 'This is exactly where documented cases show terms changing between agreement and execution.',
          opportunity: 'Make the locked, platform-tracked contract record a headline value proposition, not a quiet backend detail.',
          emotion: 'Relieved', tone: 'high',
        },
      ],
    },
    solutions: [
      {
        name: 'Server-side Cost Summary and a locking contract wizard',
        resolves: 'Rates move after you commit',
        detail: 'Cost is calculated server-side and the Fulfilment Contract wizard locks terms to match the Data Room proposal exactly. Post-signing changes require a logged, visible Change Request.',
      },
      {
        name: 'Mandatory, verified Performance Metrics',
        resolves: 'Capability is indistinguishable from sales talk',
        detail: 'A 3PL cannot receive RFP invitations until dispatch time, order accuracy and return processing are filled in and admin-verified, and they must be refreshed on a cadence so the data stays current.',
      },
      {
        name: 'A staged, pre-checked RFP flow',
        resolves: 'The RFP is rushed and shallow',
        detail: 'Define Scope, then Long List, then Short List — with a structured pre-RFP checklist that nudges order-history and volume data to completion before the brand can proceed.',
      },
      {
        name: 'Transparency as a first-class feature',
        resolves: 'The matching platforms are themselves distrusted',
        detail: 'A plain-language "how matching works" explainer, a "why this match" note tied to Volume Profile data on every suggestion, and the $100 deposit and 3PL billing model stated in full before signup.',
      },
    ],
    visualDesign: {
      statement:
        'PLACEHOLDER — the visual design rationale for APTEN is still to be written. Replace this with the argument for why this interface language suits a high-consequence procurement tool.',
      gallery: [
        { src: '/media/apten-ui-1.svg', caption: 'PLACEHOLDER — replace with a real screen' },
        { src: '/media/apten-ui-2.svg', caption: 'PLACEHOLDER — replace with a real screen' },
        { src: '/media/apten-ui-3.svg', caption: 'PLACEHOLDER — replace with a real screen' },
        { src: '/media/apten-ui-4.svg', caption: 'PLACEHOLDER — replace with a real screen' },
        { src: '/media/apten-ui-5.svg', caption: 'PLACEHOLDER — replace with a real screen' },
      ],
    },
  },
  {
    slug: 'fair-weather',
    title: 'Fair Weather',
    tagline: 'First notice of loss that stops turning a bad day into a bad month.',
    summary: 'A claims intake experience built around the twenty minutes after something goes wrong.',
    industry: 'Insurance',
    year: '2023',
    role: 'Senior Product Designer',
    timeline: '9 months · Two releases',
    team: 'Me, 1 content designer, 1 researcher, 6 engineers, 2 claims SMEs',
    tools: ['Figma', 'Dovetail', 'UserTesting', 'Optimal Workshop'],
    client: 'Merrowfield Mutual',
    accent: '#ffffff',
    artTone: '#a3a29f',
    cover: '/media/fair-weather-cover.svg',
    bands: {
      about: '/media/fair-weather-band-about.svg',
      aboutCaption: 'The product in context',
      problem: '/media/fair-weather-band-problem.svg',
      problemCaption: 'Where the work actually happens',
      solution: '/media/fair-weather-band-solution.svg',
      solutionCaption: 'The system, assembled',
    },
    about:
      'Merrowfield Mutual wrote home and small-commercial property policies across storm-exposed coastal states. Their first-notice-of-loss form was a faithful digital copy of a paper document: 62 fields, ordered by how the claims system stored data rather than how a person remembers an incident. Two thirds of policyholders abandoned it and phoned instead, at a call-handling cost the business had stopped questioning. The hard part was not the form. It was that claims intake happens on the worst day of someone’s year, often outdoors, often on a cracked phone, often while a contractor waits.',
    metrics: [
      { value: 71, suffix: '%', label: 'Digital FNOL completion', note: 'Up from 34% — the first release moved it more than the second.' },
      { value: 26, prefix: '−', suffix: '%', label: 'Intake call volume', note: 'Measured over the first full storm season post-launch.' },
      { value: 9, suffix: ' min', label: 'Median time to file', note: 'From 31 minutes, including photo capture.' },
      { value: 4.6, decimals: 1, suffix: '/5', label: 'Post-claim intake rating', note: 'From 3.1, on the same survey instrument.' },
    ],
    research: {
      intro:
        'Research ran against real claims, not hypotheticals — including three ride-alongs with field adjusters during an active storm response.',
      methods: [
        { name: 'Diary study', detail: '23 policyholders logged their first 72 hours after a loss, in their own words.' },
        { name: 'Call-recording analysis', detail: '180 intake calls transcribed and coded for the moment the caller gave up on the form.' },
        { name: 'Field ride-alongs', detail: 'Three days shadowing adjusters to see what intake data they actually reuse.' },
        { name: 'Tree testing', detail: 'Validated a loss-type taxonomy rewritten in claimant language, not policy language.' },
      ],
      insight:
        'People were not confused by the questions. They were afraid of them — every field read like a chance to say the wrong thing and lose the claim.',
      insightAttribution: 'Diary study, participant 14',
    },
    painPoints: [
      { label: 'The interrogation tone', detail: 'Fields phrased in policy language read as accusatory, so claimants stalled and called a human for reassurance.' },
      { label: 'All or nothing', detail: 'No save state. A phone dying at field 40 meant starting over at field 1.' },
      { label: 'Photos last', detail: 'Image upload sat at the end, long after most people had already put the phone down.' },
      { label: 'Silence after submit', detail: 'A confirmation number and then nothing for four days — the single largest driver of follow-up calls.' },
    ],
    competitiveAudit: {
      competitors: [
        { name: 'Northgate Assurance', verdict: 'Slick mobile intake, but funnels every complex loss straight to a phone queue.' },
        { name: 'Halden Insurance app', verdict: 'Strong claim-status tracking bolted onto an intake flow that still asks for a policy number first.' },
        { name: 'Ravensworth Direct', verdict: 'Chat-led intake that feels human until it asks the same question three times.' },
      ],
      whitespace:
        'Every competitor optimised the filing. None designed the wait. The days between submitting and hearing back were unowned territory, and that is exactly where trust was being lost.',
    },
    personas: [
      {
        name: 'Rosa Villalobos',
        role: 'Homeowner, first claim in 14 years',
        goal: 'Get the roof tarped and understand whether she is covered before the next storm.',
        frustration: 'Cannot tell which questions are required and which will be held against her.',
        quote: 'I kept re-reading it. I did not want to write the wrong thing and have that be the reason they said no.',
      },
      {
        name: 'Terrence Boyd',
        role: 'Field Adjuster, 200+ claims a season',
        goal: 'Arrive at a property already knowing what he is looking at.',
        frustration: 'Half his assignments arrive with a photo of a wet ceiling and no address detail worth using.',
        quote: 'Give me four good photos and the date it started. I can do the rest from the truck.',
      },
    ],
    journey: {
      label: 'From the moment of loss to first adjuster contact',
      stages: [
        { name: 'It happens', detail: 'Water through the ceiling at 6am; the priority is stopping it, not filing anything.', emotion: 'Alarmed', tone: 'low' },
        { name: 'Stabilise', detail: 'Buckets, towels, a call to a roofer who asks for a claim number she does not have.', emotion: 'Overwhelmed', tone: 'low' },
        { name: 'Find the policy', detail: 'Digging for a policy number the app should never have asked her for.', emotion: 'Impatient', tone: 'low' },
        { name: 'Start the form', detail: 'Sixty-two fields in policy language, no sense of how long this will take.', emotion: 'Wary', tone: 'low' },
        { name: 'Abandon and call', detail: 'Twelve minutes on hold to have a person confirm she is not making it worse.', emotion: 'Resigned', tone: 'mid' },
        { name: 'The silence', detail: 'Four days with a confirmation number and no visible progress.', emotion: 'Anxious', tone: 'low' },
        { name: 'Adjuster calls', detail: 'Finally a human with context — the first genuinely reassuring moment.', emotion: 'Relieved', tone: 'high' },
      ],
    },
    solutions: [
      {
        name: 'Ask like a person',
        resolves: 'The interrogation tone',
        detail: 'Every question rewritten with a content designer into claimant language, with a one-line "why we ask" beneath anything that sounds legally loaded.',
      },
      {
        name: 'Resumable by default',
        resolves: 'All or nothing',
        detail: 'Intake saves on every field change and can be resumed from a text-message link — no account, no password, no re-entry.',
      },
      {
        name: 'Photos first',
        resolves: 'Photos last',
        detail: 'Capture opens the flow while the claimant is still standing in front of the damage, with four guided shots adjusters said they actually reuse.',
      },
      {
        name: 'The visible wait',
        resolves: 'Silence after submit',
        detail: 'A claim timeline showing what has happened, what is next, and who owns it — plus a named adjuster and an honest date range, not a promise.',
      },
    ],
    visualDesign: {
      statement:
        'This one had to feel calm before it felt clever. Generous type sizes for outdoor phone use in bad light, one question per screen, and a soft violet reserved for anything the insurer commits to — dates, ownership, next steps — so a claimant scanning in a panic can find the promises. No progress percentages, which tested as pressure; a plain step count instead.',
      gallery: [
        { src: '/media/fair-weather-ui-1.svg', caption: 'Guided photo capture as the opening step' },
        { src: '/media/fair-weather-ui-2.svg', caption: 'One question per screen, with "why we ask"' },
        { src: '/media/fair-weather-ui-3.svg', caption: 'Resume-by-text handoff' },
        { src: '/media/fair-weather-ui-4.svg', caption: 'Claim timeline with named adjuster' },
        { src: '/media/fair-weather-ui-5.svg', caption: 'Adjuster-side intake summary' },
      ],
    },
  },

  {
    slug: 'shopfloor-signal',
    title: 'Shopfloor Signal',
    tagline: 'Gave line supervisors a downtime story they could act on before the shift ended.',
    summary: 'Downtime capture designed for gloved hands, loud rooms, and ninety free seconds.',
    industry: 'Manufacturing',
    year: '2023',
    role: 'Lead Product Designer',
    timeline: '11 months · 3 plants piloted, 14 rolled out',
    team: 'Me, 1 industrial engineer, 1 PM, 7 engineers',
    tools: ['Figma', 'Miro', 'Grafana', 'On-site observation'],
    client: 'Vantera Industrial',
    accent: '#ffffff',
    artTone: '#d6d5d2',
    cover: '/media/shopfloor-signal-cover.svg',
    bands: {
      about: '/media/shopfloor-signal-band-about.svg',
      aboutCaption: 'The product in context',
      problem: '/media/shopfloor-signal-band-problem.svg',
      problemCaption: 'Where the work actually happens',
      solution: '/media/shopfloor-signal-band-solution.svg',
      solutionCaption: 'The system, assembled',
    },
    about:
      'Vantera ran fourteen plants on an OEE platform that produced immaculate weekly reports nobody used to change anything. Downtime reasons were logged by supervisors from memory at end of shift, which meant the data was roughly right and completely useless — everything landed in a bucket called "Other, minor stop". The mandate was to make capture fast enough to happen at the machine, in the moment, by someone wearing gloves. The constraint that shaped everything: a supervisor has about ninety uninterrupted seconds, and the room is too loud to think in.',
    metrics: [
      { value: 84, suffix: '%', label: 'Stops logged within 5 min', note: 'Up from 11% logged same-shift.' },
      { value: 6.2, decimals: 1, suffix: ' pts', label: 'OEE lift on pilot lines', note: 'Sustained over two quarters at three plants.' },
      { value: 73, prefix: '−', suffix: '%', label: '"Other" reason codes', note: 'The bucket that used to swallow a third of all downtime.' },
      { value: 22, suffix: ' sec', label: 'Median time to log a stop', note: 'Two taps and a reason, gloves on.' },
    ],
    research: {
      intro:
        'Five days on three shop floors across two plants, including two night shifts, plus a teardown of eighteen months of reason-code data.',
      methods: [
        { name: 'Shadowing', detail: '11 supervisors observed across day, swing and night shifts.' },
        { name: 'Reason-code forensics', detail: 'Traced 34,000 logged stops to find where the taxonomy collapsed into "Other".' },
        { name: 'Glove testing', detail: 'Tap-target trials with three glove types on the actual wall-mounted panels.' },
        { name: 'Shift-handover interviews', detail: 'What actually gets passed on verbally, and why it never reaches the system.' },
      ],
      insight:
        'Supervisors were not skipping the log because it was long. They were skipping it because it asked for a cause at the exact moment they were still fixing the effect.',
      insightAttribution: 'Night shift, Plant 4',
    },
    painPoints: [
      { label: 'Cause before cure', detail: 'The system demanded a root cause while the line was still down and hands were still busy.' },
      { label: 'Taxonomy by committee', detail: '84 reason codes written by corporate engineering, none in the words the floor actually uses.' },
      { label: 'Gloves versus targets', detail: 'Touch targets sized for a mouse, on a panel only ever used with gloves on.' },
      { label: 'Reports nobody reads', detail: 'Weekly PDFs arriving Monday about a problem that was solved or forgotten on Wednesday.' },
    ],
    competitiveAudit: {
      competitors: [
        { name: 'Aldergate MES', verdict: 'Deep scheduling engine, an interface that assumes a seated operator with a keyboard.' },
        { name: 'Provec OEE', verdict: 'Genuinely good dashboards for plant managers; nothing at all for the person at the machine.' },
        { name: 'Kirinmark Tablet', verdict: 'Right hardware instincts, wrong data model — every stop needs a cause before it can be saved.' },
      ],
      whitespace:
        'Everyone built for the plant manager reading yesterday. Nobody built for the supervisor standing at a stopped line right now — which is the only moment the data is cheap to collect and worth anything.',
    },
    personas: [
      {
        name: 'Ivan Prokopenko',
        role: 'Line Supervisor, Line 3, night shift',
        goal: 'Get the line running and hand over a shift that does not create work for the next one.',
        frustration: 'Logging a stop properly costs him the same ninety seconds he needs to fix it.',
        quote: 'I will tell you exactly what happened. Just not while it is still happening.',
      },
      {
        name: 'Priya Raghunathan',
        role: 'Plant Operations Manager',
        goal: 'Find the two recurring stops costing her the most, and prove it to corporate.',
        frustration: 'A third of her downtime data says "Other", which is the same as no data.',
        quote: 'I can defend a number. I cannot defend a bucket labelled Other.',
      },
    ],
    journey: {
      label: 'A single unplanned stop, from klaxon to root cause',
      stages: [
        { name: 'Line stops', detail: 'Klaxon, andon light, and three people converging on the same machine.', emotion: 'Urgent', tone: 'low' },
        { name: 'Triage', detail: 'Ivan diagnoses by ear before he touches a panel.', emotion: 'Locked in', tone: 'neutral' },
        { name: 'Fix', detail: 'Eleven minutes, gloves on, both hands occupied.', emotion: 'Working', tone: 'neutral' },
        { name: 'Restart', detail: 'Line back up; the system now wants a root cause from a menu of 84.', emotion: 'Impatient', tone: 'low' },
        { name: 'Defer the log', detail: 'Tap "Other, minor stop" and promise himself he will fix it later.', emotion: 'Dismissive', tone: 'low' },
        { name: 'Shift handover', detail: 'Real story told verbally to the next supervisor, recorded nowhere.', emotion: 'Routine', tone: 'neutral' },
        { name: 'Monday report', detail: 'Priya reads a chart in which a third of the truth is missing.', emotion: 'Frustrated', tone: 'low' },
      ],
    },
    solutions: [
      {
        name: 'Two-tap stop',
        resolves: 'Cause before cure',
        detail: 'Logging splits in half: mark the stop in two gloved taps now, attach the cause from a phone during handover. Capture stops competing with repair.',
      },
      {
        name: 'Floor vocabulary',
        resolves: 'Taxonomy by committee',
        detail: '84 codes rewritten into 19, in the words supervisors used while being shadowed, with per-line ordering by actual frequency.',
      },
      {
        name: 'Glove-first panel',
        resolves: 'Gloves versus targets',
        detail: 'Minimum 72px targets, high-contrast at a two-metre glance, and no interaction that needs precision or a second hand.',
      },
      {
        name: 'The shift card',
        resolves: 'Reports nobody reads',
        detail: 'One card at handover: the three stops that cost this shift the most, and whether they are getting worse. It replaced the Monday PDF entirely.',
      },
    ],
    visualDesign: {
      statement:
        'Designed to be read at two metres, in a room lit by sodium lamps, by someone who is not going to lean in. Everything is oversized, high-contrast and stripped of decoration; amber carries state and only state, so a glance across the floor tells you whether a line is fine without reading a single label. Nothing animates on the panel — motion on a shop floor means a machine is moving, and the interface has no business borrowing that signal.',
      gallery: [
        { src: '/media/shopfloor-signal-ui-1.svg', caption: 'Two-tap stop capture, wall panel' },
        { src: '/media/shopfloor-signal-ui-2.svg', caption: 'Reason picker in floor vocabulary' },
        { src: '/media/shopfloor-signal-ui-3.svg', caption: 'Handover shift card' },
        { src: '/media/shopfloor-signal-ui-4.svg', caption: 'Line status at a two-metre glance' },
        { src: '/media/shopfloor-signal-ui-5.svg', caption: 'Plant view — recurring stop ranking' },
      ],
    },
  },

  {
    slug: 'dwell',
    title: 'Dwell',
    tagline: 'Eleven distribution centres, 41% less driver detention, one honest appointment.',
    summary: 'Dock scheduling rebuilt around the only number carriers actually care about.',
    industry: 'Logistics',
    year: '2025',
    role: 'Lead Product Designer',
    timeline: '8 months · Pilot → multi-site',
    team: 'Me, 1 researcher, 2 PMs, 8 engineers',
    tools: ['Figma', 'FigJam', 'Fullstory', 'Metabase'],
    client: 'Northbay Freight Network',
    accent: '#ffffff',
    artTone: '#8f8e8b',
    cover: '/media/dwell-cover.svg',
    bands: {
      about: '/media/dwell-band-about.svg',
      aboutCaption: 'The product in context',
      problem: '/media/dwell-band-problem.svg',
      problemCaption: 'Where the work actually happens',
      solution: '/media/dwell-band-solution.svg',
      solutionCaption: 'The system, assembled',
    },
    about:
      'Northbay ran eleven distribution centres where dock appointments were booked in a portal, confirmed by email, and then ignored by everyone. Drivers waited an average of 94 minutes past their slot; carriers billed detention; site managers blamed carriers; carriers blamed sites. The mandate was to cut detention spend. The difficulty was political rather than technical — an accurate appointment makes a site look bad, so every honest signal in the system had been quietly rounded off by the people it embarrassed.',
    metrics: [
      { value: 41, prefix: '−', suffix: '%', label: 'Driver detention hours', note: 'Across eleven sites, first two quarters.' },
      { value: 94, prefix: '−', suffix: ' min', label: 'Average dwell', note: 'From 94 minutes over slot down to 55.' },
      { value: 3.1, decimals: 1, prefix: '$', suffix: 'M', label: 'Annualised detention avoided', note: 'Finance-validated, net of the two sites that regressed.' },
      { value: 88, suffix: '%', label: 'Appointments kept', note: 'Up from 51% — measured against the slot, not the day.' },
    ],
    research: {
      intro:
        'Two weeks split between the guard shack and the yard office, plus 30 carrier dispatchers interviewed by phone because that is the only way they ever talk to anyone.',
      methods: [
        { name: 'Yard observation', detail: '4 sites, 6am–2pm, counting where the 94 minutes actually went.' },
        { name: 'Driver intercepts', detail: '38 short interviews in the cab, in the queue, while waiting.' },
        { name: 'Dispatcher interviews', detail: '30 carrier-side conversations about how they really plan a route.' },
        { name: 'Telematics reconciliation', detail: 'Compared GPS arrival times against booked slots and logged check-ins.' },
      ],
      insight:
        'The appointment was never the problem. Every party had learned to treat it as fiction, so each one padded their own estimate — and the padding was the delay.',
      insightAttribution: 'Telematics reconciliation, week 2',
    },
    painPoints: [
      { label: 'The fiction slot', detail: 'Appointment times were aspirational, so carriers padded arrivals and sites padded capacity, compounding both.' },
      { label: 'Check-in by clipboard', detail: 'Arrival was recorded when a guard walked out, not when the truck arrived — the gap was pure unrecorded dwell.' },
      { label: 'No shared clock', detail: 'Site, carrier and driver each had a different arrival timestamp, and every detention dispute became forensics.' },
      { label: 'Rebooking means phoning', detail: 'A delayed driver could not move a slot without a call nobody had time to take.' },
    ],
    competitiveAudit: {
      competitors: [
        { name: 'Tidewater Dock', verdict: 'Best-in-class booking calendar; treats what happens after the truck arrives as somebody else’s software.' },
        { name: 'Grantham Yard OS', verdict: 'Powerful yard-move orchestration for the site, nothing at all in the driver’s hand.' },
        { name: 'Loadway Portal', verdict: 'Carrier-friendly and quick to book, but the site can silently override any slot without telling anyone.' },
      ],
      whitespace:
        'Every product served one side of the gate. None gave the site, the carrier and the driver the same timestamp — and detention disputes are, in the end, an argument about whose clock is real.',
    },
    personas: [
      {
        name: 'Curtis Nwosu',
        role: 'Owner-operator, regional dry van',
        goal: 'Two more stops today, which means knowing now whether he is waiting an hour.',
        frustration: 'No way to tell a late slot from a moving one until he is already parked.',
        quote: 'Tell me it is going to be ninety minutes and I will go eat. Do not tell me twenty and mean ninety.',
      },
      {
        name: 'Lorena Batiste',
        role: 'DC Inbound Manager',
        goal: 'Keep doors flowing without a queue that spills onto the county road.',
        frustration: 'Half her arrivals are unannounced early, and the system rewards her for looking punctual, not being punctual.',
        quote: 'I can absorb a late truck. What I cannot absorb is six early ones nobody warned me about.',
      },
    ],
    journey: {
      label: 'One inbound load, gate to gate',
      stages: [
        { name: 'Book the slot', detail: 'Dispatcher picks a time everyone privately treats as approximate.', emotion: 'Sceptical', tone: 'mid' },
        { name: 'Roll in', detail: 'Curtis pads by 45 minutes because being late is worse than waiting.', emotion: 'Defensive', tone: 'mid' },
        { name: 'Arrive early', detail: 'Parks on the shoulder; nothing in the system knows he is there.', emotion: 'Idle', tone: 'low' },
        { name: 'Check in', detail: 'Clipboard at the shack, timestamp written when the guard gets to him.', emotion: 'Irritated', tone: 'low' },
        { name: 'Wait', detail: 'Ninety-four minutes with no visibility and no way to leave.', emotion: 'Burning daylight', tone: 'low' },
        { name: 'Door assignment', detail: 'A yard hostler waves him in; no notice, no ETA before it happens.', emotion: 'Rushed', tone: 'mid' },
        { name: 'Unload and out', detail: 'Fast once it starts — the dock was never the bottleneck.', emotion: 'Relieved', tone: 'high' },
        { name: 'Detention dispute', detail: 'Three weeks later, two clocks disagree and someone eats the cost.', emotion: 'Adversarial', tone: 'low' },
      ],
    },
    solutions: [
      {
        name: 'The honest slot',
        resolves: 'The fiction slot',
        detail: 'Appointments show a live confidence band instead of a single time, recalculated from real door throughput. Sites stopped being punished for accuracy, so accuracy appeared.',
      },
      {
        name: 'Geofence check-in',
        resolves: 'Check-in by clipboard',
        detail: 'Arrival is stamped when the truck crosses the geofence, not when a guard notices. The clipboard became a fallback rather than the system of record.',
      },
      {
        name: 'One clock, three views',
        resolves: 'No shared clock',
        detail: 'Driver, site and carrier read the same timeline off the same events — the detention conversation moved from forensics to arithmetic.',
      },
      {
        name: 'Self-serve reslot',
        resolves: 'Rebooking means phoning',
        detail: 'A running-late driver can shift their own slot from a text link if capacity allows, and the site sees it before the truck does.',
      },
    ],
    visualDesign: {
      statement:
        'Three audiences, one system, wildly different conditions — a phone in bright sun with one thumb, a yard-office monitor, a dispatcher’s third browser tab. The language leans on a single green used only for confirmed, shared facts; anything estimated stays outlined and uncoloured. That one rule does most of the work: on any screen, filled means agreed, and agreed is the only thing anyone can bill against.',
      gallery: [
        { src: '/media/dwell-ui-1.svg', caption: 'Driver view — confidence band, not a false time' },
        { src: '/media/dwell-ui-2.svg', caption: 'Yard office live door board' },
        { src: '/media/dwell-ui-3.svg', caption: 'Shared timeline across all three parties' },
        { src: '/media/dwell-ui-4.svg', caption: 'Self-serve reslot from a text link' },
        { src: '/media/dwell-ui-5.svg', caption: 'Detention reconciliation view' },
      ],
    },
  },
];
