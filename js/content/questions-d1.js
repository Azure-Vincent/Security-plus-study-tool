/* Domain 1 question bank — original questions. Option format: [text, explanation, isCorrect] */
SEC.addQuestions('1.1', [
  { d: 1, q: 'Which control type is an intrusion detection system (IDS) that alerts analysts but does not block traffic?', o: [
    ['Preventive', 'Preventive controls stop an event; an IDS only alerts.'],
    ['Detective', 'An IDS identifies and records suspicious activity, which makes it detective.', true],
    ['Corrective', 'Corrective controls restore systems after an incident.'],
    ['Deterrent', 'Deterrents discourage attackers; an IDS is usually invisible to them.']
  ], ex: 'Detection without blocking is the definition of a detective control. Swap IDS for IPS and the answer becomes preventive.' },
  { d: 1, q: 'A sign on a data center fence reads “Restricted area: violators will be prosecuted.” What type of control is the sign?', o: [
    ['Deterrent', 'The sign discourages intrusion but cannot physically stop anyone.', true],
    ['Preventive', 'The fence is preventive; the sign alone does not stop entry.'],
    ['Compensating', 'It isn’t replacing a primary control that couldn’t be implemented.'],
    ['Detective', 'The sign doesn’t detect or record anything.']
  ], ex: 'Warning signs work psychologically. If an intruder ignores them, nothing stops the intrusion, so they are deterrents rather than preventive controls.' },
  { d: 2, s: 'A small business has only two IT staff, so it can’t fully separate the duties of creating and approving user accounts. Management instead requires a weekly review of all account changes by the owner.', q: 'What type of control is the weekly review?', o: [
    ['Directive', 'It isn’t an instruction to staff about behavior.'],
    ['Compensating', 'The review makes up for the separation of duties the business can’t implement.', true],
    ['Corrective', 'Nothing is being restored after an incident.'],
    ['Preventive', 'A review after the fact cannot stop a bad change from happening.']
  ], ex: 'When the ideal control (separation of duties) isn’t feasible, an alternative that reduces the same risk is a compensating control. The review is also detective in nature, but the scenario emphasizes that it replaces the missing control.' },
  { d: 1, q: 'Which of the following is a managerial control?', o: [
    ['Configuring a host-based firewall', 'Firewalls are technical controls.'],
    ['Performing an annual risk assessment', 'Risk assessments are management-level planning and oversight activities.', true],
    ['Installing bollards at the entrance', 'Bollards are physical controls.'],
    ['A guard checking badges at a door', 'Guards performing duties are operational (or physical) controls.']
  ], ex: 'Managerial (administrative) controls govern and plan security: policies, risk assessments, and vendor reviews.' },
  { d: 2, q: 'After ransomware encrypted a file server, the team restored the data from last night’s backup. What type of control was the backup restoration?', o: [
    ['Detective', 'Detection happened earlier; restoration fixes the damage.'],
    ['Corrective', 'Restoring from backup limits damage and returns systems to normal after an incident.', true],
    ['Deterrent', 'Backups don’t discourage attackers.'],
    ['Directive', 'Directive controls instruct behavior.']
  ], ex: 'Corrective controls act after an incident to restore operations: backups, reimaging, patching an exploited flaw.' },
  { d: 2, q: 'Which TWO are examples of operational controls?', o: [
    ['Security awareness training sessions', 'Training delivered by people as an ongoing activity is operational.', true],
    ['Daily review of firewall logs by an analyst', 'A person performing a routine security process is operational.', true],
    ['Full-disk encryption on laptops', 'Encryption is enforced by technology, which makes it technical.'],
    ['An information security policy approved by the board', 'Policies are managerial.']
  ], ex: 'Operational controls are performed primarily by people as part of day-to-day operations. Technology-enforced measures are technical; governance documents are managerial.' },
  { d: 2, q: 'An acceptable use policy that tells employees not to install unapproved software is BEST described as which control type?', o: [
    ['Directive', 'The policy instructs people what they should or should not do.', true],
    ['Preventive', 'A policy alone doesn’t technically stop installation; application allow listing would.'],
    ['Detective', 'The policy doesn’t identify violations.'],
    ['Corrective', 'It doesn’t repair anything.']
  ], ex: 'Directive controls direct behavior through policies, procedures and instructions. They depend on people complying.' },
  { d: 3, s: 'A warehouse installs hidden cameras that record to a server reviewed only after inventory goes missing.', q: 'Which control type do the cameras primarily provide in this scenario?', o: [
    ['Deterrent', 'Hidden cameras can’t discourage anyone who doesn’t know they exist.'],
    ['Detective', 'They record evidence that is reviewed to identify what happened.', true],
    ['Preventive', 'Cameras don’t physically stop theft.'],
    ['Compensating', 'Nothing indicates they replace an infeasible control.']
  ], ex: 'The same device can serve different types. Visible cameras deter and detect; hidden cameras only detect.' },
  { d: 2, q: 'A company replaces password-only VPN access with password plus hardware token authentication. Which category and type describe the token requirement?', o: [
    ['Technical, preventive', 'MFA is enforced by technology and stops unauthorized access attempts.', true],
    ['Managerial, directive', 'It is enforced by the system, not just instructed.'],
    ['Physical, deterrent', 'A token isn’t a physical barrier to a facility.'],
    ['Operational, detective', 'It doesn’t detect or record incidents.']
  ], ex: 'MFA is a technical control that prevents logins without the second factor.' },
  { d: 3, q: 'Which control would be classified as BOTH physical and preventive?', o: [
    ['Motion-activated alarm', 'An alarm detects; it doesn’t stop entry.'],
    ['Access control vestibule', 'A vestibule physically prevents tailgating into a secure area.', true],
    ['Visitor log book', 'A log records entries (detective/operational).'],
    ['Security policy on visitor escorts', 'Policies are managerial/directive.']
  ], ex: 'Physical controls exist in the real world; preventive controls stop the event. An access control vestibule does both.' }
]);

SEC.addQuestions('1.2', [
  { d: 1, q: 'Which part of the CIA triad is MOST directly protected by hashing a file and comparing the hash later?', o: [
    ['Confidentiality', 'Hashing doesn’t hide content.'],
    ['Integrity', 'Comparing hashes reveals whether the file changed.', true],
    ['Availability', 'Hashing doesn’t keep systems running.'],
    ['Authorization', 'Authorization isn’t part of the CIA triad.']
  ], ex: 'Hashes are integrity checks: any modification produces a different hash value.' },
  { d: 1, q: 'A DDoS attack takes an online store offline for six hours. Which security goal was affected?', o: [
    ['Availability', 'Customers couldn’t reach the service, which is an availability failure.', true],
    ['Integrity', 'No data was altered.'],
    ['Confidentiality', 'No data was disclosed.'],
    ['Non-repudiation', 'This concerns proof of actions.']
  ], ex: 'Denial-of-service attacks target availability.' },
  { d: 2, q: 'An administrator can show that a contract was approved by a specific manager, and the manager cannot plausibly deny it. Which concept is demonstrated?', o: [
    ['Non-repudiation', 'Proof that ties an action to a person so they can’t deny it is non-repudiation.', true],
    ['Availability', 'Availability concerns access to systems.'],
    ['Authorization', 'Authorization grants permissions; it doesn’t prove who acted.'],
    ['Obfuscation', 'Obfuscation hides meaning.']
  ], ex: 'Non-repudiation is usually achieved with digital signatures, whose private keys only the signer holds.' },
  { d: 2, q: 'A user enters a username and password, and the system then checks which folders the user may open. Which TWO AAA functions occurred?', o: [
    ['Authentication', 'Verifying the password proves identity.', true],
    ['Authorization', 'Determining which folders the user can open is authorization.', true],
    ['Accounting', 'Nothing in the scenario records the user’s activity.'],
    ['Attestation', 'Attestation is a formal statement about controls, not part of AAA.']
  ], ex: 'Authentication proves identity, authorization decides access, and accounting records actions.' },
  { d: 2, q: 'In a Zero Trust architecture, which component makes the access decision based on policy, identity and device signals?', o: [
    ['Policy Enforcement Point', 'The PEP enforces decisions but doesn’t make them.'],
    ['Policy Engine', 'The Policy Engine evaluates policy and decides whether to grant access.', true],
    ['Implicit trust zone', 'This is the protected area behind the PEP.'],
    ['Subject', 'The subject is the user/device requesting access.']
  ], ex: 'Control plane: the Policy Engine decides and the Policy Administrator communicates. Data plane: the Policy Enforcement Point enforces.' },
  { d: 2, s: 'A company adopts Zero Trust. A user on the office LAN requests access to the HR system.', q: 'How should the request be treated?', o: [
    ['Allowed automatically because it comes from the internal network', 'Zero Trust rejects implicit trust based on network location.'],
    ['Verified explicitly using identity, device posture and context before access', 'Every request is authenticated and authorized regardless of location.', true],
    ['Blocked, because Zero Trust denies all internal traffic', 'Zero Trust verifies; it doesn’t block everything.'],
    ['Allowed if the user logged in to Windows that morning', 'Prior sessions don’t replace per-request verification.']
  ], ex: '“Never trust, always verify.” Location inside the perimeter grants no trust by itself.' },
  { d: 1, q: 'Which physical control is specifically designed to prevent tailgating into a secure area?', o: [
    ['Bollards', 'Bollards stop vehicles.'],
    ['Access control vestibule', 'Interlocking doors allow only one person through at a time.', true],
    ['Fencing', 'Fencing marks and protects a perimeter but doesn’t stop someone following through a door.'],
    ['Lighting', 'Lighting deters and aids detection.']
  ], ex: 'An access control vestibule (mantrap) holds a person between two doors, defeating tailgating and piggybacking.' },
  { d: 2, q: 'A security team places a document named “Executive_Salaries_2025.xlsx” on a file share. No one should ever open it, and any access triggers an alert. What is it?', o: [
    ['Honeypot', 'A honeypot is a decoy system.'],
    ['Honeyfile', 'A decoy file that alerts when accessed is a honeyfile.', true],
    ['Honeynet', 'A honeynet is a network of decoy systems.'],
    ['DLP policy', 'DLP inspects real data leaving the organization.']
  ], ex: 'Deception technologies (honeypots, honeynets, honeyfiles, honeytokens) produce high-fidelity alerts because legitimate users have no reason to touch them.' },
  { d: 2, q: 'An organization compares its current controls against the requirements of a security framework to identify missing controls. What is this activity called?', o: [
    ['Penetration test', 'A pentest exploits weaknesses; it doesn’t compare against a framework.'],
    ['Gap analysis', 'Comparing current state to a desired state to find gaps is gap analysis.', true],
    ['Business impact analysis', 'A BIA assesses downtime impact on business functions.'],
    ['Tabletop exercise', 'A tabletop rehearses a response scenario.']
  ], ex: 'Gap analysis measures the distance between where you are and where you need to be, producing a remediation roadmap.' },
  { d: 3, q: 'Which sensor detects an intruder by measuring changes in reflected high-frequency radio waves?', o: [
    ['Infrared', 'Infrared sensors detect heat signatures.'],
    ['Pressure', 'Pressure sensors detect weight.'],
    ['Microwave', 'Microwave sensors emit radio waves and detect changes in the reflection caused by motion.', true],
    ['Ultrasonic', 'Ultrasonic sensors use sound waves, not radio waves.']
  ], ex: 'Infrared = heat, pressure = weight, microwave = reflected radio waves, ultrasonic = reflected sound.' },
  { d: 3, q: 'Why do alerts generated by honeytokens typically have a very low false-positive rate?', o: [
    ['They use machine learning to filter noise', 'Their accuracy comes from their design, not ML.'],
    ['Legitimate users and systems have no reason to use them, so any use is suspicious', 'Because the tokens have no business purpose, any use indicates compromise.', true],
    ['They are encrypted', 'Encryption doesn’t affect alert accuracy.'],
    ['They block attackers automatically', 'Honeytokens detect; they don’t block.']
  ], ex: 'Decoys produce high-fidelity alerts because normal activity never touches them.' },
  { d: 2, q: 'Which practice undermines non-repudiation the MOST?', o: [
    ['Requiring digital signatures on approvals', 'Signatures support non-repudiation.'],
    ['Multiple administrators sharing one admin account', 'With a shared account, actions can’t be tied to an individual.', true],
    ['Logging all administrative actions', 'Logging supports accountability.'],
    ['Using individual MFA tokens', 'Individual credentials support accountability.']
  ], ex: 'Non-repudiation and accounting both depend on unique identities. Shared accounts break the link between action and person.' }
]);

SEC.addQuestions('1.3', [
  { d: 1, q: 'Which document describes how to reverse a change if it causes problems?', o: [
    ['Backout plan', 'A backout (rollback) plan defines how to restore the previous state.', true],
    ['Impact analysis', 'This predicts effects; it doesn’t describe reversal.'],
    ['Acceptable use policy', 'An AUP governs user behavior.'],
    ['Risk register', 'A risk register tracks risks.']
  ], ex: 'Every significant change should have a tested backout plan before it is approved.' },
  { d: 1, q: 'Why are changes usually scheduled during a maintenance window?', o: [
    ['To minimize business disruption if downtime or problems occur', 'Maintenance windows are low-impact times agreed with the business.', true],
    ['Because security tools are disabled during that time', 'Security tools should not be disabled.'],
    ['To avoid documentation requirements', 'Documentation is still required.'],
    ['So that approval is not needed', 'Approval is still required.']
  ], ex: 'A maintenance window limits impact on users and gives time to roll back if needed.' },
  { d: 2, q: 'A team wants to deploy a new monitoring agent. Which step should identify that the agent requires a reboot of every database server?', o: [
    ['Impact analysis', 'Impact analysis determines effects such as restarts and downtime.', true],
    ['Backout plan', 'This covers reversal, not prediction of effects.'],
    ['Lessons learned', 'This occurs after incidents.'],
    ['Attestation', 'Attestation confirms controls.']
  ], ex: 'Impact analysis considers downtime, service and application restarts, dependencies and security implications before approval.' },
  { d: 2, s: 'After a new endpoint security tool is deployed, a line-of-business application stops launching on all workstations.', q: 'Which technical change-management consideration was MOST likely overlooked?', o: [
    ['Updating the application allow list / exclusions', 'New security tools often block apps that aren’t on allow lists or excluded.', true],
    ['The maintenance window', 'Timing wouldn’t cause the app to be blocked.'],
    ['Stakeholder sign-off', 'Missing sign-off wouldn’t technically block an app.'],
    ['Version control', 'Version control tracks changes; it doesn’t cause blocks.']
  ], ex: 'Changes can affect allow/deny lists, causing legitimate software to be blocked. Testing would have revealed this.' },
  { d: 2, q: 'Which TWO are business-process elements of change management?', o: [
    ['Ownership', 'Each change needs an accountable owner.', true],
    ['Stakeholder identification', 'Affected stakeholders must be consulted or informed.', true],
    ['Legacy applications', 'This is a technical implication, not a business-process element.'],
    ['Service restarts', 'This is a technical implication.']
  ], ex: 'Business processes include approval, ownership, stakeholders, impact analysis, test results, backout plan, maintenance window and SOPs. Technical implications include allow/deny lists, restarts, downtime, legacy apps and dependencies.' },
  { d: 2, q: 'Updating network diagrams after a firewall replacement is an example of which change-management practice?', o: [
    ['Documentation updates', 'Keeping diagrams, policies and procedures current is part of closing a change.', true],
    ['Impact analysis', 'That happens before the change.'],
    ['Dependency mapping only', 'Dependencies are considered beforehand; the diagram update is documentation.'],
    ['Backout planning', 'This is about reversing a change.']
  ], ex: 'Outdated documentation leads to mistakes during troubleshooting and incident response.' },
  { d: 3, s: 'A web team renews an expiring TLS certificate on a load balancer. Shortly after, a partner’s API integration fails because it had pinned the old certificate.', q: 'Which change-management element would MOST likely have prevented this?', o: [
    ['Identifying dependencies during impact analysis', 'Mapping who depends on the certificate would have revealed the partner pinning it.', true],
    ['Using a longer maintenance window', 'More time wouldn’t reveal the dependency.'],
    ['Restricting the change to authorized personnel', 'The change was authorized; the issue is an unknown dependency.'],
    ['Creating an SOP for certificate renewal', 'An SOP helps consistency but wouldn’t by itself identify this partner dependency.']
  ], ex: 'Dependencies are a key technical implication. Something as small as a certificate can break systems that rely on it.' },
  { d: 1, q: 'Which group typically reviews and approves proposed changes in an organization?', o: [
    ['Change Advisory Board (CAB)', 'The CAB evaluates risk and approves or rejects changes.', true],
    ['Red team', 'A red team performs offensive testing.'],
    ['Incident response team', 'IR teams handle incidents.'],
    ['Audit committee', 'Audit committees oversee audits at the board level.']
  ], ex: 'A CAB brings together technical and business stakeholders to evaluate changes.' },
  { d: 3, q: 'Why is version control important for security when managing infrastructure-as-code templates?', o: [
    ['It provides a history of who changed what, enabling review and rollback', 'Version history supports accountability, peer review and quick reversion.', true],
    ['It encrypts the templates automatically', 'Version control doesn’t encrypt by default.'],
    ['It eliminates the need for testing', 'Testing is still required.'],
    ['It prevents all misconfigurations', 'Bad changes can still be committed; version control helps detect and revert them.']
  ], ex: 'Version control creates an audit trail and makes backout straightforward.' }
]);

SEC.addQuestions('1.4', [
  { d: 1, q: 'Which algorithm is a symmetric block cipher commonly used to encrypt data at rest?', o: [
    ['RSA', 'RSA is asymmetric.'],
    ['AES', 'AES is the standard symmetric cipher for bulk data.', true],
    ['SHA-256', 'SHA-256 is a hash function, not encryption.'],
    ['ECDHE', 'ECDHE is a key exchange method.']
  ], ex: 'Symmetric ciphers like AES are fast and suit large amounts of data.' },
  { d: 2, q: 'Bob wants to prove to Alice that a message came from him and wasn’t modified. What should he do?', o: [
    ['Encrypt it with Alice’s public key', 'This provides confidentiality, not proof of origin.'],
    ['Sign a hash of the message with his private key', 'A digital signature with Bob’s private key proves origin and integrity.', true],
    ['Hash the message without a key', 'Anyone can recompute a plain hash after altering the message.'],
    ['Encrypt it with a shared symmetric key', 'Either key holder could have created it, so it doesn’t prove Bob sent it.']
  ], ex: 'Signatures: sender’s private key signs, sender’s public key verifies, giving integrity, authentication and non-repudiation.' },
  { d: 2, q: 'Which TWO techniques make stolen password hashes harder to crack?', o: [
    ['Salting each password with a unique random value', 'Salts defeat rainbow tables and make each hash unique.', true],
    ['Using a key-stretching algorithm such as bcrypt or PBKDF2', 'Key stretching slows every guess dramatically.', true],
    ['Encoding the hashes in Base64', 'Encoding is trivially reversible and adds no security.'],
    ['Switching from SHA-256 to MD5', 'MD5 is weaker and faster to crack.']
  ], ex: 'Good password storage is salted and slow: bcrypt, scrypt, PBKDF2 or Argon2.' },
  { d: 2, q: 'A browser needs to confirm a website’s certificate hasn’t been revoked without downloading a large list. Which mechanism is designed for this?', o: [
    ['CRL', 'A CRL is a downloadable list of revoked certificates.'],
    ['OCSP', 'OCSP queries the status of a single certificate in real time.', true],
    ['CSR', 'A CSR requests a certificate.'],
    ['Key escrow', 'Escrow stores keys for recovery.']
  ], ex: 'OCSP (and OCSP stapling) gives fast per-certificate status checks; CRLs require downloading a list.' },
  { d: 1, q: 'What does an organization send to a certificate authority to obtain a new certificate?', o: [
    ['Its private key', 'The private key must never leave the owner.'],
    ['A certificate signing request (CSR)', 'The CSR contains the public key and identity information for the CA to sign.', true],
    ['A CRL', 'CRLs list revoked certificates.'],
    ['An OCSP response', 'OCSP responses come from the CA’s responder.']
  ], ex: 'Generate the key pair locally, keep the private key, and submit the CSR.' },
  { d: 2, q: 'Which hardware component built into a laptop’s motherboard stores keys used for full-disk encryption and supports measured boot?', o: [
    ['HSM', 'An HSM is a separate enterprise appliance or card.'],
    ['TPM', 'A Trusted Platform Module is the onboard chip used for disk encryption keys and boot integrity.', true],
    ['KMS', 'A KMS is a key management service, usually centralized.'],
    ['SED', 'A self-encrypting drive encrypts itself but isn’t the motherboard key store.']
  ], ex: 'TPM: per-device chip. HSM: dedicated high-assurance key appliance. KMS: centralized key lifecycle service.' },
  { d: 2, q: 'A payment processor replaces card numbers in its order database with random values. Only a secured vault can map them back to real numbers. What is this technique?', o: [
    ['Masking', 'Masking hides part of a value for display and usually can’t be reversed.'],
    ['Tokenization', 'Random surrogate values mapped in a secure vault are tokens.', true],
    ['Hashing', 'Hashes can’t be mapped back to the original by a vault lookup in normal use.'],
    ['Steganography', 'Steganography hides data inside other data.']
  ], ex: 'Tokenization removes sensitive data from most systems, which shrinks the scope of compliance requirements like PCI DSS.' },
  { d: 2, q: 'Why does TLS use asymmetric cryptography during the handshake but symmetric encryption for the session data?', o: [
    ['Asymmetric cryptography securely establishes a shared key; symmetric encryption is much faster for bulk data', 'This hybrid design combines secure key exchange with efficient encryption.', true],
    ['Symmetric encryption is more secure than asymmetric for authentication', 'Authentication in TLS relies on certificates and asymmetric keys.'],
    ['Asymmetric encryption can’t encrypt more than one packet', 'It can, but it is slow.'],
    ['Symmetric keys are longer, which makes the handshake slower', 'Symmetric keys are typically shorter, and this isn’t the reason.']
  ], ex: 'Hybrid cryptosystems solve symmetric key distribution with asymmetric methods, then use symmetric ciphers for speed.' },
  { d: 3, s: 'A company hosts dozens of subdomains (app1.example.com, app2.example.com, …) and frequently adds new ones. Administrators want to minimize certificate management overhead.', q: 'Which certificate type is MOST appropriate?', o: [
    ['Self-signed certificate per subdomain', 'Not trusted by browsers and adds overhead.'],
    ['Wildcard certificate (*.example.com)', 'A wildcard covers every first-level subdomain, including new ones.', true],
    ['Extended Validation certificate for example.com only', 'It wouldn’t cover the subdomains.'],
    ['Code-signing certificate', 'Code-signing certificates sign software.']
  ], ex: 'Wildcards simplify management but increase impact if the private key is stolen, so protect the key carefully.' },
  { d: 2, q: 'A company wants to be able to recover encrypted data if an employee loses their private key or leaves. Which practice supports this?', o: [
    ['Key escrow', 'A trusted party securely stores copies of keys for authorized recovery.', true],
    ['Certificate pinning', 'Pinning restricts accepted certificates.'],
    ['Perfect forward secrecy', 'PFS protects past sessions; it doesn’t support recovery.'],
    ['Key stretching', 'Key stretching strengthens passwords.']
  ], ex: 'Key escrow (or key recovery agents) prevents permanent data loss when keys are lost.' },
  { d: 3, q: 'Which attack exploits probability to find two different inputs that produce the same hash value faster than brute force?', o: [
    ['Downgrade attack', 'Downgrade forces weaker protocols.'],
    ['Birthday attack', 'The birthday paradox makes collisions much more likely than intuition suggests.', true],
    ['Replay attack', 'Replay reuses captured data.'],
    ['Pass-the-hash', 'Pass-the-hash reuses credential hashes.']
  ], ex: 'Birthday attacks find collisions. Longer hash outputs (SHA-256 and above) resist them.' },
  { d: 2, q: 'Which technique hides a message inside the pixel data of an image so that observers don’t know a message exists?', o: [
    ['Tokenization', 'Tokenization replaces values with tokens.'],
    ['Steganography', 'Steganography conceals the existence of data inside other media.', true],
    ['Data masking', 'Masking hides parts of visible data.'],
    ['Salting', 'Salting adds randomness to hashes.']
  ], ex: 'Steganography is obfuscation: it hides that data exists rather than making it unreadable.' },
  { d: 3, q: 'Which property of a blockchain makes altering a past transaction easy to detect?', o: [
    ['Each block contains the hash of the previous block', 'Changing any block breaks the hash chain for every later block.', true],
    ['Transactions are encrypted with AES', 'Public ledgers are usually not encrypted.'],
    ['A single central authority validates changes', 'Blockchains are decentralized.'],
    ['Blocks are deleted after 30 days', 'Ledgers are append-only and persistent.']
  ], ex: 'Hash chaining plus distributed copies make blockchains tamper-evident, which protects integrity.' },
  { d: 3, s: 'A database stores customer records. Auditors require that Social Security numbers be unreadable even to DBAs who can query the tables, while other columns remain usable.', q: 'Which encryption approach BEST meets this requirement?', o: [
    ['Full-disk encryption on the database server', 'FDE protects against stolen disks but data is decrypted for anyone querying the running database.'],
    ['Column/record-level encryption of the SSN field', 'Encrypting the specific field keeps it protected inside the database with separate key control.', true],
    ['TLS between the application and the database', 'This protects data in transit only.'],
    ['Hashing the entire table', 'Hashing would make all columns unusable.']
  ], ex: 'Granular (database/record/column) encryption protects specific sensitive fields from privileged users who can read the rest of the database.' }
]);
