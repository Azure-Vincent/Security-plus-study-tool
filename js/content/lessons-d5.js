/* Domain 5: Security Program Management and Oversight — original lesson content. */
(function () {
  var D = SEC.D;

  SEC.addLesson('5.1', {
    title: 'Security Governance',
    minutes: 30,
    intro: '<strong>Governance</strong> is how an organization directs and controls security: the documents (policies, standards, procedures, guidelines), the external rules it must follow, the oversight structures, and who is responsible for systems and data.',
    terms: [
      ['Policy', 'High-level, mandatory statement of management intent (what and why).'],
      ['Standard', 'Mandatory specific requirement that supports a policy (e.g., AES-256 for data at rest).'],
      ['Procedure', 'Step-by-step instructions for performing a task (how).'],
      ['Guideline', 'Recommended, non-mandatory advice.'],
      ['AUP', 'Acceptable Use Policy. What users may and may not do with company resources.'],
      ['Data owner / controller / processor / custodian', 'Accountable executive / entity deciding why and how personal data is processed / entity processing on the controller’s behalf / person who implements day-to-day protection.'],
      ['Playbook', 'A documented response plan for a specific scenario (e.g., phishing).']
    ],
    sections: [
      {
        h: 'The governance document hierarchy',
        body: '',
        diagram: D.layers([{ t: 'Policies', sub: 'mandatory · what & why', tone: 'accent' }, { t: 'Standards', sub: 'mandatory · specific requirements' }, { t: 'Procedures', sub: 'mandatory · step-by-step how' }, { t: 'Guidelines', sub: 'recommended · flexible advice', tone: 'good' }], 'From broad intent to specific actions'),
        compare: { title: 'Commonly confused: Policy vs Standard vs Procedure vs Guideline', head: ['', 'Mandatory?', 'Level of detail', 'Example'], rows: [
          ['Policy', 'Yes', 'Broad intent', 'All sensitive data must be encrypted'], ['Standard', 'Yes', 'Specific, measurable', 'Use AES-256; TLS 1.2 or higher'], ['Procedure', 'Yes', 'Step-by-step', 'How to enable BitLocker on a new laptop'], ['Guideline', 'No', 'Advice', 'Consider using a passphrase of four random words']] },
        check: { q: 'A document states “Passwords must be at least 14 characters and checked against a breached-password list.” What type of document is this?', o: [
          ['Policy', 'Policies state broad intent; this is a specific, measurable requirement.'],
          ['Standard', 'Specific mandatory technical requirements are standards.', true],
          ['Guideline', 'Guidelines are optional recommendations.'],
          ['Procedure', 'Procedures give step-by-step instructions.']
        ] }
      },
      {
        h: 'Common policies',
        body: '<ul><li><strong>Acceptable use policy (AUP)</strong>: rules for using company systems and internet.</li><li><strong>Information security policy</strong>: the top-level security program statement.</li>' +
          '<li><strong>Business continuity (BC)</strong> and <strong>disaster recovery (DR)</strong> policies.</li><li><strong>Incident response (IR)</strong> policy.</li>' +
          '<li><strong>Software development lifecycle (SDLC)</strong> policy: security in development.</li><li><strong>Change management</strong> policy.</li></ul>' +
          '<p>Common <strong>standards</strong>: password, access control, physical security, encryption. Common <strong>procedures</strong>: change management, onboarding/offboarding, and <strong>playbooks</strong> for incident types.</p>'
      },
      {
        h: 'External considerations',
        body: '<p>Governance must reflect <strong>regulatory</strong> (laws such as GDPR, HIPAA), <strong>legal</strong>, <strong>industry</strong> (PCI DSS), and <strong>local/regional, national and global</strong> requirements. A multinational must meet the strictest applicable rule in each location.</p>'
      },
      {
        h: 'Governance structures and monitoring',
        body: '<ul><li><strong>Boards</strong> and <strong>committees</strong> provide oversight; <strong>government entities</strong> regulate.</li><li><strong>Centralized</strong> governance: one central team sets and enforces rules (consistent). <strong>Decentralized</strong>: business units govern themselves (flexible, less consistent).</li>' +
          '<li><strong>Monitoring and revision</strong>: review documents regularly (e.g., annually) and after major changes, incidents or new laws.</li></ul>'
      },
      {
        h: 'Roles for systems and data',
        body: '<ul><li><strong>Owner</strong>: senior person accountable for the data. Decides classification and who gets access.</li>' +
          '<li><strong>Controller</strong>: (privacy term) decides the purposes and means of processing personal data.</li><li><strong>Processor</strong>: processes personal data on behalf of the controller (e.g., a payroll provider).</li>' +
          '<li><strong>Custodian/steward</strong>: handles day-to-day care: backups, permissions, data quality.</li></ul>',
        check: { q: 'A company hires a cloud payroll service to process employee salary data according to the company’s instructions. What is the payroll service’s role?', o: [
          ['Data controller', 'The company decides why and how the data is processed, so it is the controller.'],
          ['Data processor', 'An entity processing personal data on behalf of the controller is a processor.', true],
          ['Data owner', 'The owner is an internal accountable role at the company.'],
          ['Data subject', 'The employees are the data subjects.']
        ] }
      }
    ],
    takeaways: [
      'Policies (what/why, mandatory) → standards (specific, mandatory) → procedures (how, mandatory) → guidelines (optional).',
      'Know AUP, information security, BC/DR, IR, SDLC and change management policies, plus playbooks.',
      'External rules come from regulators, laws, industry standards and local to global jurisdictions.',
      'Owner (accountable), controller (decides purpose), processor (acts for the controller), custodian (day-to-day care).'
    ]
  });

  SEC.addLesson('5.2', {
    title: 'Risk Management',
    minutes: 40,
    intro: 'Risk management identifies, analyzes and treats risks so the organization stays within its <strong>risk appetite</strong>. You need to calculate <strong>SLE, ARO and ALE</strong>, choose a risk strategy, and know the business impact analysis metrics <strong>RTO, RPO, MTTR and MTBF</strong>.',
    terms: [
      ['Risk', 'The likelihood of a threat exploiting a vulnerability, combined with the impact.'],
      ['AV', 'Asset Value. The value of the asset in money.'],
      ['EF', 'Exposure Factor. Percentage of the asset lost in one incident.'],
      ['SLE', 'Single Loss Expectancy = AV × EF.'],
      ['ARO', 'Annualized Rate of Occurrence. How many times per year the event is expected.'],
      ['ALE', 'Annualized Loss Expectancy = SLE × ARO.'],
      ['Risk register', 'A document listing risks, owners, ratings, and treatment status.'],
      ['KRI', 'Key Risk Indicator. A metric that signals rising risk.'],
      ['MTTR / MTBF', 'Mean Time To Repair / Mean Time Between Failures.']
    ],
    sections: [
      {
        h: 'Identification and assessment types',
        body: '<p><strong>Risk identification</strong> finds what could go wrong. Assessments can be <strong>ad hoc</strong> (when needed, e.g., a new vendor), <strong>recurring</strong> (scheduled, e.g., annually), <strong>one-time</strong> (a specific project) or <strong>continuous</strong> (ongoing automated monitoring).</p>'
      },
      {
        h: 'Qualitative vs quantitative analysis',
        body: '<p><strong>Qualitative</strong> analysis uses ratings (low/medium/high) for <strong>likelihood/probability</strong> and <strong>impact</strong>, often in a heat map. It is fast and subjective. <strong>Quantitative</strong> analysis uses money and numbers.</p>',
        diagram: D.grid([['Likelihood ↓ / Impact →', 'Low', 'Medium', 'High'], ['High', { t: 'Medium', tone: 'warn' }, { t: 'High', tone: 'bad' }, { t: 'Critical', tone: 'bad' }], ['Medium', { t: 'Low', tone: 'good' }, { t: 'Medium', tone: 'warn' }, { t: 'High', tone: 'bad' }], ['Low', { t: 'Low', tone: 'good' }, { t: 'Low', tone: 'good' }, { t: 'Medium', tone: 'warn' }]], 'Qualitative risk heat map', { cw: 150, rowHeader: true })
      },
      {
        h: 'Quantitative formulas',
        body: '<pre>SLE = AV × EF          (cost of one incident)\nALE = SLE × ARO        (expected cost per year)</pre>' +
          '<div class="ex">A warehouse worth $2,000,000 sits in a flood zone. A flood would destroy 25% of it (EF = 0.25). Floods are expected once every 10 years (ARO = 0.1).<br>SLE = $2,000,000 × 0.25 = <strong>$500,000</strong><br>ALE = $500,000 × 0.1 = <strong>$50,000 per year</strong>.<br>A flood barrier costing $20,000/year that removes most of the risk is cost-justified; one costing $90,000/year is not.</div>',
        check: { q: 'A laptop is worth $1,500 including data recovery costs. Laptops are lost 4 times per year and each loss is total (EF 100%). What is the ALE?', o: [
          ['$1,500', 'That is the SLE.'],
          ['$6,000', 'SLE $1,500 × ARO 4 = $6,000.', true],
          ['$375', 'This divides instead of multiplying.'],
          ['$600', 'This isn’t derived from the formulas.']
        ] }
      },
      {
        h: 'Risk register, tolerance and appetite',
        body: '<ul><li><strong>Risk register</strong>: each risk with description, <strong>risk owner</strong>, likelihood/impact, treatment and status. <strong>Key risk indicators (KRIs)</strong> warn when a risk is growing (e.g., rising number of unpatched critical systems). The <strong>risk threshold</strong> is the level that triggers action.</li>' +
          '<li><strong>Risk appetite</strong>: how much risk the organization is <em>willing to pursue</em> for its goals: <em>expansionary</em> (higher risk for growth), <em>conservative</em> (low risk) or <em>neutral</em>.</li>' +
          '<li><strong>Risk tolerance</strong>: the acceptable <em>variation</em> around that appetite for a specific risk.</li></ul>'
      },
      {
        h: 'Risk management strategies',
        body: '',
        compare: { title: 'The four risk responses', head: ['Strategy', 'Meaning', 'Example'], rows: [
          ['Mitigate (reduce)', 'Apply controls to lower likelihood or impact', 'Install MFA to reduce account takeover risk'],
          ['Transfer (share)', 'Shift financial impact to a third party', 'Buy cyber insurance; outsource to a provider under contract'],
          ['Avoid', 'Stop the risky activity entirely', 'Discontinue a legacy service that can’t be secured'],
          ['Accept', 'Acknowledge and live with the risk (often via an exception/exemption)', 'Accept a low-risk finding where controls cost more than the loss']] },
        check: { q: 'A company decides to stop offering a file-sharing feature because it can’t be secured to its standards. What risk response is this?', o: [
          ['Transfer', 'Nothing was shifted to a third party.'],
          ['Avoid', 'Eliminating the activity that creates the risk is avoidance.', true],
          ['Mitigate', 'Mitigation keeps the activity and adds controls.'],
          ['Accept', 'Acceptance keeps the activity without added controls.']
        ] }
      },
      {
        h: 'Business impact analysis (BIA)',
        body: '<p>A BIA identifies critical functions and how downtime affects them. Key metrics:</p><ul><li><strong>RTO</strong>: how quickly a function must be restored.</li><li><strong>RPO</strong>: how much data loss (measured in time) is acceptable.</li>' +
          '<li><strong>MTTR</strong>: average time to repair a failed component. Lower is better.</li><li><strong>MTBF</strong>: average time between failures. Higher means more reliable.</li></ul>',
        check: { q: 'Which metric describes the reliability of a component by measuring the average operating time between failures?', o: [
          ['MTTR', 'MTTR measures repair time.'],
          ['MTBF', 'Mean Time Between Failures measures reliability.', true],
          ['RPO', 'RPO is acceptable data loss.'],
          ['ARO', 'ARO is the yearly frequency of a risk event.']
        ] }
      },
      {
        h: 'Risk reporting',
        body: '<p>Report risk status to management and the board: top risks, trends in KRIs, treatment progress and accepted risks. Reports enable informed decisions and accountability.</p>'
      }
    ],
    takeaways: [
      'SLE = AV × EF; ALE = SLE × ARO. Spend on a control only if it costs less than the risk it removes.',
      'Qualitative = ratings/heat maps; quantitative = money.',
      'Risk register tracks risks, owners, KRIs and thresholds. Appetite = willingness; tolerance = acceptable deviation.',
      'Responses: mitigate, transfer, avoid, accept (exceptions/exemptions).',
      'BIA metrics: RTO, RPO, MTTR (lower is better), MTBF (higher is better).'
    ]
  });

  SEC.addLesson('5.3', {
    title: 'Third-Party Risk Management',
    minutes: 22,
    intro: 'Vendors, suppliers and partners can introduce risk into your organization. Third-party risk management covers <strong>assessing</strong> vendors before and during the relationship, <strong>choosing</strong> them carefully, putting the right <strong>agreements</strong> in place, and <strong>monitoring</strong> them over time.',
    terms: [
      ['SLA', 'Service-Level Agreement. Measurable service commitments (e.g., 99.9% uptime) and penalties.'],
      ['MOU / MOA', 'Memorandum of Understanding (informal intent) / Memorandum of Agreement (more formal, defined responsibilities).'],
      ['MSA', 'Master Service Agreement. Overarching terms for future work between parties.'],
      ['SOW / WO', 'Statement of Work / Work Order. Specific project deliverables, timelines and costs under an MSA.'],
      ['NDA', 'Non-Disclosure Agreement. Protects confidential information.'],
      ['BPA', 'Business Partners Agreement. Defines a partnership’s responsibilities, profit sharing and decision-making.'],
      ['Right-to-audit clause', 'Contract term allowing you to audit the vendor’s security.']
    ],
    sections: [
      {
        h: 'Vendor assessment',
        body: '<ul><li><strong>Penetration testing</strong> results from the vendor.</li><li><strong>Right-to-audit clause</strong> in the contract.</li><li><strong>Evidence of internal audits</strong>.</li>' +
          '<li><strong>Independent assessments</strong> (e.g., SOC 2 Type II reports, ISO 27001 certification).</li><li><strong>Supply chain analysis</strong>: who are <em>their</em> suppliers? (fourth-party risk).</li></ul>'
      },
      {
        h: 'Vendor selection',
        body: '<p><strong>Due diligence</strong>: investigate financial stability, security practices, history of breaches and references before signing. Check for <strong>conflicts of interest</strong>, e.g., an employee choosing a vendor owned by a relative.</p>',
        diagram: D.flow([{ t: 'Due diligence', sub: 'questionnaires, SOC 2', tone: 'accent' }, { t: 'Contract', sub: 'MSA, SLA, NDA, right to audit' }, { t: 'Onboard', sub: 'least-privilege access', tone: 'good' }, { t: 'Monitor', sub: 'reviews, KPIs, reassess', tone: 'warn' }, { t: 'Offboard', sub: 'revoke access, return data', tone: 'bad' }], 'Third-party risk lifecycle')
      },
      {
        h: 'Agreement types',
        body: '',
        compare: { title: 'Commonly confused: agreement types', head: ['Agreement', 'Purpose', 'Binding?'], rows: [
          ['SLA', 'Measurable performance levels (uptime, response time) and remedies', 'Yes'],
          ['MOU', 'General intent to work together', 'Usually not legally binding'],
          ['MOA', 'More detailed agreement on responsibilities', 'More formal; may be binding'],
          ['MSA', 'Umbrella terms for an ongoing relationship', 'Yes'],
          ['SOW / WO', 'Specific work, deliverables, timeline under an MSA', 'Yes'],
          ['NDA', 'Keep shared information confidential', 'Yes'],
          ['BPA', 'Partnership roles, profit sharing, decisions', 'Yes']] },
        check: { q: 'A company and its hosting provider sign an agreement guaranteeing 99.95% uptime with service credits if missed. What is this?', o: [
          ['NDA', 'An NDA covers confidentiality.'],
          ['SLA', 'Measurable service levels with penalties are defined in an SLA.', true],
          ['MOU', 'An MOU expresses intent without specific enforceable metrics.'],
          ['BPA', 'A BPA governs partnership roles and profit sharing.']
        ] }
      },
      {
        h: 'Vendor monitoring and rules of engagement',
        body: '<p><strong>Vendor monitoring</strong> continues after signing: periodic <strong>questionnaires</strong>, review of updated audit reports, performance against SLAs, and news about breaches. <strong>Rules of engagement</strong> define how interactions happen, e.g., what testing is allowed against a vendor, communication channels, and incident notification timelines.</p>',
        check: { q: 'Before signing with a new cloud vendor, a company wants contractual permission to review the vendor’s security controls in the future. What should the contract include?', o: [
          ['A right-to-audit clause', 'This grants the customer the right to audit the vendor’s security.', true],
          ['An NDA', 'An NDA protects confidential information.'],
          ['A work order', 'A WO defines specific work tasks.'],
          ['An MOU', 'An MOU is typically non-binding.']
        ] }
      }
    ],
    takeaways: [
      'Assess vendors with pen test results, audits, independent assessments (SOC 2/ISO 27001) and supply chain analysis.',
      'Include a right-to-audit clause; perform due diligence; watch for conflicts of interest.',
      'SLA = measurable service levels; MOU = intent; MOA = more formal; MSA = umbrella; SOW/WO = specific work; NDA = confidentiality; BPA = partnership.',
      'Keep monitoring vendors with questionnaires and reviews; define rules of engagement.'
    ]
  });

  SEC.addLesson('5.4', {
    title: 'Security Compliance',
    minutes: 22,
    intro: '<strong>Compliance</strong> means meeting the laws, regulations, contracts and standards that apply to you, and being able to <em>prove</em> it. This lesson covers reporting, consequences, monitoring and privacy.',
    terms: [
      ['Due diligence / due care', 'Investigating and understanding risks / taking reasonable action to address them.'],
      ['Attestation', 'A formal statement (by management or an auditor) that controls are in place.'],
      ['Data subject', 'The individual whom personal data is about.'],
      ['Right to be forgotten', 'A privacy right (e.g., under GDPR) to have personal data erased.'],
      ['Data inventory', 'A record of what personal data is held, where, and why.']
    ],
    sections: [
      {
        h: 'Compliance reporting',
        body: '<p><strong>Internal</strong> reporting informs management and the board. <strong>External</strong> reporting goes to regulators, customers or card brands (e.g., PCI DSS reports on compliance, breach notifications within legal deadlines).</p>'
      },
      {
        h: 'Consequences of non-compliance',
        body: '<ul><li><strong>Fines</strong> and <strong>sanctions</strong> from regulators.</li><li><strong>Reputational damage</strong> and loss of customer trust.</li><li><strong>Loss of license</strong> to operate (e.g., the ability to process cards).</li><li><strong>Contractual impacts</strong>: breach of contract, lost business.</li></ul>',
        check: { q: 'A merchant repeatedly fails its PCI DSS assessment and its acquiring bank stops allowing it to accept credit cards. Which consequence is this?', o: [
          ['Reputational damage', 'This may follow, but the direct consequence is losing the right to process cards.'],
          ['Loss of license', 'Losing the ability to process payments is a loss of license/privilege to operate.', true],
          ['Data sovereignty', 'This concerns where data is stored.'],
          ['Attestation', 'Attestation is a statement of compliance.']
        ] }
      },
      {
        h: 'Compliance monitoring',
        body: '<ul><li><strong>Due diligence</strong> (research and understand) and <strong>due care</strong> (act responsibly to address the risk).</li>' +
          '<li><strong>Attestation and acknowledgement</strong>: management signs off that controls exist; employees acknowledge policies.</li>' +
          '<li><strong>Internal and external</strong> monitoring by internal audit and outside assessors.</li><li><strong>Automation</strong>: continuous compliance tools check configurations against standards.</li></ul>',
        compare: { title: 'Due diligence vs Due care', head: ['', 'Due diligence', 'Due care'], rows: [['Focus', 'Investigate and understand', 'Act and maintain'], ['Timing', 'Before and during decisions', 'Ongoing'], ['Example', 'Assess a vendor’s security before signing', 'Patch systems and enforce policies every day']] }
      },
      {
        h: 'Privacy',
        body: '<ul><li><strong>Legal implications</strong>: local/regional, national and global privacy laws (e.g., GDPR, state privacy laws).</li><li><strong>Data subject</strong>: the person the data describes, who holds rights over it.</li>' +
          '<li><strong>Controller vs processor</strong>: the controller decides why/how; the processor acts on its instructions.</li><li><strong>Ownership</strong>: who is accountable for the data.</li>' +
          '<li><strong>Data inventory and retention</strong>: know what personal data you hold, and keep it only as long as needed.</li>' +
          '<li><strong>Right to be forgotten</strong>: individuals can request erasure of their personal data in some jurisdictions.</li></ul>',
        check: { q: 'A customer asks a European online retailer to delete all personal data it holds about them. Which privacy concept applies?', o: [
          ['Data sovereignty', 'Sovereignty concerns which country’s laws apply to stored data.'],
          ['Right to be forgotten', 'The right to erasure lets data subjects request deletion of their data.', true],
          ['Legal hold', 'A legal hold prevents deletion for litigation.'],
          ['Due diligence', 'Due diligence is investigating risk.']
        ] }
      }
    ],
    takeaways: [
      'Compliance reporting is internal (management) or external (regulators, partners).',
      'Non-compliance → fines, sanctions, reputational damage, loss of license, contractual impacts.',
      'Due diligence = investigate; due care = act. Attestation = formal statement that controls exist.',
      'Privacy: data subjects have rights (including the right to be forgotten); controllers decide, processors act; keep a data inventory and minimal retention.'
    ]
  });

  SEC.addLesson('5.5', {
    title: 'Audits and Assessments',
    minutes: 25,
    intro: 'Audits and assessments verify that controls exist and work. Know the difference between internal and external audits, the types of penetration tests, and how much the tester knows in advance.',
    terms: [
      ['Audit', 'A formal, independent check against a standard or requirement.'],
      ['Assessment', 'An evaluation of security posture, often less formal than an audit.'],
      ['Attestation', 'Written assurance about controls, e.g., an auditor’s opinion.'],
      ['Known environment', 'Pen test with full information (formerly white box).'],
      ['Unknown environment', 'Pen test with no prior information (formerly black box).'],
      ['Partially known', 'Pen test with limited information (formerly gray box).'],
      ['Passive / active reconnaissance', 'Gathering info without touching the target (OSINT) / directly probing the target (scans).']
    ],
    sections: [
      {
        h: 'Internal vs external',
        body: '<ul><li><strong>Internal</strong>: <em>compliance</em> checks by internal audit, an <em>audit committee</em> (board-level oversight), and <em>self-assessments</em>.</li>' +
          '<li><strong>External</strong>: <em>regulatory</em> audits and <em>examinations</em> by authorities, <em>assessments</em> by consultants, and <em>independent third-party audits</em> (e.g., SOC 2), which give the most credible assurance to customers.</li></ul>',
        check: { q: 'Customers want independent assurance that a SaaS provider’s controls operate effectively over time. What should the provider obtain?', o: [
          ['A self-assessment questionnaire', 'Self-assessment lacks independence.'],
          ['An independent third-party audit report (e.g., SOC 2 Type II)', 'An independent auditor’s report over a period provides credible assurance.', true],
          ['An internal vulnerability scan', 'Scans aren’t an audit of control effectiveness.'],
          ['An MOU', 'An MOU is an agreement, not assurance.']
        ] }
      },
      {
        h: 'Penetration testing types',
        body: '<ul><li><strong>Physical</strong>: test locks, badges, guards and tailgating.</li><li><strong>Offensive</strong> (red team): attack like an adversary.</li><li><strong>Defensive</strong> (blue team): detect and respond.</li>' +
          '<li><strong>Integrated</strong> (purple team): attackers and defenders work together and share findings to improve detection.</li></ul>',
        compare: { title: 'How much does the tester know?', head: ['Environment', 'Tester knowledge', 'Simulates', 'Trade-off'], rows: [
          ['Known (white box)', 'Full: diagrams, source, credentials', 'Insider / thorough audit', 'Most thorough, least realistic'],
          ['Partially known (gray box)', 'Some: e.g., a user account', 'Attacker with a foothold', 'Balanced'],
          ['Unknown (black box)', 'None', 'External attacker', 'Most realistic, may miss things']] },
        check: { q: 'A tester is given only the company name and must discover everything else, like an outside attacker. What type of test is this?', o: [
          ['Known environment', 'Known environment tests provide full information.'],
          ['Partially known environment', 'Some information would be provided.'],
          ['Unknown environment', 'No prior knowledge simulates an external attacker.', true],
          ['Defensive test', 'That describes the blue team role.']
        ] }
      },
      {
        h: 'Reconnaissance',
        body: '<p><strong>Passive reconnaissance</strong> gathers information without interacting with target systems: search engines, social media, DNS records, job postings, breach databases. It is undetectable by the target. <strong>Active reconnaissance</strong> directly probes the target with port scans, banner grabbing and vulnerability scans. It is detectable and requires authorization.</p>',
        check: { q: 'Which is an example of passive reconnaissance?', o: [
          ['Running an Nmap scan of the company’s IP range', 'Scanning interacts with the target, which makes it active.'],
          ['Reviewing employees’ public profiles and job postings for technology clues', 'Using public sources without touching target systems is passive.', true],
          ['Banner grabbing on the mail server', 'Connecting to the server is active.'],
          ['Attempting default logins on the VPN', 'This is active testing, beyond reconnaissance.']
        ] }
      },
      {
        h: 'Rules and attestation',
        body: '<p>Penetration tests need written authorization and <strong>rules of engagement</strong>: scope, timing, allowed techniques, contacts and data handling. After an audit, <strong>attestation</strong> is the formal written statement of the findings or of control effectiveness.</p>'
      }
    ],
    takeaways: [
      'Internal: compliance, audit committee, self-assessments. External: regulatory exams, assessments, independent third-party audits.',
      'Known = full info; partially known = some info; unknown = no info (most realistic external view).',
      'Red = offensive, blue = defensive, purple = integrated.',
      'Passive recon doesn’t touch the target (OSINT); active recon probes it (scans).',
      'Always get written authorization and rules of engagement.'
    ]
  });

  SEC.addLesson('5.6', {
    title: 'Security Awareness Practices',
    minutes: 22,
    intro: 'People are both a target and a defense. A security awareness program teaches users to <strong>recognize</strong> attacks, <strong>report</strong> them, and <strong>behave safely</strong>. Programs are measured and improved over time.',
    terms: [
      ['Phishing campaign', 'A controlled simulated phishing exercise used to train and measure users.'],
      ['Anomalous behavior', 'Actions that deviate from normal patterns: risky, unexpected or unintentional.'],
      ['OPSEC', 'Operational security. Protecting information that could help an attacker (e.g., not posting badge photos).'],
      ['Insider threat', 'Risk from people with legitimate access.']
    ],
    sections: [
      {
        h: 'Phishing campaigns',
        body: '<p>Simulated phishing teaches users to <strong>recognize</strong> red flags: urgency, mismatched sender domains, unexpected attachments, requests for credentials or payment changes, and hover-revealed URLs that don’t match. Equally important is <strong>responding to reported suspicious messages</strong>: make reporting one click, thank reporters, and give feedback. Programs that punish clicks discourage reporting.</p>',
        diagram: D.flow([{ t: 'Baseline test', sub: 'measure click & report rates' }, { t: 'Train', sub: 'short, targeted modules', tone: 'accent' }, { t: 'Simulate', sub: 'varied, realistic campaigns', tone: 'warn' }, { t: 'Measure', sub: 'trend reports, not blame', tone: 'good' }], 'Awareness program cycle', { loop: true, loopLabel: 'repeat and adjust' }),
        check: { q: 'Which metric BEST shows that a phishing awareness program is improving security culture?', o: [
          ['Number of training videos produced', 'Output volume doesn’t measure behavior change.'],
          ['Increasing rate of users reporting simulated phishing emails', 'Rising report rates show users recognizing and acting on threats.', true],
          ['Number of employees disciplined for clicking', 'Punishment discourages reporting.'],
          ['Length of the annual training session', 'Longer training isn’t necessarily more effective.']
        ] }
      },
      {
        h: 'Recognizing anomalous behavior',
        body: '<ul><li><strong>Risky</strong>: deliberately unsafe actions (disabling antivirus, sharing passwords).</li><li><strong>Unexpected</strong>: unusual for the person or role (accessing systems they never use, working at odd hours).</li>' +
          '<li><strong>Unintentional</strong>: honest mistakes (sending a spreadsheet to the wrong recipient, misconfiguring a share).</li></ul>'
      },
      {
        h: 'User guidance and training topics',
        body: '<ul><li><strong>Policy/handbooks</strong>: users know and acknowledge the rules.</li><li><strong>Situational awareness</strong>: notice tailgaters, shoulder surfers, unfamiliar people.</li>' +
          '<li><strong>Insider threat</strong> awareness: report concerning behavior through proper channels.</li><li><strong>Password management</strong>: password managers, unique passphrases, MFA.</li>' +
          '<li><strong>Removable media and cables</strong>: never plug in found USB drives or unknown charging cables (malicious cables can act as keyboards).</li>' +
          '<li><strong>Social engineering</strong>: verify requests through a known channel.</li><li><strong>Operational security</strong>: don’t share internal details publicly (e.g., badge photos, project names).</li>' +
          '<li><strong>Hybrid/remote work</strong>: secure home Wi-Fi, VPN use, privacy screens, locking devices, family members not using work devices.</li></ul>',
        check: { q: 'An employee finds a USB drive labeled “Q4 Salaries” in the parking lot. What should training tell them to do?', o: [
          ['Plug it into a work PC to find the owner', 'This is exactly what attackers who drop USBs want.'],
          ['Hand it to the security team without plugging it in', 'Unknown media should be reported and analyzed safely by security.', true],
          ['Plug it into a personal home computer instead', 'It could still compromise the employee and spread.'],
          ['Throw it away', 'Reporting lets security investigate a possible targeted attack.']
        ] }
      },
      {
        h: 'Reporting, monitoring, development and execution',
        body: '<p><strong>Initial</strong> training at onboarding and <strong>recurring</strong> training (at least annually, plus targeted refreshers) keep knowledge current. <strong>Monitoring and reporting</strong> track completion and simulation results. <strong>Development</strong> tailors content to roles and current threats; <strong>execution</strong> delivers it in short, engaging, frequent formats.</p>'
      }
    ],
    takeaways: [
      'Phishing simulations train recognition; easy reporting and positive feedback build culture.',
      'Anomalous behavior can be risky, unexpected or unintentional.',
      'Training topics: policies, situational awareness, insider threat, passwords, removable media and cables, social engineering, OPSEC, remote work.',
      'Train at onboarding and regularly; measure improvement (report rates, click rates) and adjust.'
    ]
  });
})();
