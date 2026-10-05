/* Domain 4 question bank — original questions. */
SEC.addQuestions('4.1', [
  { d: 1, q: 'Which wireless security protocol uses Simultaneous Authentication of Equals (SAE) to resist offline dictionary attacks?', o: [
    ['WPA3-Personal', 'WPA3-Personal replaces the PSK handshake with SAE.', true],
    ['WEP', 'WEP is broken and obsolete.'],
    ['WPA2-PSK', 'WPA2-PSK is vulnerable to offline cracking of captured handshakes.'],
    ['WPS', 'WPS is a setup feature with known weaknesses.']
  ], ex: 'SAE requires live interaction for each guess, defeating offline cracking.' },
  { d: 2, q: 'Before installing wireless access points in a new office, IT walks the floor measuring signal strength and interference. What is this?', o: [
    ['Site survey', 'A site survey measures RF conditions to plan AP placement.', true],
    ['Penetration test', 'Tests exploitation, not coverage.'],
    ['War driving by attackers', 'Unauthorized discovery of networks.'],
    ['Packet capture', 'Captures traffic content.']
  ], ex: 'Site surveys produce heat maps that show coverage, dead zones and signal leakage.' },
  { d: 2, q: 'Which TWO settings should be applied to session cookies in a web application?', o: [
    ['Secure', 'Ensures the cookie is only sent over HTTPS.', true],
    ['HttpOnly', 'Prevents JavaScript from reading the cookie, which limits XSS session theft.', true],
    ['Domain=* (all domains)', 'Broad domain scope increases exposure.'],
    ['Expires in 10 years', 'Long-lived session cookies increase risk.']
  ], ex: 'Use Secure, HttpOnly and SameSite attributes with short lifetimes for session cookies.' },
  { d: 2, q: 'A company lets employees use their own phones for work email and needs to wipe only corporate data if a device is lost. What should it use?', o: [
    ['MDM with containerization for BYOD', 'Containerization separates corporate data so it can be selectively wiped.', true],
    ['Full device wipe on any incident', 'This would delete personal data on employee-owned devices.'],
    ['No controls, to respect privacy', 'Leaves corporate data unprotected.'],
    ['Disable email on phones', 'Doesn’t meet the business need.']
  ], ex: 'Selective wipe and work profiles balance BYOD privacy and security.' },
  { d: 2, q: 'Which deployment model provides a company-owned phone that employees may also use for personal purposes?', o: [
    ['COPE', 'Corporate-Owned, Personally Enabled.', true],
    ['BYOD', 'Employee-owned.'],
    ['CYOD', 'Company-owned from a choice list; personal use is not the defining feature.'],
    ['VDI', 'Not a device ownership model.']
  ], ex: 'COPE gives the company full control while allowing personal use.' },
  { d: 2, q: 'A software company wants customers to verify that downloaded installers came from the company and were not modified. What should it implement?', o: [
    ['Code signing', 'A digital signature on code proves publisher and integrity.', true],
    ['Sandboxing', 'Isolates execution but doesn’t prove origin.'],
    ['Input validation', 'Prevents injection; unrelated to distribution.'],
    ['Static code analysis', 'Finds bugs in source code.']
  ], ex: 'Code signing uses a certificate from a trusted CA; protect the signing key in an HSM.' },
  { d: 3, q: 'Which EAP method provides the strongest authentication for enterprise Wi-Fi by requiring certificates on both the client and the server?', o: [
    ['EAP-TLS', 'Mutual certificate authentication.', true],
    ['PEAP-MSCHAPv2', 'Uses a server certificate and a user password.'],
    ['EAP-MD5', 'Weak and obsolete.'],
    ['Open authentication', 'No authentication.']
  ], ex: 'EAP-TLS eliminates password-based attacks but requires PKI for client certificates.' },
  { d: 2, q: 'Which activity checks source code for vulnerabilities without running the application?', o: [
    ['Static code analysis', 'SAST examines code at rest.', true],
    ['Dynamic analysis', 'DAST tests the running app.'],
    ['Fuzzing', 'Fuzzing sends random input to a running program.'],
    ['Penetration testing', 'Tests running systems.']
  ], ex: 'SAST catches flaws early in development, so they are cheaper to fix.' },
  { d: 2, q: 'A security team opens unknown email attachments in an isolated virtual environment to observe their behavior. What is this technique?', o: [
    ['Sandboxing', 'Executing in isolation prevents harm to real systems.', true],
    ['Tokenization', 'Unrelated.'],
    ['Code signing', 'Unrelated.'],
    ['Geofencing', 'Unrelated.']
  ], ex: 'Sandboxes are also used by browsers and email gateways.' },
  { d: 1, q: 'What is the FIRST step in managing secure baselines?', o: [
    ['Establish the baseline (e.g., from benchmarks)', 'You must define a secure configuration before deploying or maintaining it.', true],
    ['Maintain the baseline', 'Maintenance comes later.'],
    ['Deploy the baseline', 'You need a baseline to deploy.'],
    ['Decommission the baseline', 'Not a lifecycle step.']
  ], ex: 'Establish → deploy → maintain.' },
  { d: 3, s: 'A network team is hardening newly installed core switches.', q: 'Which action is MOST appropriate?', o: [
    ['Disable Telnet and HTTP management, enable SSH/HTTPS, and use SNMPv3', 'Secure management protocols protect credentials and configurations.', true],
    ['Enable all ports for future flexibility', 'Unused ports should be disabled.'],
    ['Keep the default admin password for vendor support', 'Defaults must be changed.'],
    ['Use SNMPv1 with the “public” community', 'Insecure.']
  ], ex: 'Network device hardening: change defaults, secure management, disable unused ports and services, back up configs.' },
  { d: 3, q: 'Which input validation approach is MOST secure for a field expecting a five-digit postal code?', o: [
    ['Server-side allow-list validation accepting exactly five digits', 'Validating against the expected format on the server is robust.', true],
    ['Client-side JavaScript validation only', 'Client-side checks can be bypassed.'],
    ['A deny list blocking quotes and angle brackets', 'Deny lists miss variants.'],
    ['No validation, relying on the database', 'Leaves injection risk.']
  ], ex: 'Always validate on the server; prefer allow lists (known-good patterns).' }
]);

SEC.addQuestions('4.2', [
  { d: 1, q: 'Which sanitization method uses a strong magnetic field and is effective only on magnetic media?', o: [
    ['Degaussing', 'Degaussers erase magnetic media such as HDDs and tapes.', true],
    ['Cryptographic erase', 'Works by destroying encryption keys.'],
    ['Overwriting', 'Writes new data.'],
    ['Shredding', 'Physical destruction.']
  ], ex: 'Degaussing doesn’t work on SSDs or flash media.' },
  { d: 2, q: 'A disposal vendor shreds a company’s old hard drives. What should the company obtain to prove proper disposal?', o: [
    ['Certificate of destruction', 'Documentation proves the media was destroyed.', true],
    ['An NDA', 'Confidentiality agreement only.'],
    ['A purchase order', 'Unrelated to disposal proof.'],
    ['A CSR', 'Certificate signing request.']
  ], ex: 'Certification supports compliance and audit requirements.' },
  { d: 2, q: 'Why should every asset in the inventory have an assigned owner?', o: [
    ['So someone is accountable for its protection, classification and lifecycle decisions', 'Ownership establishes accountability.', true],
    ['To determine its IP address', 'IP addressing is separate.'],
    ['To avoid patching it', 'Ownership supports patching.'],
    ['Because owners perform all backups personally', 'Custodians often handle operations.']
  ], ex: 'Assignment/accounting includes ownership and classification.' },
  { d: 2, q: 'A security team runs regular network discovery scans and compares results to the CMDB. What is the PRIMARY purpose?', o: [
    ['Identify unknown or unmanaged assets', 'Enumeration finds assets missing from inventory.', true],
    ['Encrypt all devices', 'Unrelated.'],
    ['Sanitize old drives', 'Unrelated.'],
    ['Create user accounts', 'Unrelated.']
  ], ex: 'Unmanaged assets often go unpatched and become entry points.' },
  { d: 3, q: 'A company needs to dispose of SSDs containing confidential data and will not reuse them. Which method is MOST reliable?', o: [
    ['Physical destruction (shredding/pulverizing)', 'Destroying the media guarantees data can’t be recovered.', true],
    ['Degaussing', 'Ineffective on SSDs.'],
    ['Single-pass overwrite', 'Wear leveling can leave data in spare blocks.'],
    ['Quick format', 'Data remains recoverable.']
  ], ex: 'For SSDs: cryptographic erase if reusing; physical destruction if not.' },
  { d: 2, q: 'Which procurement practice reduces supply chain risk when acquiring network hardware?', o: [
    ['Purchasing from authorized resellers and verifying vendor support lifecycles', 'Reduces risk of counterfeit or tampered devices and EOL surprises.', true],
    ['Buying the cheapest units from online auctions', 'Higher risk of counterfeit/tampered equipment.'],
    ['Skipping security review to speed delivery', 'Increases risk.'],
    ['Allowing each department to buy independently without tracking', 'Creates shadow IT.']
  ], ex: 'Security belongs in the acquisition process.' },
  { d: 2, q: 'A company keeps customer support chat logs forever “just in case.” What is the MAIN risk?', o: [
    ['Over-retention increases breach impact and may violate retention/privacy requirements', 'Data kept longer than needed is a liability.', true],
    ['The logs will become encrypted automatically', 'Unrelated.'],
    ['Storage will become faster', 'Unrelated.'],
    ['There is no risk', 'There is legal and security risk.']
  ], ex: 'Retention policies should define minimum and maximum periods.' },
  { d: 3, q: 'Which TWO steps belong in decommissioning a server that stored sensitive data?', o: [
    ['Sanitize or destroy its storage media', 'Prevents data recovery.', true],
    ['Remove it from inventory, DNS and monitoring', 'Prevents forgotten records and stale access paths.', true],
    ['Leave it powered on in case it is needed', 'Forgotten systems become targets.'],
    ['Give the drives to employees for personal use', 'Leaks data.']
  ], ex: 'Decommissioning covers data sanitization and records and access cleanup.' },
  { d: 1, q: 'Which activity is part of asset monitoring/tracking?', o: [
    ['Maintaining an up-to-date inventory', 'Inventory tracking is monitoring.', true],
    ['Negotiating purchase price', 'Procurement.'],
    ['Shredding drives', 'Disposal.'],
    ['Writing an AUP', 'Governance.']
  ], ex: 'Inventory and enumeration are ongoing tracking activities.' }
]);

SEC.addQuestions('4.3', [
  { d: 1, q: 'What does a CVSS score represent?', o: [
    ['The severity of a vulnerability on a 0–10 scale', 'CVSS rates technical severity.', true],
    ['The unique identifier of a vulnerability', 'That is a CVE ID.'],
    ['The cost of a breach', 'Not CVSS.'],
    ['The number of affected hosts', 'Not CVSS.']
  ], ex: 'CVE identifies; CVSS scores severity.' },
  { d: 2, q: 'A vulnerability scanner fails to report a missing patch that is actually missing on a server. What is this?', o: [
    ['False negative', 'A real issue was missed.', true],
    ['False positive', 'A reported issue that isn’t real.'],
    ['True positive', 'A correctly reported issue.'],
    ['True negative', 'Correctly reporting no issue.']
  ], ex: 'False negatives are dangerous because they create false confidence. Credentialed scans reduce them.' },
  { d: 2, q: 'Which scan type logs into hosts to examine installed software and configurations, producing more accurate results?', o: [
    ['Credentialed scan', 'Authenticated scans see inside the system.', true],
    ['Non-credentialed scan', 'Only sees network-exposed information.'],
    ['Passive reconnaissance', 'Doesn’t touch systems.'],
    ['Ping sweep', 'Only discovers live hosts.']
  ], ex: 'Credentialed scans reduce false positives and false negatives.' },
  { d: 2, q: 'Which TWO factors should raise the remediation priority of a vulnerability above its CVSS base score alone?', o: [
    ['The affected system is internet-facing', 'Exposure increases likelihood of exploitation.', true],
    ['Exploit code is publicly available and being used in the wild', 'Active exploitation increases urgency.', true],
    ['The system is an isolated lab machine with no data', 'This lowers priority.'],
    ['A compensating control fully blocks the vulnerable service', 'This lowers priority.']
  ], ex: 'Contextual and environmental factors adjust priority.' },
  { d: 2, q: 'A vendor patch will not be available for 60 days. Which response reduces risk in the meantime?', o: [
    ['Apply compensating controls such as WAF rules or disabling the vulnerable feature', 'Compensating controls reduce exposure until the patch arrives.', true],
    ['Mark the finding as a false positive', 'It is a real vulnerability.'],
    ['Stop scanning the system', 'Hides the issue.'],
    ['Wait without changes', 'Leaves exposure unmitigated.']
  ], ex: 'Document an exception and track it until remediation.' },
  { d: 2, q: 'After patching a critical vulnerability, what should the team do to validate remediation?', o: [
    ['Rescan the affected systems', 'Rescanning confirms the vulnerability is gone.', true],
    ['Delete the original scan report', 'Reports provide audit evidence.'],
    ['Assume success', 'Validation is required.'],
    ['Increase the CVSS score', 'Scores aren’t changed by remediation.']
  ], ex: 'Validation includes rescanning, audits and verification.' },
  { d: 3, q: 'A company invites external researchers to find and report vulnerabilities in its web app in exchange for monetary rewards. What is this?', o: [
    ['Bug bounty program', 'Paying researchers for valid findings is a bug bounty.', true],
    ['Penetration test contract', 'A pentest is a defined engagement with specific testers.'],
    ['Threat feed', 'Provides intelligence.'],
    ['Vulnerability scan', 'Automated tool.']
  ], ex: 'Bug bounties and responsible disclosure programs supplement internal testing.' },
  { d: 2, q: 'Which practice tracks vulnerabilities in third-party libraries used by an application?', o: [
    ['Package monitoring / software composition analysis', 'Tracks dependencies for known CVEs.', true],
    ['Static analysis of first-party code only', 'Doesn’t cover libraries comprehensively.'],
    ['Physical penetration testing', 'Unrelated.'],
    ['Log aggregation', 'Unrelated.']
  ], ex: 'SBOMs and dependency scanning help address supply chain risk.' },
  { d: 3, s: 'A dark web monitoring service alerts that credentials for several employees appear in a recently posted data dump.', q: 'This is an example of which vulnerability identification source?', o: [
    ['Threat feed (dark web intelligence)', 'Dark web monitoring is a threat intelligence source.', true],
    ['Static analysis', 'Code analysis.'],
    ['System audit', 'Internal review of systems.'],
    ['Responsible disclosure', 'Researcher reporting to a vendor.']
  ], ex: 'Respond by forcing password resets and verifying MFA for affected accounts.' },
  { d: 3, q: 'Leadership decides to accept a medium-severity vulnerability on a legacy system for six months because remediation would halt production. What must accompany this decision?', o: [
    ['A documented exception/exemption with approval, compensating controls and a review date', 'Formal exceptions track accepted risk.', true],
    ['Removing the system from inventory', 'Hides the risk.'],
    ['Disabling all monitoring', 'Increases risk.'],
    ['Nothing; verbal approval is enough', 'Exceptions need documentation.']
  ], ex: 'Exceptions should be time-bound and reviewed.' },
  { d: 2, q: 'Which testing method analyzes a running web application by sending crafted requests to find vulnerabilities?', o: [
    ['Dynamic analysis (DAST)', 'DAST tests a running app from the outside.', true],
    ['Static analysis (SAST)', 'Analyzes code without running it.'],
    ['Code signing', 'Proves origin.'],
    ['Data masking', 'Unrelated.']
  ], ex: 'SAST and DAST are complementary.' }
]);

SEC.addQuestions('4.4', [
  { d: 1, q: 'Which tool collects logs from many sources, correlates events and generates security alerts?', o: [
    ['SIEM', 'Security Information and Event Management centralizes and correlates logs.', true],
    ['DLP', 'Prevents data leaks.'],
    ['UPS', 'Power supply.'],
    ['WAF', 'Protects web apps.']
  ], ex: 'SIEMs provide aggregation, correlation, alerting, dashboards and retention.' },
  { d: 2, q: 'Which data source records metadata such as source/destination IPs, ports and bytes transferred, without full packet contents?', o: [
    ['NetFlow', 'Flow records summarize conversations.', true],
    ['Full packet capture', 'Includes payloads.'],
    ['SNMP trap', 'Device event notification.'],
    ['Syslog from antivirus', 'Malware detection events.']
  ], ex: 'NetFlow is efficient for spotting anomalies and large transfers.' },
  { d: 2, q: 'A switch sends an unsolicited message to the network management system when a port goes down. What is this?', o: [
    ['SNMP trap', 'Traps are device-initiated alerts.', true],
    ['NetFlow record', 'Traffic metadata.'],
    ['SCAP benchmark', 'Configuration standard.'],
    ['DLP alert', 'Data leakage.']
  ], ex: 'Use SNMPv3 for secure monitoring.' },
  { d: 2, q: 'Which standard enables automated checking of system configurations against benchmarks and vulnerability definitions?', o: [
    ['SCAP', 'Security Content Automation Protocol standardizes automated compliance and vulnerability checks.', true],
    ['SAML', 'Federated authentication.'],
    ['SMTP', 'Email transfer.'],
    ['SNMP', 'Device management.']
  ], ex: 'SCAP-compatible tools evaluate systems against benchmarks such as CIS.' },
  { d: 2, q: 'Which TWO are benefits of agent-based monitoring compared with agentless monitoring?', o: [
    ['Deeper visibility into host processes and files', 'Agents see local activity in detail.', true],
    ['Monitoring continues when laptops are off the corporate network', 'Agents report from anywhere.', true],
    ['No software to deploy or maintain', 'That is an agentless benefit.'],
    ['No impact on endpoint resources', 'Agents use some resources.']
  ], ex: 'Agentless is easier to deploy; agents give depth and mobility.' },
  { d: 2, q: 'A DLP system detects an employee emailing a spreadsheet containing hundreds of card numbers to a personal address. What should a properly configured DLP do?', o: [
    ['Block or quarantine the message and alert security', 'DLP enforces data policies on outbound channels.', true],
    ['Encrypt the employee’s hard drive', 'Unrelated.'],
    ['Delete the employee’s account automatically', 'Overly drastic and not a DLP function.'],
    ['Increase the email size limit', 'Unrelated.']
  ], ex: 'DLP policies can block, quarantine, encrypt or alert based on content.' },
  { d: 3, q: 'After a SIEM alert is confirmed as a false positive caused by a legitimate admin script, what is the BEST next step?', o: [
    ['Tune the rule with a narrowly scoped exception for that script', 'Tuning reduces noise without disabling detection.', true],
    ['Disable the rule permanently', 'Could hide real attacks.'],
    ['Ignore future alerts of that type', 'Leads to alert fatigue and missed attacks.'],
    ['Delete the logs', 'Destroys evidence.']
  ], ex: 'Validation and tuning are part of the alert lifecycle.' },
  { d: 2, q: 'Which monitoring activity stores logs long-term to meet compliance requirements and support future investigations?', o: [
    ['Archiving', 'Archiving retains logs for required periods.', true],
    ['Quarantine', 'Isolates hosts or files.'],
    ['Alert tuning', 'Adjusts rules.'],
    ['Scanning', 'Finds vulnerabilities.']
  ], ex: 'Retention periods come from policy and regulations.' },
  { d: 3, s: 'An EDR alert shows ransomware-like behavior on a laptop. The SOC playbook says to prevent spread while preserving the device for analysis.', q: 'Which alert response action fits?', o: [
    ['Quarantine/isolate the endpoint via EDR', 'Network isolation contains the threat while preserving evidence.', true],
    ['Reimage immediately', 'Destroys forensic evidence.'],
    ['Shut down the SIEM', 'Removes visibility.'],
    ['Ask the user to keep working', 'Allows spread.']
  ], ex: 'Quarantine is a core alert response and remediation action.' },
  { d: 1, q: 'What is the purpose of log aggregation?', o: [
    ['Collecting logs from many systems into one place for analysis and correlation', 'Centralization enables correlation and retention.', true],
    ['Deleting old logs', 'That is log rotation.'],
    ['Encrypting network traffic', 'Unrelated.'],
    ['Blocking malicious IPs', 'Firewall function.']
  ], ex: 'Aggregation is the foundation of SIEM.' }
]);

SEC.addQuestions('4.5', [
  { d: 2, q: 'A firewall has these rules: 1) DENY TCP ANY → 10.0.1.10 port 22; 2) ALLOW TCP 10.0.5.0/24 → 10.0.1.10 port 22. Administrators in 10.0.5.0/24 cannot SSH to the server. Why?', o: [
    ['Rule 1 matches first and denies the traffic', 'First match wins; the broad deny precedes the specific allow.', true],
    ['The implicit deny overrides rule 2', 'The implicit deny applies only when no rule matches.'],
    ['SSH uses UDP', 'SSH uses TCP 22.'],
    ['Rule 2 has the wrong subnet mask', 'The rule would work if it came first.']
  ], ex: 'Order specific allows above broader denies.' },
  { d: 1, q: 'Which secure protocol should replace Telnet for remote command-line administration?', o: [
    ['SSH', 'SSH encrypts remote sessions on TCP 22.', true],
    ['FTP', 'FTP is file transfer and unencrypted.'],
    ['SNMPv1', 'Unencrypted management protocol.'],
    ['HTTP', 'Unencrypted web.']
  ], ex: 'Telnet sends credentials in clear text.' },
  { d: 2, q: 'Which DNS record type tells receiving mail servers which IP addresses are authorized to send email for a domain?', o: [
    ['SPF', 'Sender Policy Framework lists authorized senders.', true],
    ['DKIM', 'Publishes the public key for signature verification.'],
    ['DMARC', 'Defines policy and reporting.'],
    ['CNAME', 'Alias record.']
  ], ex: 'SPF + DKIM + DMARC together combat spoofing.' },
  { d: 2, q: 'Which TWO email security mechanisms are validated by a DMARC policy?', o: [
    ['SPF', 'DMARC checks SPF results and alignment.', true],
    ['DKIM', 'DMARC checks DKIM signatures and alignment.', true],
    ['S/MIME', 'End-to-end message encryption/signing, not evaluated by DMARC.'],
    ['STARTTLS', 'Transport encryption, not DMARC.']
  ], ex: 'DMARC passes if SPF or DKIM passes with domain alignment.' },
  { d: 2, q: 'Which control alerts when critical system files on a web server are modified unexpectedly?', o: [
    ['File integrity monitoring (FIM)', 'FIM compares file hashes to a baseline.', true],
    ['DLP', 'Watches data leaving.'],
    ['NAC', 'Controls network admission.'],
    ['Web filter', 'Controls browsing.']
  ], ex: 'FIM detects defacement, rootkits and unauthorized configuration changes.' },
  { d: 2, q: 'A company wants to stop malware callbacks to known-malicious domains for every device and protocol with minimal infrastructure. What is the MOST efficient control?', o: [
    ['DNS filtering', 'Blocking resolution of malicious domains stops connections early, for all protocols.', true],
    ['Host-based firewall rules per IP', 'Hard to maintain as IPs change.'],
    ['Full packet capture', 'Detective only.'],
    ['FIM', 'Unrelated.']
  ], ex: 'DNS filtering is lightweight and broad. Pair it with web filtering for content inspection.' },
  { d: 3, s: 'Laptops used by traveling staff must be protected from malicious websites even when not connected to the corporate VPN.', q: 'Which web filtering approach BEST meets this need?', o: [
    ['Agent-based web filtering on each laptop', 'Agents enforce policy wherever the device is.', true],
    ['Centralized proxy in headquarters only', 'Only filters traffic routed through HQ.'],
    ['Router ACLs at headquarters', 'Doesn’t cover remote traffic.'],
    ['Content filtering on the email gateway', 'Only covers email.']
  ], ex: 'Agent-based or cloud-delivered (SASE) filtering covers remote users.' },
  { d: 2, q: 'Which Linux feature enforces mandatory access control policies that confine processes even if they run as root?', o: [
    ['SELinux', 'Security-Enhanced Linux enforces MAC policies.', true],
    ['Group Policy', 'Windows Active Directory feature.'],
    ['sudo', 'Grants privileges; doesn’t confine.'],
    ['cron', 'Job scheduler.']
  ], ex: 'SELinux limits damage from compromised services.' },
  { d: 3, q: 'Which detection method is MOST likely to identify a never-before-seen attack, at the cost of more false positives?', o: [
    ['Anomaly/behavior-based detection', 'Deviations from a baseline can reveal novel attacks.', true],
    ['Signature-based detection', 'Needs known patterns.'],
    ['Hash allow listing', 'Prevention, not detection of network attacks.'],
    ['Port scanning', 'Discovery technique.']
  ], ex: 'Combine signatures (accurate for known threats) with anomaly detection (novel threats).' },
  { d: 2, q: 'Which technology checks a device’s patch level and antivirus status before allowing it onto the network, and places noncompliant devices in a remediation VLAN?', o: [
    ['NAC', 'Network Access Control enforces posture checks.', true],
    ['DLP', 'Data loss prevention.'],
    ['FIM', 'File monitoring.'],
    ['SPF', 'Email authentication.']
  ], ex: 'NAC can be agent-based or agentless; often uses 802.1X.' },
  { d: 2, q: 'An organization needs to retrieve email securely from its mail server using IMAP. Which port should it use?', o: [
    ['993 (IMAPS)', 'IMAP over TLS uses port 993.', true],
    ['143', 'Unencrypted IMAP (unless STARTTLS).'],
    ['110', 'Port 110 is unencrypted POP3, a different retrieval protocol.'],
    ['25', 'Port 25 is SMTP, used for sending/relaying mail, not IMAP retrieval.']
  ], ex: 'Secure variants: IMAPS 993, POP3S 995, SMTPS 465/587 with STARTTLS.' },
  { d: 3, q: 'Which capability correlates detections across endpoints, network, cloud workloads, identity and email into unified incidents?', o: [
    ['XDR', 'Extended Detection and Response correlates across multiple domains.', true],
    ['Antivirus', 'Endpoint-only, signature-centric.'],
    ['HIPS', 'Host-only prevention.'],
    ['SNMP', 'Device monitoring.']
  ], ex: 'EDR focuses on endpoints; XDR extends correlation across the environment.' },
  { d: 2, q: 'User behavior analytics flags an accountant who normally downloads 20 files per day downloading 4,000 files at 2 a.m. Why is UBA effective here?', o: [
    ['It baselines normal behavior and detects significant deviations', 'Anomaly from a user’s own baseline is the signal.', true],
    ['It blocks all downloads after 5 p.m.', 'That would be a rule-based restriction.'],
    ['It scans files for malware signatures', 'That is antivirus.'],
    ['It encrypts the files', 'Unrelated.']
  ], ex: 'UBA can detect insider threats and compromised accounts that use valid credentials.' },
  { d: 3, s: 'A screened subnet hosts a web server (10.0.1.10). The internal database (10.0.2.20) must be reachable only by the web server on TCP 1433.', q: 'Which rule should be placed on the internal firewall above the final deny?', o: [
    ['ALLOW TCP 10.0.1.10 → 10.0.2.20 port 1433', 'This permits only the required flow.', true],
    ['ALLOW ANY ANY → 10.0.2.20 ANY', 'Far too permissive.'],
    ['ALLOW TCP ANY → 10.0.2.20 port 1433', 'Allows any source, including the internet.'],
    ['DENY TCP 10.0.1.10 → 10.0.2.20 port 1433', 'Blocks the required flow.']
  ], ex: 'Least-privilege firewall rules specify exact sources, destinations and ports.' }
]);

SEC.addQuestions('4.6', [
  { d: 1, q: 'Which combination provides multifactor authentication?', o: [
    ['A smart card and a PIN', 'Something you have plus something you know.', true],
    ['A password and a security question', 'Both are knowledge factors.'],
    ['A fingerprint and a retina scan', 'Both are inherence factors.'],
    ['Two passwords', 'Same factor.']
  ], ex: 'MFA requires factors from different categories.' },
  { d: 2, q: 'In which access control model does the data owner decide who can access a file?', o: [
    ['Discretionary access control (DAC)', 'Owners grant access at their discretion.', true],
    ['Mandatory access control (MAC)', 'System-enforced labels.'],
    ['Rule-based access control', 'Global rules.'],
    ['Attribute-based access control', 'Policy-evaluated attributes.']
  ], ex: 'DAC is flexible but prone to oversharing.' },
  { d: 2, q: 'Which access control model assigns permissions to job functions such as “Nurse” or “Billing Clerk”, and users inherit permissions through membership?', o: [
    ['Role-based access control (RBAC)', 'Permissions follow roles.', true],
    ['MAC', 'Labels and clearances.'],
    ['DAC', 'Owner discretion.'],
    ['Time-of-day restriction', 'Time-based limitation.']
  ], ex: 'RBAC scales well and simplifies onboarding.' },
  { d: 2, q: 'Which standard is XML-based and commonly used to provide web single sign-on between an identity provider and SaaS applications?', o: [
    ['SAML', 'Security Assertion Markup Language uses XML assertions.', true],
    ['OAuth 2.0', 'Delegated authorization with tokens.'],
    ['LDAP', 'Directory access protocol.'],
    ['RADIUS', 'Network AAA.']
  ], ex: 'SAML: IdP issues signed assertions to service providers.' },
  { d: 2, q: 'An employee resigns today. When should their accounts be disabled?', o: [
    ['Immediately upon departure, as part of de-provisioning', 'Prompt de-provisioning prevents misuse.', true],
    ['At the next quarterly access review', 'Leaves a window of risk.'],
    ['Only if the employee was fired', 'All departures require removal.'],
    ['After one year', 'Far too late.']
  ], ex: 'Automate de-provisioning from HR systems where possible.' },
  { d: 3, q: 'Which privileged access practice grants admin rights only for an approved time window and revokes them automatically?', o: [
    ['Just-in-time permissions', 'JIT access is temporary and task-bound.', true],
    ['Password vaulting', 'Stores credentials securely; not inherently time-bound.'],
    ['Federation', 'Cross-organization identity trust.'],
    ['DAC', 'Owner-based access.']
  ], ex: 'JIT reduces standing privileges that attackers could abuse.' },
  { d: 2, q: 'Which TWO are “something you have” factors?', o: [
    ['Hardware security key (FIDO2)', 'A physical token is possession-based.', true],
    ['Authenticator app generating TOTP codes', 'The phone app is a soft token you possess.', true],
    ['Fingerprint', 'Something you are.'],
    ['PIN', 'Something you know.']
  ], ex: 'Hardware and software tokens, smart cards and security keys are possession factors.' },
  { d: 3, s: 'A cloud HR application should allow access only if the user is in the HR department, using a managed device, during business hours, from the corporate country.', q: 'Which access control model is MOST suitable?', o: [
    ['Attribute-based access control (ABAC)', 'ABAC evaluates multiple attributes in one policy.', true],
    ['DAC', 'Owners can’t enforce device or time conditions.'],
    ['RBAC only', 'Roles alone don’t cover device, time and location.'],
    ['MAC', 'Label-based clearance model.']
  ], ex: 'ABAC is the most granular model and is common in Zero Trust policy engines.' },
  { d: 2, q: 'A third-party calendar app accesses a user’s mailbox calendar through tokens the user approved, without receiving the user’s password. Which protocol enables this?', o: [
    ['OAuth 2.0', 'OAuth provides delegated authorization via access tokens.', true],
    ['Kerberos', 'Internal ticket-based authentication.'],
    ['SAML', 'Primarily authentication/SSO assertions.'],
    ['TACACS+', 'Device administration AAA.']
  ], ex: 'OpenID Connect adds identity (authentication) on top of OAuth.' },
  { d: 2, q: 'Which control BEST prevents privilege creep for employees who change departments?', o: [
    ['Periodic access reviews and recertification (attestation)', 'Reviews remove permissions no longer needed.', true],
    ['Longer passwords', 'Unrelated to accumulated permissions.'],
    ['SSO', 'Simplifies login, not permissions.'],
    ['Biometrics', 'Authentication, not authorization.']
  ], ex: 'Role changes should trigger access adjustments, and reviews catch what is missed.' },
  { d: 3, q: 'What is a key risk of single sign-on, and how is it usually mitigated?', o: [
    ['Compromise of the SSO account grants access to many apps; mitigate with strong MFA and monitoring', 'SSO concentrates risk in one credential.', true],
    ['SSO increases password fatigue; mitigate by adding more passwords', 'SSO reduces password fatigue.'],
    ['SSO prevents MFA', 'SSO commonly integrates MFA.'],
    ['SSO stores passwords in each application', 'SSO avoids per-app passwords.']
  ], ex: 'Protect the identity provider as a crown jewel.' },
  { d: 2, q: 'Which password practice aligns with modern guidance?', o: [
    ['Allow long passphrases, check against known-breached passwords and use a password manager', 'Length, breach screening and managers improve security and usability.', true],
    ['Force 30-day password changes for all users regardless of risk', 'Frequent forced changes lead to weaker patterns.'],
    ['Limit passwords to 8 characters', 'Length should be encouraged.'],
    ['Prohibit paste into password fields', 'This hinders password managers.']
  ], ex: 'Combine strong password practices with MFA, or move to passwordless.' },
  { d: 3, q: 'Which authentication approach is MOST resistant to phishing?', o: [
    ['FIDO2/passkey security keys bound to the legitimate site', 'Origin-bound cryptographic credentials can’t be replayed to a fake site.', true],
    ['SMS one-time codes', 'Codes can be phished or intercepted via SIM swapping.'],
    ['Security questions', 'Easily researched or phished.'],
    ['Password only', 'Easily phished.']
  ], ex: 'Passwordless FIDO2 resists credential phishing by design.' },
  { d: 2, q: 'Before issuing credentials to a new remote hire, the company verifies a government ID through a video call and checks it against HR records. What is this?', o: [
    ['Identity proofing', 'Verifying someone’s identity before provisioning.', true],
    ['Federation', 'Trust between organizations.'],
    ['Attestation', 'Confirming access appropriateness.'],
    ['Accounting', 'Recording actions.']
  ], ex: 'Strong identity proofing prevents fraudulent account creation.' }
]);

SEC.addQuestions('4.7', [
  { d: 1, q: 'What is the difference between automation and orchestration?', o: [
    ['Automation performs individual tasks; orchestration coordinates multiple automated tasks across systems into workflows', 'Orchestration connects automations end to end.', true],
    ['They are identical terms', 'They differ in scope.'],
    ['Orchestration is always manual', 'It is automated coordination.'],
    ['Automation requires a SOAR platform', 'Scripts can automate without SOAR.']
  ], ex: 'SOAR platforms orchestrate playbooks across security tools.' },
  { d: 2, q: 'A cloud policy automatically prevents anyone from creating a publicly accessible storage bucket. What is this?', o: [
    ['A guard rail', 'Guard rails enforce safe configurations automatically.', true],
    ['A honeypot', 'Decoy.'],
    ['A tabletop exercise', 'Discussion exercise.'],
    ['Technical debt', 'A cost of poor solutions.']
  ], ex: 'Guard rails enforce baselines at scale.' },
  { d: 2, q: 'Which TWO are benefits of security automation?', o: [
    ['Faster reaction time to incidents', 'Automated actions occur in seconds.', true],
    ['Consistent enforcement of baselines', 'Automation applies the same configuration every time.', true],
    ['Elimination of all security staff', 'People are still needed.'],
    ['Guaranteed zero complexity', 'Automation can add complexity.']
  ], ex: 'Automation is a workforce multiplier and improves consistency.' },
  { d: 2, q: 'If a central automation platform that provisions all user accounts goes offline, onboarding stops. Which consideration does this describe?', o: [
    ['Single point of failure', 'Dependence on one platform creates a single point of failure.', true],
    ['Employee retention', 'A benefit of automation.'],
    ['Workforce multiplier', 'A benefit.'],
    ['Guard rail', 'Preventive control.']
  ], ex: 'Design automation with redundancy and manual fallback procedures.' },
  { d: 3, s: 'A SOAR playbook automatically disables any account with 5 failed logins in 10 minutes. During a password-spraying attack, it disables 3,000 accounts, including executives.', q: 'What lesson does this illustrate?', o: [
    ['Automations must be tested and include safeguards, because they can amplify impact', 'Poorly scoped automation can cause self-inflicted outages.', true],
    ['Automation should never be used for security', 'Overcorrection; automation is valuable.'],
    ['Password spraying can’t be detected', 'It can be detected.'],
    ['Accounts should never be disabled', 'Disabling is sometimes appropriate.']
  ], ex: 'Consider complexity and failure impact; add thresholds, exclusions and human approval for high-impact actions.' },
  { d: 2, q: 'Security scans run automatically every time developers commit code to the repository. Which automation use case is this?', o: [
    ['Continuous integration and testing', 'CI pipelines run tests and scans on each change.', true],
    ['Ticket escalation', 'Workflow for incidents.'],
    ['User provisioning', 'Account creation.'],
    ['Resource decommissioning', 'Retirement.']
  ], ex: 'Shifting security left catches issues early.' },
  { d: 2, q: 'Which consideration describes the burden of maintaining many custom scripts that break when systems change?', o: [
    ['Technical debt and ongoing supportability', 'Unmaintained automation creates future costs.', true],
    ['Scaling securely', 'A benefit.'],
    ['Reaction time', 'A benefit.'],
    ['Enforcing baselines', 'A benefit.']
  ], ex: 'Document automations, assign owners and include them in change management.' },
  { d: 1, q: 'An alert in the SIEM automatically creates a ticket in the IT service management system and assigns it to the on-call analyst. Which use case is this?', o: [
    ['Ticket creation and escalation', 'Automating ticketing and routing.', true],
    ['Guard rails', 'Configuration prevention.'],
    ['Resource provisioning', 'Creating infrastructure.'],
    ['Code signing', 'Unrelated.']
  ], ex: 'Integrations and APIs connect security tools to workflow systems.' }
]);

SEC.addQuestions('4.8', [
  { d: 1, q: 'Which phase of incident response includes creating the IR plan, assembling the team and acquiring tools?', o: [
    ['Preparation', 'Preparation happens before incidents.', true],
    ['Containment', 'During an incident.'],
    ['Recovery', 'Restoring systems.'],
    ['Lessons learned', 'After the incident.']
  ], ex: 'Good preparation determines how well every later phase goes.' },
  { d: 2, q: 'Malware has been removed and the vulnerability patched. Systems are now being restored from clean backups and monitored. Which phase is this?', o: [
    ['Recovery', 'Returning systems to normal operation.', true],
    ['Eradication', 'Removal already happened.'],
    ['Detection', 'Earlier phase.'],
    ['Preparation', 'Before incidents.']
  ], ex: 'Order: containment → eradication → recovery.' },
  { d: 2, q: 'Which document records every person who handled a piece of evidence, when and why?', o: [
    ['Chain of custody', 'Tracks evidence handling to preserve admissibility.', true],
    ['Legal hold', 'Preserves data from deletion.'],
    ['Risk register', 'Tracks risks.'],
    ['Playbook', 'Response steps.']
  ], ex: 'Gaps in chain of custody can make evidence inadmissible.' },
  { d: 2, q: 'In what order should these be collected from a running system, most volatile first?', o: [
    ['RAM, then swap/temp files, then disk, then backups', 'Follows the order of volatility.', true],
    ['Disk, then RAM, then backups', 'RAM would be lost first.'],
    ['Backups, then disk, then RAM', 'Reverse of correct order.'],
    ['Order doesn’t matter', 'Volatile data disappears quickly.']
  ], ex: 'Capture memory before powering down or imaging disks.' },
  { d: 2, q: 'Litigation is expected over a contract dispute. Legal instructs IT to suspend automatic deletion of relevant email. What is this?', o: [
    ['Legal hold', 'Preserves potentially relevant data.', true],
    ['E-discovery production', 'Producing data comes later.'],
    ['Chain of custody', 'Evidence handling record.'],
    ['Data masking', 'Unrelated.']
  ], ex: 'Legal holds override normal retention and deletion policies.' },
  { d: 3, q: 'Which TWO actions are part of the containment phase?', o: [
    ['Isolating infected hosts from the network', 'Stops spread.', true],
    ['Disabling compromised user accounts', 'Prevents further attacker access.', true],
    ['Writing the lessons-learned report', 'Post-incident activity.'],
    ['Restoring all systems from backup', 'Recovery activity.']
  ], ex: 'Containment limits damage while preserving evidence.' },
  { d: 2, q: 'Department heads meet to talk through how they would respond to a hypothetical data breach scenario. What is this?', o: [
    ['Tabletop exercise', 'Discussion-based scenario walkthrough.', true],
    ['Simulation', 'Simulations involve realistic practice actions.'],
    ['Penetration test', 'Tests technical defenses.'],
    ['Failover test', 'Tests DR systems.']
  ], ex: 'Tabletops are low cost and good for testing communication and decisions.' },
  { d: 3, q: 'Analysts proactively search endpoint telemetry for signs of a specific attacker technique described in a new threat report, without any alert having fired. What is this?', o: [
    ['Threat hunting', 'Proactive, hypothesis-driven searching.', true],
    ['Root cause analysis', 'Explains a known incident.'],
    ['Vulnerability scanning', 'Finds weaknesses.'],
    ['E-discovery', 'Legal data production.']
  ], ex: 'Threat hunting finds threats that evaded automated detection.' },
  { d: 2, q: 'Why should forensic analysts work on a hashed bit-for-bit copy rather than the original drive?', o: [
    ['To preserve the original evidence and prove integrity by matching hashes', 'Hashes prove the copy is identical and the original stays untouched.', true],
    ['Because copies are faster to read', 'Not the reason.'],
    ['To compress the data', 'Not the purpose.'],
    ['Because originals can’t be hashed', 'They can.']
  ], ex: 'Use write blockers during acquisition and document hashes.' },
  { d: 3, s: 'After recovering from a breach, the team determines attackers entered through a VPN appliance missing a six-month-old patch because it wasn’t in the patch management scope.', q: 'Which activity identified this, and what should happen next?', o: [
    ['Root cause analysis; feed the findings into lessons learned and improve preparation (add network appliances to patch scope)', 'RCA finds the underlying cause so the process can be fixed.', true],
    ['Threat hunting; no further action needed', 'Improvements are needed.'],
    ['Containment; isolate the VPN permanently', 'Overreaction; the process gap needs fixing.'],
    ['E-discovery; produce documents for court', 'Unrelated.']
  ], ex: 'The IR cycle closes with lessons learned feeding back into preparation.' },
  { d: 1, q: 'What is the PRIMARY goal of the lessons-learned phase?', o: [
    ['Improve future response and prevent recurrence', 'Review what worked and what didn’t.', true],
    ['Assign blame to individuals', 'Blameless reviews encourage honesty.'],
    ['Delete incident records', 'Records should be retained.'],
    ['Restore systems', 'Recovery phase.']
  ], ex: 'Hold lessons-learned meetings soon after incidents while details are fresh.' },
  { d: 2, q: 'Which process identifies, collects and produces electronically stored information in response to a lawsuit?', o: [
    ['E-discovery', 'Electronic discovery for legal proceedings.', true],
    ['Threat hunting', 'Security activity.'],
    ['Sandboxing', 'Malware analysis.'],
    ['Tokenization', 'Data protection.']
  ], ex: 'Legal hold preserves; e-discovery finds and produces.' }
]);

SEC.addQuestions('4.9', [
  { d: 2, q: 'An analyst needs to confirm whether outbound connections from a workstation to 203.0.113.50 on port 4444 were allowed. Which source should she check FIRST?', o: [
    ['Firewall logs', 'Firewalls log allowed/blocked connections with IPs and ports.', true],
    ['Vulnerability scan report', 'Shows weaknesses, not connections.'],
    ['Email gateway logs', 'Email-specific.'],
    ['Badge reader logs', 'Physical access.']
  ], ex: 'Firewall logs answer “was this traffic permitted?”' },
  { d: 2, q: 'Which Windows event indicates a failed logon attempt?', o: [
    ['Event ID 4625', '4625 = an account failed to log on.', true],
    ['Event ID 4624', '4624 = successful logon.'],
    ['Event ID 4720', '4720 = user account created.'],
    ['Event ID 1102', '1102 = audit log cleared.']
  ], ex: 'Useful IDs: 4624/4625 (logon success/failure), 4720 (account created), 4732 (added to group), 1102 (log cleared).' },
  { d: 2, q: 'An investigator wants to determine the true originating mail server of a phishing email. What should she examine?', o: [
    ['The email headers (metadata)', 'Received headers show the path the message took.', true],
    ['The email body text only', 'Body text can be faked easily.'],
    ['NetFlow from the web proxy', 'Unrelated to mail path.'],
    ['DHCP logs', 'IP assignment.']
  ], ex: 'Metadata includes headers, timestamps and authentication results (SPF/DKIM/DMARC).' },
  { d: 3, q: 'Which data source provides the MOST detailed evidence of what was transmitted during a suspected unencrypted data exfiltration?', o: [
    ['Packet capture', 'Full packets include payload content.', true],
    ['NetFlow', 'Only metadata.'],
    ['Dashboard summary', 'Aggregated view.'],
    ['Vulnerability scan', 'Unrelated.']
  ], ex: 'PCAPs are detailed but large; NetFlow shows patterns.' },
  { d: 2, q: 'EDR shows `outlook.exe` spawning `powershell.exe -enc JABzAD0A…`. Which data source revealed this?', o: [
    ['Endpoint logs', 'EDR/endpoint telemetry records process creation and parent-child relationships.', true],
    ['Firewall logs', 'Network-level only.'],
    ['IPS logs', 'Network signature matches.'],
    ['Application logs from the web server', 'Different system.']
  ], ex: 'An Office application launching encoded PowerShell is a strong malicious indicator.' },
  { d: 2, q: 'Which TWO sources would BEST show whether a vulnerability exploited during an incident was previously known on the affected server?', o: [
    ['Historical vulnerability scan reports', 'Show what was detected before the incident.', true],
    ['Patch management/automated reports', 'Show whether the patch was deployed.', true],
    ['Badge access logs', 'Physical access only.'],
    ['DNS query logs', 'Name resolution activity.']
  ], ex: 'Correlating scan history and patch status helps root cause analysis.' },
  { d: 3, s: 'IPS logs show “ET EXPLOIT Apache Struts RCE attempt — action: alert” for traffic to an internal web server, followed minutes later by the server making outbound connections to an unknown IP.', q: 'What does this sequence MOST likely indicate?', o: [
    ['The IPS detected but did not block the exploit, and the server was likely compromised', '“Alert” means not blocked, and new outbound connections suggest a successful exploit.', true],
    ['The exploit was blocked successfully', 'Action was alert, not drop.'],
    ['A false positive with no further concern', 'The outbound connections suggest otherwise.'],
    ['A DDoS attack', 'Pattern doesn’t match.']
  ], ex: 'Read the action field in IPS logs carefully: alert vs block/drop.' },
  { d: 1, q: 'What is the main purpose of a security dashboard?', o: [
    ['Provide an at-a-glance view of key metrics and alerts', 'Dashboards summarize status visually.', true],
    ['Store full packet captures', 'Not their purpose.'],
    ['Replace incident response', 'They support it.'],
    ['Encrypt logs', 'Unrelated.']
  ], ex: 'Dashboards help prioritize but investigations need underlying data.' },
  { d: 2, q: 'A photo posted by an employee on social media contains GPS coordinates of a secure facility. What type of data revealed the location?', o: [
    ['Metadata (EXIF)', 'Image metadata can include GPS coordinates.', true],
    ['Firewall log', 'Unrelated.'],
    ['NetFlow', 'Unrelated.'],
    ['IPS signature', 'Unrelated.']
  ], ex: 'Metadata is valuable for investigations and is also an OPSEC risk.' },
  { d: 3, q: 'Linux /var/log/auth.log shows 300 “Failed password for invalid user” entries from many IPs, each trying a different username, followed by no successful logins. What is the BEST interpretation?', o: [
    ['Automated username/password guessing that hasn’t succeeded; review SSH exposure and consider blocking or key-only auth', 'Many failures, no success, so an attempted but unsuccessful attack.', true],
    ['A confirmed compromise', 'No successful login is shown.'],
    ['A DDoS attack against SSH', 'This is credential guessing.'],
    ['Normal user behavior', 'Hundreds of invalid users isn’t normal.']
  ], ex: 'Harden SSH: disable password auth, use keys, restrict source IPs, use fail2ban-style controls.' }
]);
