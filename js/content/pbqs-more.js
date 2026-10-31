/* Additional performance-based labs for objectives that had none. Original content. */
(function () {
  var P = SEC.pbqs;
  var PRIORITY = ['Fix immediately (within 24 hours)', 'Fix this week', 'Fix in the next monthly cycle', 'Accept with a documented exception', 'Close as a false positive'];

  /* ---------- 4.3 Vulnerability scan triage ---------- */
  P.push({
    id: 'vuln-triage', type: 'config', title: 'Prioritize vulnerability scan findings', objs: ['4.3'], d: 2, minutes: 8,
    scenario: '<p>This week’s credentialed scan returned more findings than the team can fix at once. Decide how to handle each one. Base your decision on the CVSS score <em>and</em> the context: exposure, exploit availability, the data at risk and any compensating controls.</p>',
    tasks: ['Choose a response for each finding.', 'Decide what happens after the urgent fixes are applied.'],
    groups: [
      { label: 'Findings', fields: [
        { id: 'f1', kind: 'select', label: 'F1. CVSS 9.8 remote code execution on the internet-facing VPN appliance. Exploitation is reported in the wild.', options: PRIORITY, accept: ['Fix immediately (within 24 hours)'], why: 'Critical, exposed to the internet and actively exploited. This is the highest risk on the list.' },
        { id: 'f2', kind: 'select', label: 'F2. CVSS 9.1 on an isolated lab VM with no network path to production and no real data.', options: PRIORITY, accept: ['Fix in the next monthly cycle', 'Accept with a documented exception'], why: 'A high base score, but the environment makes exploitation unlikely and the impact small. Normal patching, or a documented exception, is reasonable.' },
        { id: 'f3', kind: 'select', label: 'F3. CVSS 7.5 SQL injection in the public payment web app. Proof-of-concept code is public.', options: PRIORITY, accept: ['Fix immediately (within 24 hours)'], why: 'A lower base score than F2, but it is internet-facing, handles card data and has public exploit code, so context raises its priority.' },
        { id: 'f4', kind: 'select', label: 'F4. CVSS 5.3: TLS 1.0 still enabled on the internal HR portal.', options: PRIORITY, accept: ['Fix this week', 'Fix in the next monthly cycle'], why: 'A real weakness but internal-only and medium severity. Schedule it rather than dropping everything.' },
        { id: 'f5', kind: 'select', label: 'F5. Apache HTTP Server vulnerability reported on WEB-07. The credentialed scan shows WEB-07 runs IIS and has no Apache installed.', options: PRIORITY, accept: ['Close as a false positive'], why: 'The software is not present, so the finding is a false positive. Record why it was closed.' },
        { id: 'f6', kind: 'select', label: 'F6. CVSS 8.8 on a legacy imaging device. The vendor cannot patch for 6 months. The device is already on an isolated VLAN that only allows traffic to its server.', options: PRIORITY, accept: ['Accept with a documented exception'], why: 'Patching is not possible yet and compensating controls are in place, so the risk is formally accepted with an exception and a review date.' }
      ] },
      { label: 'Follow-up', fields: [
        { id: 'after', kind: 'select', label: 'What should happen after F1 and F3 are patched?', options: ['Rescan the affected systems to confirm the fix', 'Delete the scan report', 'Lower the CVSS scores in the report', 'Disable scanning for a month'], accept: ['Rescan the affected systems to confirm the fix'], why: 'Validation by rescanning confirms the remediation actually worked.' }
      ] }
    ],
    solution: { steps: [
      'Start with exposure and exploitability: internet-facing systems with known exploits come first (F1, F3), even when another finding has a higher base score.',
      'Lower the priority of high scores in isolated environments with no data (F2), and schedule medium internal issues (F4).',
      'Close findings the evidence disproves as false positives (F5), and record why.',
      'When a fix is impossible, document an exception with compensating controls and a review date (F6).',
      'Rescan to validate the fixes, then report the results.'
    ], alt: 'F2 can be patched in the normal cycle or accepted with an exception. F4 can be fixed this week or in the monthly cycle.' }
  });

  /* ---------- 4.4 SIEM alert triage and tuning ---------- */
  P.push({
    id: 'siem-triage', type: 'logs', title: 'Triage and tune the SIEM alert queue', objs: ['4.4', '4.9'], d: 2, minutes: 9,
    scenario: '<p>It is Monday morning and the SIEM has queued the alerts below from the weekend. Some are real incidents. Others are noise from known activity. Flag every alert that needs an incident response, then decide how to deal with the noise.</p>',
    source: 'SIEM alert queue, Saturday–Sunday',
    lines: [
      { id: 's1', bad: false, text: 'MEDIUM  Multiple failed logins  user=svc_backup src=10.0.2.15  48 failures at 02:00 Sat and Sun', why: 'The nightly backup job is using an expired password. It needs fixing, but it is not an attack, and it is the noise to tune.' },
      { id: 's2', bad: true, text: 'HIGH    Impossible travel  user=j.chen  Toronto 09:02 -> Moscow 09:20 (Sat)', why: 'Two locations 18 minutes apart indicates a stolen credential.' },
      { id: 's3', bad: false, text: 'LOW     Antivirus detection  EICAR test file on QA-LAB-03  (security team ticket SEC-1182)', why: 'A documented antivirus test using the harmless EICAR file.' },
      { id: 's4', bad: true, text: 'HIGH    EDR  winword.exe spawned powershell.exe -enc JABzAD0A...  host=FIN-WS12', why: 'An Office document launching encoded PowerShell is a classic malware delivery chain.' },
      { id: 's5', bad: true, text: 'HIGH    DLP  2,400 records matching SSN pattern emailed to a personal Gmail address  user=m.ortiz', why: 'Possible data exfiltration by an insider or a compromised account.' },
      { id: 's6', bad: false, text: 'MEDIUM  Port scan detected  src=10.0.9.5  (approved vulnerability scanner, window Sat 01:00-04:00)', why: 'The authorized scanner running in its approved window.' },
      { id: 's7', bad: true, text: 'HIGH    Brute force  user=admin src=203.0.113.50  300 failures then SUCCESS at 03:41', why: 'A successful login after hundreds of failures means the account is compromised.' },
      { id: 's8', bad: true, text: 'CRIT    New account added to Domain Admins  name=support2  host=DC01  by unknown process at 03:44', why: 'Privilege escalation and persistence right after the brute-force success.' },
      { id: 's9', bad: false, text: 'INFO    Disk usage 91%  host=FILE02', why: 'An operations alert, not a security incident.' }
    ],
    questions: [
      { id: 'noise', kind: 'select', label: 'Which alert is noise caused by a broken process, and should be fixed at the source?', options: ['Multiple failed logins for svc_backup', 'Impossible travel for j.chen', 'DLP alert for m.ortiz', 'New Domain Admins member'], accept: ['Multiple failed logins for svc_backup'], why: 'Update the service account’s credential (ideally in a vault) so the job stops failing.' },
      { id: 'tune', kind: 'select', label: 'How should the port scan rule be tuned?', options: ['Exclude only the approved scanner IP, only during its approved window', 'Disable the port scan rule', 'Lower the severity of every port scan alert', 'Delete the scanner’s logs'], accept: ['Exclude only the approved scanner IP, only during its approved window'], why: 'A narrow exception removes the known noise while still catching scans from anywhere else, or at other times.' },
      { id: 'link', kind: 'select', label: 'Which two alerts belong to the same incident?', options: ['The admin brute force and the new Domain Admins account', 'The EICAR test and the disk usage alert', 'The svc_backup failures and the port scan', 'The impossible travel and the EICAR test'], accept: ['The admin brute force and the new Domain Admins account'], why: 'The successful admin login at 03:41 was followed three minutes later by a new privileged account: correlation links them.' }
    ],
    solution: { steps: [
      'Separate attacks from known activity. The authorized scanner, a documented EICAR test and a disk alert are not incidents.',
      'Flag the five real incidents: impossible travel (s2), Office spawning encoded PowerShell (s4), DLP exfiltration (s5), the successful brute force (s7) and the new Domain Admins account (s8).',
      'Correlate s7 and s8: one attacker logged in as admin and created a privileged account for persistence.',
      'Fix noisy sources rather than muting rules: update the svc_backup credential, and add a narrow, time-bound exception for the approved scanner.',
      'Never disable a rule outright to cut noise, because it would also hide real attacks.'
    ] }
  });

  /* ---------- 4.7 SOAR playbook ordering ---------- */
  P.push({
    id: 'playbook-order', type: 'ordering', title: 'Build an automated phishing playbook', objs: ['4.7', '4.8'], d: 2, minutes: 6,
    scenario: '<p>Your team is automating the response to user-reported phishing in its SOAR platform. Put the playbook steps in the order they should run. Steps marked as happening at the same stage can be in either order.</p>',
    items: [
      { id: 'a', rank: 1, label: 'Ingest the reported email from the phishing mailbox', why: 'The trigger: the playbook starts when a report arrives.' },
      { id: 'b', rank: 2, label: 'Parse the email: extract the sender, URLs and attachment hashes', why: 'You need indicators before you can look anything up.' },
      { id: 'c', rank: 3, label: 'Enrich: check URL and hash reputation against threat intelligence', why: 'Enrichment turns raw indicators into evidence.' },
      { id: 'd', rank: 4, label: 'Score a verdict and send uncertain cases to an analyst for approval', why: 'A decision gate keeps high-impact automation from acting on weak evidence.' },
      { id: 'e', rank: 5, label: 'Block the sender domain and URLs on the email gateway and web proxy', why: 'Containment. It can run alongside the mailbox purge.' },
      { id: 'f', rank: 5, label: 'Search all mailboxes and purge matching messages', why: 'Containment. It can run alongside the blocking step.' },
      { id: 'g', rank: 6, label: 'Thank the reporter and record the case in the ticketing system', why: 'Close the loop and keep an audit trail.' },
      { id: 'h', rank: 7, label: 'Review playbook metrics and tune thresholds', why: 'Continuous improvement reduces false positives and missed cases.' }
    ],
    initialOrder: ['f', 'c', 'h', 'a', 'g', 'd', 'b', 'e'],
    solution: { steps: ['Trigger: ingest the report.', 'Parse, then enrich the indicators.', 'Decide, with a human approval gate for uncertain or high-impact cases.', 'Contain: block indicators and purge messages (either order).', 'Notify and document, then review metrics to tune the playbook.'] }
  });

  /* ---------- 4.2 Media disposal decisions ---------- */
  P.push({
    id: 'media-disposal', type: 'placement', layout: 'grid', title: 'Choose the right media sanitization', objs: ['4.2'], d: 2, minutes: 6,
    scenario: '<p>IT is clearing out equipment. Drag each item to the sanitization method that best fits it. Consider the media type, how sensitive the data is, and whether the device will be reused.</p>',
    zones: [
      { id: 'wipe', label: 'Overwrite (wipe) and reuse', desc: 'magnetic drives with low-sensitivity data' },
      { id: 'crypto', label: 'Cryptographic erase and reuse', desc: 'encrypted drives and SSDs' },
      { id: 'degauss', label: 'Degauss', desc: 'magnetic media only' },
      { id: 'destroy', label: 'Physically destroy, with a certificate', desc: 'highest assurance, no reuse' }
    ],
    tokens: [
      { id: 'm1', label: 'Encrypted laptop SSD, laptop going to a new employee', accept: ['crypto'], why: 'Destroying the encryption key makes the data unreadable and keeps the SSD usable. Overwriting is unreliable on SSDs.' },
      { id: 'm2', label: 'HDD from a retired file server with customer PII, going to recycling', accept: ['destroy', 'degauss'], why: 'Sensitive data and no reuse: destruction (or degaussing, then disposal) gives the strongest assurance.' },
      { id: 'm3', label: 'Backup tapes with payroll data, past their retention period', accept: ['degauss', 'destroy'], why: 'Tapes are magnetic, so degaussing works. Shredding also works.' },
      { id: 'm4', label: 'Unencrypted HDD from a lobby kiosk, staying in use inside the company', accept: ['wipe'], why: 'Low-sensitivity data on a magnetic drive that will be reused: a verified overwrite is enough.' },
      { id: 'm5', label: 'Company phone being reassigned (encrypted by default)', accept: ['crypto'], why: 'A factory reset on a modern phone performs a cryptographic erase.' },
      { id: 'm6', label: 'Failed SSD from a database server holding health records', accept: ['destroy'], why: 'It cannot be erased because it no longer works, and degaussing does not work on SSDs. Destroy it and keep the certificate.' },
      { id: 'm7', label: 'Hard drive inside a leased printer being returned to the vendor', accept: ['wipe', 'destroy'], why: 'Wipe it before return, or remove and destroy it if the lease allows. Never return it untouched.' }
    ],
    solution: { steps: [
      'SSDs and encrypted devices that will be reused: cryptographic erase.',
      'Magnetic drives with low-sensitivity data that will be reused: overwrite and verify.',
      'Magnetic media you will not reuse, especially tapes: degauss or destroy.',
      'Sensitive data with no reuse, or failed drives that cannot be erased: physical destruction, and keep the certificate of destruction.'
    ], alt: 'Several items accept more than one method, such as degauss or destroy for tapes and server HDDs, or wipe or destroy for the printer drive.' }
  });

  /* ---------- 3.4 Recovery planning from a BIA ---------- */
  var SITES = ['Hot site', 'Warm site', 'Cold site'];
  var DATA = ['Continuous replication', 'Hourly backups', 'Nightly backups', 'Weekly backups'];
  P.push({
    id: 'recovery-plan', type: 'config', title: 'Plan recovery from a business impact analysis', objs: ['3.4', '5.2'], d: 2, minutes: 8,
    scenario: '<p>The business impact analysis gives a recovery time objective (RTO, maximum downtime) and a recovery point objective (RPO, maximum data loss) for four systems. Choose the least expensive recovery site and data protection that still meets each target.</p>',
    tasks: ['A hot site takes minutes to hours, a warm site hours to a day or two, and a cold site days to weeks.', 'Choose data protection at least as frequent as the RPO.'],
    groups: [
      { label: 'Online store checkout: RTO 1 hour, RPO 5 minutes', fields: [
        { id: 'c_site', kind: 'select', label: 'Recovery site', options: SITES, accept: ['Hot site'], why: 'Only a hot site can be serving customers within an hour.' },
        { id: 'c_data', kind: 'select', label: 'Data protection', options: DATA, accept: ['Continuous replication'], why: 'Losing at most 5 minutes of orders needs continuous replication.' }
      ] },
      { label: 'Customer database: RTO 4 hours, RPO 1 hour', fields: [
        { id: 'd_site', kind: 'select', label: 'Recovery site', options: SITES, accept: ['Hot site', 'Warm site'], why: 'Four hours is achievable with a well-prepared warm site, or a hot site.' },
        { id: 'd_data', kind: 'select', label: 'Data protection', options: DATA, accept: ['Hourly backups', 'Continuous replication'], why: 'An RPO of 1 hour needs at least hourly backups.' }
      ] },
      { label: 'Payroll system: RTO 3 days, RPO 24 hours', fields: [
        { id: 'p_site', kind: 'select', label: 'Recovery site', options: SITES, accept: ['Warm site'], why: 'Three days rules out a cold site’s days-to-weeks build-out, but does not justify a hot site.' },
        { id: 'p_data', kind: 'select', label: 'Data protection', options: DATA, accept: ['Nightly backups', 'Hourly backups'], why: 'Nightly backups meet a 24-hour RPO.' }
      ] },
      { label: 'Internal wiki: RTO 2 weeks, RPO 1 week', fields: [
        { id: 'w_site', kind: 'select', label: 'Recovery site', options: SITES, accept: ['Cold site'], why: 'The cheapest option meets a two-week RTO.' },
        { id: 'w_data', kind: 'select', label: 'Data protection', options: DATA, accept: ['Weekly backups', 'Nightly backups'], why: 'Weekly backups meet a 1-week RPO.' }
      ] },
      { label: 'Backup protection', fields: [
        { id: 'ransom', kind: 'multi', label: 'Which TWO protect these backups against ransomware?', options: ['Keep an offline or immutable copy', 'Test restores regularly', 'Store the only copy on a mapped network drive', 'Use the same admin account for backups and production'], accept: ['Keep an offline or immutable copy', 'Test restores regularly'], why: 'Ransomware cannot encrypt an offline or immutable copy, and tested restores prove the backups work.' }
      ] }
    ],
    solution: { steps: [
      'RTO drives the site: minutes to an hour means hot, hours to a few days means warm, weeks means cold.',
      'RPO drives the backup frequency: protection must run at least as often as the RPO allows data to be lost.',
      'Pick the least expensive option that meets both targets. Over-provisioning wastes money, and under-provisioning misses the BIA.',
      'Protect the backups themselves with an offline or immutable copy and regular restore tests.'
    ], alt: 'Where a more capable option still meets the target (for example a hot site for the customer database), it is accepted.' }
  });

  /* ---------- 5.3 Agreement types ---------- */
  P.push({
    id: 'agreements', type: 'placement', layout: 'grid', title: 'Match each situation to the right agreement', objs: ['5.3'], d: 1, minutes: 5,
    scenario: '<p>Your company is working with several vendors and partners. Drag each situation to the agreement or contract clause that covers it.</p>',
    zones: [
      { id: 'sla', label: 'SLA', desc: 'service level agreement' }, { id: 'mou', label: 'MOU', desc: 'memorandum of understanding' }, { id: 'msa', label: 'MSA', desc: 'master service agreement' },
      { id: 'sow', label: 'SOW', desc: 'statement of work' }, { id: 'nda', label: 'NDA', desc: 'non-disclosure agreement' }, { id: 'bpa', label: 'BPA', desc: 'business partners agreement' },
      { id: 'rta', label: 'Right-to-audit clause', desc: 'part of a contract' }
    ],
    tokens: [
      { id: 'g1', label: '99.9% monthly uptime, with service credits if it is missed', accept: ['sla'], why: 'Measurable service levels with remedies define an SLA.' },
      { id: 'g2', label: 'Two agencies agree to cooperate on a pilot, without binding obligations', accept: ['mou'], why: 'An MOU records intent, and is usually not legally binding.' },
      { id: 'g3', label: 'Overall terms for all future work with a consulting firm', accept: ['msa'], why: 'An MSA is the umbrella contract that later work orders refer to.' },
      { id: 'g4', label: 'Deliverables, timeline and price for one penetration test under the existing contract', accept: ['sow'], why: 'A statement of work defines a specific engagement under an MSA.' },
      { id: 'g5', label: 'Protect network diagrams shared during vendor evaluation', accept: ['nda'], why: 'An NDA keeps shared information confidential.' },
      { id: 'g6', label: 'Two companies launch a joint product and split profits and decisions', accept: ['bpa'], why: 'A BPA defines partners’ roles, profit sharing and decision-making.' },
      { id: 'g7', label: 'Lets you inspect the vendor’s security controls each year', accept: ['rta'], why: 'A right-to-audit clause grants the customer permission to audit the vendor.' }
    ],
    solution: { steps: [
      'Performance promises and penalties: SLA. Non-binding intent: MOU.',
      'Umbrella terms: MSA. One specific job under those terms: SOW (or work order).',
      'Confidentiality: NDA. Partnership roles and profit sharing: BPA.',
      'The right to check a vendor’s security is a contract clause: right to audit.'
    ] }
  });

  /* ---------- 2.1 Threat actors ---------- */
  P.push({
    id: 'threat-actors', type: 'placement', layout: 'grid', title: 'Identify the threat actor', objs: ['2.1'], d: 1, minutes: 5,
    scenario: '<p>Read each incident summary and drag it to the threat actor that most likely carried it out. Use the clues: resources, sophistication, motivation, and whether the actor already had access.</p>',
    zones: [
      { id: 'nation', label: 'Nation-state' }, { id: 'crime', label: 'Organized crime' }, { id: 'hack', label: 'Hacktivist' },
      { id: 'insider', label: 'Insider threat' }, { id: 'unskilled', label: 'Unskilled attacker' }, { id: 'shadow', label: 'Shadow IT' }
    ],
    tokens: [
      { id: 'a1', label: 'Custom malware stays hidden in a defense contractor’s network for 14 months', accept: ['nation'], why: 'Long, stealthy espionage with custom tools needs state-level resources.' },
      { id: 'a2', label: 'Ransomware gang runs a professional negotiation portal and demands cryptocurrency', accept: ['crime'], why: 'Profit-driven and organized like a business.' },
      { id: 'a3', label: 'Ministry website defaced with a protest message after a controversial vote', accept: ['hack'], why: 'A public action for a political cause.' },
      { id: 'a4', label: 'Engineer who just resigned copies the source code repository to a personal drive', accept: ['insider'], why: 'Misuse of legitimate access by an employee.' },
      { id: 'a5', label: 'Teenager runs a downloaded exploit kit against random websites to brag online', accept: ['unskilled'], why: 'Borrowed tools, little skill, and a motive of notoriety.' },
      { id: 'a6', label: 'Sales team stores customer lists in an unapproved file-sharing app', accept: ['shadow'], why: 'Technology used without IT approval or oversight. A risk, not an attacker.' },
      { id: 'a7', label: 'Wiper malware hits another country’s power grid during a border conflict', accept: ['nation'], why: 'Destructive attacks on critical infrastructure tied to conflict.' },
      { id: 'a8', label: 'Help desk employee sells customer records on a criminal forum', accept: ['insider'], why: 'An insider abusing legitimate access for money.' }
    ],
    solution: { steps: [
      'Strategic, stealthy or destructive operations against defense or infrastructure targets: nation-state.',
      'Money as a business model: organized crime. A public cause: hacktivist.',
      'Legitimate access misused: insider threat. Borrowed tools for notoriety: unskilled attacker.',
      'Unapproved technology with no malicious actor: shadow IT.'
    ] }
  });
})();
