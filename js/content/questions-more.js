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

/* Scenario-based and advanced questions for objectives that had fewer of them. */
SEC.addQuestions('2.2', [
  { d: 3, s: 'A software company notices that a widely used open-source logging library it bundles was updated by a new maintainer. The update quietly sends environment variables to an external server.', q: 'Which threat vector does this BEST represent, and what control would have reduced the risk?', o: [
    ['Supply chain (software provider); pin and review dependency versions and monitor packages before updating', 'The compromise arrived through a trusted third-party component. Dependency pinning, review and package monitoring reduce the risk.', true],
    ['Watering hole; block the library’s website', 'No website the victims visit was compromised.'],
    ['Default credentials; change the library’s password', 'Libraries do not have default credentials.'],
    ['Removable media; disable USB ports', 'The code arrived through the package update process.']
  ], ex: 'Open-source dependencies are part of the supply chain. Software composition analysis, version pinning and review of maintainer changes help catch malicious updates.' }
]);

SEC.addQuestions('2.3', [
  { d: 3, s: 'A developer stores uploaded profile pictures in a cloud bucket. A tester finds that changing the image ID in the URL from 1041 to 1042 shows another customer’s private document, and the bucket allows public listing.', q: 'Which TWO vulnerabilities are present?', o: [
    ['Misconfiguration (publicly listable cloud storage)', 'Public listing of a bucket holding private files is a cloud misconfiguration.', true],
    ['Broken access control (insecure direct object reference) in the web app', 'The app returns objects by ID without checking that they belong to the requester.', true],
    ['Buffer overflow', 'No memory corruption is involved.'],
    ['VM escape', 'No virtualization breakout is involved.']
  ], ex: 'Cloud misconfigurations and missing authorization checks are common, high-impact web vulnerabilities. Fix both: make the bucket private and check object ownership on every request.' }
]);

SEC.addQuestions('3.1', [
  { d: 3, s: 'A startup moves its monolithic app to containers in a managed Kubernetes service. To save time, every container runs as root with the host’s Docker socket mounted, and images are pulled from public registries without scanning.', q: 'Which change MOST reduces the risk of one compromised container taking over the host?', o: [
    ['Stop running containers as privileged root with the host socket mounted, and use minimal, scanned images', 'Privileged containers with the host socket can control the host. Removing that access and scanning images limits the blast radius.', true],
    ['Move the app back to a single monolithic VM', 'This gives up the benefits without fixing the actual misconfiguration.'],
    ['Increase the number of container replicas', 'Scaling does not change isolation.'],
    ['Disable logging to improve performance', 'This reduces visibility.']
  ], ex: 'Containers share the host kernel, so privileged containers and mounted host sockets break isolation. Least privilege and image hygiene are the core controls.' }
]);

SEC.addQuestions('3.3', [
  { d: 3, s: 'A multinational stores customer records in a cloud region in the United States. A new regulation in one of its markets requires residents’ personal data to stay in that country, and analysts in other countries only need aggregated statistics.', q: 'Which approach BEST meets the requirement?', o: [
    ['Store those residents’ data in an in-country region and give other analysts only aggregated or masked data', 'This meets data sovereignty rules and limits exposure through minimization and masking.', true],
    ['Encrypt the data and keep it in the US region', 'Encryption does not satisfy a data residency requirement.'],
    ['Copy the data to every region for availability', 'This violates the residency requirement.'],
    ['Tokenize only the names and keep everything else in the US', 'The rest of the personal data still leaves the country.']
  ], ex: 'Data sovereignty is about where data is stored and processed. Combine geographic restrictions with minimization so other teams see only what they need.' }
]);

SEC.addQuestions('4.1', [
  { d: 3, s: 'A hospital’s staff use personally owned phones to read clinical messages. Security wants to wipe hospital data from a lost phone without touching personal photos, and to block access from jailbroken devices.', q: 'Which solution BEST meets both needs?', o: [
    ['MDM with a managed work profile (containerization) and a compliance policy that blocks jailbroken devices', 'A work container allows selective wipe, and compliance checks detect and block jailbroken devices.', true],
    ['Require a 4-digit PIN only', 'A PIN does not separate data or detect jailbreaks.'],
    ['Full device wipe through the carrier', 'This erases personal data on employee-owned phones.'],
    ['Disable Wi-Fi on all phones', 'This does not address either requirement.']
  ], ex: 'For BYOD, MDM with containerization balances privacy and security, and compliance policies enforce device health.' }
]);

SEC.addQuestions('4.2', [
  { d: 2, s: 'During an audit, the security team finds 37 laptops in the asset inventory that no one can locate. Several were assigned to employees who left in the past year.', q: 'Which process change would BEST prevent this from happening again?', o: [
    ['Make asset return and inventory update a required step in the offboarding checklist, with regular reconciliation', 'Offboarding should recover assets, and periodic reconciliation catches gaps early.', true],
    ['Buy cheaper laptops', 'Cost does not address the tracking gap.'],
    ['Remove the missing laptops from the inventory', 'This hides the problem and the possible data exposure.'],
    ['Disable full-disk encryption to speed up repairs', 'This increases the risk from lost devices.']
  ], ex: 'Asset management spans the lifecycle. Tie assignment and return to HR events, and reconcile the inventory regularly. Remotely lock or wipe devices that are not recovered.' }
]);

SEC.addQuestions('4.4', [
  { d: 3, s: 'A SOC receives 4,000 alerts a day, and analysts close most of them without investigation. Last month a real intrusion alert sat unread for three days.', q: 'Which action would MOST improve detection effectiveness?', o: [
    ['Tune noisy rules with narrow exceptions, correlate related events, and prioritize alerts by severity and asset value', 'Reducing noise and adding context lets analysts focus on the alerts that matter.', true],
    ['Disable all medium and low severity rules', 'This would hide real attacks that start as low-severity signals.'],
    ['Hire more analysts and keep every rule as is', 'This helps but does not address the root cause: alert fatigue from noise.'],
    ['Increase log retention to five years', 'Retention does not improve triage.']
  ], ex: 'Alert fatigue is a classic monitoring failure. Tuning, correlation and prioritization (often with SOAR) restore the signal.' }
]);

SEC.addQuestions('4.7', [
  { d: 3, s: 'A company automates account provisioning from its HR system. A bug in a new mapping rule gives every new hire in Sales the Finance role, and the error spreads to 60 accounts before anyone notices.', q: 'Which TWO controls would have MOST reduced the impact?', o: [
    ['Test automation changes in a staging environment through change management before release', 'Testing catches mapping errors before they reach production.', true],
    ['Alert on unusual privilege assignments, such as a spike in Finance role grants', 'Monitoring the automation’s output detects mistakes quickly.', true],
    ['Remove all automation and provision accounts by hand', 'This loses the consistency and speed benefits instead of managing the risk.'],
    ['Give the automation account domain admin rights', 'This increases the impact of any error.']
  ], ex: 'Automation multiplies both good and bad changes. Treat it like code: test it, control changes to it, and monitor what it does.' }
]);

SEC.addQuestions('5.1', [
  { d: 3, s: 'Each business unit of a fast-growing company writes its own security rules. Auditors find three different password standards and no consistent incident response process, and the board wants consistency without slowing teams down.', q: 'Which governance approach BEST addresses this?', o: [
    ['A central information security policy and standards set by a governance committee, with business units writing procedures within them', 'Centralized policy and standards give consistency, while local procedures keep teams flexible.', true],
    ['Let each unit keep its own rules and compare them yearly', 'This keeps the inconsistency the auditors found.'],
    ['Replace all policies with optional guidelines', 'Guidelines are not mandatory, so nothing becomes consistent.'],
    ['Have the help desk write the policies', 'Policy is set by management and governance bodies.']
  ], ex: 'Policies and standards set the mandatory baseline, and procedures describe how each team meets it. A governance committee keeps them current.' },
  { d: 3, s: 'A cloud payroll provider processes employee data for a company under the company’s instructions. After a breach at the provider, regulators ask the company who was responsible for deciding why and how employee data was processed.', q: 'Which statement is MOST accurate?', o: [
    ['The company is the data controller and remains accountable; the provider is a processor acting on its instructions', 'Controllers decide purposes and means, and keep accountability even when processing is outsourced.', true],
    ['The provider becomes the data owner because it stores the data', 'Storing data does not transfer ownership or controller duties.'],
    ['No one is accountable because the data was in the cloud', 'Accountability does not disappear in the cloud.'],
    ['The employees are the processors', 'Employees are the data subjects.']
  ], ex: 'Outsourcing processing does not outsource accountability. Contracts, due diligence and audits manage the processor’s risk.' }
]);

SEC.addQuestions('5.5', [
  { d: 3, s: 'A penetration tester is hired to test only the company’s public web servers. During testing, she finds credentials that would let her reach the internal HR database.', q: 'What should she do?', o: [
    ['Stop at the scope boundary, document the finding and notify the client contact as the rules of engagement require', 'Testing outside the authorized scope is not permitted, even when it is technically possible.', true],
    ['Use the credentials to prove impact on the HR database', 'This goes beyond written authorization.'],
    ['Post the credentials publicly to warn employees', 'This would expose the client.'],
    ['Ignore the finding because it is out of scope', 'It is a serious finding that the client needs to know about.']
  ], ex: 'Rules of engagement define scope, contacts and how to handle critical findings. Out-of-scope discoveries are reported, not exploited.' }
]);
