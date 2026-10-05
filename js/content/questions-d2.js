/* Domain 2 question bank — original questions. */
SEC.addQuestions('2.1', [
  { d: 1, q: 'An attacker with little technical skill uses a downloaded exploit kit to deface a small website for bragging rights. Which threat actor is this?', o: [
    ['Nation-state', 'Nation-states are highly skilled and strategic.'],
    ['Unskilled attacker', 'Using others’ tools with little skill, for notoriety, is an unskilled attacker.', true],
    ['Organized crime', 'Organized crime seeks profit.'],
    ['Insider threat', 'Nothing suggests internal access.']
  ], ex: 'Unskilled attackers (script kiddies) rely on existing tools and are often motivated by thrills or recognition.' },
  { d: 1, q: 'Which threat actor is MOST likely to deploy ransomware and demand payment in cryptocurrency?', o: [
    ['Organized crime', 'Ransomware is a profit-driven business for criminal groups.', true],
    ['Hacktivist', 'Hacktivists seek publicity for causes rather than ransom.'],
    ['Shadow IT', 'Shadow IT isn’t an attacker.'],
    ['Nation-state seeking espionage', 'Espionage favors stealth, not ransom demands.']
  ], ex: 'Financial gain is the hallmark motivation of organized crime.' },
  { d: 2, q: 'A marketing team signs up for an unapproved cloud file-sharing service and uploads customer lists to collaborate with an agency. What does this represent?', o: [
    ['Hacktivism', 'There is no ideological attacker.'],
    ['Shadow IT', 'Technology used without IT approval or oversight is shadow IT.', true],
    ['Nation-state activity', 'No government actor is involved.'],
    ['Watering hole attack', 'No legitimate site was compromised.']
  ], ex: 'Shadow IT creates risk by putting data outside security controls, even with good intentions.' },
  { d: 2, s: 'A disgruntled systems administrator was told she will be laid off next month. Security notices she has been copying large volumes of design files to a personal USB drive.', q: 'Which actor and likely motivation does this describe?', o: [
    ['Insider threat: data exfiltration / revenge or financial gain', 'An employee misusing legitimate access to take data before leaving is a classic insider threat.', true],
    ['Hacktivist: political beliefs', 'Nothing indicates a political cause.'],
    ['Unskilled attacker: notoriety', 'She is an insider with legitimate access.'],
    ['Nation-state: war', 'No government involvement is indicated.']
  ], ex: 'Insiders bypass perimeter defenses. DLP, monitoring, least privilege and timely de-provisioning reduce this risk.' },
  { d: 2, q: 'Which attribute BEST distinguishes a nation-state actor from other actors?', o: [
    ['Use of phishing', 'Most actors use phishing.'],
    ['Extensive resources and sophistication, enabling long-term persistent campaigns', 'Government funding supports advanced, persistent operations (APTs).', true],
    ['Desire for public recognition', 'Nation-states usually prefer stealth.'],
    ['Lack of funding', 'Nation-states are well funded.']
  ], ex: 'Advanced persistent threats with custom tooling and long dwell times point to nation-states.' },
  { d: 2, q: 'A group leaks internal emails from an energy company to protest its environmental record and posts the leak on social media with a manifesto. What is the PRIMARY motivation?', o: [
    ['Financial gain', 'No payment is sought.'],
    ['Philosophical/political beliefs', 'The leak is meant to advance a cause.', true],
    ['Espionage', 'Espionage is covert, not publicized.'],
    ['Blackmail', 'No demand is made in exchange for silence.']
  ], ex: 'Hacktivists act from ideology and seek publicity.' },
  { d: 3, q: 'An attacker emails a CFO: “We have copies of your board minutes. Pay 20 BTC or we send them to journalists.” Which motivation is this?', o: [
    ['Blackmail', 'Threatening exposure unless paid is blackmail/extortion.', true],
    ['Service disruption', 'Nothing is disrupted.'],
    ['Ethical', 'Ethical hackers disclose responsibly, without threats.'],
    ['War', 'This isn’t state conflict.']
  ], ex: 'Blackmail uses the threat of disclosure to coerce payment or action.' },
  { d: 2, q: 'Which TWO factors would suggest an attack was carried out by an internal actor rather than an external one?', o: [
    ['The attacker used valid credentials and knew which server held payroll data', 'Legitimate credentials and internal knowledge point to an insider.', true],
    ['Activity occurred from a workstation inside the building using the employee’s badge to enter', 'Physical presence and badge use suggest an insider.', true],
    ['Traffic originated from a foreign botnet', 'This points to an external actor.'],
    ['The attack began with mass phishing of public addresses', 'This is a typical external initial access technique.']
  ], ex: 'Internal actors already have access and knowledge; external actors must gain them.' },
  { d: 3, q: 'A researcher discovers a vulnerability in a vendor’s product, reports it privately and waits for a patch before publishing. Which motivation is this?', o: [
    ['Ethical', 'Responsible disclosure to improve security is an ethical motivation.', true],
    ['Revenge', 'Nothing suggests retaliation.'],
    ['Disruption/chaos', 'The researcher avoided causing harm.'],
    ['Financial gain through extortion', 'No payment was demanded.']
  ], ex: 'Ethical hackers aim to improve security, often through responsible disclosure or bug bounty programs.' },
  { d: 3, s: 'During a regional military conflict, malware wipes hard drives at another country’s power distribution companies, causing blackouts.', q: 'Which motivation BEST fits?', o: [
    ['Financial gain', 'No profit is involved; wiper malware destroys data.'],
    ['War / service disruption by a nation-state', 'Destructive attacks on critical infrastructure during conflict are acts of cyber warfare.', true],
    ['Hacktivism for awareness', 'This is destructive state-level activity, not a protest.'],
    ['Insider revenge', 'No insider is indicated.']
  ], ex: 'Attacks on critical infrastructure tied to conflict reflect war or strategic disruption motivations.' }
]);

SEC.addQuestions('2.2', [
  { d: 1, q: 'An attacker sends text messages pretending to be a bank, asking recipients to click a link and “verify” their account. What is this?', o: [
    ['Vishing', 'Vishing uses voice calls.'],
    ['Smishing', 'Phishing via SMS text messages is smishing.', true],
    ['Whaling', 'Whaling targets executives, typically via email.'],
    ['Typosquatting', 'Typosquatting uses look-alike domains.']
  ], ex: 'Smishing = SMS phishing; vishing = voice phishing.' },
  { d: 1, q: 'Which practice MOST directly reduces the attack surface of a server?', o: [
    ['Disabling unused services and closing unnecessary ports', 'Fewer listening services means fewer entry points.', true],
    ['Adding more RAM', 'Capacity doesn’t change exposure.'],
    ['Increasing log verbosity', 'Logging aids detection, not exposure.'],
    ['Renaming the server', 'Names don’t change exposure meaningfully.']
  ], ex: 'Attack surface reduction removes entry points: services, ports, software, accounts.' },
  { d: 2, q: 'An attacker registers “paypa1-support.com” to capture users who mistype a payment site’s address. What is this?', o: [
    ['Typosquatting', 'Registering look-alike domains for mistyped URLs is typosquatting.', true],
    ['DNS poisoning', 'Poisoning corrupts DNS caches.'],
    ['Watering hole', 'A watering hole compromises a legitimate site.'],
    ['Pretexting', 'Pretexting is a fabricated story used in social engineering.']
  ], ex: 'Typosquatting and brand impersonation often go together. Monitor for and register look-alike domains.' },
  { d: 2, s: 'Attackers compromise a popular industry forum frequently visited by engineers at a specific aerospace firm and plant an exploit that targets visitors’ browsers.', q: 'Which attack technique are the attackers using?', o: [
    ['Spear phishing', 'No message was sent to victims.'],
    ['Watering hole', 'Compromising a site the target group visits is a watering hole attack.', true],
    ['Business email compromise', 'BEC involves email accounts and payments.'],
    ['Supply chain attack via MSP', 'No service provider is involved.']
  ], ex: 'Watering hole attacks wait for targets to come to a trusted site.' },
  { d: 2, q: 'A caller claims to be from the help desk, says there is an urgent problem with the user’s mailbox, and asks for the user’s MFA code. Which TWO techniques are being used?', o: [
    ['Vishing', 'The attack is conducted via a voice call.', true],
    ['Impersonation / pretexting', 'The caller fabricates an identity and story to gain trust.', true],
    ['Typosquatting', 'No domains are involved.'],
    ['Watering hole', 'No website is compromised.']
  ], ex: 'Voice-based social engineering combines impersonation, pretext and urgency. Users should verify through known channels and never share MFA codes.' },
  { d: 2, q: 'Why are end-of-life operating systems considered a significant threat vector?', o: [
    ['They no longer receive security patches, so new vulnerabilities stay exploitable', 'Unsupported systems accumulate unpatched vulnerabilities.', true],
    ['They can’t connect to networks', 'They usually still can.'],
    ['They always contain malware', 'Not inherently.'],
    ['They use too much bandwidth', 'Bandwidth isn’t the concern.']
  ], ex: 'Unsupported systems should be upgraded, replaced or isolated with compensating controls.' },
  { d: 2, q: 'An attacker compromises a managed service provider and uses its remote management tool to push ransomware to the MSP’s clients. What type of vector is this?', o: [
    ['Supply chain', 'Abusing a trusted third-party provider is a supply chain attack.', true],
    ['Removable media', 'No physical media was used.'],
    ['Default credentials', 'The vector is the MSP relationship.'],
    ['Bluetooth', 'No wireless personal area network is involved.']
  ], ex: 'MSPs, vendors and software suppliers are part of your attack surface. Assess and monitor them.' },
  { d: 1, q: 'Which of the following is an image-based threat vector?', o: [
    ['A QR code in a flyer that leads to a credential-harvesting site', 'Malicious content delivered through an image (QR code) is an image-based vector.', true],
    ['A phone call from a fake vendor', 'That is voice-based.'],
    ['A USB drive left in a lobby', 'That is removable media.'],
    ['An open Telnet port', 'That is an open service port.']
  ], ex: 'QR-code phishing (“quishing”) hides URLs that users can’t easily inspect.' },
  { d: 3, s: 'An executive assistant receives an email that appears to come from the CEO’s real address: “I’m in a meeting and need you to buy $2,000 in gift cards for a client. Send me the codes ASAP.” Investigation shows the CEO’s account was taken over.', q: 'What attack is this, and which control BEST mitigates it?', o: [
    ['Business email compromise; require out-of-band verification for financial requests', 'BEC uses a compromised or spoofed executive account; verifying through a separate known channel stops it.', true],
    ['Typosquatting; register look-alike domains', 'The real account was used, not a look-alike domain.'],
    ['Watering hole; patch browsers', 'No website was involved.'],
    ['Smishing; block SMS', 'The attack arrived by email.']
  ], ex: 'BEC relies on trust and urgency. Out-of-band verification and MFA on executive accounts are key defenses.' },
  { d: 2, q: 'A home router is exposed to the internet with the manufacturer’s default username and password. Which vector does this represent?', o: [
    ['Default credentials', 'Unchanged vendor credentials are trivial for attackers to guess.', true],
    ['Misinformation', 'This involves false information campaigns.'],
    ['Supply chain', 'The vendor isn’t the attack path here.'],
    ['Smishing', 'No SMS is involved.']
  ], ex: 'Change default credentials on every device during deployment.' },
  { d: 3, q: 'Which statement BEST describes the difference between client-based and agentless software as a threat vector consideration?', o: [
    ['Client-based software requires an installed agent that itself must be patched; agentless solutions avoid installing software but rely on network access to the target', 'Installed agents add code to maintain; agentless approaches depend on remote access methods.', true],
    ['Agentless software can’t have vulnerabilities', 'Any software can have vulnerabilities.'],
    ['Client-based software only runs in the cloud', 'Client-based software runs on endpoints.'],
    ['There is no security difference', 'Each has distinct exposure considerations.']
  ], ex: 'Both models expand the attack surface differently: agents add software to patch, agentless needs remote access and credentials.' },
  { d: 2, q: 'False social media posts claiming a company’s product causes illness are deliberately spread by a competitor. Which human vector is this?', o: [
    ['Disinformation', 'Intentionally false information spread to mislead is disinformation.', true],
    ['Pretexting', 'Pretexting targets an individual with a fabricated scenario.'],
    ['Brand impersonation', 'The attackers aren’t posing as the brand.'],
    ['Vishing', 'No calls are involved.']
  ], ex: 'Misinformation is false; disinformation is deliberately false. Both can damage reputation and influence behavior.' }
]);

SEC.addQuestions('2.3', [
  { d: 1, q: 'A program copies user input into a 64-byte buffer without checking its length. Which vulnerability exists?', o: [
    ['Buffer overflow', 'Unchecked input length can overwrite adjacent memory.', true],
    ['Race condition', 'No timing issue is described.'],
    ['Cross-site scripting', 'XSS involves web pages.'],
    ['Misconfiguration', 'This is a coding flaw.']
  ], ex: 'Bounds checking, memory-safe languages, ASLR and DEP mitigate buffer overflows.' },
  { d: 2, q: 'A login form sends the input `admin\' --` and the attacker is logged in without a password. Which vulnerability was exploited?', o: [
    ['SQL injection', 'The input altered the SQL query, commenting out the password check.', true],
    ['Directory traversal', 'No file paths are involved.'],
    ['Cross-site request forgery', 'CSRF abuses a victim’s session.'],
    ['Buffer overflow', 'The input is short and alters query logic.']
  ], ex: 'Use parameterized queries so input is treated as data, never as SQL code.' },
  { d: 2, q: 'A forum lets users post comments containing script tags that run in other visitors’ browsers and steal their session cookies. Which vulnerability is this?', o: [
    ['Stored cross-site scripting', 'Malicious script saved on the server and served to others is stored XSS.', true],
    ['SQL injection', 'The code runs in browsers, not the database.'],
    ['VM escape', 'Unrelated to virtualization.'],
    ['Race condition', 'No timing issue.']
  ], ex: 'Defend with output encoding, input validation, Content Security Policy and HttpOnly cookies.' },
  { d: 2, q: 'Malicious code running inside a guest virtual machine gains access to the hypervisor and other guests on the host. What is this?', o: [
    ['VM escape', 'Breaking out of a VM to the hypervisor is VM escape.', true],
    ['VM sprawl', 'Sprawl is uncontrolled growth of VMs.'],
    ['Resource reuse', 'Resource reuse leaks leftover data between VMs.'],
    ['Sideloading', 'Sideloading concerns mobile apps.']
  ], ex: 'VM escape is the most severe virtualization risk because one compromise can reach every tenant on the host.' },
  { d: 2, q: 'A program checks that a temporary file is owned by the user, then opens it a moment later. An attacker swaps the file for a symbolic link to /etc/shadow in between. What vulnerability is this?', o: [
    ['Time-of-check to time-of-use (TOC/TOU)', 'The resource changed between the check and the use.', true],
    ['Memory injection', 'No code is injected into memory.'],
    ['Cross-site scripting', 'Unrelated to web pages.'],
    ['Zero-day', 'Zero-day refers to disclosure status, not this flaw type.']
  ], ex: 'TOC/TOU is a race condition. Fix it with atomic operations and by not re-resolving resources after checks.' },
  { d: 1, q: 'Which term describes a vulnerability that is unknown to the vendor and has no patch available?', o: [
    ['Zero-day', 'Zero-days have no vendor fix at the time of exploitation.', true],
    ['End-of-life', 'EOL means support ended.'],
    ['Legacy', 'Legacy means old but still in use.'],
    ['False positive', 'This is an incorrect scan finding.']
  ], ex: 'Layered defenses (EDR, segmentation, least privilege) reduce zero-day impact.' },
  { d: 2, q: 'A user removes manufacturer restrictions from an iPhone to install apps and tweaks not allowed by Apple. What is this called?', o: [
    ['Jailbreaking', 'Removing iOS restrictions is jailbreaking (rooting on Android).', true],
    ['Sideloading', 'Sideloading is installing apps from outside the store; it may follow jailbreaking but isn’t the same thing.'],
    ['Tokenization', 'Unrelated.'],
    ['Code signing', 'Code signing verifies software publishers.']
  ], ex: 'Jailbroken or rooted devices bypass the OS security model. MDM can detect and block them.' },
  { d: 3, s: 'Attackers compromise a software vendor’s build server and insert a backdoor into a legitimately signed update that thousands of customers install automatically.', q: 'Which TWO vulnerability types does this illustrate?', o: [
    ['Supply chain (software provider)', 'The compromise came through a trusted vendor.', true],
    ['Malicious update', 'The trusted update mechanism delivered malicious code.', true],
    ['Jailbreaking', 'Unrelated to mobile restrictions.'],
    ['Resource reuse', 'Unrelated to virtualization memory.']
  ], ex: 'Code signing alone can’t protect you if the vendor’s build process is compromised. Monitor vendors and use SBOMs and behavioral detection.' },
  { d: 2, q: 'A cloud storage bucket containing customer invoices is configured to allow public read access. Which vulnerability category is this?', o: [
    ['Misconfiguration', 'An insecure setting created the exposure.', true],
    ['Cryptographic', 'Encryption isn’t the issue.'],
    ['Buffer overflow', 'No memory corruption.'],
    ['Firmware', 'No device firmware is involved.']
  ], ex: 'Misconfigurations, especially in the cloud, cause many breaches. Use guard rails and configuration scanning.' },
  { d: 3, q: 'Why is firmware vulnerability remediation often more difficult than OS patching?', o: [
    ['Firmware updates often require vendor-specific tools, reboots and carry a risk of bricking devices, and many devices are overlooked in patch programs', 'Firmware patching is less automated and riskier, so it is frequently neglected.', true],
    ['Firmware can’t contain vulnerabilities', 'It certainly can.'],
    ['Firmware updates are always applied automatically', 'Many are manual.'],
    ['Firmware vulnerabilities only affect printers', 'Firmware exists in almost all hardware.']
  ], ex: 'Include BIOS/UEFI, NIC, storage controller and network device firmware in vulnerability management.' },
  { d: 3, q: 'A website still uses TLS 1.0 with RC4 cipher suites. Which vulnerability type is this?', o: [
    ['Cryptographic', 'Outdated protocols and weak ciphers are cryptographic vulnerabilities.', true],
    ['Race condition', 'No timing flaw is described.'],
    ['Memory injection', 'Not a memory issue.'],
    ['Sideloading', 'Mobile app issue.']
  ], ex: 'Disable deprecated protocols and ciphers; require TLS 1.2+ with strong suites.' },
  { d: 2, q: 'Memory released by one virtual machine is reassigned to another VM without being cleared, exposing fragments of the first VM’s data. Which vulnerability is this?', o: [
    ['Resource reuse', 'Data remnants exposed through reallocated resources is resource reuse.', true],
    ['VM escape', 'No breakout to the hypervisor occurred.'],
    ['Legacy hardware', 'Unrelated.'],
    ['Malicious update', 'Unrelated.']
  ], ex: 'Hypervisors should sanitize memory and storage before reallocating them.' }
]);

SEC.addQuestions('2.4', [
  { d: 1, q: 'Malware spreads from host to host across a network automatically by exploiting an SMB vulnerability, with no user interaction. What type of malware is it?', o: [
    ['Worm', 'Self-propagation without user action defines a worm.', true],
    ['Virus', 'Viruses need a user to execute infected files.'],
    ['Trojan', 'Trojans rely on users installing disguised software.'],
    ['Logic bomb', 'A logic bomb waits for a trigger.']
  ], ex: 'Worms are identified by rapid, automatic spread and scanning traffic.' },
  { d: 1, q: 'Users report files renamed with a “.locked” extension and a text file demanding payment. Which malware is present?', o: [
    ['Ransomware', 'Encrypted files plus a ransom note are the hallmark of ransomware.', true],
    ['Spyware', 'Spyware hides and steals information.'],
    ['Adware/bloatware', 'This doesn’t encrypt files.'],
    ['Rootkit', 'Rootkits hide; they don’t demand ransom.']
  ], ex: 'Contain immediately by isolating infected hosts, then restore from clean backups.' },
  { d: 2, q: 'Authentication logs show one or two failed logins for each of 800 different accounts from the same IP address, using the password “Winter2025!”. What attack is this?', o: [
    ['Password spraying', 'Trying one common password across many accounts is spraying.', true],
    ['Brute force against one account', 'Brute force targets a single account with many passwords.'],
    ['Credential replay', 'Replay reuses captured credentials.'],
    ['Birthday attack', 'Birthday attacks find hash collisions.']
  ], ex: 'Spraying stays under per-account lockout thresholds. Detect it by correlating failures across accounts from a source.' },
  { d: 2, q: 'A security analyst sees `GET /index.php?page=../../../../etc/passwd` in web logs. Which attack is this?', o: [
    ['Directory traversal', 'Using ../ to escape the web root is directory traversal.', true],
    ['SQL injection', 'No SQL syntax is present.'],
    ['XSS', 'No script content is present.'],
    ['Buffer overflow', 'The input isn’t abnormally long.']
  ], ex: 'Validate and canonicalize file paths; run web services with least privilege.' },
  { d: 2, q: 'The ARP table on several workstations shows the default gateway IP mapped to a MAC address belonging to an unknown laptop. What attack is likely occurring?', o: [
    ['On-path attack via ARP poisoning', 'Spoofed ARP replies redirect traffic through the attacker.', true],
    ['DNS tunneling', 'This would show unusual DNS queries.'],
    ['Amplified DDoS', 'No flood of traffic is described.'],
    ['Evil twin', 'An evil twin is a rogue wireless AP.']
  ], ex: 'Dynamic ARP inspection and port security mitigate ARP poisoning.' },
  { d: 2, s: 'A user signs in to the VPN from Toronto at 10:05. At 10:20 the same account signs in to the email portal from an IP in Eastern Europe.', q: 'Which indicator is present?', o: [
    ['Impossible travel', 'The same user can’t physically be in both places 15 minutes apart.', true],
    ['Resource consumption', 'Nothing about resource use is described.'],
    ['Missing logs', 'Logs exist and show the activity.'],
    ['Blocked content', 'Nothing was blocked.']
  ], ex: 'Impossible travel often indicates stolen credentials. Respond by revoking sessions and resetting credentials.' },
  { d: 3, q: 'An attacker sends small DNS queries with a spoofed source IP to thousands of open resolvers, which send large responses to the victim. Which TWO terms describe this attack?', o: [
    ['Reflected', 'Responses are reflected off third-party servers toward the spoofed victim.', true],
    ['Amplified', 'Small requests generate much larger responses.', true],
    ['On-path', 'The attacker isn’t intercepting traffic.'],
    ['Replay', 'Nothing is being replayed.']
  ], ex: 'DNS, NTP and memcached have been abused for reflected/amplified DDoS. Mitigations include rate limiting, closing open resolvers and DDoS scrubbing.' },
  { d: 2, q: 'A badge reader log shows an employee entering the data center while HR records show the employee was on vacation abroad. Investigators find a small device near the parking lot reader. What attack is likely?', o: [
    ['RFID cloning', 'Copying the badge’s RFID credential allows entry as the employee.', true],
    ['Tailgating', 'Tailgating follows someone through; the log shows a badge read.'],
    ['Environmental attack', 'Environmental attacks target HVAC/power.'],
    ['Bluesnarfing', 'This targets Bluetooth devices.']
  ], ex: 'Use encrypted smart cards and MFA (badge + PIN) for sensitive areas.' },
  { d: 2, q: 'An attacker captures a valid authentication message on the network and later re-sends it to gain access. What attack is this?', o: [
    ['Replay attack', 'Re-sending captured valid data is a replay attack.', true],
    ['Downgrade attack', 'Downgrade forces weaker protocols.'],
    ['Privilege escalation', 'No higher privileges are sought.'],
    ['Collision', 'Collision concerns hashes.']
  ], ex: 'Timestamps, nonces and session tokens that expire defeat replay attacks.' },
  { d: 3, s: 'A user visits a malicious site while logged in to their bank in another tab. The site contains a hidden form that submits a funds transfer request to the bank, which processes it using the user’s session.', q: 'Which attack is the malicious site performing?', o: [
    ['Cross-site request forgery (CSRF)', 'The victim’s browser is tricked into sending an authenticated request.', true],
    ['Server-side request forgery (SSRF)', 'SSRF makes the server send requests.'],
    ['Stored XSS', 'No script was stored on the bank site.'],
    ['Session replay', 'The attacker never captured the session.']
  ], ex: 'Anti-CSRF tokens and SameSite cookies prevent CSRF.' },
  { d: 2, q: 'A standard user account suddenly adds itself to the Domain Admins group by exploiting an unpatched service. What does this indicate?', o: [
    ['Privilege escalation', 'Gaining higher permissions than authorized is privilege escalation.', true],
    ['Password spraying', 'No password guessing is described.'],
    ['DNS poisoning', 'Unrelated.'],
    ['Concurrent session usage', 'Unrelated.']
  ], ex: 'Monitor privileged group changes and patch promptly.' },
  { d: 3, q: 'An attacker on public Wi-Fi forces a victim’s connection to fall back from TLS 1.3 to an obsolete protocol with known weaknesses. Which attack is this?', o: [
    ['Downgrade attack', 'Forcing a weaker protocol version is a downgrade.', true],
    ['Birthday attack', 'Birthday attacks find hash collisions.'],
    ['Pass-the-hash', 'Unrelated.'],
    ['Jamming', 'Jamming disrupts radio signals.']
  ], ex: 'Disable legacy protocols on servers and clients so there is nothing to downgrade to.' },
  { d: 2, q: 'Security finds that the Windows Security event log on a compromised server was cleared at 03:12, just after a suspicious login. Which indicator is this?', o: [
    ['Missing logs', 'Cleared or absent logs suggest an attacker covering tracks.', true],
    ['Published/documented', 'This refers to data appearing publicly.'],
    ['Blocked content', 'Nothing was blocked.'],
    ['Account lockout', 'No lockout occurred.']
  ], ex: 'Forward logs to a central SIEM in real time so local tampering can’t erase evidence.' },
  { d: 3, q: 'A server’s CPU sits at 100% for days, outbound connections go to a known mining pool, and no business process explains it. What is the MOST likely cause?', o: [
    ['Cryptojacking malware', 'Unexplained resource consumption plus mining pool traffic indicates cryptomining malware.', true],
    ['A logic bomb', 'Logic bombs execute a payload on a trigger.'],
    ['Bloatware', 'Bloatware doesn’t contact mining pools.'],
    ['DNS poisoning', 'Unrelated.']
  ], ex: 'Resource consumption is a key indicator. Correlate it with network destinations.' },
  { d: 2, q: 'Malware that conceals its own processes and files by modifying the operating system kernel is BEST described as a:', o: [
    ['Rootkit', 'Rootkits hide at a deep level, often in the kernel or firmware.', true],
    ['Keylogger', 'Keyloggers record keystrokes.'],
    ['Worm', 'Worms self-propagate.'],
    ['Bloatware', 'Bloatware is unwanted preinstalled software.']
  ], ex: 'Rootkits are difficult to detect from the infected OS. Reimaging is usually required.' },
  { d: 3, s: 'A web application log contains a request whose “name” parameter contains 5,000 “A” characters followed by `\\x90\\x90\\x90` sequences. The application crashed immediately afterward.', q: 'What attack was MOST likely attempted?', o: [
    ['Buffer overflow', 'Very long input with NOP sled patterns, followed by a crash, indicates an overflow attempt.', true],
    ['Directory traversal', 'No path manipulation.'],
    ['CSRF', 'CSRF uses a victim’s session, not oversized input.'],
    ['Password spraying', 'Unrelated.']
  ], ex: 'Long repeated characters and NOP sleds (0x90) are classic buffer overflow indicators.' }
]);

SEC.addQuestions('2.5', [
  { d: 1, q: 'Which mitigation limits an attacker’s ability to move laterally from a compromised guest Wi-Fi device to internal servers?', o: [
    ['Network segmentation', 'Separate segments with filtering stop lateral movement.', true],
    ['Stronger Wi-Fi passwords', 'This doesn’t restrict movement once connected.'],
    ['Disk encryption', 'Unrelated to network movement.'],
    ['Log rotation', 'Unrelated.']
  ], ex: 'Segmentation (VLANs, firewalls) contains compromises within a zone.' },
  { d: 2, q: 'Which control BEST prevents unknown malicious executables from running on point-of-sale terminals?', o: [
    ['Application allow listing', 'Only explicitly approved software can run.', true],
    ['Antivirus deny list', 'Deny lists only block known malware.'],
    ['Password complexity', 'Unrelated to code execution.'],
    ['Full-disk encryption', 'Protects stored data only.']
  ], ex: 'Allow listing is ideal for fixed-function systems like POS terminals and kiosks.' },
  { d: 2, q: 'Which TWO are hardening techniques for a new workstation image?', o: [
    ['Removing unnecessary preinstalled software', 'Less software means less attack surface.', true],
    ['Enabling a host-based firewall', 'A host firewall filters traffic at the endpoint.', true],
    ['Granting users local administrator rights', 'This increases risk.'],
    ['Leaving default passwords for support convenience', 'Defaults are a common attack vector.']
  ], ex: 'Hardening reduces the attack surface and enforces secure settings.' },
  { d: 2, q: 'A database service account currently has domain administrator rights but only needs read/write access to one database. Which principle should be applied?', o: [
    ['Least privilege', 'Give accounts only the permissions they need.', true],
    ['Separation of duties', 'This splits tasks among people.'],
    ['Defense in depth', 'Layering controls is good practice but isn’t the specific fix.'],
    ['Implicit deny', 'That applies to rule sets.']
  ], ex: 'Over-privileged service accounts are a top target. Compromise of one would grant domain-wide control.' },
  { d: 2, q: 'An infected laptop is detected. Which mitigation should the SOC apply immediately to prevent spread while preserving evidence?', o: [
    ['Isolate the host from the network (quarantine)', 'Isolation contains the threat and keeps the system intact for analysis.', true],
    ['Wipe and reimage immediately', 'This destroys evidence and should come later.'],
    ['Ignore until the next patch cycle', 'Delaying allows spread.'],
    ['Change the Wi-Fi password', 'This doesn’t isolate the specific host.']
  ], ex: 'Isolation (via EDR network containment or switch port) is a primary containment mitigation.' },
  { d: 1, q: 'Which mitigation directly addresses known vulnerabilities in operating systems and applications?', o: [
    ['Patching', 'Patches fix known flaws.', true],
    ['Monitoring', 'Monitoring detects but doesn’t fix.'],
    ['Encryption', 'Encryption protects data confidentiality.'],
    ['Decommissioning every server', 'Impractical and unnecessary.']
  ], ex: 'Timely patching is among the most effective security controls.' },
  { d: 3, s: 'An old file server has been replaced but still sits powered on in the rack, joined to the domain, with unpatched SMBv1 enabled.', q: 'What is the BEST mitigation?', o: [
    ['Properly decommission it: remove it from the network and domain, sanitize the drives', 'Decommissioning eliminates a forgotten, vulnerable system.', true],
    ['Add an antivirus agent', 'This leaves the unneeded system exposed.'],
    ['Change its hostname', 'Cosmetic only.'],
    ['Enable verbose logging', 'Detection doesn’t remove the risk.']
  ], ex: 'Systems that are no longer needed should be retired properly, not left running.' },
  { d: 2, q: 'Which mitigation ensures that systems remain at an approved secure configuration after deployment?', o: [
    ['Configuration enforcement (e.g., Group Policy, MDM, configuration management tools)', 'These tools continuously apply and correct settings.', true],
    ['Annual penetration testing', 'Testing finds problems periodically but doesn’t enforce settings.'],
    ['Data masking', 'Unrelated.'],
    ['Bug bounty program', 'Finds flaws, doesn’t enforce configuration.']
  ], ex: 'Configuration enforcement prevents drift from the secure baseline.' },
  { d: 3, q: 'What is the PRIMARY difference between a HIPS and a host-based firewall?', o: [
    ['A HIPS analyzes behavior and activity on the host to block attacks; a host firewall filters network connections by rules', 'HIPS looks at system and application behavior; firewalls filter traffic.', true],
    ['A host firewall can block exploits inside allowed traffic, but a HIPS cannot', 'It is the reverse: HIPS inspects behavior.'],
    ['They are identical', 'They serve different purposes.'],
    ['A HIPS only works on network appliances', 'HIPS is host-based by definition.']
  ], ex: 'Defense in depth uses both: firewall rules restrict connections; HIPS detects and blocks malicious behavior.' },
  { d: 2, q: 'Disabling Telnet and FTP on network devices is an example of which mitigation?', o: [
    ['Disabling unnecessary ports and protocols', 'Removing insecure or unused services is a hardening step.', true],
    ['Application allow listing', 'This controls which programs run.'],
    ['Encryption of data at rest', 'Unrelated.'],
    ['Monitoring', 'Monitoring observes rather than removes.']
  ], ex: 'Replace insecure management protocols with SSH and SFTP, and disable the old ones.' },
  { d: 3, s: 'A hospital must keep an MRI machine running an unsupported OS because the vendor certifies only that version. The machine needs to send images to the PACS server.', q: 'Which combination BEST mitigates the risk?', o: [
    ['Place it in an isolated segment with ACLs allowing only PACS traffic, and monitor it', 'Isolation plus tightly scoped access and monitoring compensates for the unpatchable OS.', true],
    ['Install the latest OS update without vendor approval', 'This may void certification and break the device.'],
    ['Allow it full internet access for remote vendor support', 'This increases exposure.'],
    ['Disconnect the PACS server instead', 'That breaks a critical workflow.']
  ], ex: 'When patching isn’t possible, segmentation, access control and monitoring act as compensating mitigations.' }
]);
