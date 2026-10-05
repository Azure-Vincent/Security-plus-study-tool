/* Domain 3 question bank — original questions. */
SEC.addQuestions('3.1', [
  { d: 1, q: 'In a SaaS model, who is responsible for patching the application software?', o: [
    ['The SaaS provider', 'In SaaS, the provider manages the application and everything beneath it.', true],
    ['The customer', 'Customers manage their data, users and access settings, not the app code.'],
    ['The customer’s ISP', 'ISPs don’t manage SaaS applications.'],
    ['No one', 'The provider is responsible.']
  ], ex: 'Customers always retain responsibility for data and identity/access configuration, even in SaaS.' },
  { d: 2, q: 'Which responsibility remains with the customer regardless of cloud service model (IaaS, PaaS or SaaS)?', o: [
    ['Managing user access and protecting their data', 'Data and identity/access are always the customer’s responsibility.', true],
    ['Physical security of data centers', 'This is always the provider’s responsibility.'],
    ['Hypervisor patching', 'Provider responsibility in cloud models.'],
    ['Network hardware maintenance', 'Provider responsibility.']
  ], ex: 'The shared responsibility model shifts layers to the provider but never your data or access decisions.' },
  { d: 2, q: 'What is a key security benefit of infrastructure as code (IaC)?', o: [
    ['Consistent, repeatable deployments that can be peer-reviewed and version-controlled', 'IaC reduces configuration drift and human error.', true],
    ['It eliminates the need for access control', 'Access control is still needed.'],
    ['It makes secrets impossible to leak', 'Secrets can still be accidentally committed.'],
    ['It removes the need for testing', 'Templates still need testing and scanning.']
  ], ex: 'IaC templates should be scanned for misconfigurations, because one error is replicated everywhere.' },
  { d: 2, q: 'Which TWO are security considerations specific to containerization compared with virtual machines?', o: [
    ['Containers share the host OS kernel, so a kernel exploit can affect all containers', 'Shared kernels mean weaker isolation than VMs.', true],
    ['Container images may include vulnerable packages and must be scanned', 'Image hygiene is a core container security task.', true],
    ['Each container requires its own full guest OS', 'That describes VMs.'],
    ['Containers can’t be orchestrated', 'Containers are commonly orchestrated (e.g., Kubernetes).']
  ], ex: 'Use minimal base images, scan images, avoid privileged containers, and patch the host kernel.' },
  { d: 2, q: 'A factory’s control network has no physical connection to any other network, and updates are delivered by scanned USB media. What design is this?', o: [
    ['Air-gapped (physical isolation)', 'No network connection to other networks is an air gap.', true],
    ['Logical segmentation with VLANs', 'VLANs share physical infrastructure.'],
    ['Software-defined networking', 'SDN is centrally programmed networking.'],
    ['Hybrid cloud', 'Unrelated.']
  ], ex: 'Air gaps give the strongest isolation, but removable media becomes the primary threat vector.' },
  { d: 3, q: 'What security risk is introduced by centralizing network control in an SDN controller?', o: [
    ['The controller becomes a high-value target and potential single point of failure', 'Compromise of the controller can reconfigure the whole network.', true],
    ['SDN prevents segmentation', 'SDN actually enables fine-grained segmentation.'],
    ['SDN eliminates the data plane', 'The data plane still forwards traffic.'],
    ['SDN cannot use encryption', 'Unrelated.']
  ], ex: 'Protect SDN controllers with strong authentication, segmentation, redundancy and monitoring.' },
  { d: 2, q: 'Which architecture is MOST appropriate for a function that resizes uploaded images, runs a few times per hour, and should not require server patching by the company?', o: [
    ['Serverless functions', 'The provider manages servers and runtime; you pay per execution.', true],
    ['On-premises bare-metal server', 'Requires full management.'],
    ['IaaS virtual machine', 'The customer patches the OS.'],
    ['Air-gapped workstation', 'Inappropriate for a web-triggered workload.']
  ], ex: 'Serverless reduces patching responsibility but you still secure code, permissions and data.' },
  { d: 2, q: 'Why are many IoT and embedded devices considered high risk?', o: [
    ['They often have default credentials, limited ability to patch, and constrained resources for security tools', 'These constraints make them easy targets that are hard to fix.', true],
    ['They always use strong encryption', 'Often they don’t.'],
    ['They can’t connect to networks', 'IoT devices are networked by definition.'],
    ['They have unlimited compute resources', 'Typically very limited.']
  ], ex: 'Segment IoT devices, change defaults and buy from vendors with update commitments.' },
  { d: 3, s: 'A utility runs SCADA systems controlling water pumps. Engineers want to connect them to the corporate network so they can view dashboards from their desks.', q: 'What is the BEST approach?', o: [
    ['Keep the OT network segmented and provide read-only data through a tightly controlled DMZ or data diode', 'This preserves isolation while enabling visibility.', true],
    ['Flatten the network so engineers have direct access', 'This exposes critical controllers to corporate threats.'],
    ['Expose the HMI to the internet with a strong password', 'Internet exposure of SCADA is extremely risky.'],
    ['Move the SCADA controllers into the cloud', 'Physical controllers can’t simply move to the cloud, and it adds risk.']
  ], ex: 'ICS/SCADA prioritize availability and safety. Segment them and allow only tightly controlled data flows.' },
  { d: 3, q: 'A company with seasonal traffic spikes wants to avoid buying hardware for peak capacity while maintaining availability. Which architecture consideration does the cloud BEST address?', o: [
    ['Scalability', 'Cloud resources scale up and down with demand.', true],
    ['Inability to patch', 'Unrelated to traffic spikes.'],
    ['Physical isolation', 'Unrelated.'],
    ['Risk of vendor lock-in', 'This is a drawback, not what the cloud addresses here.']
  ], ex: 'Elastic scalability is a major cloud benefit, with cost and availability trade-offs.' },
  { d: 2, q: 'Which characteristic defines a real-time operating system (RTOS)?', o: [
    ['Deterministic processing that guarantees responses within strict time limits', 'RTOSs prioritize predictable timing for embedded and safety-critical systems.', true],
    ['A graphical desktop for end users', 'RTOSs usually have no desktop.'],
    ['Automatic cloud backups', 'Unrelated.'],
    ['It runs only in containers', 'Unrelated.']
  ], ex: 'RTOS devices (medical, automotive, industrial) are hard to patch and require careful vendor coordination.' },
  { d: 2, q: 'A microservices application exposes 40 internal APIs. Which security concern increases compared with a monolithic application?', o: [
    ['A larger attack surface requiring strong service-to-service authentication and API security', 'More network-exposed components mean more entry points.', true],
    ['Inability to scale components independently', 'Microservices scale independently, which is a benefit.'],
    ['A single failure always brings down the whole app', 'Microservices can contain failures.'],
    ['No need for logging', 'Distributed systems need more logging.']
  ], ex: 'Use API gateways, mutual TLS, least privilege and centralized logging for microservices.' }
]);

SEC.addQuestions('3.2', [
  { d: 1, q: 'Where should a public-facing mail relay server be placed?', o: [
    ['In a screened subnet (DMZ)', 'Internet-facing services belong in the DMZ.', true],
    ['On the internal user LAN', 'This would expose internal systems if compromised.'],
    ['In the database segment', 'Back-end systems should not host public services.'],
    ['On an executive’s workstation', 'Inappropriate.']
  ], ex: 'The DMZ isolates exposed services from internal networks.' },
  { d: 2, q: 'An inline security appliance protecting a stock exchange’s order system fails. The business requires that no unfiltered traffic ever reaches the system. How should the appliance be configured?', o: [
    ['Fail-closed', 'Fail-closed blocks all traffic on failure, which favors security.', true],
    ['Fail-open', 'Fail-open would pass unfiltered traffic.'],
    ['Passive tap mode', 'A tap can’t enforce filtering.'],
    ['Disabled during peak hours', 'This defeats the purpose.']
  ], ex: 'Choose fail-closed when security outweighs availability, and fail-open when availability is paramount.' },
  { d: 2, q: 'Administrators must manage servers in a restricted zone. Servers should accept SSH/RDP only from one hardened, monitored host that requires MFA. What is this host called?', o: [
    ['Jump server', 'A jump server (bastion host) is the controlled gateway for admin access.', true],
    ['Load balancer', 'Load balancers distribute traffic.'],
    ['Forward proxy', 'Forward proxies handle user web traffic.'],
    ['Honeypot', 'A honeypot is a decoy.']
  ], ex: 'Jump servers concentrate admin access for strong authentication, logging and monitoring.' },
  { d: 2, q: 'Which device should be deployed to block SQL injection and cross-site scripting attacks against a company’s web application?', o: [
    ['Web application firewall (WAF)', 'A WAF inspects HTTP traffic for application-layer attacks.', true],
    ['Layer 4 firewall', 'It only sees IPs and ports.'],
    ['Network TAP', 'A TAP copies traffic; it doesn’t block.'],
    ['SNMP manager', 'Unrelated.']
  ], ex: 'WAFs complement secure coding by filtering malicious requests.' },
  { d: 2, q: 'Which TWO statements about IDS and IPS are correct?', o: [
    ['An IPS is deployed inline and can block traffic', 'Inline placement allows active prevention.', true],
    ['An IDS typically receives a copy of traffic via a SPAN port or TAP', 'Passive monitoring can’t disrupt traffic.', true],
    ['An IDS blocks malicious packets in real time', 'An IDS only alerts.'],
    ['An IPS can never cause a network outage', 'Inline devices can cause outages if they fail closed or misfire.']
  ], ex: 'IDS = passive/detective; IPS = active/inline/preventive.' },
  { d: 2, q: 'A company wants only company-owned, authenticated laptops to get access when plugged into any office switch port. What should be implemented?', o: [
    ['802.1X port-based authentication with a RADIUS server', '802.1X authenticates devices or users before the port passes traffic.', true],
    ['MAC address filtering only', 'MAC addresses are easily spoofed.'],
    ['A WAF', 'WAFs protect web apps.'],
    ['SD-WAN', 'SD-WAN connects sites.']
  ], ex: '802.1X with EAP-TLS and device certificates provides strong port security.' },
  { d: 3, q: 'Which firewall type can allow access to a corporate cloud storage tenant while blocking uploads to personal accounts on the same service, even though both use HTTPS on port 443?', o: [
    ['Next-generation firewall (layer 7 application awareness)', 'NGFWs identify applications and functions beyond ports.', true],
    ['Stateless packet filter', 'It can’t distinguish applications on the same port.'],
    ['Layer 4 stateful firewall', 'It sees ports and IPs, not application functions.'],
    ['Network TAP', 'TAPs don’t filter.']
  ], ex: 'Application-aware (layer 7) inspection, often with TLS inspection, enables granular control.' },
  { d: 2, q: 'Which secure communication option connects two branch offices’ networks over the internet so all traffic between them is encrypted?', o: [
    ['Site-to-site IPsec VPN in tunnel mode', 'Tunnel mode encrypts entire packets between gateways.', true],
    ['Remote access VPN for each user', 'This connects individual users, not networks.'],
    ['Telnet', 'Telnet is unencrypted.'],
    ['Port mirroring', 'Unrelated.']
  ], ex: 'Site-to-site VPNs connect networks; remote access VPNs connect users.' },
  { d: 3, s: 'A company has 60 small branch offices, each with a broadband and an LTE connection. IT wants centralized management of routing policies and automatic failover between links.', q: 'Which technology BEST fits?', o: [
    ['SD-WAN', 'SD-WAN centrally manages multiple WAN links and routing policies.', true],
    ['Air gap', 'Air gaps isolate networks.'],
    ['UTM in each branch with manual configuration', 'Lacks central policy orchestration across links.'],
    ['Honeynet', 'A decoy network.']
  ], ex: 'SD-WAN is often paired with SASE to add cloud-delivered security.' },
  { d: 2, q: 'A small business wants firewall, IPS, antivirus and web filtering in one appliance managed from a single console. What should it buy?', o: [
    ['UTM appliance', 'Unified threat management combines multiple security functions.', true],
    ['Network TAP', 'Copies traffic only.'],
    ['Load balancer', 'Distributes traffic.'],
    ['Jump server', 'Used for admin access.']
  ], ex: 'UTMs simplify management but are a single point of failure and can bottleneck performance.' },
  { d: 3, q: 'Which device placed in front of internal web servers can terminate TLS, hide server details, and distribute requests among servers?', o: [
    ['Reverse proxy', 'Reverse proxies sit in front of servers and handle inbound requests.', true],
    ['Forward proxy', 'Forward proxies serve internal clients going outbound.'],
    ['IDS sensor', 'A sensor monitors only.'],
    ['RADIUS server', 'Provides AAA.']
  ], ex: 'Reverse proxies are often combined with load balancing and WAF capabilities.' },
  { d: 2, q: 'A remote workforce needs secure web gateway, CASB, ZTNA and firewall capabilities delivered from the cloud close to users. What is this model called?', o: [
    ['SASE', 'Secure Access Service Edge converges networking and security in the cloud.', true],
    ['SCADA', 'Industrial control systems.'],
    ['SAN', 'Storage area network.'],
    ['SOAR', 'Security orchestration platform.']
  ], ex: 'SASE replaces backhauling traffic to HQ for inspection.' },
  { d: 3, s: 'A security architect must add intrusion detection to a hospital network. Clinical systems must never be interrupted by the security tool.', q: 'Which deployment and attribute combination is BEST?', o: [
    ['Passive IDS on a TAP/monitor port', 'A passive out-of-band sensor can’t interrupt traffic.', true],
    ['Inline IPS set to fail-closed', 'This could block clinical traffic.'],
    ['Inline IPS set to fail-open', 'Still inline and can misfire or add latency.'],
    ['Active firewall blocking all unknown traffic', 'Risky for clinical availability.']
  ], ex: 'Device attributes (active/passive, inline/tap) should match business priorities.' },
  { d: 1, q: 'What is the role of a RADIUS server in an 802.1X deployment?', o: [
    ['Authentication server that validates credentials', 'RADIUS checks credentials and returns accept/reject.', true],
    ['Supplicant', 'The supplicant is the client device.'],
    ['Authenticator', 'The switch or AP is the authenticator.'],
    ['Load balancer', 'Unrelated.']
  ], ex: 'Supplicant → authenticator → authentication server (RADIUS).' }
]);

SEC.addQuestions('3.3', [
  { d: 1, q: 'Data stored in a database on a server’s disk is in which state?', o: [
    ['At rest', 'Stored data is at rest.', true],
    ['In transit', 'In transit means moving across a network.'],
    ['In use', 'In use means being processed in memory.'],
    ['In escrow', 'Not a data state.']
  ], ex: 'Protect data at rest with disk, database or file encryption and access controls.' },
  { d: 2, q: 'Which method protects data in transit between a browser and a web server?', o: [
    ['TLS', 'TLS encrypts traffic over the network.', true],
    ['Full-disk encryption', 'Protects data at rest.'],
    ['Tokenization', 'Replaces data values; it doesn’t encrypt the channel.'],
    ['Hashing', 'Hashing provides integrity checks.']
  ], ex: 'TLS (HTTPS) is the standard for web data in transit.' },
  { d: 2, q: 'A European company must keep EU citizens’ personal data in EU-located data centers to comply with local law. Which concept is this?', o: [
    ['Data sovereignty', 'Data is subject to the laws of the country where it resides.', true],
    ['Data masking', 'Hides data values.'],
    ['Data minimization', 'Collecting only necessary data.'],
    ['Non-repudiation', 'Proof of actions.']
  ], ex: 'Cloud region selection must consider sovereignty and cross-border transfer rules.' },
  { d: 2, q: 'A customer service portal shows only the last four digits of a customer’s card number. What technique is used?', o: [
    ['Data masking', 'Hiding part of the value for display is masking.', true],
    ['Tokenization', 'Tokenization replaces the whole value with a token.'],
    ['Steganography', 'Hides data in other media.'],
    ['Hashing', 'One-way transformation of the whole value.']
  ], ex: 'Masking limits exposure to what users actually need to see.' },
  { d: 2, q: 'Which TWO are examples of regulated data?', o: [
    ['Patient health records', 'Health data is regulated (e.g., HIPAA).', true],
    ['Payment card numbers', 'Card data is governed by PCI DSS and laws.', true],
    ['A company’s public press release', 'Public information isn’t regulated in this sense.'],
    ['An internal lunch menu', 'Not regulated.']
  ], ex: 'Regulated data carries legal or contractual handling requirements.' },
  { d: 3, q: 'Which state of data is the MOST difficult to protect, and why?', o: [
    ['In use, because it must be decrypted in memory to be processed', 'Processing typically requires plaintext in RAM, exposing it to memory attacks.', true],
    ['At rest, because disks can’t be encrypted', 'Disks are easily encrypted.'],
    ['In transit, because TLS doesn’t exist for most protocols', 'Most protocols have secure versions.'],
    ['Archived, because backups can’t be encrypted', 'Backups can be encrypted.']
  ], ex: 'Secure enclaves and confidential computing address data in use.' },
  { d: 2, q: 'A company blocks logins to its HR portal from countries where it has no employees. Which data protection method is this?', o: [
    ['Geographic restrictions', 'Location-based access control limits where data can be accessed from.', true],
    ['Tokenization', 'Unrelated.'],
    ['Data classification', 'Labels sensitivity, doesn’t restrict location.'],
    ['Hashing', 'Unrelated.']
  ], ex: 'Geolocation-based rules reduce exposure to attacks from unexpected regions.' },
  { d: 3, s: 'A manufacturer’s secret chemical formula gives it a market advantage. It is not patented to avoid public disclosure.', q: 'How is this data BEST classified by type?', o: [
    ['Trade secret', 'Confidential information providing competitive advantage, protected by secrecy.', true],
    ['Public data', 'It is highly confidential.'],
    ['Regulated data', 'It isn’t governed by data protection regulation.'],
    ['Legal data', 'Not specifically legal records.']
  ], ex: 'Trade secrets depend entirely on staying confidential, so protect them with access control, DLP and NDAs.' },
  { d: 2, q: 'Which classification label is MOST appropriate for marketing brochures published on the company website?', o: [
    ['Public', 'Information intended for public release.', true],
    ['Restricted', 'For highly sensitive data.'],
    ['Confidential', 'For data that would harm the organization if disclosed.'],
    ['Critical', 'For data essential to operations.']
  ], ex: 'Classification drives handling. Public data still needs integrity protection.' },
  { d: 3, q: 'A developer needs realistic data to test a new billing system but must not see real customer details. Which approach is BEST?', o: [
    ['Use masked or synthetic data in the test environment', 'Masking/substitution provides realistic but non-sensitive test data.', true],
    ['Copy the production database directly', 'Exposes real data in a less secure environment.'],
    ['Encrypt production data and give the developer the key', 'The developer would still see real data.'],
    ['Hash all fields', 'Hashed data isn’t realistic for testing billing logic.']
  ], ex: 'Non-production environments should not contain real sensitive data.' },
  { d: 2, q: 'Which method protects sensitive data by placing systems that store it on a separate network zone with restricted access?', o: [
    ['Segmentation', 'Isolating sensitive systems limits who and what can reach them.', true],
    ['Obfuscation', 'Makes data hard to understand.'],
    ['Hashing', 'Integrity check.'],
    ['Steganography', 'Hides data in other media.']
  ], ex: 'PCI DSS scope reduction commonly uses segmentation of cardholder data environments.' }
]);

SEC.addQuestions('3.4', [
  { d: 1, q: 'Which recovery site has hardware and connectivity in place but requires data to be restored before operations resume?', o: [
    ['Warm site', 'Warm sites are partially ready and need data restoration.', true],
    ['Hot site', 'Hot sites have current data and are ready almost immediately.'],
    ['Cold site', 'Cold sites have only space and power.'],
    ['Mobile site only', 'Not the standard answer.']
  ], ex: 'Hot > warm > cold in readiness and cost.' },
  { d: 2, q: 'A business can tolerate losing at most 15 minutes of transaction data. What does this define?', o: [
    ['Recovery point objective (RPO)', 'RPO is the maximum acceptable data loss measured in time.', true],
    ['Recovery time objective (RTO)', 'RTO is acceptable downtime.'],
    ['MTBF', 'Reliability metric.'],
    ['MTTR', 'Repair time metric.']
  ], ex: 'An RPO of 15 minutes requires replication or backups at least every 15 minutes.' },
  { d: 2, q: 'Which technology distributes incoming requests across multiple active web servers so that one failed server doesn’t interrupt service?', o: [
    ['Load balancer', 'Load balancing spreads traffic across active servers.', true],
    ['UPS', 'Provides power.'],
    ['Tape backup', 'Recovery, not live availability.'],
    ['Cold site', 'Disaster recovery location.']
  ], ex: 'Load balancers also perform health checks to route around failed nodes.' },
  { d: 2, q: 'Which TWO practices help protect backups against ransomware?', o: [
    ['Keeping an offline or immutable backup copy', 'Ransomware can’t encrypt what it can’t reach or modify.', true],
    ['Regularly testing restores', 'Ensures backups are usable when needed.', true],
    ['Storing the only backup on a mapped network drive', 'Mapped drives are often encrypted by ransomware.'],
    ['Disabling backup encryption', 'Encryption protects confidentiality and doesn’t cause ransomware exposure.']
  ], ex: 'Follow 3-2-1 with an offline/immutable copy and test restores regularly.' },
  { d: 2, q: 'Why should a company place its disaster recovery site several hundred miles from its primary data center?', o: [
    ['Geographic dispersion prevents a single regional disaster from affecting both sites', 'Distance protects against regional events like hurricanes.', true],
    ['It reduces latency', 'Distance usually increases latency.'],
    ['It is always cheaper', 'Not necessarily.'],
    ['Regulations require exactly 500 miles', 'No universal rule.']
  ], ex: 'Balance distance against replication latency and cost.' },
  { d: 3, q: 'Which test runs the recovery system alongside the production system with the same inputs, so results can be compared without interrupting operations?', o: [
    ['Parallel processing', 'Both systems process simultaneously for comparison.', true],
    ['Failover test', 'Failover switches production to the backup.'],
    ['Tabletop exercise', 'Discussion-based only.'],
    ['Full interruption test', 'Shuts down production.']
  ], ex: 'Parallel processing validates the DR environment safely.' },
  { d: 1, q: 'What provides immediate short-term power to servers during a utility outage until generators start?', o: [
    ['UPS', 'An uninterruptible power supply bridges the gap with batteries.', true],
    ['Generator', 'Generators take time to start.'],
    ['Surge protector', 'Protects against spikes only.'],
    ['PDU', 'Distributes power; doesn’t store it.']
  ], ex: 'UPS for seconds to minutes; generators for hours or days.' },
  { d: 2, q: 'An organization uses two different cloud providers for its critical application so that an outage at one provider doesn’t stop service. What is this strategy?', o: [
    ['Multi-cloud', 'Using multiple providers reduces dependency on any one.', true],
    ['Hybrid cloud', 'Hybrid mixes on-premises and cloud.'],
    ['Private cloud', 'Single-organization cloud.'],
    ['Cold site', 'A DR facility.']
  ], ex: 'Multi-cloud improves resilience but adds complexity and skill requirements.' },
  { d: 3, s: 'A company’s ERP system must be back online within 4 hours of a disaster, and losing more than 1 hour of data is unacceptable.', q: 'Which combination BEST meets these requirements?', o: [
    ['Warm or hot site with hourly (or more frequent) replication', 'Hourly data protection meets the RPO; a ready site meets the 4-hour RTO.', true],
    ['Cold site with weekly tape backups', 'Fails both RTO and RPO.'],
    ['Hot site with weekly backups', 'Meets RTO but not RPO.'],
    ['Daily backups stored onsite only', 'Fails RPO and offers no site-level protection.']
  ], ex: 'RPO drives backup/replication frequency; RTO drives site readiness.' },
  { d: 2, q: 'Which backup technique records every change to data so that the system can be restored to a specific point in time?', o: [
    ['Journaling', 'Journals log changes for point-in-time recovery.', true],
    ['Full image only', 'A full image captures one moment, not every change.'],
    ['Data masking', 'Unrelated.'],
    ['Load balancing', 'Unrelated.']
  ], ex: 'Journaling, replication and snapshots each serve different recovery needs.' },
  { d: 2, q: 'Capacity planning for continuity should consider which TWO resources in addition to technology?', o: [
    ['People', 'Enough trained staff (and cross-training) is essential.', true],
    ['Infrastructure', 'Facilities, power and network capacity must be planned.', true],
    ['Marketing budgets', 'Not a continuity capacity element.'],
    ['Social media followers', 'Unrelated.']
  ], ex: 'Capacity planning covers people, technology and infrastructure.' },
  { d: 3, q: 'Why does platform diversity improve resilience?', o: [
    ['A single vulnerability or failure is less likely to affect every system at once', 'Different platforms don’t share all the same flaws.', true],
    ['It reduces administrative complexity', 'Diversity increases complexity.'],
    ['It eliminates the need for backups', 'Backups are still required.'],
    ['It guarantees lower costs', 'Often costs more.']
  ], ex: 'Diversity trades simplicity for reduced common-mode failure.' }
]);
