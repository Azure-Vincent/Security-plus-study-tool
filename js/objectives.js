/* Curriculum: CompTIA Security+ SY0-701 exam objectives (domains, weights, objective titles).
   Objective titles follow the published SY0-701 objectives; all teaching content in this app is original. */
window.SEC = window.SEC || {};

SEC.exam = {
  name: 'CompTIA Security+',
  code: 'SY0-701',
  versionLabel: 'V7 (SY0-701)',
  launched: 'November 7, 2023',
  verifiedOn: '2026-10-05',
  status: 'Current live exam',
  maxQuestions: 90,
  minutes: 90,
  passing: '750 on a 100–900 scale',
  questionTypes: 'Multiple-choice (single and multiple response) and performance-based',
  upcoming: {
    code: 'SY0-801',
    note: 'CompTIA has announced the next version, SY0-801. Published reports put its English launch at about November 17, 2026 and SY0-701 English retirement at June 11, 2027. Dates can change, so check comptia.org before you book. This app teaches the SY0-701 objectives. Most of the material carries over, but if you plan to sit SY0-801, compare these objectives against its final objectives document.'
  }
};

SEC.domains = [
  { id: '1', title: 'General Security Concepts', weight: 12, color: '#2563eb' },
  { id: '2', title: 'Threats, Vulnerabilities, and Mitigations', weight: 22, color: '#dc2626' },
  { id: '3', title: 'Security Architecture', weight: 18, color: '#7c3aed' },
  { id: '4', title: 'Security Operations', weight: 28, color: '#059669' },
  { id: '5', title: 'Security Program Management and Oversight', weight: 20, color: '#d97706' }
];

SEC.objectives = [
  { id: '1.1', title: 'Compare and contrast various types of security controls.',
    topics: ['Control categories: technical, managerial, operational, physical', 'Control types: preventive, deterrent, detective, corrective, compensating, directive'] },
  { id: '1.2', title: 'Summarize fundamental security concepts.',
    topics: ['CIA triad', 'Non-repudiation', 'AAA (authentication, authorization, accounting)', 'Gap analysis', 'Zero Trust (control plane / data plane)', 'Physical security (bollards, vestibules, sensors)', 'Deception and disruption (honeypots, honeynets, honeyfiles, honeytokens)'] },
  { id: '1.3', title: 'Explain the importance of change management processes and the impact to security.',
    topics: ['Business processes: approval, ownership, stakeholders, impact analysis, test results, backout plan, maintenance window, SOP', 'Technical implications: allow/deny lists, restricted activities, downtime, restarts, legacy apps, dependencies', 'Documentation and version control'] },
  { id: '1.4', title: 'Explain the importance of using appropriate cryptographic solutions.',
    topics: ['PKI: public/private keys, key escrow', 'Encryption levels: full-disk, partition, file, volume, database, record; transport; symmetric vs asymmetric; key exchange; algorithms; key length', 'Tools: TPM, HSM, KMS, secure enclave', 'Obfuscation: steganography, tokenization, data masking', 'Hashing, salting, digital signatures, key stretching', 'Blockchain, open public ledger', 'Certificates: CAs, CRLs, OCSP, self-signed, third-party, root of trust, CSR, wildcard'] },
  { id: '2.1', title: 'Compare and contrast common threat actors and motivations.',
    topics: ['Actors: nation-state, unskilled attacker, hacktivist, insider threat, organized crime, shadow IT', 'Attributes: internal/external, resources/funding, sophistication', 'Motivations: data exfiltration, espionage, service disruption, blackmail, financial gain, philosophical/political beliefs, ethical, revenge, disruption/chaos, war'] },
  { id: '2.2', title: 'Explain common threat vectors and attack surfaces.',
    topics: ['Message-based (email, SMS, IM)', 'Image-based, file-based, voice call, removable device', 'Vulnerable software (client-based vs agentless), unsupported systems', 'Unsecure networks (wireless, wired, Bluetooth), open service ports, default credentials', 'Supply chain (MSPs, vendors, suppliers)', 'Human vectors / social engineering: phishing, vishing, smishing, misinformation, impersonation, BEC, pretexting, watering hole, brand impersonation, typosquatting'] },
  { id: '2.3', title: 'Explain various types of vulnerabilities.',
    topics: ['Application: memory injection, buffer overflow, race conditions (TOC/TOU), malicious update', 'OS-based, web-based (SQLi, XSS)', 'Hardware: firmware, end-of-life, legacy', 'Virtualization: VM escape, resource reuse', 'Cloud-specific, supply chain', 'Cryptographic, misconfiguration', 'Mobile device: side loading, jailbreaking', 'Zero-day'] },
  { id: '2.4', title: 'Given a scenario, analyze indicators of malicious activity.',
    topics: ['Malware: ransomware, trojan, worm, spyware, bloatware, virus, keylogger, logic bomb, rootkit', 'Physical: brute force, RFID cloning, environmental', 'Network: DDoS (amplified, reflected), DNS attacks, wireless, on-path, credential replay, malicious code', 'Application: injection, buffer overflow, replay, privilege escalation, forgery, directory traversal', 'Cryptographic: downgrade, collision, birthday', 'Password: spraying, brute force', 'Indicators: account lockout, concurrent session usage, blocked content, impossible travel, resource consumption, resource inaccessibility, out-of-cycle logging, published/documented, missing logs'] },
  { id: '2.5', title: 'Explain the purpose of mitigation techniques used to secure the enterprise.',
    topics: ['Segmentation, access control (ACL, permissions)', 'Application allow list, isolation, patching, encryption, monitoring, least privilege', 'Configuration enforcement, decommissioning', 'Hardening: encryption, EDR, host-based firewall, HIPS, disabling ports/protocols, default password changes, removal of unnecessary software'] },
  { id: '3.1', title: 'Compare and contrast security implications of different architecture models.',
    topics: ['Cloud: responsibility matrix, hybrid, third-party vendors', 'IaC, serverless, microservices', 'Network infrastructure: physical isolation (air-gapped), logical segmentation, SDN', 'On-premises, centralized vs decentralized, containerization, virtualization', 'IoT, ICS/SCADA, RTOS, embedded systems, high availability', 'Considerations: availability, resilience, cost, responsiveness, scalability, ease of deployment, risk transference, ease of recovery, patch availability, inability to patch, power, compute'] },
  { id: '3.2', title: 'Given a scenario, apply security principles to secure enterprise infrastructure.',
    topics: ['Device placement, security zones, attack surface, connectivity', 'Failure modes: fail-open, fail-closed', 'Device attribute: active vs passive, inline vs tap/monitor', 'Network appliances: jump server, proxy server, IPS/IDS, load balancer, sensors', 'Port security: 802.1X, EAP', 'Firewall types: WAF, UTM, NGFW, layer 4/layer 7', 'Secure communication/access: VPN, remote access, tunneling (TLS, IPSec), SD-WAN, SASE', 'Selection of effective controls'] },
  { id: '3.3', title: 'Compare and contrast concepts and strategies to protect data.',
    topics: ['Data types: regulated, trade secret, intellectual property, legal, financial, human/non-human readable', 'Classifications: sensitive, confidential, public, restricted, private, critical', 'Data states: at rest, in transit, in use', 'Data sovereignty, geolocation', 'Methods: geographic restrictions, encryption, hashing, masking, tokenization, obfuscation, segmentation, permission restrictions'] },
  { id: '3.4', title: 'Explain the importance of resilience and recovery in security architecture.',
    topics: ['High availability: load balancing vs clustering', 'Site considerations: hot, cold, warm, geographic dispersion', 'Platform diversity, multi-cloud', 'Continuity of operations, capacity planning (people, technology, infrastructure)', 'Testing: tabletop, failover, simulation, parallel processing', 'Backups: onsite/offsite, frequency, encryption, snapshots, recovery, replication, journaling', 'Power: generators, UPS'] },
  { id: '4.1', title: 'Given a scenario, apply common security techniques to computing resources.',
    topics: ['Secure baselines: establish, deploy, maintain', 'Hardening targets: mobile, workstations, switches, routers, cloud, servers, ICS/SCADA, embedded, RTOS, IoT', 'Wireless: site surveys, heat maps; WPA3, AAA/RADIUS, cryptographic protocols, authentication protocols', 'Mobile solutions: MDM, BYOD, COPE, CYOD, cellular, Wi-Fi, Bluetooth', 'Application security: input validation, secure cookies, static code analysis, code signing, sandboxing, monitoring'] },
  { id: '4.2', title: 'Explain the security implications of proper hardware, software, and data asset management.',
    topics: ['Acquisition/procurement process', 'Assignment/accounting: ownership, classification', 'Monitoring/asset tracking: inventory, enumeration', 'Disposal/decommissioning: sanitization, destruction, certification, data retention'] },
  { id: '4.3', title: 'Explain various activities associated with vulnerability management.',
    topics: ['Identification: vulnerability scan, application security (static/dynamic analysis, package monitoring), threat feeds (OSINT, proprietary, information-sharing orgs, dark web), penetration testing, responsible disclosure, bug bounty, system/process audit', 'Analysis: confirmation (false positive/negative), prioritize, CVSS, CVE, classification, exposure factor, environmental variables, industry/organizational impact, risk tolerance', 'Response and remediation: patching, insurance, segmentation, compensating controls, exceptions/exemptions', 'Validation: rescanning, audit, verification', 'Reporting'] },
  { id: '4.4', title: 'Explain security alerting and monitoring concepts and tools.',
    topics: ['Monitoring computing resources: systems, applications, infrastructure', 'Activities: log aggregation, alerting, scanning, reporting, archiving, alert response and remediation/validation (quarantine, alert tuning)', 'Tools: SCAP, benchmarks, agents/agentless, SIEM, antivirus, DLP, SNMP traps, NetFlow, vulnerability scanners'] },
  { id: '4.5', title: 'Given a scenario, modify enterprise capabilities to enhance security.',
    topics: ['Firewall: rules, access lists, ports/protocols, screened subnets', 'IDS/IPS: trends, signatures', 'Web filter: agent-based, centralized proxy, URL scanning, content categorization, block rules, reputation', 'Operating system security: Group Policy, SELinux', 'Implementation of secure protocols: protocol selection, port selection, transport method', 'DNS filtering', 'Email security: DMARC, DKIM, SPF, gateway', 'File integrity monitoring, DLP, NAC, EDR/XDR, user behavior analytics'] },
  { id: '4.6', title: 'Given a scenario, implement and maintain identity and access management.',
    topics: ['Provisioning/de-provisioning user accounts', 'Permission assignments and implications', 'Identity proofing, federation, SSO (LDAP, OAuth, SAML), interoperability, attestation', 'Access controls: mandatory, discretionary, role-based, rule-based, attribute-based, time-of-day restrictions, least privilege', 'MFA: biometrics, hard/soft tokens, security keys; something you know/have/are/somewhere you are', 'Password concepts: best practices, password managers, passwordless', 'Privileged access management: just-in-time permissions, password vaulting, ephemeral credentials'] },
  { id: '4.7', title: 'Explain the importance of automation and orchestration related to secure operations.',
    topics: ['Use cases: user provisioning, resource provisioning, guard rails, security groups, ticket creation, escalation, enabling/disabling services and access, CI testing, integrations and APIs', 'Benefits: efficiency/time saving, enforcing baselines, standard infrastructure configurations, scaling securely, employee retention, reaction time, workforce multiplier', 'Other considerations: complexity, cost, single point of failure, technical debt, ongoing supportability'] },
  { id: '4.8', title: 'Explain appropriate incident response activities.',
    topics: ['Process: preparation, detection, analysis, containment, eradication, recovery, lessons learned', 'Training; testing (tabletop exercise, simulation)', 'Root cause analysis, threat hunting', 'Digital forensics: legal hold, chain of custody, acquisition, reporting, preservation, e-discovery'] },
  { id: '4.9', title: 'Given a scenario, use data sources to support an investigation.',
    topics: ['Log data: firewall, application, endpoint, OS-specific security, IPS/IDS, network, metadata', 'Data sources: vulnerability scans, automated reports, dashboards, packet captures'] },
  { id: '5.1', title: 'Summarize elements of effective security governance.',
    topics: ['Guidelines, policies (AUP, information security, BC, DR, IR, SDLC, change management)', 'Standards (password, access control, physical security, encryption)', 'Procedures (change management, onboarding/offboarding, playbooks)', 'External considerations: regulatory, legal, industry, local/regional, national, global', 'Monitoring and revision; types of governance structures (boards, committees, government entities, centralized/decentralized)', 'Roles and responsibilities for systems and data: owners, controllers, processors, custodians/stewards'] },
  { id: '5.2', title: 'Explain elements of the risk management process.',
    topics: ['Risk identification, risk assessment (ad hoc, recurring, one-time, continuous)', 'Risk analysis: qualitative, quantitative, SLE, ALE, ARO, probability, likelihood, exposure factor, impact', 'Risk register: key risk indicators, risk owners, risk threshold', 'Risk tolerance, risk appetite (expansionary, conservative, neutral)', 'Risk management strategies: transfer, accept (exemption, exception), avoid, mitigate', 'Risk reporting; business impact analysis: RTO, RPO, MTTR, MTBF'] },
  { id: '5.3', title: 'Explain the processes associated with third-party risk assessment and management.',
    topics: ['Vendor assessment: penetration testing, right-to-audit clause, evidence of internal audits, independent assessments, supply chain analysis', 'Vendor selection: due diligence, conflict of interest', 'Agreement types: SLA, MOA, MOU, MSA, WO/SOW, NDA, BPA', 'Vendor monitoring, questionnaires, rules of engagement'] },
  { id: '5.4', title: 'Summarize elements of effective security compliance.',
    topics: ['Compliance reporting: internal, external', 'Consequences of non-compliance: fines, sanctions, reputational damage, loss of license, contractual impacts', 'Compliance monitoring: due diligence/care, attestation and acknowledgement, internal and external, automation', 'Privacy: legal implications, data subject, controller vs processor, ownership, data inventory and retention, right to be forgotten'] },
  { id: '5.5', title: 'Explain types and purposes of audits and assessments.',
    topics: ['Attestation', 'Internal: compliance, audit committee, self-assessments', 'External: regulatory, examinations, assessment, independent third-party audit', 'Penetration testing: physical, offensive, defensive, integrated, known/partially known/unknown environment, reconnaissance (passive/active)'] },
  { id: '5.6', title: 'Given a scenario, implement security awareness practices.',
    topics: ['Phishing campaigns: recognizing attempts, responding to reported suspicious messages', 'Anomalous behavior recognition: risky, unexpected, unintentional', 'User guidance and training: policy/handbooks, situational awareness, insider threat, password management, removable media and cables, social engineering, operational security, hybrid/remote work environments', 'Reporting and monitoring: initial, recurring', 'Development and execution'] }
];

SEC.lessons = SEC.lessons || {};
SEC.questions = SEC.questions || [];
SEC.pbqs = SEC.pbqs || [];

SEC.objById = function (id) { return SEC.objectives.find(function (o) { return o.id === id; }); };
SEC.domainOf = function (objId) { return SEC.domains.find(function (d) { return d.id === String(objId).split('.')[0]; }); };

/* Content helpers.
   Options are written as [text, explanation, isCorrect]. */
SEC.addQuestions = function (objId, list) {
  // IDs continue from existing questions for the objective so progress records stay stable when content is appended.
  var offset = SEC.questions.filter(function (q) { return q.obj === objId; }).length;
  list.forEach(function (q, i) {
    q.id = objId + '-' + String(offset + i + 1).padStart(2, '0');
    q.obj = objId;
    q.type = q.o.filter(function (o) { return o[2]; }).length > 1 ? 'mr' : 'mc';
    q.d = q.d || 2;
    SEC.questions.push(q);
  });
};
SEC.addLesson = function (objId, lesson) { lesson.obj = objId; SEC.lessons[objId] = lesson; };
