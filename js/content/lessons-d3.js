/* Domain 3: Security Architecture — original lesson content. */
(function () {
  var D = SEC.D;

  SEC.addLesson('3.1', {
    title: 'Architecture Models and Their Security Implications',
    minutes: 35,
    intro: 'Where and how systems run changes who secures what. This lesson compares cloud, on-premises, virtualized, containerized, serverless, IoT and industrial architectures, and the trade-offs each brings: availability, cost, patchability and more.',
    terms: [
      ['IaaS / PaaS / SaaS', 'Infrastructure / Platform / Software as a Service. Increasing levels of provider responsibility.'],
      ['Shared responsibility model', 'The division of security duties between a cloud provider and the customer.'],
      ['IaC', 'Infrastructure as Code. Defining infrastructure in version-controlled files (e.g., Terraform).'],
      ['Serverless', 'Running functions without managing servers; the provider manages the runtime.'],
      ['Microservices', 'An application built as many small, independent services that talk over APIs.'],
      ['SDN', 'Software-Defined Networking. Separates the network control plane from the data plane for central, programmable control.'],
      ['Air gap', 'Physical isolation with no network connection to other networks.'],
      ['ICS / SCADA', 'Industrial Control Systems / Supervisory Control and Data Acquisition. Control physical processes such as power grids and factories.'],
      ['RTOS', 'Real-Time Operating System. Guarantees timing for embedded devices (e.g., car brakes, medical devices).']
    ],
    sections: [
      {
        h: 'Cloud and the shared responsibility model',
        body: '<p>In the cloud, security is <strong>shared</strong>. The provider always secures the physical data centers and hardware. The customer always owns their data, user accounts and access decisions. Everything between depends on the service model.</p>',
        diagram: D.grid([
          ['Layer', 'On-prem', 'IaaS', 'PaaS', 'SaaS'],
          ['Data & access', { t: 'Customer', tone: 'warn' }, { t: 'Customer', tone: 'warn' }, { t: 'Customer', tone: 'warn' }, { t: 'Customer', tone: 'warn' }],
          ['Application', { t: 'Customer', tone: 'warn' }, { t: 'Customer', tone: 'warn' }, { t: 'Customer', tone: 'warn' }, { t: 'Provider', tone: 'good' }],
          ['OS & runtime', { t: 'Customer', tone: 'warn' }, { t: 'Customer', tone: 'warn' }, { t: 'Provider', tone: 'good' }, { t: 'Provider', tone: 'good' }],
          ['Virtualization', { t: 'Customer', tone: 'warn' }, { t: 'Provider', tone: 'good' }, { t: 'Provider', tone: 'good' }, { t: 'Provider', tone: 'good' }],
          ['Physical', { t: 'Customer', tone: 'warn' }, { t: 'Provider', tone: 'good' }, { t: 'Provider', tone: 'good' }, { t: 'Provider', tone: 'good' }]
        ], 'Shared responsibility by service model (simplified)', { cw: 112 }),
        check: { q: 'A company runs virtual machines on an IaaS platform. Who is responsible for patching the guest operating systems?', o: [
          ['The cloud provider', 'In IaaS the provider secures the hypervisor and hardware, not your guest OS.'],
          ['The customer', 'In IaaS, the customer manages the OS and everything above it.', true],
          ['Neither: IaaS operating systems patch themselves', 'Patching must still be managed.'],
          ['The responsibility is always split 50/50', 'Responsibility depends on the layer, not a fixed percentage.']
        ] }
      },
      {
        h: 'Hybrid, multi-party and third-party considerations',
        body: '<ul><li><strong>Hybrid cloud</strong>: mixes on-premises and cloud. Challenges: consistent identity, policies and monitoring across both environments, and secure interconnection.</li>' +
          '<li><strong>Third-party vendors</strong>: cloud services depend on providers’ security and contracts (right to audit, SLAs).</li>' +
          '<li><strong>Responsibility matrix</strong>: a document that spells out exactly who handles each security task. Misunderstanding it is a top cause of cloud breaches (e.g., public storage buckets).</li></ul>'
      },
      {
        h: 'Modern application architectures',
        body: '<ul><li><strong>Infrastructure as Code (IaC)</strong>: consistent, repeatable, reviewable deployments. Security benefit: no configuration drift, and changes go through code review. Risk: a bad template replicates the mistake everywhere, and secrets may be accidentally committed to code.</li>' +
          '<li><strong>Serverless</strong>: the provider patches the runtime and servers, which shrinks your responsibility. You still secure code, permissions (function roles) and data.</li>' +
          '<li><strong>Microservices</strong>: failures and compromises can be contained per service, and each scales independently. Many APIs means a larger attack surface and a need for strong service-to-service authentication.</li>' +
          '<li><strong>Containerization</strong>: lightweight isolation sharing the host OS kernel. It is less isolated than VMs, because a kernel exploit can affect all containers. Scan images and use minimal base images.</li>' +
          '<li><strong>Virtualization</strong>: VMs have their own OS on a hypervisor. Stronger isolation than containers; the risks are VM escape and VM sprawl.</li></ul>',
        compare: { title: 'Virtual machines vs Containers', head: ['', 'Virtual machines', 'Containers'], rows: [['Isolation', 'Separate OS per VM (strong)', 'Shared host kernel (lighter)'], ['Startup and size', 'Minutes, GBs', 'Seconds, MBs'], ['Key risk', 'VM escape, sprawl', 'Kernel exploits, vulnerable images, privileged containers']] },
        check: { q: 'Which architecture shifts patching of the operating system and runtime to the provider while the customer remains responsible for code and function permissions?', o: [
          ['IaaS', 'With IaaS the customer patches the OS.'],
          ['Serverless', 'The provider manages servers and runtimes; customers secure their code, data and permissions.', true],
          ['On-premises virtualization', 'You manage everything on-premises.'],
          ['Air-gapped network', 'An air gap is an isolation approach, not a hosting model.']
        ] }
      },
      {
        h: 'Network infrastructure models',
        body: '<ul><li><strong>Physical isolation (air gap)</strong>: the strongest separation, used for classified and critical systems. Data moves only by removable media, which becomes the main risk.</li>' +
          '<li><strong>Logical segmentation</strong>: VLANs, subnets and ACLs separate traffic on shared hardware.</li>' +
          '<li><strong>SDN</strong>: a central controller programs network devices. It enables fast, consistent policy and microsegmentation. The controller becomes a high-value target.</li>' +
          '<li><strong>On-premises</strong>: full control and full responsibility. <strong>Centralized vs decentralized</strong>: centralized is easier to manage but can be a single point of failure; decentralized is more resilient but harder to keep consistent.</li></ul>'
      },
      {
        h: 'IoT, ICS/SCADA, RTOS and embedded systems',
        body: '<p>These devices often <strong>cannot be patched easily</strong>, have long lifespans, weak default credentials, limited CPU/power for security software, and safety requirements where <em>availability</em> comes first.</p><ul>' +
          '<li><strong>ICS/SCADA</strong>: control power plants, water treatment and factories. Protect them with segmentation (separate OT networks), strict access control, and monitoring designed for industrial protocols.</li>' +
          '<li><strong>RTOS and embedded</strong>: purpose-built firmware; updates may require vendor involvement.</li><li><strong>IoT</strong>: cameras, sensors, smart devices. Isolate them on their own VLAN and change default passwords.</li></ul>',
        check: { q: 'A water utility’s SCADA controllers run firmware the vendor cannot update for two years. What is the BEST way to reduce risk in the meantime?', o: [
          ['Install antivirus on the controllers', 'Embedded controllers typically can’t run standard endpoint software.'],
          ['Segment the controllers onto an isolated network with strictly controlled access', 'Isolation is a strong compensating control when patching is impossible.', true],
          ['Expose the controllers to the internet for remote vendor support', 'That greatly increases risk.'],
          ['Replace the controllers with containers', 'Containers aren’t a substitute for physical industrial controllers.']
        ] }
      },
      {
        h: 'Architecture considerations',
        body: '<p>When choosing an architecture, weigh: <strong>availability</strong>, <strong>resilience</strong>, <strong>cost</strong>, <strong>responsiveness</strong>, <strong>scalability</strong>, <strong>ease of deployment</strong>, <strong>risk transference</strong> (e.g., to a cloud provider or insurer), <strong>ease of recovery</strong>, <strong>patch availability</strong>, <strong>inability to patch</strong>, <strong>power</strong> and <strong>compute</strong> constraints. The exam often presents a requirement (e.g., “must scale for seasonal peaks at low cost”) and asks which model fits.</p>'
      }
    ],
    takeaways: [
      'Shared responsibility: the provider always owns physical security; the customer always owns data and access. IaaS → customer patches the OS; SaaS → provider runs the app.',
      'IaC gives consistency and review; serverless offloads runtime patching; microservices increase API attack surface.',
      'Containers share a kernel (lighter isolation); VMs have separate OSs (stronger isolation).',
      'Air gaps give the strongest isolation; SDN centralizes control (and creates a high-value controller).',
      'IoT/ICS/embedded devices are hard to patch. Segment them and change defaults.'
    ]
  });

  SEC.addLesson('3.2', {
    title: 'Securing Enterprise Infrastructure',
    minutes: 40,
    intro: 'This scenario objective asks you to <strong>place and choose</strong> security devices: which firewall, where the IDS goes, how remote users connect, and what happens when a device fails. Think in terms of zones and the traffic crossing between them.',
    terms: [
      ['Screened subnet (DMZ)', 'A network segment between the internet and internal LAN for public-facing servers.'],
      ['Jump server', 'A hardened host admins connect to first, then use it to reach sensitive systems.'],
      ['Proxy server', 'An intermediary that makes requests on behalf of clients (forward) or servers (reverse).'],
      ['IDS / IPS', 'Intrusion Detection System (alerts) / Intrusion Prevention System (blocks inline).'],
      ['WAF', 'Web Application Firewall. Inspects HTTP traffic for attacks such as SQLi and XSS.'],
      ['NGFW', 'Next-Generation Firewall. Application-aware layer 7 firewall with IPS and identity features.'],
      ['UTM', 'Unified Threat Management. One appliance combining firewall, IPS, antivirus, web filtering, etc.'],
      ['802.1X / EAP', 'Port-based network access control / Extensible Authentication Protocol used with it.'],
      ['SD-WAN', 'Software-Defined WAN. Centrally managed connectivity across branch sites using multiple links.'],
      ['SASE', 'Secure Access Service Edge. Cloud-delivered networking plus security (SWG, CASB, ZTNA, FWaaS).']
    ],
    sections: [
      {
        h: 'Zones and device placement',
        body: '<p>Divide the network into <strong>security zones</strong> by trust level: internet (untrusted), screened subnet/DMZ (semi-trusted, public services), internal LAN (trusted users), and restricted zones (databases, management, payment systems). Place controls where traffic crosses between zones.</p>',
        diagram: D.zones([{ zone: 'Internet', sub: 'untrusted', tone: 'bad' }, { device: 'Edge NGFW' }, { zone: 'Screened subnet', sub: 'web, mail, reverse proxy + WAF', tone: 'warn' }, { device: 'Internal FW' }, { zone: 'Internal LAN', sub: 'users, IDS sensor', tone: 'zone' }, { device: 'FW / ACL' }, { zone: 'Restricted', sub: 'DB servers, jump server', tone: 'good' }], 'Typical zone design with control placement'),
        check: { q: 'Where should a company’s public web server be placed?', o: [
          ['In the internal LAN with the employees', 'If compromised, it would give attackers a foothold among internal systems.'],
          ['In a screened subnet (DMZ) between firewalls', 'Public services belong in the DMZ so a compromise doesn’t give direct internal access.', true],
          ['In the restricted database zone', 'Internet-facing servers should never sit with sensitive back-end systems.'],
          ['Directly on the internet with no firewall', 'This removes the protection of a filtered perimeter.']
        ] }
      },
      {
        h: 'Failure modes and device attributes',
        body: '<ul><li><strong>Fail-open</strong>: if the device fails, traffic passes. This preserves availability but loses protection.</li><li><strong>Fail-closed</strong>: if the device fails, traffic stops. This preserves security at the cost of availability.</li></ul>' +
          '<div class="ex">An inline IPS protecting a hospital’s life-critical telemetry may be configured fail-open (availability first). A firewall protecting a bank’s payment network is usually fail-closed (security first).</div>' +
          '<ul><li><strong>Active</strong> devices can act on traffic (block, modify); <strong>passive</strong> devices only observe.</li>' +
          '<li><strong>Inline</strong> devices sit in the traffic path (IPS, firewall). <strong>Tap/monitor</strong> devices receive a copy of traffic via a network TAP or SPAN port (IDS). They can’t block, but they can’t break the network either.</li></ul>',
        compare: { title: 'IDS vs IPS', head: ['', 'IDS', 'IPS'], rows: [['Placement', 'Out of band (tap/SPAN)', 'Inline'], ['Action', 'Alert only (passive)', 'Block/drop (active)'], ['If it fails', 'Network unaffected', 'Fail-open or fail-closed decision'], ['Control type', 'Detective', 'Preventive']] },
        check: { q: 'Management wants intrusion monitoring on a production network but insists the device must never cause an outage or add latency. Which deployment fits?', o: [
          ['Inline IPS, fail-closed', 'Fail-closed could cause an outage, and inline devices add latency.'],
          ['IDS connected to a SPAN port or TAP', 'A passive monitor receives copies of traffic, so it can’t disrupt flows.', true],
          ['Inline IPS, fail-open', 'It is still inline and adds latency and risk.'],
          ['A WAF in front of every server', 'A WAF is inline and is specific to web traffic.']
        ] }
      },
      {
        h: 'Network appliances',
        body: '<ul><li><strong>Jump server</strong> (jump box/bastion host): admins connect to it (with MFA and logging), then reach servers. Internal servers accept management only from the jump server.</li>' +
          '<li><strong>Proxy server</strong>: a <em>forward proxy</em> handles user requests to the internet (filtering, caching, logging). A <em>reverse proxy</em> sits in front of servers (TLS offload, load distribution, hiding internal servers).</li>' +
          '<li><strong>Load balancer</strong>: spreads traffic across servers for availability and performance; can also terminate TLS.</li>' +
          '<li><strong>Sensors</strong>: collect data for IDS/SIEM at key points.</li></ul>'
      },
      {
        h: 'Firewall types',
        body: '<ul><li><strong>Layer 4</strong> (stateful/packet filter): decisions by IP, port and protocol. Fast, but it can’t tell what application is inside port 443.</li>' +
          '<li><strong>Layer 7 / NGFW</strong>: understands applications (e.g., blocks file uploads to personal cloud storage but allows the corporate tenant), integrates IPS and user identity.</li>' +
          '<li><strong>WAF</strong>: protects web applications from SQLi, XSS and similar attacks by inspecting HTTP/S.</li>' +
          '<li><strong>UTM</strong>: an all-in-one appliance for small and mid-size organizations. It is simpler to run but is a single point of failure, and performance drops when every feature is enabled.</li></ul>',
        check: { q: 'An e-commerce site is being hit by SQL injection attempts against its checkout form. Which device is designed to filter these requests?', o: [
          ['Layer 4 firewall', 'It sees only ports and addresses, not the HTTP content.'],
          ['Web application firewall', 'A WAF inspects HTTP requests for application attacks like SQLi.', true],
          ['Forward proxy', 'A forward proxy controls users’ outbound browsing, not inbound attacks on your site.'],
          ['Load balancer', 'It distributes traffic but doesn’t inspect it for injection.']
        ] }
      },
      {
        h: 'Port security: 802.1X and EAP',
        body: '<p><strong>802.1X</strong> is port-based network access control. Until a device authenticates, the switch port (or Wi-Fi association) passes only authentication traffic. Three roles: <em>supplicant</em> (the device), <em>authenticator</em> (switch/AP), <em>authentication server</em> (usually RADIUS). <strong>EAP</strong> carries the credentials. EAP-TLS uses certificates on both sides and is the strongest common option.</p>',
        diagram: D.flow([{ t: 'Supplicant', sub: 'laptop' }, { t: 'Authenticator', sub: 'switch / AP', tone: 'accent' }, { t: 'Auth server', sub: 'RADIUS', tone: 'good' }, { t: 'Directory', sub: 'user accounts' }], '802.1X components')
      },
      {
        h: 'Secure communication and access',
        body: '<ul><li><strong>VPN</strong>: an encrypted tunnel. <em>Remote access VPN</em> (user to network) or <em>site-to-site</em> (network to network).</li>' +
          '<li><strong>IPsec</strong>: network-layer tunneling. <em>Tunnel mode</em> encrypts the whole packet (site-to-site); <em>transport mode</em> encrypts the payload only. AH gives integrity; ESP gives encryption plus integrity.</li>' +
          '<li><strong>TLS</strong> VPNs work through browsers and firewalls easily (port 443).</li>' +
          '<li><strong>SD-WAN</strong>: intelligently routes branch traffic over broadband, LTE and MPLS links, managed centrally.</li>' +
          '<li><strong>SASE</strong>: moves security to the cloud edge, close to users wherever they are: secure web gateway, CASB, zero-trust network access and firewall-as-a-service in one cloud service.</li></ul>',
        check: { q: 'A company with a fully remote workforce wants consistent web filtering, CASB and zero-trust access delivered from the cloud without routing traffic through headquarters. What fits best?', o: [
          ['Site-to-site IPsec VPN', 'This connects networks, not individual remote users, and backhauls traffic.'],
          ['SASE', 'SASE combines networking and cloud-delivered security services at the edge near users.', true],
          ['UTM appliance at headquarters', 'This forces traffic back to HQ.'],
          ['Air gap', 'An air gap isolates systems; it doesn’t provide remote access.']
        ] }
      },
      {
        h: 'Selecting effective controls',
        body: '<p>Match the control to the requirement: <em>protect a web app</em> → WAF; <em>admin access to servers</em> → jump server + MFA; <em>only company devices on the LAN</em> → 802.1X/NAC; <em>visibility without risk of outage</em> → passive IDS; <em>branch connectivity</em> → SD-WAN or site-to-site VPN; <em>remote workforce security</em> → SASE/ZTNA.</p>'
      }
    ],
    compare: [{ title: 'Commonly confused: Forward proxy vs Reverse proxy', head: ['', 'Forward proxy', 'Reverse proxy'], rows: [['Protects', 'Internal clients', 'Internal servers'], ['Traffic direction', 'Users → internet', 'Internet → your servers'], ['Typical features', 'URL filtering, caching, user logging', 'TLS offload, load spreading, hiding server details, WAF integration']] }],
    takeaways: [
      'Public-facing servers belong in a screened subnet (DMZ).',
      'Fail-open favors availability; fail-closed favors security.',
      'IDS = passive, tap/SPAN, alerts. IPS = active, inline, blocks.',
      'WAF protects web apps; NGFW is layer-7 application-aware; UTM is all-in-one; layer 4 sees only IPs and ports.',
      '802.1X: supplicant → authenticator → RADIUS. EAP-TLS uses certificates.',
      'Jump servers centralize admin access; SASE delivers security from the cloud edge to remote users.'
    ]
  });

  SEC.addLesson('3.3', {
    title: 'Protecting Data',
    minutes: 25,
    intro: 'Data protection starts with knowing <strong>what</strong> data you have, <strong>how sensitive</strong> it is, and <strong>what state</strong> it is in. Then you pick the right protection method: encryption, hashing, masking, tokenization, segmentation or geographic restriction.',
    terms: [
      ['Data at rest / in transit / in use', 'Stored on media / moving across a network / being processed in memory.'],
      ['Data sovereignty', 'Data is subject to the laws of the country where it is stored.'],
      ['Geolocation / geofencing', 'Determining location / enforcing rules based on location.'],
      ['PII / PHI', 'Personally Identifiable Information / Protected Health Information.'],
      ['Trade secret', 'Confidential business information that gives a competitive edge (e.g., a recipe or algorithm).'],
      ['Obfuscation', 'Making data hard to understand without changing what it means to authorized systems.']
    ],
    sections: [
      {
        h: 'Data types',
        body: '<ul><li><strong>Regulated</strong>: governed by law or regulation (PHI under HIPAA, card data under PCI DSS, personal data under GDPR).</li>' +
          '<li><strong>Trade secret</strong> and <strong>intellectual property</strong>: designs, source code, patents.</li><li><strong>Legal</strong> and <strong>financial</strong> information.</li>' +
          '<li><strong>Human-readable</strong> (documents) vs <strong>non-human-readable</strong> (binary data, barcodes, encoded data). Both need protection; DLP must be able to inspect both.</li></ul>'
      },
      {
        h: 'Classification levels',
        body: '<p>Classification labels drive handling rules. A common commercial scheme, from least to most sensitive: <strong>Public</strong> → <strong>Private/Internal</strong> → <strong>Sensitive</strong> → <strong>Confidential</strong> → <strong>Restricted</strong>, plus <strong>Critical</strong> for data whose loss would stop the business. Labels vary by organization, so what matters is that each level has defined handling requirements.</p>',
        diagram: D.layers([{ t: 'Public', sub: 'press releases, marketing', tone: 'good' }, { t: 'Private / Internal', sub: 'org charts, internal memos' }, { t: 'Sensitive', sub: 'customer lists', tone: 'accent' }, { t: 'Confidential', sub: 'HR records, contracts', tone: 'warn' }, { t: 'Restricted', sub: 'card data, trade secrets', tone: 'bad' }], 'Example data classification levels (least to most sensitive)'),
        check: { q: 'Who is primarily responsible for deciding a data set’s classification level?', o: [
          ['The data owner', 'The data owner (a senior business role) is accountable for classifying data.', true],
          ['The data custodian', 'Custodians implement controls (backups, permissions) but don’t set classification.'],
          ['Any employee who creates a document', 'Employees follow classification rules; owners decide classification.'],
          ['The cloud provider', 'Providers host data; they don’t classify your data.']
        ] }
      },
      {
        h: 'Data states',
        body: '<ul><li><strong>At rest</strong>: disks, databases, backups. Protect with full-disk/database encryption and access controls.</li><li><strong>In transit</strong>: crossing networks. Protect with TLS, IPsec, SSH.</li>' +
          '<li><strong>In use</strong>: in memory or CPU while processed. The hardest state to protect. Options include secure enclaves/confidential computing and limiting who can access the process.</li></ul>',
        diagram: D.flow([{ t: 'At rest', sub: 'FDE, DB encryption', tone: 'good' }, { t: 'In transit', sub: 'TLS, IPsec, VPN', tone: 'accent' }, { t: 'In use', sub: 'secure enclave, access control', tone: 'warn' }], 'Data states and typical protections'),
        check: { q: 'A laptop with customer records is stolen from a car. Which control would have best protected the data?', o: [
          ['TLS', 'TLS protects data in transit, not on a stolen disk.'],
          ['Full-disk encryption', 'FDE protects data at rest on a lost or stolen device.', true],
          ['Data masking in reports', 'Masking doesn’t protect the raw files on disk.'],
          ['A web application firewall', 'A WAF protects web apps from network attacks.']
        ] }
      },
      {
        h: 'Sovereignty and geolocation',
        body: '<p><strong>Data sovereignty</strong>: data stored in a country falls under that country’s laws. Some regulations restrict cross-border transfers, which affects which cloud regions you can use. <strong>Geolocation</strong> lets you enforce <strong>geographic restrictions</strong>: block logins from countries where you don’t operate, or keep data in specific regions.</p>'
      },
      {
        h: 'Methods to secure data',
        body: '<ul><li><strong>Encryption</strong>: reversible with the key; protects confidentiality.</li><li><strong>Hashing</strong>: one-way; verifies integrity and stores passwords.</li>' +
          '<li><strong>Masking</strong>: hides part of the value (<code>****-****-****-4821</code>).</li><li><strong>Tokenization</strong>: swaps the value for a meaningless token; the mapping sits in a secure vault. This reduces PCI DSS scope.</li>' +
          '<li><strong>Obfuscation</strong>: makes data or code hard to understand.</li><li><strong>Segmentation</strong>: keeps sensitive data on separate networks/systems.</li>' +
          '<li><strong>Permission restrictions</strong>: least-privilege access to data.</li></ul>',
        check: { q: 'A retailer wants its order system to store something that represents each customer card but is useless if stolen, while the payment processor can still charge the card later. What should it use?', o: [
          ['Hashing', 'A hash can’t be turned back into a card number to charge.'],
          ['Tokenization', 'A token stands in for the card; only the token vault maps it back to the real number.', true],
          ['Masking', 'Masking is for display; it doesn’t support later charging.'],
          ['Steganography', 'Hiding data inside images doesn’t address this.']
        ] }
      }
    ],
    takeaways: [
      'Classify data (public → restricted/critical); data owners decide classification.',
      'At rest → disk/database encryption; in transit → TLS/IPsec; in use → secure enclaves and access control.',
      'Data sovereignty: the location of data determines which laws apply.',
      'Tokenization (vault mapping) vs masking (partial display) vs hashing (one-way) vs encryption (reversible).'
    ]
  });

  SEC.addLesson('3.4', {
    title: 'Resilience and Recovery',
    minutes: 30,
    intro: 'Security includes <strong>availability</strong>: staying up during failures and recovering quickly from disasters. This lesson covers high availability, recovery sites, backups, testing and power.',
    terms: [
      ['High availability (HA)', 'Designing systems to remain operational with minimal downtime.'],
      ['Load balancing vs clustering', 'Distributing work across active nodes / multiple servers acting as one, with failover.'],
      ['Hot / warm / cold site', 'Recovery sites ranked by readiness: ready to go / partially equipped / space and power only.'],
      ['RPO / RTO', 'Recovery Point Objective (max acceptable data loss) / Recovery Time Objective (max acceptable downtime).'],
      ['Snapshot', 'A point-in-time copy of a system or volume state.'],
      ['Journaling', 'Logging changes so they can be replayed to a point in time.'],
      ['UPS', 'Uninterruptible Power Supply. Battery that bridges short outages until a generator starts.']
    ],
    sections: [
      {
        h: 'High availability: load balancing and clustering',
        body: '<p><strong>Load balancing</strong> distributes requests across several servers. If one fails, the others keep serving (active/active). <strong>Clustering</strong> groups servers to act as one system; in active/passive clusters a standby node takes over if the primary fails. Both remove single points of failure.</p>',
        compare: { title: 'Load balancing vs Clustering', head: ['', 'Load balancing', 'Clustering'], rows: [['Main goal', 'Spread load, scale out', 'Failover and continuity of a service'], ['Typical mode', 'Active/active', 'Active/passive or active/active'], ['Example', 'Web farm behind a load balancer', 'Database cluster with shared storage']] }
      },
      {
        h: 'Site considerations',
        body: '<ul><li><strong>Hot site</strong>: fully equipped, data replicated, ready in minutes to hours. Most expensive.</li><li><strong>Warm site</strong>: hardware and connectivity in place, but data must be restored. Hours to days.</li>' +
          '<li><strong>Cold site</strong>: space, power and cooling only. Days to weeks. Cheapest.</li><li><strong>Geographic dispersion</strong>: sites far enough apart that one disaster (hurricane, regional outage) can’t hit both.</li></ul>',
        diagram: D.grid([['Site', 'Readiness', 'Recovery time', 'Cost'], ['Hot', { t: 'Fully running, replicated', tone: 'good' }, { t: 'Minutes–hours', tone: 'good' }, { t: 'Highest', tone: 'bad' }], ['Warm', { t: 'Hardware ready, data restore needed', tone: 'warn' }, { t: 'Hours–days', tone: 'warn' }, { t: 'Medium', tone: 'warn' }], ['Cold', { t: 'Space & power only', tone: 'bad' }, { t: 'Days–weeks', tone: 'bad' }, { t: 'Lowest', tone: 'good' }]], 'Recovery site comparison', { cw: 150, ch: 54 }),
        check: { q: 'A trading firm has an RTO of 15 minutes for its trading platform. Which recovery site is required?', o: [
          ['Cold site', 'Days to weeks is far too slow.'],
          ['Warm site', 'Restoring data takes hours or more.'],
          ['Hot site', 'Only a hot site with replicated data can meet a minutes-level RTO.', true],
          ['Offsite tape backups only', 'Restoring from tape can’t meet 15 minutes.']
        ] }
      },
      {
        h: 'Platform diversity and multi-cloud',
        body: '<p><strong>Platform diversity</strong> (different OSs, vendors or technologies) means one vulnerability can’t take down everything. <strong>Multi-cloud</strong> spreads workloads across providers so one provider’s outage doesn’t stop the business. The cost is more complexity and more skills to maintain.</p>'
      },
      {
        h: 'Continuity of operations and capacity planning',
        body: '<p><strong>Continuity of operations (COOP)</strong> plans how essential functions keep going during disruption, including manual workarounds. <strong>Capacity planning</strong> covers <em>people</em> (enough trained staff, cross-training), <em>technology</em> (compute, licenses) and <em>infrastructure</em> (power, bandwidth, facilities).</p>'
      },
      {
        h: 'Testing resilience',
        body: '<ul><li><strong>Tabletop exercise</strong>: discussion-based walk-through of a scenario. Cheap, no systems touched.</li><li><strong>Simulation</strong>: a realistic practice event (e.g., a simulated phishing outbreak) that tests the response.</li>' +
          '<li><strong>Failover test</strong>: actually switch to backup systems/site.</li><li><strong>Parallel processing</strong>: run the recovery system alongside production and compare results, without stopping production.</li></ul>',
        check: { q: 'Executives want to validate the disaster recovery plan by discussing their decisions during a hypothetical ransomware scenario, without touching any systems. What should be conducted?', o: [
          ['Failover test', 'This actually switches systems.'],
          ['Tabletop exercise', 'A discussion-based scenario walk-through with no system impact is a tabletop exercise.', true],
          ['Parallel processing', 'This runs systems side by side.'],
          ['Penetration test', 'A pentest tests defenses, not the DR plan decisions.']
        ] }
      },
      {
        h: 'Backups',
        body: '<ul><li><strong>Onsite vs offsite</strong>: onsite restores fast; offsite survives a site disaster. Use both (the classic <em>3-2-1</em> rule: 3 copies, 2 media types, 1 offsite, ideally one offline/immutable copy against ransomware).</li>' +
          '<li><strong>Frequency</strong> is driven by the <strong>RPO</strong>: an RPO of 1 hour means backing up or replicating at least hourly.</li><li><strong>Encryption</strong> protects backup media.</li>' +
          '<li><strong>Snapshots</strong>: quick point-in-time copies (common for VMs). <strong>Replication</strong>: copies data to another location continuously or near continuously. <strong>Journaling</strong>: records every change for point-in-time recovery.</li>' +
          '<li><strong>Recovery</strong>: backups are only useful if restores are tested regularly.</li></ul>',
        diagram: D.flow([{ t: 'Last good backup', sub: 'RPO: how much data you can lose', tone: 'good' }, { t: 'Disaster', sub: 'outage begins', tone: 'bad' }, { t: 'Service restored', sub: 'RTO: how long you can be down', tone: 'accent' }], 'RPO looks backward to data loss; RTO looks forward to downtime'),
        compare: { title: 'Commonly confused: RPO vs RTO', head: ['', 'RPO', 'RTO'], rows: [['Measures', 'Acceptable data loss (time)', 'Acceptable downtime'], ['Looks', 'Backward from the incident', 'Forward from the incident'], ['Drives', 'Backup/replication frequency', 'Recovery site type and procedures']] }
      },
      {
        h: 'Power',
        body: '<p>A <strong>UPS</strong> provides instant battery power for minutes, covering short outages and the gap until generators start. <strong>Generators</strong> provide long-term power during extended outages. Many sites also use dual power supplies and separate utility feeds.</p>',
        check: { q: 'Which combination keeps a data center running through a 6-hour utility outage without any interruption?', o: [
          ['Generator only', 'Generators take time to start, so servers would lose power briefly.'],
          ['UPS only', 'A UPS typically lasts minutes, not hours.'],
          ['UPS to bridge the gap, plus a generator for the long outage', 'The UPS covers the seconds-to-minutes gap; the generator covers the hours.', true],
          ['Surge protectors', 'These protect against spikes, not outages.']
        ] }
      }
    ],
    takeaways: [
      'Load balancing spreads load (active/active); clustering provides failover.',
      'Hot = fastest/most expensive; warm = hardware ready; cold = space only. Disperse sites geographically.',
      'RPO = data loss tolerance (drives backup frequency); RTO = downtime tolerance (drives site choice).',
      'Test with tabletop exercises, simulations, failover and parallel processing.',
      'Follow 3-2-1 backups with an offline/immutable copy; test restores. UPS + generator for power.'
    ]
  });
})();
