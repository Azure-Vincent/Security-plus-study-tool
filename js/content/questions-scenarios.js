/* Additional scenario-based questions across domains — original content. Appended IDs continue each objective's numbering. */
SEC.addQuestions('1.2', [
  { d: 3, s: 'A hospital moves to Zero Trust. A nurse’s tablet passes MFA, but the device posture check shows it is missing three months of OS patches. The nurse requests access to the patient records system.', q: 'What is the MOST appropriate Zero Trust outcome?', o: [
    ['Grant full access because MFA succeeded', 'Zero Trust evaluates device health as well as identity.'],
    ['Deny or restrict access (e.g., send to remediation) until the device meets posture policy', 'Adaptive policy uses identity and device signals, and an unhealthy device fails policy.', true],
    ['Grant access because the tablet is on the hospital Wi-Fi', 'Network location confers no trust in Zero Trust.'],
    ['Disable the nurse’s account permanently', 'Excessive; the user isn’t the problem.']
  ], ex: 'Policy-driven, adaptive access considers user, device and context on every request.' }
]);

SEC.addQuestions('1.4', [
  { d: 3, s: 'A developer stores API secrets in application config files on dozens of cloud VMs. Auditors require centralized key rotation, access policies and an audit trail of every use of the keys.', q: 'Which solution BEST meets the requirement?', o: [
    ['A key management system (KMS) / secrets manager', 'Centralizes storage, rotation, access policy and audit logging of keys.', true],
    ['Encoding the secrets in Base64', 'Encoding is not protection.'],
    ['A TPM on each VM', 'TPMs protect device-bound keys but don’t centralize rotation and auditing across many systems.'],
    ['Steganography', 'Hiding secrets in images doesn’t provide management or auditing.']
  ], ex: 'A KMS (often backed by HSMs) provides lifecycle management and auditing for keys at scale.' }
]);

SEC.addQuestions('2.2', [
  { d: 2, s: 'Employees at a law firm receive a convincing email that appears to come from the firm’s document-signing provider, using the provider’s logo and a domain that differs by one letter, asking them to “re-authenticate”.', q: 'Which TWO techniques are combined in this attack?', o: [
    ['Brand impersonation', 'Copying a trusted provider’s look and messaging.', true],
    ['Typosquatting', 'Using a look-alike domain with a one-letter difference.', true],
    ['Watering hole', 'No legitimate site was compromised.'],
    ['Vishing', 'This is email, not voice.']
  ], ex: 'Phishing campaigns often layer brand impersonation, look-alike domains and urgency.' }
]);

SEC.addQuestions('2.4', [
  { d: 3, s: 'Over a weekend, 40 workstations on one floor began making SMB connections to every IP in the 10.0.0.0/16 range. Each infected workstation then started scanning too. No users were logged in.', q: 'Which malware type BEST explains this?', o: [
    ['Worm', 'Rapid self-propagation with scanning and no user action indicates a worm.', true],
    ['Trojan', 'Trojans need users to install them and don’t self-spread.'],
    ['Logic bomb', 'Logic bombs execute a payload on a trigger, not network spreading.'],
    ['Keylogger', 'Keyloggers record keystrokes.']
  ], ex: 'Contain worms quickly through segmentation, blocking the exploited port and patching the vulnerability.' },
  { d: 2, s: 'A user reports that her online banking session showed an unexpected certificate warning on the coffee shop Wi-Fi. Another user nearby saw the same warning. The coffee shop has two networks with the same SSID.', q: 'Which attack is MOST likely?', o: [
    ['Evil twin access point enabling an on-path attack', 'A rogue AP impersonating the legitimate SSID lets attackers intercept traffic, causing certificate warnings.', true],
    ['SQL injection', 'Unrelated to wireless interception.'],
    ['Password spraying', 'No credential guessing is described.'],
    ['Logic bomb', 'Unrelated.']
  ], ex: 'Users should never click through certificate warnings and should use a VPN on public Wi-Fi.' }
]);

SEC.addQuestions('3.2', [
  { d: 3, s: 'A company needs contractors to administer three Linux servers in a restricted zone. Requirements: MFA, session recording, no direct SSH from contractor laptops to the servers, and minimal firewall openings.', q: 'Which design BEST meets all requirements?', o: [
    ['Contractors connect via VPN to a hardened jump server with MFA and session recording; servers accept SSH only from the jump server', 'A single controlled, monitored entry point satisfies every requirement.', true],
    ['Open SSH on the servers to the internet with strong passwords', 'Violates direct-access and exposure requirements.'],
    ['Give contractors domain admin accounts', 'Excessive privilege; no recording.'],
    ['Place the servers in the DMZ', 'Increases exposure without meeting requirements.']
  ], ex: 'Jump servers (bastion hosts) centralize privileged access and its auditing.' }
]);

SEC.addQuestions('3.4', [
  { d: 2, s: 'Ransomware encrypted a company’s file servers and also the backup repository, which was mounted as a network share on the same domain.', q: 'Which backup design change would have MOST likely prevented loss of the backups?', o: [
    ['Keep an offline or immutable backup copy isolated from the production domain', 'Isolated or immutable backups can’t be encrypted by malware with domain access.', true],
    ['Back up more often to the same share', 'The share would still be encrypted.'],
    ['Disable backup encryption', 'Encryption isn’t the issue.'],
    ['Use RAID 5 on the file servers', 'RAID isn’t a backup.']
  ], ex: '3-2-1 with an offline/immutable copy is a key ransomware resilience control.' }
]);

SEC.addQuestions('4.3', [
  { d: 3, s: 'A scan of 2,000 servers produced 14,000 findings. The team can patch about 300 per week. Some findings are CVSS 9.8 on isolated test servers, others CVSS 7.2 on internet-facing payment servers with public exploit code.', q: 'How should the team prioritize remediation?', o: [
    ['Rank by risk: combine CVSS with exposure, exploit availability, asset criticality and compensating controls', 'Context-aware prioritization fixes the most dangerous issues first.', true],
    ['Strictly by CVSS base score, highest first', 'Ignores exposure and business impact.'],
    ['Alphabetically by server name', 'Arbitrary.'],
    ['Ignore findings below CVSS 9.0', 'Leaves exploitable high-risk issues open.']
  ], ex: 'Environmental and organizational factors adjust priority beyond the base score.' }
]);

SEC.addQuestions('4.5', [
  { d: 3, s: 'Attackers keep spoofing the company’s domain in invoice emails to customers. The domain publishes an SPF record, but receiving servers still deliver the spoofed messages to inboxes.', q: 'What should the company add to instruct receivers to reject messages that fail authentication?', o: [
    ['A DMARC record with p=reject (after monitoring with p=none)', 'DMARC enforces a policy for failing messages and provides reports.', true],
    ['A second SPF record', 'Multiple SPF records are invalid and don’t add enforcement.'],
    ['An MX record pointing to a backup server', 'Controls inbound routing, not spoofing.'],
    ['A self-signed TLS certificate', 'Unrelated to sender authentication.']
  ], ex: 'Roll DMARC out gradually: none → quarantine → reject, using reports to find legitimate senders.' }
]);

SEC.addQuestions('4.6', [
  { d: 3, s: 'An administrator account was compromised and used to create new accounts. Investigation shows the admin used the same privileged account for email and web browsing, and it had permanent domain admin rights.', q: 'Which TWO changes would MOST reduce this risk?', o: [
    ['Separate privileged accounts from daily-use accounts', 'Admins should browse and email with standard accounts.', true],
    ['Use just-in-time privileged access through a PAM solution', 'Removes standing privileges that attackers can abuse.', true],
    ['Increase the password expiration interval', 'Doesn’t address privilege exposure.'],
    ['Disable audit logging on domain controllers', 'Reduces visibility.']
  ], ex: 'PAM practices (JIT, vaulting, separate admin accounts) shrink the window and scope of privileged compromise.' }
]);

SEC.addQuestions('4.8', [
  { d: 3, s: 'During a breach investigation, an analyst copies a suspect’s laptop drive to an external disk, analyzes the original drive directly, and doesn’t record who handled the laptop. The case later goes to court.', q: 'What is the MOST significant problem with the evidence?', o: [
    ['Analyzing the original without a verified image and lacking chain of custody may make the evidence inadmissible', 'Integrity (hashes, write blocking) and documented handling are essential.', true],
    ['The analyst should have used a larger external disk', 'Capacity is irrelevant.'],
    ['The laptop should have been reimaged first', 'This destroys evidence.'],
    ['Nothing; any copy is acceptable in court', 'Courts require demonstrable integrity.']
  ], ex: 'Use write blockers, hash originals and images, work on copies, and maintain chain of custody.' }
]);

SEC.addQuestions('4.9', [
  { d: 3, s: 'NetFlow shows a finance workstation sending 120 bytes to the same external IP every 60 seconds, around the clock, for three weeks. No user is logged in overnight.', q: 'What does this pattern MOST likely indicate?', o: [
    ['Malware beaconing to a command-and-control server', 'Regular, small, periodic outbound connections are classic beaconing.', true],
    ['A user streaming video', 'Streaming is high-volume and user-driven.'],
    ['Normal Windows updates', 'Updates aren’t tiny fixed-interval connections to one IP for weeks.'],
    ['A DDoS attack against the workstation', 'Traffic is outbound and tiny.']
  ], ex: 'NetFlow is effective for spotting beaconing without full packet capture.' }
]);

SEC.addQuestions('5.2', [
  { d: 3, s: 'A risk register entry shows “Unpatched VPN appliance” rated High, with owner “IT”, and treatment “TBD” for nine months. The KRI for critical vulnerabilities older than 30 days has doubled.', q: 'What is the BEST improvement to the risk management process?', o: [
    ['Assign a named individual risk owner with a treatment plan and deadline, and escalate because the KRI exceeded the threshold', 'Risks need accountable owners and action when thresholds are breached.', true],
    ['Lower the risk rating to Medium', 'Changing the rating doesn’t reduce risk.'],
    ['Remove the KRI', 'Hides useful warning signals.'],
    ['Wait for the annual assessment', 'The KRI already signals urgency.']
  ], ex: 'Effective registers have specific owners, thresholds and tracked treatments.' }
]);

SEC.addQuestions('5.3', [
  { d: 2, s: 'A SaaS vendor that stores your customer data refuses to share any security documentation and has no independent audit reports. Their contract allows them to subcontract to unnamed providers.', q: 'What is the BEST course of action?', o: [
    ['Treat this as high third-party risk: require evidence (e.g., SOC 2), a right-to-audit clause and subcontractor disclosure, or choose another vendor', 'Due diligence requires evidence and contractual protections.', true],
    ['Sign immediately because SaaS vendors are always secure', 'Unfounded assumption.'],
    ['Accept a verbal assurance from sales', 'Not evidence.'],
    ['Ask the vendor to sign an MOU instead of a contract', 'MOUs are non-binding.']
  ], ex: 'Vendor assessment and contract terms are the main tools for managing third-party risk.' }
]);

SEC.addQuestions('5.6', [
  { d: 2, s: 'After a simulated phishing campaign, 18% of employees clicked the link but only 4% reported the email. Managers propose publicly naming everyone who clicked.', q: 'What is the BEST approach to improve outcomes?', o: [
    ['Provide immediate, constructive micro-training to clickers and make reporting easy and recognized', 'Positive reinforcement increases reporting; shaming discourages it.', true],
    ['Publicly name and shame everyone who clicked', 'Damages trust and reduces reporting.'],
    ['Stop running simulations', 'Removes a valuable training tool.'],
    ['Block all external email', 'Impractical.']
  ], ex: 'Measure both click and report rates; build a culture where reporting is rewarded.' }
]);
