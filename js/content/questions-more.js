/* Additional authored questions so every objective has at least 12. IDs continue each objective's numbering. */
SEC.addQuestions('1.1', [
  { d: 2, s: 'After a break-in, a retailer adds motion-activated floodlights to its loading dock and posts signs that the area is monitored.', q: 'Which TWO control types do these additions primarily provide?', o: [
    ['Deterrent', 'Lights and monitoring signs discourage intruders from trying.', true],
    ['Detective', 'Motion-activated lights reveal movement and draw attention to it.', true],
    ['Corrective', 'Nothing is being restored after an incident.'],
    ['Directive', 'The signs warn outsiders; they are not instructions for staff behavior.']
  ], ex: 'Lighting both discourages attempts and exposes activity when it happens. Neither physically stops entry, so neither is preventive.' },
  { d: 3, q: 'A bank requires that wire transfers above $50,000 be approved by two different managers. Which category and type BEST describe this requirement?', o: [
    ['Managerial category, preventive type', 'It is a policy-level rule (managerial) designed to stop fraudulent transfers before they happen (preventive).', true],
    ['Technical category, detective type', 'The rule is not enforced only by software, and it acts before the transfer, not after.'],
    ['Physical category, deterrent type', 'Nothing physical is involved.'],
    ['Operational category, corrective type', 'It does not repair anything after an incident.']
  ], ex: 'Dual approval (a separation-of-duties control) is set by management and exists to prevent a single person from completing a fraudulent action.' }
]);

SEC.addQuestions('1.3', [
  { d: 1, q: 'Which is the PRIMARY purpose of testing a change in a non-production environment before approval?', o: [
    ['To find problems before they affect users and production systems', 'Testing reveals breakage and side effects safely.', true],
    ['To avoid needing a backout plan', 'A backout plan is still required.'],
    ['To skip the change advisory board', 'Test results support the approval; they do not replace it.'],
    ['To extend the maintenance window', 'Testing is unrelated to window length.']
  ], ex: 'Test results are a key input to change approval because they show the change works and expose side effects early.' },
  { d: 2, s: 'A routine monthly OS patch for 300 workstations follows the same steps every time and has never caused an outage.', q: 'How should this change MOST efficiently be handled under change management?', o: [
    ['As a pre-approved standard change following a documented SOP', 'Low-risk, repeatable changes can be pre-approved and run from an SOP.', true],
    ['As an emergency change each month', 'Emergency changes are for urgent, unplanned fixes.'],
    ['Without any record, because it is routine', 'Every change should still be recorded.'],
    ['By full CAB review of each workstation individually', 'This adds effort without reducing risk for a proven routine change.']
  ], ex: 'Standard changes keep control and documentation while removing unnecessary review for proven, low-risk work.' },
  { d: 3, q: 'A firewall rule change was approved, but the implementer also opened an extra port "to save time later." Which TWO change management principles were violated?', o: [
    ['The change went beyond its approved scope', 'Only the approved change should be made.', true],
    ['The extra port skipped impact analysis and approval', 'Unreviewed changes bypass risk assessment.', true],
    ['The maintenance window was too long', 'Timing is not the issue described.'],
    ['Version control was used', 'Version control is good practice, not a violation.']
  ], ex: 'Scope creep during implementation introduces unassessed risk, which change management exists to prevent.' }
]);

SEC.addQuestions('2.1', [
  { d: 2, q: 'Which threat actor is MOST likely to have the least funding and sophistication but still cause damage using publicly available attack tools?', o: [
    ['Unskilled attacker', 'Low skill and resources, relying on tools written by others.', true],
    ['Nation-state', 'Nation-states are well funded and sophisticated.'],
    ['Organized crime', 'Criminal groups are usually well resourced.'],
    ['Advanced persistent threat', 'APTs are highly capable by definition.']
  ], ex: 'Off-the-shelf tools let low-skill attackers cause real harm, which is why patching and basic hygiene matter.' },
  { d: 3, s: 'Months after a contract dispute, a former IT contractor uses a VPN account that was never disabled to delete backup jobs.', q: 'Which TWO describe this situation?', o: [
    ['Insider threat (former contractor with retained access)', 'Former insiders with valid access are insider threats.', true],
    ['Revenge as the likely motivation', 'A contract dispute followed by destructive action suggests revenge.', true],
    ['Hacktivism', 'No political or social cause is involved.'],
    ['Espionage', 'Deleting backups is destructive, not intelligence gathering.']
  ], ex: 'Prompt de-provisioning of contractors and regular access reviews prevent leftover access from being abused.' }
]);

SEC.addQuestions('2.5', [
  { d: 2, q: 'A company wants to ensure that a stolen laptop does not expose customer data, even if the attacker removes the drive. Which mitigation is MOST appropriate?', o: [
    ['Full-disk encryption', 'Encrypted drives are unreadable without the key.', true],
    ['Host-based firewall', 'A firewall does not protect data on a removed drive.'],
    ['Application allow list', 'This controls what runs, not data at rest.'],
    ['Network segmentation', 'Segmentation does not protect a physically stolen device.']
  ], ex: 'Encryption is the mitigation for data at rest on lost or stolen devices.' }
]);

SEC.addQuestions('3.3', [
  { d: 2, q: 'A hospital wants to share patient data with researchers while preventing them from identifying individuals. Which approach BEST meets this goal?', o: [
    ['Mask or remove identifying fields before sharing', 'Removing or masking identifiers protects privacy while keeping useful data.', true],
    ['Encrypt the data and give researchers the key', 'Researchers could then read the identifiers.'],
    ['Hash the entire records', 'Hashed records are not useful for research analysis.'],
    ['Share the raw data under an NDA only', 'An NDA does not technically protect identities.']
  ], ex: 'Data minimization and masking reduce exposure of personal data while supporting a legitimate purpose.' }
]);

SEC.addQuestions('4.2', [
  { d: 1, q: 'Why should software license and version information be included in asset inventory?', o: [
    ['To track what needs patching and to ensure software is legitimately licensed', 'Inventory supports vulnerability management and compliance.', true],
    ['To increase disk space', 'Inventory does not affect storage.'],
    ['To encrypt the software', 'Inventory does not encrypt anything.'],
    ['To disable logging', 'Unrelated.']
  ], ex: 'You cannot patch or license what you do not know you have.' },
  { d: 2, s: 'An employee leaves the company. Their laptop is returned, but no one records it, and it sits in a closet for a year with cached credentials and local files.', q: 'Which asset management weakness does this show?', o: [
    ['Poor tracking and decommissioning of returned assets', 'Returned devices must be recorded, sanitized and reassigned or retired.', true],
    ['Over-retention of backup tapes', 'No tapes are involved.'],
    ['Weak procurement process', 'The issue happens at return, not purchase.'],
    ['Lack of encryption in transit', 'Unrelated to the stored laptop.']
  ], ex: 'Offboarding should trigger asset return, inventory update and sanitization.' },
  { d: 3, q: 'Which TWO actions should happen when a server is assigned a data classification of Confidential?', o: [
    ['A named owner is recorded and accountable for it', 'Ownership is part of assignment and accounting.', true],
    ['Controls required for Confidential data, such as encryption and restricted access, are applied', 'Classification drives which controls are required.', true],
    ['The server is removed from inventory to hide it', 'Hiding assets makes them unmanaged.'],
    ['Logging is disabled to protect the data', 'Logging supports protection and should remain on.']
  ], ex: 'Assignment ties every asset to an owner and a classification, and the classification determines its controls.' }
]);

SEC.addQuestions('4.4', [
  { d: 2, q: 'A SIEM correlates a VPN login from a new country, a mass file download, and an email forward rule created by the same account within 15 minutes. Why is correlation valuable here?', o: [
    ['Individually minor events combine into a high-confidence sign of account compromise', 'Correlation links related events across sources.', true],
    ['It deletes the attacker’s files automatically', 'Correlation detects; it does not delete.'],
    ['It replaces the need for log retention', 'Logs are still needed.'],
    ['It encrypts the VPN traffic', 'Unrelated.']
  ], ex: 'Correlating signals across systems is the core value of a SIEM.' },
  { d: 3, q: 'Which TWO are good reasons to tune an IDS/SIEM rule set regularly?', o: [
    ['Reduce false positives that cause alert fatigue', 'Fewer noisy alerts keep analysts focused.', true],
    ['Adjust detections as the environment and threats change', 'New systems and attack techniques require updated rules.', true],
    ['Lower storage costs by turning off all logging', 'Disabling logging removes visibility.'],
    ['Guarantee zero false negatives', 'No tuning can guarantee that.']
  ], ex: 'Tuning keeps detection accurate and actionable over time.' }
]);

SEC.addQuestions('4.7', [
  { d: 1, q: 'Which is an example of automating user de-provisioning?', o: [
    ['An HR termination event automatically disables the user’s accounts and revokes access', 'Automation removes access immediately and consistently.', true],
    ['A manager emails IT a week later', 'That is manual and slow.'],
    ['Reviewing accounts once a year only', 'Annual review is not automated de-provisioning.'],
    ['Letting accounts expire after 10 years', 'Far too slow.']
  ], ex: 'Automated de-provisioning closes one of the most common gaps attackers and insiders exploit.' },
  { d: 2, q: 'How does automation act as a workforce multiplier for a small security team?', o: [
    ['Repetitive tasks run automatically, so analysts can focus on investigations that need judgment', 'Automation handles volume; people handle complex decisions.', true],
    ['It removes the need for any analysts', 'People are still required.'],
    ['It guarantees no incidents occur', 'Automation does not prevent all incidents.'],
    ['It doubles each analyst’s salary', 'Unrelated.']
  ], ex: 'Automation saves time and improves consistency, which effectively expands team capacity.' },
  { d: 2, s: 'A cloud team writes a script that automatically creates security groups for new servers using an approved template.', q: 'Which benefit does this MOST directly provide?', o: [
    ['Standard, secure infrastructure configurations every time', 'Templates enforce consistent, approved settings.', true],
    ['Elimination of all technical debt', 'Scripts can create their own technical debt.'],
    ['Removal of the need for change management', 'Changes to the template still need review.'],
    ['Faster physical shipping of servers', 'Unrelated.']
  ], ex: 'Automated provisioning from approved templates enforces baselines and reduces misconfiguration.' },
  { d: 3, q: 'Which TWO are risks that must be managed when introducing security orchestration?', o: [
    ['A failure in the orchestration platform can halt many dependent processes', 'Central platforms can become single points of failure.', true],
    ['Poorly tested playbooks can take harmful actions at scale', 'Automation amplifies mistakes as well as successes.', true],
    ['Orchestration always makes response slower', 'It usually speeds response.'],
    ['Orchestration cannot integrate with other tools', 'Integration through APIs is its purpose.']
  ], ex: 'Plan for redundancy, testing, safeguards and ongoing ownership when automating.' }
]);

SEC.addQuestions('4.9', [
  { d: 2, q: 'An analyst wants to know which internal host was assigned IP 10.0.4.57 at 14:05 yesterday. Which data source answers this?', o: [
    ['DHCP server logs', 'DHCP logs record which device (MAC) leased which IP and when.', true],
    ['Firewall deny logs', 'These show blocked traffic, not address assignments.'],
    ['Vulnerability scan report', 'Scans show weaknesses, not lease history.'],
    ['Email gateway logs', 'Unrelated to IP assignment.']
  ], ex: 'Mapping IPs to devices at a point in time is a common first step in investigations.' }
]);

SEC.addQuestions('5.1', [
  { d: 2, q: 'A security team publishes a document recommending, but not requiring, that staff use a passphrase of four random words. What type of document is this?', o: [
    ['Guideline', 'Recommendations that are not mandatory are guidelines.', true],
    ['Standard', 'Standards are mandatory.'],
    ['Policy', 'Policies are mandatory statements of intent.'],
    ['Procedure', 'Procedures are mandatory step-by-step instructions.']
  ], ex: 'Guidelines give flexible advice; policies, standards and procedures are mandatory.' }
]);

SEC.addQuestions('5.3', [
  { d: 2, q: 'What is the PRIMARY purpose of a vendor security questionnaire during selection?', o: [
    ['To gather information about the vendor’s security practices as part of due diligence', 'Questionnaires collect evidence for the risk assessment.', true],
    ['To replace the contract', 'Questionnaires do not create obligations.'],
    ['To calculate the vendor’s ALE', 'Unrelated.'],
    ['To grant the vendor network access', 'Access is a separate decision.']
  ], ex: 'Questionnaires are a starting point; independent evidence such as audit reports adds assurance.' }
]);

SEC.addQuestions('5.4', [
  { d: 2, q: 'Which is an example of internal compliance reporting?', o: [
    ['A quarterly compliance status report to the board’s audit committee', 'Internal reporting goes to the organization’s own leadership.', true],
    ['A breach notification to a regulator', 'That is external reporting.'],
    ['A PCI DSS report on compliance sent to the card brands', 'That is external.'],
    ['A customer-facing SOC 2 report', 'That is shared externally.']
  ], ex: 'Internal reporting informs leadership; external reporting informs regulators, partners and customers.' },
  { d: 3, s: 'A company collects customers’ birth dates for a loyalty program but has no documented reason to keep them after the program ends. Privacy law requires data minimization.', q: 'What should the company do?', o: [
    ['Define a retention period tied to the purpose and delete the data when it is no longer needed', 'Retention limits and deletion support minimization requirements.', true],
    ['Keep the data indefinitely in case it becomes useful', 'This violates minimization and increases breach impact.'],
    ['Move the data to a different country', 'Relocation does not address minimization.'],
    ['Encrypt it and keep it forever', 'Encryption helps but does not satisfy retention limits.']
  ], ex: 'A data inventory with purpose-based retention is central to privacy compliance.' }
]);

SEC.addQuestions('5.5', [
  { d: 2, q: 'What must be in place BEFORE a penetration tester begins active testing?', o: [
    ['Written authorization and agreed rules of engagement', 'Testing without permission can be illegal and disruptive.', true],
    ['A completed final report', 'The report comes after testing.'],
    ['Disabled monitoring tools', 'Monitoring usually stays on; the scope says how detection is handled.'],
    ['Public announcement of the test', 'Tests are not publicly announced.']
  ], ex: 'Authorization and rules of engagement define scope, timing, allowed techniques and contacts.' },
  { d: 3, q: 'Which TWO activities are examples of active reconnaissance?', o: [
    ['Port scanning the target’s public IP range', 'Scanning interacts directly with target systems.', true],
    ['Banner grabbing on the target’s mail server', 'Connecting to the service is direct interaction.', true],
    ['Reading the company’s job postings', 'Public sources are passive.'],
    ['Searching certificate transparency logs', 'Public records are passive.']
  ], ex: 'Active reconnaissance touches target systems and can be detected; passive reconnaissance does not.' }
]);

SEC.addQuestions('5.6', [
  { d: 2, q: 'An employee is working from a coffee shop. Which behavior should awareness training encourage?', o: [
    ['Use the company VPN, lock the screen when stepping away, and be mindful of shoulder surfing', 'These address common risks of public spaces.', true],
    ['Join any open Wi-Fi without a VPN', 'Open networks expose traffic.'],
    ['Leave the laptop unlocked while ordering', 'Unattended devices are easy to misuse or steal.'],
    ['Share the screen with strangers who ask', 'This exposes sensitive information.']
  ], ex: 'Situational awareness and remote work training cover physical and network risks outside the office.' },
  { d: 3, s: 'A security team sees that click rates in phishing simulations are low, but almost nobody reports suspicious emails.', q: 'What is the BEST next step for the awareness program?', o: [
    ['Promote and simplify reporting, and recognize people who report', 'Reporting turns employees into an early-warning system.', true],
    ['Stop all simulations because click rates are low', 'Reporting behavior still needs improvement.'],
    ['Make simulations impossible to spot', 'Unrealistic tests erode trust.'],
    ['Discipline everyone who did not report', 'Punishment discourages engagement.']
  ], ex: 'Effective programs measure and improve both avoiding clicks and reporting threats.' }
]);
