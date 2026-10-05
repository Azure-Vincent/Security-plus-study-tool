/* Domain 1: General Security Concepts — original lesson content. */
(function () {
  var D = SEC.D;

  SEC.addLesson('1.1', {
    title: 'Security Controls: Categories and Types',
    minutes: 20,
    intro: 'A <strong>security control</strong> is any safeguard that reduces risk. That includes a lock, a policy, a firewall rule or a training class. The exam describes every control in two ways: its <em>category</em> (how it is implemented) and its <em>type</em> (what it does relative to an incident). Learn to label a control both ways, and many questions become easy.',
    terms: [
      ['Control', 'A safeguard or countermeasure that reduces the likelihood or impact of a risk.'],
      ['Category', 'How a control is implemented: technical, managerial, operational, or physical.'],
      ['Type (function)', 'What a control does in relation to an incident: preventive, deterrent, detective, corrective, compensating, or directive.'],
      ['IDS', 'Intrusion Detection System. Watches traffic or hosts and raises alerts (detective).'],
      ['ACL', 'Access Control List. A list of rules that allows or denies access.'],
      ['SOP', 'Standard Operating Procedure. A documented step-by-step way to perform a task.']
    ],
    sections: [
      {
        h: 'The four control categories',
        body: '<p>The category answers <strong>“Who or what carries out this control?”</strong></p><ul>' +
          '<li><strong>Technical</strong> (also called <em>logical</em>): enforced by hardware or software. Examples: firewalls, encryption, antivirus, MFA, ACLs on a file share.</li>' +
          '<li><strong>Managerial</strong> (also called <em>administrative</em>): decisions and documents that set direction and manage risk. Examples: security policies, risk assessments, vendor due diligence, hiring standards.</li>' +
          '<li><strong>Operational</strong>: carried out day to day by <em>people</em> following processes. Examples: security guards doing rounds, awareness training, change-management reviews, log review by an analyst.</li>' +
          '<li><strong>Physical</strong>: tangible barriers in the real world. Examples: fences, locks, bollards, mantraps/access control vestibules, cameras, lighting.</li></ul>' +
          '<p class="warnbox">Managerial controls <em>plan and govern</em>; operational controls are <em>people executing</em> those plans. A written training policy is managerial. Actually delivering the training is operational.</p>',
        diagram: D.grid([
          ['Technical', 'Managerial', 'Operational', 'Physical'],
          ['Firewall rule', 'Risk assessment', 'Guard patrols', 'Fence'],
          ['Disk encryption', 'Security policy', 'Awareness training', 'Door lock'],
          ['MFA', 'Vendor review', 'Log review', 'CCTV camera']
        ], 'Control categories with examples', { cw: 140 }),
        check: { q: 'A company requires all new employees to complete phishing-awareness training delivered by the HR team during onboarding. Which category best describes the training session itself?', o: [
          ['Technical', 'Nothing here is enforced by software or hardware.'],
          ['Operational', 'People deliver and take the training as an ongoing process, so it is operational.', true],
          ['Physical', 'Training is not a tangible barrier.'],
          ['Managerial', 'The <em>policy</em> requiring training is managerial, but delivering it is operational.']
        ] }
      },
      {
        h: 'The six control types',
        body: '<p>The type answers <strong>“When does it act, and what does it accomplish?”</strong></p><ul>' +
          '<li><strong>Preventive</strong>: stops an incident before it happens (firewall deny rule, locked door, MFA).</li>' +
          '<li><strong>Deterrent</strong>: discourages an attacker psychologically but does not physically stop them (warning sign, visible camera, login banner).</li>' +
          '<li><strong>Detective</strong>: identifies and records an incident while it happens or afterward (IDS, log monitoring, motion sensor, audit).</li>' +
          '<li><strong>Corrective</strong>: limits damage and restores normal operation after an incident (restoring from backup, reimaging a host, patching after an exploit).</li>' +
          '<li><strong>Compensating</strong>: an <em>alternative</em> control used when the primary control isn’t feasible (isolating a legacy system that can’t be patched).</li>' +
          '<li><strong>Directive</strong>: tells people what to do or not do (policy statement, “Authorized personnel only” procedure, AUP).</li></ul>',
        diagram: D.flow([
          { t: 'Deterrent', sub: 'discourage before', tone: 'accent' },
          { t: 'Preventive', sub: 'block the attempt', tone: 'good' },
          { t: 'Detective', sub: 'notice & record', tone: 'warn' },
          { t: 'Corrective', sub: 'recover & fix', tone: 'bad' }
        ], 'Where each control type acts on an incident timeline'),
        check: { q: 'A server that runs an unsupported operating system cannot be patched, so the team places it on an isolated VLAN with strict ACLs. What type of control is the isolation?', o: [
          ['Corrective', 'Nothing has been repaired after an incident.'],
          ['Compensating', 'Isolation substitutes for the control that can’t be applied (patching), so it is compensating.', true],
          ['Deterrent', 'It does more than discourage; it restricts traffic.'],
          ['Directive', 'Directive controls are instructions to people, not network segmentation.']
        ] }
      },
      {
        h: 'Labeling a control both ways',
        body: '<p>Every control has <em>both</em> a category and a type. Ask the two questions separately:</p>' +
          '<div class="ex">A security guard at the lobby desk checks badges. Category: <strong>operational</strong> (a person performs it), though many references also call guards a physical control. Type: <strong>preventive</strong> (stops unauthorized entry) and <strong>deterrent</strong> (their presence discourages attempts).</div>' +
          '<div class="ex">An IPS (intrusion <em>prevention</em> system) blocks a malicious packet. Category: <strong>technical</strong>. Type: <strong>preventive</strong>. Compare this with an IDS, which only alerts and is therefore <strong>detective</strong>.</div>' +
          '<p>Many controls serve more than one type. A CCTV camera is <em>detective</em> (it records evidence) and <em>deterrent</em> (it is visible). On the exam, pick the type the scenario emphasizes. If the camera is hidden, it cannot deter.</p>',
        check: { q: 'Which TWO describe a login banner stating “Unauthorized access is prohibited and will be prosecuted”?', o: [
          ['Technical category', 'The banner is displayed by the system, so it is generally categorized as technical.', true],
          ['Deterrent type', 'Its purpose is to discourage misuse, so it is a deterrent.', true],
          ['Corrective type', 'It doesn’t repair anything after an incident.'],
          ['Detective type', 'Displaying text doesn’t detect or record activity.']
        ] }
      }
    ],
    compare: [
      { title: 'Commonly confused: Preventive vs Deterrent vs Detective', head: ['', 'Preventive', 'Deterrent', 'Detective'],
        rows: [['Goal', 'Stop the event', 'Discourage the attacker', 'Discover the event'], ['Works if attacker ignores it?', 'Yes, it still blocks', 'No, it only influences behavior', 'Yes, it still records'], ['Examples', 'Lock, firewall deny, MFA', 'Warning sign, visible camera, banner', 'IDS alert, audit log, motion sensor']] },
      { title: 'Commonly confused: Corrective vs Compensating', head: ['', 'Corrective', 'Compensating'],
        rows: [['When', 'After an incident', 'Any time the primary control can’t be used'], ['Purpose', 'Restore and reduce damage', 'Provide equivalent protection another way'], ['Example', 'Restore files from backup after ransomware', 'Extra monitoring because separation of duties isn’t possible in a small team']] }
    ],
    takeaways: [
      'Category = <strong>how</strong> a control is implemented (technical, managerial, operational, physical).',
      'Type = <strong>what it does</strong> (preventive, deterrent, detective, corrective, compensating, directive).',
      'IDS = detective; IPS = preventive. Policies are managerial and directive.',
      'Compensating controls replace a control that isn’t feasible; corrective controls fix things after an incident.',
      'Pick the type the scenario emphasizes: a hidden camera is detective only, a visible one also deters.'
    ]
  });

  SEC.addLesson('1.2', {
    title: 'Fundamental Security Concepts',
    minutes: 30,
    intro: 'These concepts are the vocabulary of the whole exam: the <strong>CIA triad</strong>, <strong>non-repudiation</strong>, <strong>AAA</strong>, <strong>Zero Trust</strong>, physical security, and deception technologies. If you can explain each one with an example, later topics will make sense.',
    terms: [
      ['CIA triad', 'Confidentiality, Integrity, Availability: the three core goals of security.'],
      ['Non-repudiation', 'Proof that someone performed an action so they cannot credibly deny it (for example, a digital signature).'],
      ['AAA', 'Authentication (prove who you are), Authorization (what you may do), Accounting (record what you did).'],
      ['Zero Trust', 'A model that never trusts based on network location; every request is verified.'],
      ['PDP / PEP', 'Policy Decision Point (decides) and Policy Enforcement Point (enforces) in Zero Trust.'],
      ['Gap analysis', 'Comparing the current state to a desired state (e.g., a framework) to find missing controls.'],
      ['Honeypot', 'A decoy system designed to attract and study attackers.']
    ],
    sections: [
      {
        h: 'The CIA triad',
        body: '<ul><li><strong>Confidentiality</strong>: only authorized people can read data. Tools: encryption, access controls, MFA.</li>' +
          '<li><strong>Integrity</strong>: data is accurate and hasn’t been altered without authorization. Tools: hashing, digital signatures, version control, change tracking.</li>' +
          '<li><strong>Availability</strong>: systems and data are accessible when needed. Tools: redundancy, backups, load balancing, DDoS protection, patching.</li></ul>' +
          '<div class="ex">Ransomware encrypts a hospital’s records. Staff can’t reach patient data, which is an <em>availability</em> loss. If the attackers also leak records, that is a <em>confidentiality</em> loss too.</div>',
        diagram: D.hub('CIA', ['Confidentiality: encryption, access control', 'Integrity: hashing, signatures', 'Availability: redundancy, backups'], 'The CIA triad and typical supporting controls'),
        check: { q: 'An attacker modifies the price field in an online order before it reaches the server. Which security goal is primarily violated?', o: [
          ['Confidentiality', 'Nothing secret was disclosed.'],
          ['Integrity', 'Data was altered without authorization, which is an integrity violation.', true],
          ['Availability', 'The service remains available.'],
          ['Non-repudiation', 'Related, but the core violation is unauthorized modification.']
        ] }
      },
      {
        h: 'Non-repudiation and AAA',
        body: '<p><strong>Non-repudiation</strong> means a person can’t deny having done something. A <em>digital signature</em> provides it: only the holder of the private key could have produced the signature. A shared password does <em>not</em> provide non-repudiation, because anyone who knows it could have acted.</p>' +
          '<p><strong>AAA</strong> describes access in three steps:</p>',
        diagram: D.flow([
          { t: 'Identify', sub: 'claim: “I am alice”' },
          { t: 'Authenticate', sub: 'prove it: password + token', tone: 'accent' },
          { t: 'Authorize', sub: 'what alice may access', tone: 'good' },
          { t: 'Account', sub: 'log what alice did', tone: 'warn' }
        ], 'Identification, authentication, authorization and accounting'),
        compare: { title: 'Authentication vs Authorization vs Accounting', head: ['', 'Authentication', 'Authorization', 'Accounting'], rows: [
          ['Question', 'Who are you?', 'What may you do?', 'What did you do?'],
          ['Examples', 'Password, biometrics, certificate', 'ACLs, roles, permissions', 'Audit logs, session records'],
          ['Also authenticates', 'Systems too: devices can authenticate with certificates', '', '']] },
        check: { q: 'Which control best provides non-repudiation for an approval sent by email?', o: [
          ['Sending from a shared team mailbox', 'Anyone with access to the shared mailbox could send it, so the sender can deny it.'],
          ['Digitally signing the message with the sender’s private key', 'Only the private-key holder can create the signature, so the sender can’t credibly deny it.', true],
          ['Encrypting the message with the recipient’s public key', 'This gives confidentiality, not proof of origin.'],
          ['Using TLS between mail servers', 'TLS protects data in transit between servers; it doesn’t bind the message to a person.']
        ] }
      },
      {
        h: 'Gap analysis',
        body: '<p>A <strong>gap analysis</strong> compares where you are with where you need to be, usually against a framework such as NIST CSF or ISO 27001 or against a regulation. The output is a list of missing or weak controls and a plan to close them.</p><div class="ex">A startup preparing for its first customer audit maps its controls against the required standard and finds no formal incident response plan. That missing plan is a <em>gap</em>.</div>'
      },
      {
        h: 'Zero Trust',
        body: '<p>Traditional networks trusted anything “inside the firewall.” <strong>Zero Trust</strong> assumes breach and verifies every request, every time, based on identity, device health and context. It is split into two planes:</p><ul>' +
          '<li><strong>Control plane</strong>: makes decisions. Includes <em>adaptive identity</em> (risk-based authentication), <em>threat scope reduction</em>, <em>policy-driven access control</em>, the <strong>Policy Engine</strong> (decides) and <strong>Policy Administrator</strong> (issues the go/no-go and credentials). Together these form the <strong>Policy Decision Point</strong>.</li>' +
          '<li><strong>Data plane</strong>: where traffic flows. Includes the <em>subject/system</em> requesting access, the <strong>Policy Enforcement Point</strong> (the gatekeeper that allows or blocks), and <em>implicit trust zones</em> behind the PEP.</li></ul>',
        diagram: D.exchange('Subject (user + device)', 'Enterprise resource', [
          { from: 'L', t: '1. Request reaches the Policy Enforcement Point' },
          { from: 'R', t: '2. PEP asks the Policy Engine / Administrator (PDP)' },
          { from: 'R', t: '3. PDP evaluates identity, device posture, context' },
          { from: 'L', t: '4. PEP allows the session to the resource' }
        ], 'Zero Trust access decision: the PEP enforces, the PDP decides'),
        check: { q: 'In a Zero Trust architecture, which component actually allows or blocks the connection between the subject and the resource?', o: [
          ['Policy Engine', 'The Policy Engine makes the decision but does not sit in the traffic path.'],
          ['Policy Enforcement Point', 'The PEP sits in the data plane and enforces the decision.', true],
          ['Policy Administrator', 'The PA communicates the decision and sets up the session; it doesn’t enforce it in the data path.'],
          ['Implicit trust zone', 'This is the area behind the PEP, not the enforcement mechanism.']
        ] }
      },
      {
        h: 'Physical security',
        body: '<ul><li><strong>Bollards</strong>: short, sturdy posts that stop vehicles from ramming entrances.</li>' +
          '<li><strong>Access control vestibule</strong> (mantrap): two interlocking doors; the second won’t open until the first closes. This defeats <em>tailgating</em>.</li>' +
          '<li><strong>Fencing, lighting, video surveillance, security guards, access badges</strong>.</li>' +
          '<li><strong>Sensors</strong>: <em>infrared</em> (body heat), <em>pressure</em> (weight on a floor or mat), <em>microwave</em> (motion via reflected signals), <em>ultrasonic</em> (motion via sound waves).</li></ul>'
      },
      {
        h: 'Deception and disruption',
        body: '<p>Deception technologies lure attackers into revealing themselves:</p><ul>' +
          '<li><strong>Honeypot</strong>: a single decoy system.</li><li><strong>Honeynet</strong>: a network of decoys.</li>' +
          '<li><strong>Honeyfile</strong>: a bait file (e.g., <code>passwords.xlsx</code>) whose access triggers an alert.</li>' +
          '<li><strong>Honeytoken</strong>: fake data, such as a fake AWS key or a fake database record, that should never be used. Any use proves compromise.</li></ul>' +
          '<p>Legitimate users have no reason to touch these, so alerts from them have very few false positives.</p>',
        check: { q: 'A security team plants a fake API key in a source code repository and alerts on any attempt to use it. What is this called?', o: [
          ['Honeypot', 'A honeypot is a decoy system, not a piece of data.'],
          ['Honeytoken', 'A fake credential or data element that triggers an alert when used is a honeytoken.', true],
          ['Honeynet', 'A honeynet is a network of decoy systems.'],
          ['Tokenization', 'Tokenization replaces real data with surrogate values for protection, not detection.']
        ] }
      }
    ],
    takeaways: [
      'CIA: Confidentiality (encryption, access control), Integrity (hashing, signatures), Availability (redundancy, backups).',
      'Non-repudiation comes from digital signatures. Shared accounts destroy it.',
      'AAA: authenticate (who), authorize (what), account (record).',
      'Zero Trust: the control plane decides (Policy Engine + Administrator = PDP); the data plane enforces (PEP).',
      'Vestibules stop tailgating; bollards stop vehicles; honeytokens/honeyfiles detect intruders with few false positives.'
    ]
  });

  SEC.addLesson('1.3', {
    title: 'Change Management and Security',
    minutes: 18,
    intro: 'Most outages and many breaches start with an unplanned or poorly tested change. <strong>Change management</strong> is the process that makes changes deliberate, reviewed, reversible and documented. The exam tests both the <em>business process</em> and the <em>technical implications</em>.',
    terms: [
      ['CAB', 'Change Advisory Board. A group that reviews and approves changes.'],
      ['Impact analysis', 'Assessment of what a change could affect and how badly.'],
      ['Backout plan', 'Documented steps to reverse a change if it fails (also called a rollback plan).'],
      ['Maintenance window', 'A pre-approved time period when changes are allowed, chosen to minimize business impact.'],
      ['Stakeholder', 'Anyone affected by the change or with an interest in it.'],
      ['Version control', 'Tracking changes to code, configurations and documents so you can see who changed what, and revert.']
    ],
    sections: [
      {
        h: 'The change process',
        body: '<p>A typical change moves through these stages:</p>',
        diagram: D.flow([
          { t: 'Request', sub: 'owner submits change' },
          { t: 'Impact analysis', sub: 'risk, dependencies', tone: 'accent' },
          { t: 'Test', sub: 'in non-production', tone: 'accent' },
          { t: 'Approve', sub: 'CAB / stakeholders', tone: 'good' },
          { t: 'Implement', sub: 'in maintenance window', tone: 'warn' },
          { t: 'Document', sub: 'update diagrams, versions' }
        ], 'A typical change management workflow', { bw: 118 }),
        check: { q: 'Before approving a firewall upgrade, the CAB asks how the team will restore service if the new firmware breaks VPN connectivity. What document is being requested?', o: [
          ['Impact analysis', 'Impact analysis identifies what might break, not how to reverse it.'],
          ['Backout plan', 'A backout plan describes how to roll the change back if it fails.', true],
          ['Standard operating procedure', 'An SOP describes routine tasks, not reversal of a specific change.'],
          ['Maintenance window', 'This is when the change happens, not how to undo it.']
        ] }
      },
      {
        h: 'Business process elements',
        body: '<ul><li><strong>Approval process</strong>: who must sign off (often a CAB).</li><li><strong>Ownership</strong>: a named person accountable for the change.</li>' +
          '<li><strong>Stakeholders</strong>: everyone who must be consulted or informed.</li><li><strong>Impact analysis</strong>: what systems, users and security controls are affected; what if it fails?</li>' +
          '<li><strong>Test results</strong>: evidence the change works in a test environment.</li><li><strong>Backout plan</strong>: how to undo it.</li>' +
          '<li><strong>Maintenance window</strong>: when it is least disruptive.</li><li><strong>Standard operating procedure (SOP)</strong>: repeatable documented steps for routine, pre-approved changes.</li></ul>'
      },
      {
        h: 'Technical implications',
        body: '<ul><li><strong>Allow lists / deny lists</strong> may need updating, e.g., a new application must be added to the application allow list or it will be blocked.</li>' +
          '<li><strong>Restricted activities</strong>: changes must stay within approved scope. Adding “one more quick fix” during the window is a classic mistake.</li>' +
          '<li><strong>Downtime, service restarts and application restarts</strong>: plan for them and notify users.</li>' +
          '<li><strong>Legacy applications</strong> may break with newer libraries or protocols.</li>' +
          '<li><strong>Dependencies</strong>: changing one service (e.g., certificate, DNS) can break others that rely on it.</li></ul>' +
          '<div class="ex">An admin disables TLS 1.0 on a web server to improve security. An old point-of-sale terminal that only supports TLS 1.0 stops working. Better dependency analysis and testing would have caught this.</div>',
        check: { q: 'During an approved maintenance window, a technician notices an unrelated misconfiguration and fixes it while there. What is the main problem?', o: [
          ['The change was performed outside the maintenance window', 'It happened during the window.'],
          ['It was an unauthorized change outside the approved scope', 'Changes must stay within the approved scope. Unapproved changes skip impact analysis and backout planning.', true],
          ['It should have been documented in the SOP', 'Documentation matters, but the core issue is the lack of approval.'],
          ['Fixing misconfigurations is never allowed', 'Fixes are allowed, but through the change process.']
        ] }
      },
      {
        h: 'Documentation and version control',
        body: '<p>After a change, <strong>update diagrams, policies and procedures</strong> so they match reality. <strong>Version control</strong> (e.g., Git for code and infrastructure-as-code) shows who changed what and when, and makes rollback straightforward. Outdated documentation causes mistakes during incidents.</p>'
      }
    ],
    takeaways: [
      'Change management makes changes approved, tested, reversible and documented.',
      'Key elements: approval/CAB, owner, stakeholders, impact analysis, test results, backout plan, maintenance window, SOP.',
      'Watch for technical side effects: allow-list updates, restarts, downtime, legacy app breakage, dependencies.',
      'Stay inside the approved scope. Unapproved changes are a security risk even if well-intentioned.',
      'Update documentation and use version control after every change.'
    ]
  });

  SEC.addLesson('1.4', {
    title: 'Cryptographic Solutions and PKI',
    minutes: 40,
    intro: 'Cryptography protects confidentiality, integrity, authentication and non-repudiation. You don’t need to do the math for the exam, but you must know <strong>which tool fits which job</strong>: symmetric vs asymmetric encryption, hashing vs encryption, signatures, certificates and key storage hardware.',
    terms: [
      ['Plaintext / ciphertext', 'Readable data / encrypted data.'],
      ['Symmetric encryption', 'One shared secret key encrypts and decrypts (e.g., AES). Fast.'],
      ['Asymmetric encryption', 'A key pair: public key and private key (e.g., RSA, ECC). Slower; solves key distribution.'],
      ['Hash', 'A fixed-length fingerprint of data (e.g., SHA-256). One-way; any change produces a different hash.'],
      ['Salt', 'Random data added to a password before hashing so identical passwords hash differently.'],
      ['PKI', 'Public Key Infrastructure. CAs, certificates, and processes that bind public keys to identities.'],
      ['CA', 'Certificate Authority. Signs certificates to vouch for identities.'],
      ['CRL / OCSP', 'Certificate Revocation List / Online Certificate Status Protocol. Ways to check if a certificate is revoked.'],
      ['CSR', 'Certificate Signing Request. What you send to a CA to get a certificate.'],
      ['TPM / HSM', 'Trusted Platform Module (chip in a device) / Hardware Security Module (dedicated appliance for keys).'],
      ['KMS', 'Key Management System. A service for creating, storing, rotating and auditing keys.']
    ],
    sections: [
      {
        h: 'Symmetric vs asymmetric encryption',
        body: '<p><strong>Symmetric</strong> encryption uses one shared key. It is very fast and suits bulk data (disks, files, VPN traffic). The problem is getting the key to the other party securely.</p>' +
          '<p><strong>Asymmetric</strong> encryption uses a mathematically linked <em>key pair</em>. Data encrypted with the <em>public</em> key can only be decrypted with the matching <em>private</em> key. The public key can be shared freely; the private key must never leave its owner.</p>' +
          '<p>Real protocols such as TLS use <strong>both</strong>: asymmetric cryptography (or Diffie-Hellman key exchange) to agree on a session key, then fast symmetric encryption for the data.</p>',
        diagram: D.exchange('Browser', 'Web server', [
          { from: 'L', t: 'ClientHello: supported versions and cipher suites' },
          { from: 'R', t: 'Certificate (server public key, signed by CA)' },
          { from: 'L', t: 'Key exchange (ECDHE): both derive a shared session key' },
          { from: 'L', t: 'Application data encrypted with symmetric AES session key' }
        ], 'Simplified TLS: asymmetric key exchange, then symmetric bulk encryption'),
        compare: { title: 'Symmetric vs Asymmetric', head: ['', 'Symmetric', 'Asymmetric'], rows: [
          ['Keys', 'One shared secret', 'Public + private pair'], ['Speed', 'Fast', 'Slow'], ['Typical use', 'Bulk data, disks, VPN tunnels', 'Key exchange, digital signatures, certificates'],
          ['Examples', 'AES, ChaCha20 (legacy: DES, 3DES, RC4)', 'RSA, ECC, Diffie-Hellman (key exchange)'], ['Main challenge', 'Securely sharing the key', 'Performance; protecting the private key']] },
        check: { q: 'Alice wants to send Bob a file only Bob can decrypt. Which key should she use to encrypt it?', o: [
          ['Alice’s private key', 'Encrypting with Alice’s private key creates a signature-like result that anyone with her public key can decrypt.'],
          ['Alice’s public key', 'Only Alice could decrypt that, not Bob.'],
          ['Bob’s public key', 'Only Bob’s private key can decrypt data encrypted with Bob’s public key.', true],
          ['Bob’s private key', 'Alice should never have Bob’s private key.']
        ] }
      },
      {
        h: 'Hashing, salting and key stretching',
        body: '<p>A <strong>hash</strong> is a one-way fingerprint. You can’t “decrypt” a hash. You can only hash new input and compare. Use hashes to verify <em>integrity</em> (did the file change?) and to store passwords.</p>' +
          '<ul><li><strong>Salting</strong> adds a unique random value per password before hashing. This defeats precomputed <em>rainbow tables</em> and hides identical passwords.</li>' +
          '<li><strong>Key stretching</strong> (PBKDF2, bcrypt, scrypt, Argon2) runs the hash many times, making brute-force guessing far slower.</li>' +
          '<li>A <strong>collision</strong> is two inputs producing the same hash. MD5 and SHA-1 are broken this way; use SHA-256 or stronger.</li></ul>',
        diagram: D.flow([{ t: 'Password', sub: 'Summer2024!' }, { t: '+ Salt', sub: 'random per user', tone: 'accent' }, { t: 'Slow hash ×100k', sub: 'key stretching', tone: 'warn' }, { t: 'Stored hash', sub: 'unique, slow to crack', tone: 'good' }], 'Secure password storage'),
        check: { q: 'Attackers stole a password database. Two users have the same password, but their stored hashes differ. What explains this?', o: [
          ['The passwords were encrypted with AES', 'Passwords should be hashed, not encrypted, and this wouldn’t explain differing outputs on its own.'],
          ['Each password was salted before hashing', 'Unique salts make identical passwords produce different hashes.', true],
          ['The hashing algorithm produced a collision', 'A collision is the opposite: different inputs producing the same hash.'],
          ['The database used tokenization', 'Tokenization replaces data with tokens; it isn’t used for password verification.']
        ] }
      },
      {
        h: 'Digital signatures',
        body: '<p>A <strong>digital signature</strong> gives integrity, authentication and non-repudiation:</p><ol><li>The sender hashes the message.</li><li>The sender encrypts the hash with <strong>their own private key</strong>. This is the signature.</li><li>The receiver decrypts the signature with the <strong>sender’s public key</strong> and compares it with their own hash of the message. If they match, the message is unchanged and came from the private-key holder.</li></ol>' +
          '<p class="warnbox">Encrypt with the <em>recipient’s public key</em> for confidentiality. Sign with the <em>sender’s private key</em> for authenticity.</p>'
      },
      {
        h: 'Encryption levels and data states',
        body: '<ul><li><strong>Full-disk encryption (FDE)</strong>, e.g., BitLocker or FileVault, protects a lost or stolen laptop when it is powered off.</li><li><strong>Partition / volume</strong>: encrypt part of a disk.</li>' +
          '<li><strong>File-level</strong>: individual files (e.g., EFS); stays protected when copied elsewhere if the format preserves it.</li><li><strong>Database / record (column) level</strong>: protects specific sensitive fields such as SSNs, even from some database admins.</li>' +
          '<li><strong>Transport / communication</strong>: TLS, IPsec, SSH protect data in transit.</li></ul><p><strong>Key length</strong> matters: longer keys resist brute force (AES-256 > AES-128). Asymmetric keys need far more bits for similar strength (RSA-3072 ≈ AES-128). ECC achieves similar strength with shorter keys, which suits mobile and IoT.</p>'
      },
      {
        h: 'Key storage hardware and services',
        body: '<ul><li><strong>TPM</strong>: a chip on the motherboard; stores keys for disk encryption and supports secure/measured boot.</li>' +
          '<li><strong>HSM</strong>: a hardened, tamper-resistant appliance or card that generates and stores keys and performs crypto operations for servers, such as a CA’s signing key.</li>' +
          '<li><strong>KMS</strong>: a key management service (often cloud-based) that centralizes key creation, rotation, access policy and audit.</li>' +
          '<li><strong>Secure enclave</strong>: an isolated processor area (e.g., in phones) that protects keys and biometric data even from the main OS.</li>' +
          '<li><strong>Key escrow</strong>: a trusted third party holds a copy of keys so data can be recovered (e.g., if an employee leaves).</li></ul>',
        check: { q: 'A company runs its own certificate authority and must protect the root CA signing key with tamper-resistant hardware that performs signing operations itself. What should it use?', o: [
          ['TPM', 'A TPM protects keys for a single endpoint, not enterprise CA signing at scale.'],
          ['HSM', 'An HSM is purpose-built, tamper-resistant hardware for protecting high-value keys and performing crypto operations.', true],
          ['Key escrow', 'Escrow keeps a recoverable copy; it doesn’t protect the key during use.'],
          ['Steganography', 'Steganography hides data in other data; it isn’t key protection.']
        ] }
      },
      {
        h: 'Obfuscation: steganography, tokenization, masking',
        body: '<ul><li><strong>Steganography</strong>: hiding data inside other data (e.g., inside an image’s pixels). It hides the <em>existence</em> of the data.</li>' +
          '<li><strong>Tokenization</strong>: replacing sensitive data (a card number) with a random token; the real value lives in a secure vault. Common in payment processing.</li>' +
          '<li><strong>Data masking</strong>: showing only part of the data (e.g., <code>***-**-1234</code>) or substituting realistic fake data in test environments.</li></ul>'
      },
      {
        h: 'Certificates and PKI',
        body: '<p>A <strong>certificate</strong> binds a public key to an identity and is signed by a <strong>Certificate Authority</strong>. Browsers trust a set of <strong>root CAs</strong>; intermediate CAs chain up to those roots, forming the <strong>chain of trust</strong> (root of trust).</p><ul>' +
          '<li><strong>CSR</strong>: you generate a key pair, keep the private key, and send the CSR (public key + identity info) to the CA.</li>' +
          '<li><strong>Self-signed</strong> certificates are signed by their own key. They are fine for internal testing but not trusted by browsers by default. <strong>Third-party</strong> certificates are issued by a public CA.</li>' +
          '<li><strong>Wildcard</strong> (<code>*.example.com</code>) covers all first-level subdomains. <strong>SAN</strong> (Subject Alternative Name) lists multiple specific names.</li>' +
          '<li><strong>Revocation</strong>: a <strong>CRL</strong> is a list the client downloads; <strong>OCSP</strong> is a real-time query for one certificate. <strong>OCSP stapling</strong> lets the server attach a recent signed OCSP response, which saves the client a lookup.</li></ul>',
        diagram: D.flow([{ t: 'Root CA', sub: 'self-signed, offline, in trust store', tone: 'good' }, { t: 'Intermediate CA', sub: 'signed by root', tone: 'accent' }, { t: 'Server certificate', sub: 'www.example.com' }, { t: 'Browser', sub: 'validates chain + revocation', tone: 'warn' }], 'Certificate chain of trust'),
        check: { q: 'A web team needs one certificate that works for shop.example.com, mail.example.com and api.example.com, and for future subdomains. Which is the best choice?', o: [
          ['Self-signed certificate', 'Browsers won’t trust it by default.'],
          ['Wildcard certificate for *.example.com', 'A wildcard covers all first-level subdomains, including future ones.', true],
          ['A certificate with only example.com in the subject', 'That would not match the subdomains.'],
          ['Code-signing certificate', 'Code-signing certificates sign software, not websites.']
        ] }
      },
      {
        h: 'Blockchain and open public ledgers',
        body: '<p>A <strong>blockchain</strong> is a distributed, append-only ledger. Each block contains the hash of the previous block, so altering history would break every later hash. An <strong>open public ledger</strong> lets anyone verify transactions. The security benefit is <em>integrity</em> and tamper evidence without a central authority.</p>'
      }
    ],
    compare: [
      { title: 'Commonly confused: Hashing vs Encryption vs Encoding', head: ['', 'Hashing', 'Encryption', 'Encoding (e.g., Base64)'], rows: [
        ['Reversible?', 'No (one-way)', 'Yes, with the key', 'Yes, by anyone'], ['Purpose', 'Integrity, password storage', 'Confidentiality', 'Format conversion, not security'], ['Key needed?', 'No', 'Yes', 'No']] },
      { title: 'Commonly confused: CRL vs OCSP', head: ['', 'CRL', 'OCSP'], rows: [
        ['How', 'Download a full list of revoked serials', 'Query the status of one certificate'], ['Freshness', 'Only as current as the last published list', 'Near real time'], ['Load', 'Larger downloads', 'Small requests; stapling reduces load further']] },
      { title: 'Commonly confused: Tokenization vs Masking vs Encryption', head: ['', 'Tokenization', 'Masking', 'Encryption'], rows: [
        ['Original recoverable?', 'Only via the token vault', 'Usually no (display or test copy)', 'Yes, with the key'], ['Typical use', 'Payment card numbers', 'Showing last 4 digits; test data', 'Protecting stored or transmitted data']] }
    ],
    takeaways: [
      'Symmetric (AES) = fast bulk encryption; asymmetric (RSA/ECC) = key exchange and signatures. TLS uses both.',
      'Encrypt with the recipient’s public key; sign with the sender’s private key.',
      'Hashes are one-way integrity checks. Salt + key stretching (bcrypt, PBKDF2, Argon2) protect stored passwords.',
      'TPM = per-device chip; HSM = enterprise key appliance; KMS = key management service; secure enclave = isolated key area on a chip.',
      'PKI: CSR → CA signs → chain to trusted root. Check revocation with CRL or OCSP (stapling).',
      'Tokenization, masking and steganography are obfuscation techniques with different purposes.'
    ]
  });
})();
