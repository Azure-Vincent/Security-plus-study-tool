/* Domain 2: Threats, Vulnerabilities, and Mitigations — original lesson content. */
(function () {
  var D = SEC.D;

  SEC.addLesson('2.1', {
    title: 'Threat Actors and Motivations',
    minutes: 20,
    intro: 'A <strong>threat actor</strong> is the person or group behind an attack. The exam gives you clues about skill, funding, goals and whether the actor is inside or outside the organization. Your job is to name the most likely actor and motive.',
    terms: [
      ['Threat actor', 'An individual or group that poses a threat to an organization.'],
      ['APT', 'Advanced Persistent Threat. A well-resourced attacker (often nation-state) that stays hidden in a network for a long time.'],
      ['Hacktivist', 'An attacker motivated by political or social causes.'],
      ['Insider threat', 'A current or former employee, contractor or partner who misuses legitimate access.'],
      ['Shadow IT', 'Systems or services used without IT approval (e.g., a team’s personal cloud storage).'],
      ['Exfiltration', 'Unauthorized transfer of data out of an organization.']
    ],
    sections: [
      {
        h: 'The main actors',
        body: '<ul><li><strong>Nation-state</strong>: government-backed, highly funded and sophisticated. Goals: espionage, sabotage of critical infrastructure, war. Often an APT that persists for months.</li>' +
          '<li><strong>Unskilled attacker</strong> (formerly “script kiddie”): uses tools and exploits written by others; little funding; motive is often thrills or bragging rights.</li>' +
          '<li><strong>Hacktivist</strong>: motivated by ideology; defaces websites, leaks documents, runs DDoS attacks against organizations they oppose.</li>' +
          '<li><strong>Insider threat</strong>: already has access and knowledge. It can be malicious (revenge, financial gain) or unintentional (careless).</li>' +
          '<li><strong>Organized crime</strong>: profit-driven, well-funded, professional. Ransomware, fraud, data theft for sale.</li>' +
          '<li><strong>Shadow IT</strong>: not an attacker but a source of risk. Unmanaged systems, set up by well-meaning staff, bypass security controls.</li></ul>',
        diagram: D.grid([
          ['Actor', 'Resources', 'Sophistication', 'Typical motive'],
          ['Nation-state', { t: 'Very high', tone: 'bad' }, { t: 'Very high', tone: 'bad' }, 'Espionage, war'],
          ['Organized crime', { t: 'High', tone: 'warn' }, { t: 'High', tone: 'warn' }, 'Financial gain'],
          ['Hacktivist', { t: 'Varies', tone: 'warn' }, { t: 'Moderate', tone: 'warn' }, 'Ideology'],
          ['Insider', { t: 'Low–mid', tone: 'good' }, { t: 'Varies', tone: 'warn' }, 'Revenge, money'],
          ['Unskilled attacker', { t: 'Low', tone: 'good' }, { t: 'Low', tone: 'good' }, 'Thrill, notoriety']
        ], 'Threat actor attributes at a glance', { cw: 140 }),
        check: { q: 'Stolen design documents for a defense contractor turn up in a foreign government’s weapons program. The intruders were in the network for 14 months undetected. Which actor is most likely?', o: [
          ['Hacktivist', 'Hacktivists usually publicize their actions rather than quietly stealing for a government.'],
          ['Nation-state', 'Long-term stealthy access and espionage that benefits a government point to a nation-state APT.', true],
          ['Unskilled attacker', 'Persistent, stealthy, long-term operations require high sophistication.'],
          ['Shadow IT', 'Shadow IT is unapproved technology, not an attacker.']
        ] }
      },
      {
        h: 'Attributes: internal vs external, resources, sophistication',
        body: '<p>Exam scenarios give you clues about the actor:</p><ul><li><strong>Internal vs external</strong>: does the actor already have credentials or physical access? Insiders bypass perimeter controls.</li>' +
          '<li><strong>Resources/funding</strong>: custom zero-day exploits and long campaigns cost money. That suggests a nation-state or organized crime.</li>' +
          '<li><strong>Level of sophistication/capability</strong>: off-the-shelf tools and noisy scans suggest an unskilled attacker.</li></ul>'
      },
      {
        h: 'Motivations',
        body: '<p>Common motivations: <strong>data exfiltration</strong>, <strong>espionage</strong>, <strong>service disruption</strong>, <strong>blackmail</strong>, <strong>financial gain</strong>, <strong>philosophical/political beliefs</strong>, <strong>ethical</strong> (e.g., ethical hackers disclosing flaws), <strong>revenge</strong>, <strong>disruption/chaos</strong> and <strong>war</strong>.</p>' +
          '<div class="ex">A recently fired database administrator deletes production tables using credentials that weren’t revoked. Actor: insider threat. Motivation: revenge. Root cause: poor de-provisioning.</div>',
        check: { q: 'A group floods a pharmaceutical company’s website with traffic and posts a manifesto opposing animal testing. Which actor and motivation fit best?', o: [
          ['Organized crime: financial gain', 'There is no ransom or profit motive.'],
          ['Hacktivist: philosophical/political beliefs', 'Disruption tied to a cause and a public manifesto is classic hacktivism.', true],
          ['Nation-state: espionage', 'This is a public disruption, not covert intelligence gathering.'],
          ['Insider: revenge', 'Nothing indicates internal access.']
        ] }
      }
    ],
    compare: [{ title: 'Commonly confused: Hacktivist vs Organized crime vs Nation-state', head: ['', 'Hacktivist', 'Organized crime', 'Nation-state'], rows: [
      ['Motive', 'Cause / ideology', 'Money', 'Strategic advantage, espionage, war'], ['Wants publicity?', 'Usually yes', 'No (except ransom notes)', 'No, wants stealth'], ['Telltale sign', 'Defacement, leaks, manifesto', 'Ransomware, fraud, extortion', 'Long dwell time, custom tools, critical infrastructure targets']] }],
    takeaways: [
      'Match clues to actors: funding and sophistication point to nation-state or organized crime; borrowed tools point to an unskilled attacker.',
      'Insiders already have access. Prompt de-provisioning and least privilege reduce the risk.',
      'Hacktivists want attention for a cause; organized crime wants money; nation-states want intelligence or strategic disruption.',
      'Shadow IT is a risk source, not an attacker: unmanaged systems outside security controls.'
    ]
  });

  SEC.addLesson('2.2', {
    title: 'Threat Vectors and Attack Surfaces',
    minutes: 25,
    intro: 'A <strong>threat vector</strong> is the path an attacker uses to get in. The <strong>attack surface</strong> is the sum of all those possible paths. Shrinking the attack surface means removing or hardening entry points: services, ports, devices, accounts, vendors and people.',
    terms: [
      ['Threat vector', 'The method or path used to deliver an attack (email, USB, open port, vendor access…).'],
      ['Attack surface', 'All the points where an attacker could try to enter or extract data.'],
      ['Phishing / vishing / smishing', 'Fraudulent messages via email / voice calls / SMS text messages.'],
      ['BEC', 'Business Email Compromise. Impersonating or taking over an executive or vendor email account to request payments or data.'],
      ['Typosquatting', 'Registering look-alike domains (e.g., examp1e.com) to catch mistyped URLs.'],
      ['Watering hole', 'Compromising a website the target group regularly visits.'],
      ['MSP', 'Managed Service Provider. A vendor that manages your IT; a supply-chain risk.']
    ],
    sections: [
      {
        h: 'Technical vectors',
        body: '<ul><li><strong>Message-based</strong>: email, SMS, instant messaging. These carry malicious links and attachments.</li>' +
          '<li><strong>Image-based</strong> (malicious code or phishing content in images, e.g., QR codes) and <strong>file-based</strong> (macros in documents, malicious PDFs).</li>' +
          '<li><strong>Voice call</strong>: pretexting by phone.</li><li><strong>Removable devices</strong>: USB drives left in a parking lot; they may auto-run malware or act as keyboards.</li>' +
          '<li><strong>Vulnerable software</strong>: <em>client-based</em> scanning needs an installed agent; <em>agentless</em> doesn’t. Both kinds of software add attack surface if unpatched.</li>' +
          '<li><strong>Unsupported systems and applications</strong>: end-of-life software no longer gets security patches.</li>' +
          '<li><strong>Unsecure networks</strong>: open wireless, exposed wired ports in lobbies, Bluetooth attacks.</li>' +
          '<li><strong>Open service ports</strong>: every listening service is a door. Close what you don’t need.</li>' +
          '<li><strong>Default credentials</strong>: admin/admin on routers, cameras and IoT. These are among the first things attackers try.</li></ul>',
        check: { q: 'A scan shows a building’s HVAC controller is reachable from the internet and accepts the manufacturer’s published admin password. Which TWO vectors are present?', o: [
          ['Default credentials', 'The vendor’s published password was never changed.', true],
          ['Open service ports exposed to the internet', 'The management interface listens on an internet-reachable port.', true],
          ['Watering hole', 'No website frequented by victims was compromised.'],
          ['Typosquatting', 'No look-alike domain is involved.']
        ] }
      },
      {
        h: 'Supply chain vectors',
        body: '<p>Attackers increasingly go through a trusted third party: <strong>managed service providers (MSPs)</strong> with remote access to many clients, <strong>vendors</strong> whose software updates are trusted, and <strong>suppliers</strong> of hardware that could be tampered with. One compromised MSP can give access to hundreds of customers.</p>'
      },
      {
        h: 'Human vectors: social engineering',
        body: '<ul><li><strong>Phishing</strong>: mass deceptive emails. <strong>Spear phishing</strong> targets specific people; <strong>whaling</strong> targets executives.</li>' +
          '<li><strong>Vishing</strong> (voice) and <strong>smishing</strong> (SMS).</li><li><strong>Misinformation/disinformation</strong>: false information spread to mislead (disinformation is deliberate).</li>' +
          '<li><strong>Impersonation</strong> and <strong>pretexting</strong>: inventing a believable story (“I’m from IT and need to verify your account”).</li>' +
          '<li><strong>Business email compromise (BEC)</strong>: a real or spoofed executive or vendor account requests a wire transfer or gift cards.</li>' +
          '<li><strong>Watering hole</strong>: infect a site the targets trust.</li><li><strong>Brand impersonation</strong>: fake sites, emails or apps copying a real brand.</li>' +
          '<li><strong>Typosquatting</strong>: look-alike domains such as <code>rnicrosoft.com</code>.</li></ul>',
        diagram: D.flow([{ t: 'Reconnaissance', sub: 'LinkedIn, website, OSINT' }, { t: 'Pretext', sub: 'believable story', tone: 'accent' }, { t: 'Contact', sub: 'email, call, SMS', tone: 'warn' }, { t: 'Action', sub: 'click, pay, reveal', tone: 'bad' }], 'How a social engineering attack unfolds'),
        check: { q: 'The accounts payable clerk receives an email from the real mailbox of a known supplier, asking that future invoices be paid to new bank details. The supplier’s account had been compromised. What attack is this?', o: [
          ['Typosquatting', 'The email came from the real supplier account, not a look-alike domain.'],
          ['Business email compromise', 'A compromised legitimate business account used to redirect payments is BEC.', true],
          ['Watering hole', 'No commonly visited website was compromised.'],
          ['Smishing', 'This was email, not SMS.']
        ] }
      },
      {
        h: 'Reducing the attack surface',
        body: '<p>Close unnecessary ports, uninstall unused software, change default passwords, retire unsupported systems (or isolate them), control USB use, require verification for payment changes (call-back to a known number), train staff, and assess vendors.</p>'
      }
    ],
    compare: [{ title: 'Commonly confused: Phishing variants', head: ['', 'Channel', 'Target'], rows: [
      ['Phishing', 'Email', 'Many people'], ['Spear phishing', 'Email', 'Specific person or group'], ['Whaling', 'Email', 'Senior executives'], ['Vishing', 'Voice / phone', 'Anyone'], ['Smishing', 'SMS text', 'Anyone']] }],
    takeaways: [
      'Attack surface = every entry point. Reduce it by removing services, ports, software, accounts and default credentials.',
      'Unsupported (end-of-life) systems are a vector because they no longer receive patches.',
      'Supply chain attacks abuse trusted vendors, MSPs and software updates.',
      'Know the social engineering vocabulary: phishing, vishing, smishing, BEC, pretexting, watering hole, typosquatting, brand impersonation.',
      'Defend payment-change requests with out-of-band verification.'
    ]
  });

  SEC.addLesson('2.3', {
    title: 'Types of Vulnerabilities',
    minutes: 30,
    intro: 'A <strong>vulnerability</strong> is a weakness that a threat can exploit. This lesson explains how the major vulnerability classes work (memory, race conditions, injection, hardware, virtualization, cloud, supply chain, crypto, misconfiguration, mobile and zero-day) so you can spot them in a scenario.',
    terms: [
      ['Exploit', 'Code or a technique that takes advantage of a vulnerability.'],
      ['Buffer overflow', 'Writing more data into a memory buffer than it can hold, overwriting adjacent memory.'],
      ['Memory injection', 'Inserting malicious code into the memory of a running process (e.g., DLL injection).'],
      ['Race condition / TOC-TOU', 'A flaw where the outcome depends on timing; Time-of-Check to Time-of-Use is a common form.'],
      ['SQLi', 'SQL injection: user input altering a database query.'],
      ['XSS', 'Cross-site scripting: injecting script into a page that runs in other users’ browsers.'],
      ['VM escape', 'Breaking out of a virtual machine to reach the hypervisor or other VMs.'],
      ['Zero-day', 'A vulnerability unknown to the vendor, so no patch exists yet.'],
      ['Sideloading', 'Installing mobile apps from outside the official app store.']
    ],
    sections: [
      {
        h: 'Application vulnerabilities',
        body: '<ul><li><strong>Buffer overflow</strong>: a program copies input into a fixed-size buffer without checking length. Excess data overwrites adjacent memory, which can crash the program or redirect execution to attacker code. Defenses: bounds checking, memory-safe languages, ASLR, DEP/NX.</li>' +
          '<li><strong>Memory injection</strong>: malicious code is placed in another process’s memory (DLL injection, process hollowing) to hide and inherit privileges.</li>' +
          '<li><strong>Race conditions</strong>: two operations interfere because of timing. In a <strong>TOC/TOU</strong> bug, a program checks a condition (file permissions, balance) and then uses the resource; the attacker changes it in between.</li>' +
          '<li><strong>Malicious update</strong>: an attacker compromises the update channel so the trusted updater installs malware.</li></ul>',
        diagram: D.flow([{ t: 'Check', sub: 'balance ≥ $100?' }, { t: 'Gap', sub: 'attacker sends a 2nd withdrawal', tone: 'bad' }, { t: 'Use', sub: 'withdraw $100' }, { t: 'Result', sub: 'both succeed: overdraft', tone: 'warn' }], 'A time-of-check to time-of-use (TOC/TOU) race condition'),
        check: { q: 'A gift card website lets the same card be redeemed twice when two redemption requests arrive at almost the same moment. Which vulnerability is this?', o: [
          ['Buffer overflow', 'No memory is overwritten.'],
          ['Race condition', 'Simultaneous requests exploit the gap between checking the balance and using it.', true],
          ['SQL injection', 'No database query is altered by input.'],
          ['Cross-site scripting', 'No script is injected into a page.']
        ] }
      },
      {
        h: 'Web-based: SQL injection and XSS',
        body: '<p><strong>SQL injection (SQLi)</strong> happens when user input is pasted directly into a query. Input like <code>\' OR 1=1 --</code> changes the logic and can dump or modify the database. Fix: <strong>parameterized queries/prepared statements</strong> plus input validation.</p>' +
          '<p><strong>Cross-site scripting (XSS)</strong> happens when a site includes untrusted input in a page without encoding it, so a script tag such as <code>&lt;script&gt;…&lt;/script&gt;</code> runs in victims’ browsers. It can steal session cookies. <em>Stored</em> XSS is saved on the server (e.g., a comment); <em>reflected</em> XSS bounces off a request parameter in a crafted link. Fix: output encoding, input validation, Content Security Policy, HttpOnly cookies.</p>',
        compare: { title: 'SQL injection vs Cross-site scripting', head: ['', 'SQL injection', 'Cross-site scripting'], rows: [['Where the code runs', 'Database server', 'Victim’s browser'], ['Attacker goal', 'Read/modify data, bypass login', 'Steal sessions, deface, redirect'], ['Telltale input', '<code>\' OR 1=1--</code>, <code>UNION SELECT</code>', '<code>&lt;script&gt;</code>, <code>onerror=</code>, <code>javascript:</code>'], ['Primary fix', 'Parameterized queries', 'Output encoding + CSP']] },
        check: { q: 'Which control most directly prevents SQL injection?', o: [
          ['Parameterized queries', 'They keep user data separate from SQL code, so input can’t change the query.', true],
          ['TLS encryption', 'TLS protects data in transit, not the query logic.'],
          ['Output encoding', 'That is the main defense against XSS.'],
          ['Disk encryption', 'This protects stored data from physical theft.']
        ] }
      },
      {
        h: 'OS, hardware and legacy',
        body: '<ul><li><strong>Operating system</strong> vulnerabilities (privilege escalation bugs, unpatched services) are fixed through patch management.</li>' +
          '<li><strong>Firmware</strong>: low-level code in devices (BIOS/UEFI, NICs, routers). It is often overlooked in patching and can persist even after the OS is reinstalled.</li>' +
          '<li><strong>End-of-life (EOL)</strong>: the vendor no longer supports the product, so no patches arrive. <strong>Legacy</strong> systems are old but still in use, often because a critical app depends on them.</li></ul>'
      },
      {
        h: 'Virtualization and cloud',
        body: '<ul><li><strong>VM escape</strong>: code in a guest VM breaks out to the hypervisor and can reach every other VM on that host. This is the most serious virtualization risk.</li>' +
          '<li><strong>Resource reuse</strong>: memory or storage released by one VM and given to another without being wiped can leak data.</li>' +
          '<li><strong>Cloud-specific</strong>: misconfigured storage buckets open to the public, overly permissive IAM roles, exposed management APIs, and a shared responsibility model that customers misunderstand.</li></ul>'
      },
      {
        h: 'Supply chain, crypto, misconfiguration, mobile, zero-day',
        body: '<ul><li><strong>Supply chain</strong>: vulnerabilities introduced by <em>service providers</em>, <em>hardware providers</em> (tampered components) or <em>software providers</em> (compromised libraries or updates).</li>' +
          '<li><strong>Cryptographic</strong>: weak algorithms (MD5, DES, RC4), short keys, poor random number generation, expired or self-signed certificates in production.</li>' +
          '<li><strong>Misconfiguration</strong>: default settings, open shares, unnecessary services, verbose error messages. This is one of the most common real-world causes of breaches.</li>' +
          '<li><strong>Mobile</strong>: <strong>sideloading</strong> (apps from outside the official store, which skips vetting) and <strong>jailbreaking/rooting</strong> (removes OS restrictions and security model).</li>' +
          '<li><strong>Zero-day</strong>: unknown to the vendor, so no patch exists. Defend with layered controls: EDR, behavior-based detection, segmentation, least privilege.</li></ul>',
        check: { q: 'An employee installs a game on a company phone from a third-party website because it isn’t in the official store. What mobile vulnerability does this create?', o: [
          ['Jailbreaking', 'Jailbreaking removes OS restrictions; installing from a third-party site is sideloading.'],
          ['Sideloading', 'Installing apps from outside the official store bypasses app vetting.', true],
          ['VM escape', 'This involves virtual machines, not phones.'],
          ['Resource reuse', 'This involves memory or storage reallocation.']
        ] }
      }
    ],
    takeaways: [
      'Buffer overflow = writing past a memory boundary; race condition/TOC-TOU = timing gap between check and use.',
      'SQLi runs in the database (fix: parameterized queries); XSS runs in the browser (fix: output encoding, CSP).',
      'EOL and legacy systems can’t be patched. Isolate them as a compensating control.',
      'VM escape threatens every VM on a host; resource reuse can leak data between tenants.',
      'Sideloading and jailbreaking undermine mobile security; zero-days have no patch, so rely on layered defenses.'
    ]
  });

  SEC.addLesson('2.4', {
    title: 'Indicators of Malicious Activity',
    minutes: 40,
    intro: 'This is a <em>“given a scenario”</em> objective: you will read logs or symptoms and identify the attack. The trick is to link each attack to its <strong>observable indicators</strong>. This lesson covers malware, physical, network, application, cryptographic and password attacks, and the general red flags analysts look for.',
    terms: [
      ['IoC', 'Indicator of Compromise. Evidence that an attack occurred or is in progress (hash, IP, domain, log pattern).'],
      ['DDoS', 'Distributed Denial of Service. Many sources overwhelm a target.'],
      ['On-path attack', 'Attacker positions between two parties to intercept or alter traffic (formerly man-in-the-middle).'],
      ['Replay attack', 'Capturing valid data (e.g., an authentication token) and re-sending it.'],
      ['Privilege escalation', 'Gaining higher permissions than intended.'],
      ['CSRF', 'Cross-Site Request Forgery. Tricks a logged-in user’s browser into sending an unwanted request.'],
      ['Downgrade attack', 'Forcing use of an older, weaker protocol or cipher.'],
      ['Password spraying', 'Trying a few common passwords against many accounts.']
    ],
    sections: [
      {
        h: 'Malware types and their indicators',
        body: '<ul><li><strong>Ransomware</strong>: files encrypted with new extensions, ransom notes, high disk activity, deleted shadow copies.</li>' +
          '<li><strong>Trojan</strong>: malware disguised as legitimate software; often installs a <strong>RAT</strong> (remote access trojan).</li>' +
          '<li><strong>Worm</strong>: <em>self-propagates</em> across the network without user action. Indicators: sudden scanning traffic, many hosts infected quickly.</li>' +
          '<li><strong>Virus</strong>: attaches to files and needs a user to run the host file to spread.</li>' +
          '<li><strong>Spyware</strong>: monitors activity and steals information. <strong>Keylogger</strong>: records keystrokes.</li>' +
          '<li><strong>Bloatware</strong>: unwanted preinstalled software that increases attack surface.</li>' +
          '<li><strong>Logic bomb</strong>: malicious code that waits for a trigger (a date, or an employee’s removal from payroll).</li>' +
          '<li><strong>Rootkit</strong>: hides deep in the OS or firmware, conceals itself and other malware, and survives normal detection. Often requires reimaging.</li></ul>',
        compare: { title: 'Commonly confused: Virus vs Worm vs Trojan', head: ['', 'Virus', 'Worm', 'Trojan'], rows: [['Spreads by', 'Infected files run by users', 'Itself, over networks', 'Users installing it'], ['Needs user action?', 'Yes', 'No', 'Yes (to install)'], ['Key clue', 'Infected executables/docs', 'Rapid spread, scanning', 'Looks like legitimate software']] },
        check: { q: 'A former developer’s code deletes the payroll database 30 days after his account is disabled. What is this?', o: [
          ['Worm', 'There is no self-propagation.'],
          ['Logic bomb', 'Malicious code that runs when a condition is met (here, account disabled for 30 days) is a logic bomb.', true],
          ['Rootkit', 'Rootkits hide malware; this is a triggered payload.'],
          ['Spyware', 'Spyware gathers information; it doesn’t destroy data on a trigger.']
        ] }
      },
      {
        h: 'Physical attacks',
        body: '<ul><li><strong>Brute force</strong> (physical): forcing doors, locks or devices.</li><li><strong>RFID cloning</strong>: copying an access badge’s signal with a reader so the attacker can enter as the victim. Indicator: badge used at two places at once, or entry logs for someone known to be elsewhere.</li>' +
          '<li><strong>Environmental</strong>: attacking power, HVAC or fire suppression to cause outages.</li></ul>'
      },
      {
        h: 'Network attacks',
        body: '<ul><li><strong>DDoS</strong>: floods from many sources. <em>Reflected</em> attacks spoof the victim’s IP so third-party servers reply to the victim. <em>Amplified</em> attacks use protocols where a small request triggers a large response (DNS, NTP, memcached).</li>' +
          '<li><strong>DNS attacks</strong>: <em>DNS poisoning</em> (false records in a cache), <em>domain hijacking</em> (taking over registration), <em>DNS tunneling</em> (exfiltrating data in DNS queries; look for long, random-looking subdomains).</li>' +
          '<li><strong>Wireless</strong>: <em>evil twin</em> (rogue AP with the same SSID), <em>rogue AP</em>, <em>deauthentication</em> attacks, <em>jamming</em>.</li>' +
          '<li><strong>On-path</strong>: ARP poisoning on a LAN lets the attacker intercept traffic. Indicator: duplicate MAC addresses for the gateway IP in ARP tables.</li>' +
          '<li><strong>Credential replay</strong>: reusing captured hashes or tokens (pass-the-hash).</li><li><strong>Malicious code</strong>: scripts or payloads delivered over the network.</li></ul>',
        diagram: D.flow([{ t: 'Attacker', sub: 'spoofs victim IP', tone: 'bad' }, { t: 'Open DNS resolvers', sub: '60-byte query in', tone: 'warn' }, { t: 'Victim', sub: '3,000-byte answers flood in', tone: 'bad' }], 'Reflected and amplified DDoS'),
        check: { q: 'DNS logs show thousands of queries from one workstation for names like a8f3k2...x9.badexample.net, each with a long random-looking subdomain. What is most likely happening?', o: [
          ['DNS poisoning', 'Poisoning corrupts resolver caches; it doesn’t produce long encoded queries from one client.'],
          ['DNS tunneling / exfiltration', 'Data encoded into long subdomains of an attacker-controlled domain is the classic tunneling indicator.', true],
          ['Amplified DDoS', 'That would show large responses directed at a victim, not outbound encoded queries.'],
          ['Typosquatting', 'Typosquatting relies on mistyped names, not encoded data.']
        ] }
      },
      {
        h: 'Application attacks',
        body: '<ul><li><strong>Injection</strong> (SQL, command, LDAP): look for quotes, <code>OR 1=1</code>, <code>UNION SELECT</code>, <code>; cat /etc/passwd</code> in requests.</li>' +
          '<li><strong>Buffer overflow</strong>: very long input strings, often with repeated characters or NOP sleds (<code>\\x90\\x90…</code>), followed by crashes.</li>' +
          '<li><strong>Replay</strong>: the same session token or transaction reused; defended by nonces and timestamps.</li><li><strong>Privilege escalation</strong>: a normal user suddenly runs admin commands.</li>' +
          '<li><strong>Forgery</strong>: <em>CSRF</em> (victim’s browser sends an unwanted request using their session) and <em>SSRF</em> (server-side request forgery: the server is tricked into requesting internal resources such as cloud metadata).</li>' +
          '<li><strong>Directory traversal</strong>: <code>../../../../etc/passwd</code> or <code>..%2f</code> in URLs to read files outside the web root.</li></ul>',
        check: { q: 'A web log contains: GET /download?file=../../../../etc/shadow. Which attack is being attempted?', o: [
          ['Directory traversal', 'The ../ sequences try to climb out of the web directory to read system files.', true],
          ['Cross-site scripting', 'There is no script content.'],
          ['SQL injection', 'There is no SQL syntax.'],
          ['CSRF', 'CSRF abuses a victim’s session; this is direct file path manipulation.']
        ] }
      },
      {
        h: 'Cryptographic and password attacks',
        body: '<ul><li><strong>Downgrade</strong>: forcing a connection to fall back to an old protocol (e.g., SSL 3.0) with known weaknesses.</li>' +
          '<li><strong>Collision</strong>: finding two inputs with the same hash (MD5, SHA-1 weaknesses).</li><li><strong>Birthday attack</strong>: uses probability math to find collisions much faster than brute force.</li>' +
          '<li><strong>Brute force</strong>: many passwords against <em>one</em> account. It triggers lockouts on that account.</li><li><strong>Password spraying</strong>: a <em>few</em> common passwords against <em>many</em> accounts, slowly, to avoid lockouts.</li></ul>',
        compare: { title: 'Brute force vs Password spraying', head: ['', 'Brute force', 'Password spraying'], rows: [['Pattern', 'Many passwords → one account', 'One password → many accounts'], ['Lockouts', 'Yes, on the targeted account', 'Rarely (stays under thresholds)'], ['Log signature', 'Burst of failures for one username', 'One or two failures for each of many usernames, often from one source']] }
      },
      {
        h: 'General indicators',
        body: '<ul><li><strong>Account lockout</strong>: may mean brute force.</li><li><strong>Concurrent session usage</strong>: one account active from two places at once.</li>' +
          '<li><strong>Blocked content</strong>: security tools blocking access attempts to known-bad sites.</li><li><strong>Impossible travel</strong>: logins from New York and Singapore 10 minutes apart.</li>' +
          '<li><strong>Resource consumption</strong>: unusual CPU, memory or bandwidth (cryptomining, exfiltration).</li><li><strong>Resource inaccessibility</strong>: files encrypted, services down.</li>' +
          '<li><strong>Out-of-cycle logging</strong>: log entries at unusual times, such as admin activity at 3 a.m.</li><li><strong>Published/documented</strong>: your data appears on a leak site or in a news report.</li>' +
          '<li><strong>Missing logs</strong>: gaps or cleared logs suggest an attacker covering tracks.</li></ul>',
        check: { q: 'Authentication logs show a user signing in from Chicago at 09:02 and from Lagos at 09:15. What indicator is this?', o: [
          ['Out-of-cycle logging', 'This is about location and timing, not unusual log times.'],
          ['Impossible travel', 'No one can travel that distance in 13 minutes, which suggests credential compromise.', true],
          ['Resource consumption', 'No resource usage is described.'],
          ['Account lockout', 'The logins succeeded.']
        ] }
      }
    ],
    takeaways: [
      'Worms self-spread; viruses need a user; trojans masquerade; rootkits hide; logic bombs wait for a trigger.',
      'Reflected DDoS spoofs the victim’s IP; amplification abuses small-request/large-response protocols such as DNS and NTP.',
      'Long random subdomains point to DNS tunneling; duplicate gateway MACs point to ARP poisoning (on-path).',
      '<code>../</code> = directory traversal; <code>\' OR 1=1</code> = SQLi; script tags = XSS.',
      'Spraying = few passwords across many accounts; brute force = many passwords on one account.',
      'Impossible travel, concurrent sessions, missing logs and out-of-cycle activity are strong compromise indicators.'
    ]
  });

  SEC.addLesson('2.5', {
    title: 'Mitigation Techniques',
    minutes: 25,
    intro: 'Once you know the threats, how do you reduce risk? This objective lists the standard <strong>mitigation techniques</strong>. For each one, know <em>what attack it stops</em>. The exam often asks for the “best” mitigation for a specific situation.',
    terms: [
      ['Segmentation', 'Dividing a network into zones (VLANs, subnets) so a compromise in one zone doesn’t spread.'],
      ['Application allow list', 'Only explicitly approved applications may run; everything else is blocked.'],
      ['Isolation', 'Separating a system completely (quarantine, sandbox, air gap).'],
      ['Least privilege', 'Users and processes get only the access they need, nothing more.'],
      ['EDR', 'Endpoint Detection and Response. Monitors endpoints, detects threats and supports response.'],
      ['HIPS', 'Host-based Intrusion Prevention System. Blocks malicious activity on one host.'],
      ['Hardening', 'Reducing a system’s attack surface by removing unneeded components and securing settings.']
    ],
    sections: [
      {
        h: 'Network-level mitigations',
        body: '<ul><li><strong>Segmentation</strong>: put IoT, guest Wi-Fi, payment systems and servers on separate VLANs with firewall rules between them. This limits <em>lateral movement</em>.</li>' +
          '<li><strong>Access control</strong>: <em>ACLs</em> on routers/firewalls and <em>permissions</em> on files and apps.</li>' +
          '<li><strong>Isolation</strong>: quarantine infected hosts; sandbox suspicious files; air-gap critical systems.</li></ul>',
        diagram: D.zones([{ zone: 'Guest Wi-Fi', sub: 'internet only' }, { device: 'Firewall' }, { zone: 'Corporate LAN', sub: 'users' }, { device: 'Firewall' }, { zone: 'Payment segment', sub: 'card systems only', tone: 'good' }], 'Segmentation limits lateral movement between zones')
      },
      {
        h: 'Host-level mitigations',
        body: '<ul><li><strong>Application allow list</strong>: blocks unknown executables, including new malware, before it runs. Stronger than a deny list.</li>' +
          '<li><strong>Patching</strong>: fixes known vulnerabilities. The single most effective control against known exploits.</li>' +
          '<li><strong>Encryption</strong>: protects data if devices are lost or traffic is intercepted.</li><li><strong>Monitoring</strong>: detects what prevention misses.</li>' +
          '<li><strong>Least privilege</strong>: limits the blast radius when an account is compromised.</li><li><strong>Configuration enforcement</strong>: tools such as Group Policy or MDM keep systems at the approved baseline.</li>' +
          '<li><strong>Decommissioning</strong>: properly retire old systems: remove from networks and DNS, and sanitize storage.</li></ul>',
        check: { q: 'Kiosk PCs in a lobby keep getting infected by new malware that antivirus doesn’t yet recognize. Which mitigation would be MOST effective?', o: [
          ['Application allow listing', 'Only approved programs can run, so unknown malware is blocked even without a signature.', true],
          ['Signature-based antivirus updates', 'Signatures can’t catch malware that isn’t yet known.'],
          ['Full-disk encryption', 'This protects data at rest, not against execution of malware.'],
          ['Stronger passwords', 'The problem is executing malicious code, not authentication.']
        ] }
      },
      {
        h: 'Hardening techniques',
        body: '<ul><li><strong>Encryption</strong> of storage and communications.</li><li><strong>Installation of endpoint protection</strong> (EDR/antivirus).</li>' +
          '<li><strong>Host-based firewall</strong>: filters traffic on each device. It still protects laptops on hotel Wi-Fi.</li><li><strong>HIPS</strong>: blocks suspicious behaviors on the host.</li>' +
          '<li><strong>Disabling ports/protocols</strong>: turn off Telnet, FTP, SMBv1 and unused services.</li><li><strong>Default password changes</strong> on every device.</li>' +
          '<li><strong>Removal of unnecessary software</strong>: less code means fewer vulnerabilities.</li></ul>',
        diagram: D.layers([{ t: 'Policies & training', sub: 'managerial / operational' }, { t: 'Perimeter: firewall, email gateway', sub: 'network' }, { t: 'Segmentation & NAC', sub: 'internal network' }, { t: 'Host: EDR, host firewall, patching', sub: 'endpoint', tone: 'accent' }, { t: 'Application: allow list, input validation', sub: 'app', tone: 'accent' }, { t: 'Data: encryption, DLP', sub: 'data', tone: 'good' }], 'Defense in depth: layered mitigations'),
        check: { q: 'Which TWO actions harden a new Linux web server?', o: [
          ['Disable unused services such as FTP and Telnet', 'Removing unnecessary services reduces the attack surface.', true],
          ['Change default credentials and remove unused packages', 'Default passwords and unneeded software are common entry points.', true],
          ['Enable directory listing for easier troubleshooting', 'This exposes file structure to attackers; it weakens security.'],
          ['Run the web service as root', 'This violates least privilege: a compromise would give full control.']
        ] }
      }
    ],
    compare: [{ title: 'Commonly confused: Allow list vs Deny list', head: ['', 'Allow list (whitelist)', 'Deny list (blacklist)'], rows: [['Default', 'Deny everything not listed', 'Allow everything not listed'], ['Stops unknown threats?', 'Yes', 'No'], ['Admin effort', 'Higher (must approve each app)', 'Lower but always one step behind']] }],
    takeaways: [
      'Segmentation and isolation limit lateral movement and contain incidents.',
      'Application allow listing stops unknown malware; deny lists can’t.',
      'Patching addresses known vulnerabilities; least privilege limits damage from compromised accounts.',
      'Hardening = encryption, EDR, host firewall, HIPS, disabling unused ports/protocols, changing defaults, removing software.',
      'Decommission systems properly. Forgotten servers are easy targets.'
    ]
  });
})();
