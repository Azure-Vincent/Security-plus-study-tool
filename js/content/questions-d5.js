/* Domain 5 question bank — original questions. */
SEC.addQuestions('5.1', [
  { d: 1, q: 'Which document type is mandatory and expresses management’s high-level intent for security?', o: [
    ['Policy', 'Policies state high-level, mandatory direction.', true],
    ['Guideline', 'Guidelines are optional.'],
    ['Procedure', 'Procedures are detailed steps.'],
    ['Playbook', 'Playbooks are scenario-specific response steps.']
  ], ex: 'Policy → standard → procedure; guidelines advise.' },
  { d: 2, q: 'A document lists the exact steps for creating accounts for new hires, including forms and approvals. What type of document is it?', o: [
    ['Procedure', 'Step-by-step instructions are procedures.', true],
    ['Policy', 'Too detailed for a policy.'],
    ['Standard', 'Standards define requirements, not steps.'],
    ['Guideline', 'Guidelines are optional advice.']
  ], ex: 'Onboarding/offboarding procedures are classic examples.' },
  { d: 2, q: 'Which policy defines what employees may and may not do with company computers and internet access?', o: [
    ['Acceptable use policy (AUP)', 'The AUP governs use of company resources.', true],
    ['Business continuity policy', 'Covers continuing operations during disruption.'],
    ['Change management policy', 'Governs changes.'],
    ['SDLC policy', 'Governs development.']
  ], ex: 'Users often acknowledge the AUP during onboarding.' },
  { d: 2, q: 'Which TWO are typically security standards rather than policies?', o: [
    ['Encryption standard specifying AES-256 for data at rest', 'Specific technical requirement.', true],
    ['Password standard specifying minimum length and MFA', 'Specific measurable requirement.', true],
    ['Statement that “information is a critical asset to be protected”', 'Policy-level intent.'],
    ['Suggestion to use a password manager', 'Guideline.']
  ], ex: 'Standards make policies measurable and enforceable.' },
  { d: 2, q: 'Who is accountable for classifying a data set and approving who can access it?', o: [
    ['Data owner', 'Owners are accountable for classification and access decisions.', true],
    ['Data custodian', 'Custodians implement controls.'],
    ['Data processor', 'Processes on behalf of a controller.'],
    ['Help desk technician', 'Not accountable for data.']
  ], ex: 'Owner decides; custodian implements.' },
  { d: 2, q: 'A database administrator performs daily backups and applies the access permissions that the data owner approved. Which role is the DBA performing?', o: [
    ['Custodian/steward', 'Day-to-day care of data is the custodian role.', true],
    ['Owner', 'Owners make decisions, not operations.'],
    ['Controller', 'Privacy role deciding purposes of processing.'],
    ['Data subject', 'The person data is about.']
  ], ex: 'Custodians implement and maintain controls defined by owners.' },
  { d: 3, q: 'A multinational company must comply with privacy laws in each country where it operates. Which governance consideration is this?', o: [
    ['External considerations: local/regional, national and global requirements', 'Jurisdictional laws are external governance drivers.', true],
    ['Internal guidelines only', 'Laws are external and mandatory.'],
    ['Change management', 'Unrelated.'],
    ['Decentralized incident response', 'Unrelated.']
  ], ex: 'Governance must map requirements from all applicable jurisdictions.' },
  { d: 2, q: 'What is a characteristic of centralized security governance?', o: [
    ['One central authority sets policies for the whole organization, improving consistency', 'Central control favors consistency.', true],
    ['Each business unit sets its own policies independently', 'That is decentralized.'],
    ['There are no policies', 'Governance requires policies.'],
    ['Only external regulators set policy', 'Organizations set internal policy.']
  ], ex: 'Centralized = consistent but potentially slower; decentralized = flexible but inconsistent.' },
  { d: 3, q: 'When should security policies be reviewed and revised?', o: [
    ['On a regular schedule and after significant changes such as new laws, incidents or technologies', 'Monitoring and revision keep governance current.', true],
    ['Only when an auditor requests it', 'Too infrequent.'],
    ['Never, once approved', 'Policies become outdated.'],
    ['Every day', 'Impractical.']
  ], ex: 'Typical cadence is annual review plus event-driven updates.' },
  { d: 2, q: 'A SOC maintains step-by-step response instructions for ransomware, phishing and lost devices. What are these called?', o: [
    ['Playbooks', 'Scenario-specific response procedures.', true],
    ['Standards', 'Requirements.'],
    ['AUPs', 'Usage rules.'],
    ['MOUs', 'Agreements.']
  ], ex: 'Playbooks are often automated in SOAR platforms.' },
  { d: 1, q: 'Which governance structure provides top-level oversight of an organization’s risk and security program?', o: [
    ['Board of directors (and its committees)', 'Boards provide oversight and accountability.', true],
    ['Help desk', 'Operational support.'],
    ['Individual developers', 'Not oversight bodies.'],
    ['External vendors', 'Not internal governance.']
  ], ex: 'Boards and committees set direction and hold management accountable.' }
]);

SEC.addQuestions('5.2', [
  { d: 1, q: 'What is the formula for Single Loss Expectancy (SLE)?', o: [
    ['Asset value × exposure factor', 'SLE = AV × EF.', true],
    ['SLE × ARO', 'That is ALE.'],
    ['ALE ÷ ARO', 'Algebraically gives SLE, but isn’t the defining formula.'],
    ['AV × ARO', 'Missing exposure factor.']
  ], ex: 'SLE is the cost of one incident.' },
  { d: 2, q: 'A server worth $40,000 would be 50% damaged by a fire. Fires are expected once every 20 years. What is the ALE?', o: [
    ['$1,000', 'SLE = $40,000 × 0.5 = $20,000; ALE = $20,000 × 0.05 = $1,000.', true],
    ['$20,000', 'That is the SLE.'],
    ['$2,000', 'Incorrect ARO (0.1).'],
    ['$800', 'Calculation error.']
  ], ex: 'ARO for once in 20 years = 1/20 = 0.05.' },
  { d: 2, q: 'A company buys cyber insurance to cover breach costs. Which risk strategy is this?', o: [
    ['Transfer', 'Shifting financial impact to an insurer.', true],
    ['Avoid', 'Stopping the activity.'],
    ['Accept', 'Taking the risk as is.'],
    ['Mitigate', 'Reducing likelihood/impact with controls.']
  ], ex: 'Transfer shifts financial impact, but responsibility and reputational harm remain.' },
  { d: 2, q: 'Which TWO are characteristics of qualitative risk analysis?', o: [
    ['Uses ratings such as low, medium and high', 'Qualitative uses descriptive scales.', true],
    ['Is faster but more subjective than quantitative analysis', 'Relies on expert judgment.', true],
    ['Calculates exact dollar ALE values', 'That is quantitative.'],
    ['Requires precise historical loss data', 'Quantitative needs data.']
  ], ex: 'Many organizations use both approaches.' },
  { d: 2, q: 'What does a key risk indicator (KRI) provide?', o: [
    ['An early warning metric that a risk is increasing', 'KRIs signal changing risk levels.', true],
    ['The final ALE value', 'Not a KRI.'],
    ['A list of all assets', 'Inventory.'],
    ['A legal contract', 'Unrelated.']
  ], ex: 'Example KRI: number of critical vulnerabilities older than 30 days.' },
  { d: 3, q: 'An organization states it is willing to accept higher risk to pursue rapid market growth. Which risk appetite is this?', o: [
    ['Expansionary', 'Willing to take on more risk for growth.', true],
    ['Conservative', 'Low risk acceptance.'],
    ['Neutral', 'Balanced.'],
    ['Avoidant', 'Not an SY0-701 appetite category.']
  ], ex: 'Appetite: expansionary, neutral or conservative.' },
  { d: 2, q: 'A control costs $15,000 per year and would reduce ALE from $40,000 to $10,000. Is it cost-justified?', o: [
    ['Yes, it saves $30,000 in expected loss for $15,000 cost', 'Benefit ($30,000) exceeds cost ($15,000).', true],
    ['No, because any cost above $10,000 is too high', 'Compare cost to risk reduction.'],
    ['No, because ALE remains above zero', 'Residual risk is normal.'],
    ['Cannot be determined', 'The numbers allow a decision.']
  ], ex: 'Value of control = ALE before − ALE after − annual cost of control = $15,000 net benefit.' },
  { d: 2, q: 'Which document lists identified risks, their owners, ratings and treatment status?', o: [
    ['Risk register', 'The central risk tracking record.', true],
    ['Chain of custody', 'Evidence tracking.'],
    ['AUP', 'Usage policy.'],
    ['SLA', 'Service agreement.']
  ], ex: 'Each risk should have an owner accountable for treatment.' },
  { d: 1, q: 'What does RTO measure?', o: [
    ['The maximum acceptable time to restore a function after disruption', 'Recovery Time Objective.', true],
    ['The maximum acceptable data loss', 'That is RPO.'],
    ['Average time between failures', 'That is MTBF, a reliability measure.'],
    ['Expected yearly losses', 'That is ALE (SLE × ARO).']
  ], ex: 'RTO = downtime; RPO = data loss.' },
  { d: 3, s: 'A legacy application has a vulnerability. Fixing it costs $500,000; the ALE is estimated at $2,000. Management signs a formal document acknowledging the risk for one year.', q: 'Which risk response was chosen?', o: [
    ['Accept (via a documented exception)', 'Formally acknowledging the risk without treatment is acceptance.', true],
    ['Mitigate', 'No control is applied.'],
    ['Transfer', 'No third party bears the risk.'],
    ['Avoid', 'The application continues to run.']
  ], ex: 'Acceptance is appropriate when treatment costs far exceed the expected loss.' },
  { d: 2, q: 'Which metric is improved (lowered) by stocking spare parts and training technicians?', o: [
    ['MTTR', 'Mean time to repair decreases with faster repairs.', true],
    ['MTBF', 'Reliability between failures, not repair speed.'],
    ['ARO', 'Frequency of risk events.'],
    ['EF', 'Percentage of loss.']
  ], ex: 'Lower MTTR → faster recovery.' },
  { d: 3, q: 'Which type of risk assessment uses ongoing automated monitoring to update risk levels as conditions change?', o: [
    ['Continuous', 'Ongoing assessment through automation.', true],
    ['One-time', 'Single assessment.'],
    ['Ad hoc', 'Performed as needed.'],
    ['Recurring', 'Scheduled at intervals.']
  ], ex: 'Assessment types: ad hoc, recurring, one-time, continuous.' },
  { d: 2, q: 'What is the purpose of a business impact analysis (BIA)?', o: [
    ['Identify critical business functions and the impact of their disruption to set recovery priorities', 'BIA informs RTO/RPO and continuity planning.', true],
    ['Test firewall rules', 'Unrelated.'],
    ['Assess vendor contracts', 'Third-party risk.'],
    ['Calculate employee salaries', 'Unrelated.']
  ], ex: 'The BIA is a foundation for BC/DR planning.' }
]);

SEC.addQuestions('5.3', [
  { d: 1, q: 'Which agreement defines measurable performance targets such as uptime and response times, often with penalties?', o: [
    ['SLA', 'Service-level agreements define measurable service levels.', true],
    ['NDA', 'Confidentiality.'],
    ['MOU', 'Non-binding intent.'],
    ['BPA', 'Partnership terms.']
  ], ex: 'SLAs should include security-relevant metrics such as incident notification times.' },
  { d: 2, q: 'Which contract clause allows a customer to evaluate a vendor’s security controls?', o: [
    ['Right-to-audit clause', 'Grants audit rights.', true],
    ['Force majeure clause', 'Covers uncontrollable events.'],
    ['Non-compete clause', 'Restricts competition.'],
    ['Indemnification clause only', 'Covers liability, not audit rights.']
  ], ex: 'Negotiate audit rights before signing.' },
  { d: 2, q: 'Two organizations agree in writing to explore a joint project but don’t create legally binding obligations. Which document is this?', o: [
    ['Memorandum of understanding (MOU)', 'MOUs express intent and are typically non-binding.', true],
    ['MSA', 'Binding umbrella contract.'],
    ['SOW', 'Binding specific work.'],
    ['SLA', 'Binding service levels.']
  ], ex: 'MOA is more formal than an MOU and defines responsibilities.' },
  { d: 2, q: 'A company has an MSA with a consultancy. For a specific penetration test project, which document defines deliverables, timeline and cost?', o: [
    ['Statement of work (SOW) / work order', 'SOWs define specific work under an MSA.', true],
    ['NDA', 'Confidentiality.'],
    ['BPA', 'Partnership.'],
    ['MOU', 'Intent.']
  ], ex: 'MSA sets general terms; SOW/WO defines each engagement.' },
  { d: 2, q: 'Which TWO provide independent evidence of a vendor’s security posture?', o: [
    ['A SOC 2 Type II report from an independent auditor', 'Independent attestation over a period.', true],
    ['ISO 27001 certification from an accredited body', 'Independent certification.', true],
    ['The vendor’s marketing brochure', 'Not independent evidence.'],
    ['A verbal assurance from the sales representative', 'Not evidence.']
  ], ex: 'Independent assessments are stronger than self-attestation.' },
  { d: 3, s: 'During vendor selection, the procurement lead recommends a supplier owned by her brother-in-law without disclosing the relationship.', q: 'What issue does this raise?', o: [
    ['Conflict of interest', 'Personal relationships can bias vendor selection.', true],
    ['Supply chain analysis', 'A legitimate assessment activity.'],
    ['Rules of engagement', 'Interaction boundaries.'],
    ['Right to audit', 'Contract clause.']
  ], ex: 'Due diligence includes checking for and disclosing conflicts of interest.' },
  { d: 2, q: 'What is the purpose of periodic vendor security questionnaires after a contract is signed?', o: [
    ['Ongoing vendor monitoring to detect changes in risk', 'Continued monitoring keeps risk assessments current.', true],
    ['To replace the contract', 'They supplement it.'],
    ['To calculate ALE', 'Not their purpose.'],
    ['To provision user accounts', 'Unrelated.']
  ], ex: 'Third-party risk management continues throughout the relationship.' },
  { d: 3, q: 'A cloud provider relies on a third-party data center operator. Assessing that operator’s risk is part of what?', o: [
    ['Supply chain analysis (fourth-party risk)', 'Your vendor’s vendors are part of your supply chain risk.', true],
    ['Tabletop exercise', 'Response rehearsal.'],
    ['Data masking', 'Data protection.'],
    ['Code signing', 'Software integrity.']
  ], ex: 'Ask vendors how they manage their own suppliers.' },
  { d: 2, q: 'Which agreement protects confidential information shared with a vendor during contract negotiations?', o: [
    ['NDA', 'Non-disclosure agreements protect confidential information.', true],
    ['SLA', 'Service levels.'],
    ['SOW', 'Work definition.'],
    ['MOU', 'Intent.']
  ], ex: 'Sign NDAs before sharing sensitive details.' },
  { d: 3, q: 'Before allowing a vendor to perform a penetration test against a shared hosting environment, what should be agreed upon to define scope, timing and permitted techniques?', o: [
    ['Rules of engagement', 'RoE define testing boundaries and communication.', true],
    ['MTBF', 'Reliability metric.'],
    ['Data retention policy', 'Retention.'],
    ['Legal hold', 'Litigation preservation.']
  ], ex: 'Unauthorized or out-of-scope testing can disrupt services or break laws.' }
]);

SEC.addQuestions('5.4', [
  { d: 1, q: 'Which is a possible consequence of non-compliance with a data protection regulation?', o: [
    ['Fines and sanctions', 'Regulators can impose financial penalties and sanctions.', true],
    ['Lower insurance premiums', 'Usually the opposite.'],
    ['Automatic certification', 'Non-compliance prevents certification.'],
    ['Faster network performance', 'Unrelated.']
  ], ex: 'Consequences: fines, sanctions, reputational damage, loss of license, contractual impacts.' },
  { d: 2, q: 'A company investigates a cloud provider’s security before signing (due ___) and, after signing, continuously maintains appropriate controls (due ___). Which pair completes the sentence?', o: [
    ['Diligence; care', 'Diligence = investigate; care = act and maintain.', true],
    ['Care; diligence', 'Reversed.'],
    ['Process; diligence', 'Not standard terms.'],
    ['Attestation; acknowledgement', 'Different concepts.']
  ], ex: 'Due diligence is research; due care is responsible ongoing action.' },
  { d: 2, q: 'Employees annually sign a statement confirming they have read and will follow security policies. What is this?', o: [
    ['Acknowledgement', 'Users acknowledge policies.', true],
    ['Penetration test', 'Unrelated.'],
    ['Data inventory', 'Unrelated.'],
    ['Sanitization', 'Unrelated.']
  ], ex: 'Acknowledgements support accountability and compliance evidence.' },
  { d: 2, q: 'Under privacy law, which entity determines the purposes and means of processing personal data?', o: [
    ['Data controller', 'Controllers decide why and how.', true],
    ['Data processor', 'Acts on the controller’s instructions.'],
    ['Data subject', 'The individual.'],
    ['Data custodian', 'Operational role.']
  ], ex: 'Controllers carry primary accountability for compliance.' },
  { d: 2, q: 'Which TWO are privacy-related compliance activities?', o: [
    ['Maintaining a data inventory of personal data', 'You must know what personal data you hold.', true],
    ['Defining retention limits for personal data', 'Data shouldn’t be kept longer than necessary.', true],
    ['Configuring WPA3', 'Wireless security, not privacy compliance.'],
    ['Load balancing web servers', 'Availability.']
  ], ex: 'Privacy programs require inventory, minimization, retention and subject rights processes.' },
  { d: 3, q: 'Which compliance reporting is directed to regulators or other outside parties?', o: [
    ['External reporting', 'Reports to regulators, partners and customers.', true],
    ['Internal reporting', 'Reports to management and the board.'],
    ['Self-assessment', 'Internal evaluation.'],
    ['Tabletop reporting', 'Not a standard term.']
  ], ex: 'Breach notification to authorities is an external reporting obligation.' },
  { d: 2, q: 'A company uses a tool that continuously checks cloud configurations against compliance benchmarks and flags deviations. What is this?', o: [
    ['Automated compliance monitoring', 'Automation provides continuous compliance checks.', true],
    ['Due diligence questionnaire', 'Vendor assessment.'],
    ['E-discovery', 'Legal data production.'],
    ['Legal hold', 'Preservation order.']
  ], ex: 'Automation increases coverage and frequency of compliance monitoring.' },
  { d: 3, s: 'After a regulator finds repeated violations, a healthcare provider loses its ability to bill a government insurance program.', q: 'Which consequence of non-compliance does this illustrate?', o: [
    ['Contractual impacts / loss of license or authorization', 'Losing the right to participate in a program is a loss of authorization.', true],
    ['Due care', 'A practice, not a consequence.'],
    ['Data sovereignty', 'Jurisdictional storage concept.'],
    ['Attestation', 'Formal statement.']
  ], ex: 'Non-compliance can end business relationships and authorizations.' },
  { d: 2, q: 'Which privacy right lets an individual request deletion of their personal data?', o: [
    ['Right to be forgotten (erasure)', 'Allows requesting deletion.', true],
    ['Right to audit', 'Contractual vendor clause.'],
    ['Legal hold', 'Prevents deletion.'],
    ['Non-repudiation', 'Proof of actions.']
  ], ex: 'Organizations need processes to locate and erase data on valid requests.' },
  { d: 1, q: 'Who is the data subject?', o: [
    ['The individual whom personal data describes', 'Data subjects hold privacy rights.', true],
    ['The database administrator', 'Custodian.'],
    ['The cloud provider', 'Often a processor.'],
    ['The regulator', 'Enforcement body.']
  ], ex: 'Privacy laws grant rights to data subjects.' }
]);

SEC.addQuestions('5.5', [
  { d: 1, q: 'A penetration tester receives network diagrams, source code and admin credentials before testing. What type of test is this?', o: [
    ['Known environment', 'Full information provided.', true],
    ['Unknown environment', 'No information provided.'],
    ['Partially known environment', 'Limited information.'],
    ['Passive reconnaissance', 'Information gathering only.']
  ], ex: 'Known environment tests are thorough; unknown environment tests are realistic.' },
  { d: 2, q: 'Which activity is passive reconnaissance?', o: [
    ['Searching public DNS records, job postings and social media for information about the target', 'No direct interaction with target systems.', true],
    ['Port scanning the target’s public IPs', 'Active.'],
    ['Sending phishing emails to employees', 'An attack, not reconnaissance.'],
    ['Banner grabbing on web servers', 'Active.']
  ], ex: 'Passive recon is undetectable by the target; active recon touches systems.' },
  { d: 2, q: 'Red and blue teams work together during an exercise, sharing attack techniques and detection results in real time. What is this?', o: [
    ['Integrated (purple team) testing', 'Collaboration between offensive and defensive teams.', true],
    ['Unknown environment test', 'Describes tester knowledge.'],
    ['Physical penetration test', 'Tests physical controls.'],
    ['Regulatory examination', 'External compliance audit.']
  ], ex: 'Purple teaming improves detection engineering quickly.' },
  { d: 2, q: 'Which TWO are examples of external audits or assessments?', o: [
    ['A regulatory examination by a banking authority', 'Conducted by an outside regulator.', true],
    ['An independent third-party SOC 2 audit', 'Independent external auditor.', true],
    ['A department’s self-assessment checklist', 'Internal.'],
    ['An internal audit committee review', 'Internal.']
  ], ex: 'External audits provide independent assurance.' },
  { d: 3, s: 'A tester attempts to enter a data center by following employees through a secured door and posing as a delivery driver.', q: 'Which type of penetration test is this?', o: [
    ['Physical penetration test', 'Tests physical security controls.', true],
    ['Defensive test', 'Blue team activities.'],
    ['Known environment network test', 'Network-focused.'],
    ['Passive reconnaissance', 'Doesn’t involve entering facilities.']
  ], ex: 'Physical tests evaluate guards, badges, vestibules and staff awareness.' },
  { d: 2, q: 'What is an attestation in the context of audits?', o: [
    ['A formal written statement about the state or effectiveness of controls', 'Attestation provides assurance from an auditor or management.', true],
    ['A type of malware', 'Unrelated.'],
    ['A firewall rule', 'Unrelated.'],
    ['A backup method', 'Unrelated.']
  ], ex: 'SOC reports are attestation reports.' },
  { d: 1, q: 'Which test simulates an outside attacker with no prior knowledge of the target?', o: [
    ['Unknown environment', 'Formerly black box.', true],
    ['Known environment', 'Full knowledge.'],
    ['Partially known environment', 'Some knowledge.'],
    ['Self-assessment', 'Internal review.']
  ], ex: 'Realistic but may miss deeper issues within time limits.' },
  { d: 3, q: 'A board-level group oversees the internal audit function and reviews audit findings. What is it called?', o: [
    ['Audit committee', 'Board-level oversight of audits.', true],
    ['Change advisory board', 'Approves changes.'],
    ['Incident response team', 'Handles incidents.'],
    ['Red team', 'Offensive testing.']
  ], ex: 'Audit committees ensure independence and follow-through on findings.' },
  { d: 2, q: 'Which is the PRIMARY reason to perform internal compliance self-assessments?', o: [
    ['To identify and fix gaps before external audits or regulators find them', 'Self-assessments are proactive.', true],
    ['To replace all external audits', 'Some external audits are required.'],
    ['To provide independent assurance to customers', 'Self-assessments aren’t independent.'],
    ['To test backups', 'Unrelated.']
  ], ex: 'Internal assessments support continuous improvement.' },
  { d: 3, q: 'A tester begins with one standard user account and limited network information to simulate a compromised employee. What type of test is this?', o: [
    ['Partially known environment', 'Some information/access is provided.', true],
    ['Unknown environment', 'No information.'],
    ['Known environment', 'Full information.'],
    ['Passive reconnaissance', 'No interaction.']
  ], ex: 'Partially known tests balance realism and depth.' }
]);

SEC.addQuestions('5.6', [
  { d: 1, q: 'What should employees do when they receive a suspicious email?', o: [
    ['Report it using the designated reporting method (e.g., report button) and not interact with it', 'Reporting enables the security team to respond.', true],
    ['Forward it to all coworkers as a warning', 'Spreads the malicious content.'],
    ['Click the link to check if it is real', 'Risks compromise.'],
    ['Reply asking if it is legitimate', 'Engages the attacker.']
  ], ex: 'Make reporting easy and give positive feedback.' },
  { d: 2, q: 'Which metric BEST indicates that a phishing awareness program is working?', o: [
    ['Rising report rate and declining click rate in simulations over time', 'Behavior change is the goal.', true],
    ['Number of training slides', 'Output, not outcome.'],
    ['Number of employees disciplined', 'Punitive metrics discourage reporting.'],
    ['Number of emails sent by IT', 'Unrelated.']
  ], ex: 'Track trends across campaigns.' },
  { d: 2, q: 'An employee accidentally emails a customer list to the wrong external recipient. Which type of anomalous behavior is this?', o: [
    ['Unintentional', 'An honest mistake without malicious intent.', true],
    ['Risky', 'Risky behavior is deliberately unsafe.'],
    ['Malicious insider', 'No intent to harm.'],
    ['Expected', 'Not normal behavior.']
  ], ex: 'Training plus DLP and email warnings for external recipients help reduce unintentional errors.' },
  { d: 2, q: 'Which TWO topics are MOST relevant to training remote/hybrid workers?', o: [
    ['Securing home Wi-Fi and using the corporate VPN', 'Home network security is key for remote work.', true],
    ['Preventing family members from using work devices and locking screens', 'Physical and household risks at home.', true],
    ['Configuring the corporate data center fire suppression', 'Facilities-specific.'],
    ['Writing firewall ACLs for the core network', 'Admin task, not general awareness.']
  ], ex: 'Hybrid work training addresses environments outside office controls.' },
  { d: 2, q: 'Employees are told not to post photos of their ID badges or office whiteboards on social media. Which training topic is this?', o: [
    ['Operational security (OPSEC)', 'Protecting information that could aid attackers.', true],
    ['Password management', 'Different topic.'],
    ['Removable media', 'Different topic.'],
    ['Change management', 'Unrelated.']
  ], ex: 'Badge photos can enable cloning or impersonation; whiteboards may reveal internal details.' },
  { d: 3, s: 'A developer has recently been disabling endpoint protection to “speed up builds” and storing production credentials in a personal notes app.', q: 'How should this behavior be categorized and handled?', o: [
    ['Risky behavior; address it through policy enforcement, coaching and technical controls', 'Deliberately bypassing controls is risky behavior.', true],
    ['Unintentional behavior; no action needed', 'The actions are deliberate.'],
    ['Expected developer behavior', 'Violates security policy.'],
    ['A phishing campaign', 'Unrelated.']
  ], ex: 'Recognizing anomalous behavior includes risky, unexpected and unintentional categories.' },
  { d: 1, q: 'When should security awareness training be delivered?', o: [
    ['At onboarding and on a recurring basis, plus targeted refreshers', 'Initial and recurring training keeps knowledge current.', true],
    ['Only once, at hiring', 'Knowledge fades and threats change.'],
    ['Only after a breach', 'Reactive only.'],
    ['Never, if technical controls exist', 'People remain a target.']
  ], ex: 'Effective programs are continuous and adaptive.' },
  { d: 2, q: 'A user finds an unfamiliar USB charging cable on their desk. What should training advise?', o: [
    ['Don’t use it; report it, because malicious cables can inject keystrokes or malware', 'Malicious cables exist and look normal.', true],
    ['Use it only for charging', 'Malicious cables can still communicate.'],
    ['Plug it into a test laptop to check', 'Still risky; let security analyze it.'],
    ['Give it to a coworker', 'Spreads risk.']
  ], ex: 'Removable media and cables training covers USB drives and malicious cables.' },
  { d: 3, q: 'What is the PRIMARY reason security awareness content should be tailored to roles (e.g., finance, developers, executives)?', o: [
    ['Different roles face different threats, such as BEC for finance and secure coding for developers', 'Relevant content improves effectiveness.', true],
    ['It reduces the need for policies', 'Policies are still needed.'],
    ['It allows skipping training for executives', 'Executives are high-value targets.'],
    ['Regulations forbid generic training', 'Not generally true.']
  ], ex: 'Development and execution of awareness programs should reflect real risks to each audience.' }
]);
