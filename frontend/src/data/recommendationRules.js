export const recommendationRules = {
  "org-type-q": {
    priority: "Medium",
    title: "Standardize IAM Topology based on Organization Scale",
    description: "Since organization size and type dictates the complexity of IAM, ensure your chosen platform supports a multi-tenant or delegated administration model if you operate across diverse branches or sectors. Focus on centralized visibility with decentralized management to avoid bottlenecks."
  },
  "ind-sector-q": {
    priority: "High",
    title: "Align IAM with Industry Regulatory Requirements",
    description: "Industry regulations (like SOX, HIPAA, PCI-DSS) strictly govern access. Your IAM strategy must include robust auditing, mandatory periodic access reviews, and strict separation of duties (SoD) to satisfy compliance auditors and avoid penalties."
  },
  "num-identities-q": {
    priority: "Medium",
    title: "Plan for Scalability and Flexible Licensing",
    description: "The volume of identities directly impacts system performance and costs. Choose a solution that scales horizontally and offers tiered or consumption-based pricing rather than rigid per-seat models, especially if managing a large volume of external/partner identities."
  },
  "iam-maturity-q": {
    priority: "Medium",
    title: "Phase Your IAM Maturity Progression",
    description: "Avoid jumping to advanced Zero-Trust or AI-driven IAM if foundational elements (like basic SSO and MFA) are not fully deployed. Implement a phased roadmap: stabilize directories first, then SSO/MFA, followed by IGA, and finally advanced analytics."
  },
  "identity-growth-q": {
    priority: "High",
    title: "Adopt Cloud-Native Identity for High Growth",
    description: "Rapid identity growth requires cloud-native solutions that can automatically scale. Ensure your architecture relies heavily on automated provisioning (SCIM) and HR-driven onboarding to prevent manual IT bottlenecks as your workforce expands."
  },
  "multi-entity-q": {
    priority: "High",
    title: "Design for Federation and Multi-Tenancy",
    description: "Active M&A or subsidiary structures require loose coupling between identity domains. Rely on federation (SAML/OIDC) and B2B identity collaboration rather than attempting to consolidate everyone into a single active directory forest immediately."
  },
  "auth-methods-q": {
    priority: "High",
    title: "Implement Phishing-Resistant Authentication",
    description: "Relying on basic passwords or SMS MFA is insufficient against modern attacks. Transition to phishing-resistant methods like FIDO2 hardware keys, Windows Hello, or passkeys to drastically reduce the risk of credential compromise."
  },
  "ciam-need-q": {
    priority: "Medium",
    title: "Separate CIAM from Workforce Identity",
    description: "Customer Identity (CIAM) requires high scalability, UX-focused registration, and CRM integrations, which differs from Workforce IAM. Use a dedicated CIAM tenant or product to prevent internal security policies from degrading the external customer experience."
  },
  "id-lifecycle-q": {
    priority: "High",
    title: "Automate Joiner, Mover, Leaver (JML) Processes",
    description: "Manual provisioning leads to orphan accounts and security gaps. Integrate your HR system directly with your IAM platform to automatically trigger provisioning and immediate access revocation upon termination."
  },
  "dev-experience-q": {
    priority: "Medium",
    title: "Prioritize Developer-Friendly APIs and SDKs",
    description: "If building custom apps, your development team needs seamless IAM integration. Select vendors that offer robust SDKs, well-documented REST/GraphQL APIs, and drop-in UI widgets to accelerate secure application delivery."
  },
  "primary-store-q": {
    priority: "High",
    title: "Establish a Single Source of Truth",
    description: "Fragmented identity stores cause data inconsistency. Designate a single system (such as an HRIS or a master cloud directory) as the authoritative source of truth, and strictly enforce downstream syncing rather than allowing disparate updates."
  },
  "non-human-q": {
    priority: "High",
    title: "Implement Secrets Management for Machine Identities",
    description: "Non-human identities (service accounts, bots, CI/CD pipelines) often possess highly privileged access. Do not manage them like human accounts; use dedicated secrets management platforms (like HashiCorp Vault or CyberArk) with short-lived tokens."
  },
  "self-service-q": {
    priority: "Medium",
    title: "Deploy Comprehensive Self-Service Portals",
    description: "Reduce IT helpdesk friction by enabling self-service password resets (SSPR), access requests, and profile management. Ensure self-service actions are protected by step-up MFA to prevent account takeover."
  },
  "access-models-q": {
    priority: "Medium",
    title: "Transition from RBAC to ABAC/PBAC",
    description: "Static roles often lead to 'role explosion'. Move towards Attribute-Based Access Control (ABAC) or Policy-Based Access Control (PBAC) that evaluates dynamic context (location, device posture, time) before granting access."
  },
  "resources-scope-q": {
    priority: "Medium",
    title: "Extend Governance to Unstructured Data and Cloud",
    description: "Do not limit access governance to just web applications. Ensure your IGA strategy extends to unstructured data (file shares), cloud infrastructure entitlements (CIEM), and critical databases."
  },
  "need-iga-q": {
    priority: "High",
    title: "Deploy Formal Identity Governance and Administration",
    description: "Basic SSO tools cannot enforce compliance. You need a dedicated IGA platform to manage complex access request workflows, enforce Separation of Duties (SoD), and provide verifiable audit trails for regulated access."
  },
  "auto-reviews-q": {
    priority: "High",
    title: "Automate Periodic Access Certification Campaigns",
    description: "Manual spreadsheet-based reviews are error-prone and fail audits. Implement automated certification campaigns that route approvals to resource owners or managers, utilizing micro-certifications to prevent reviewer fatigue."
  },
  "granularity-q": {
    priority: "Medium",
    title: "Implement Fine-Grained Authorization",
    description: "Coarse app-level access is insufficient for sensitive applications. Utilize externalized authorization solutions (like OPA or Cedar) to enforce fine-grained, row/field-level permissions outside of the application codebase."
  },
  "policy-sim-q": {
    priority: "Medium",
    title: "Enable 'What-If' Policy Simulation",
    description: "Before applying sweeping policy changes or altering SoD rules, utilize simulation capabilities to preview the impact. This prevents accidental lockouts and ensures compliance rules function as intended."
  },
  "custom-apps-q": {
    priority: "Medium",
    title: "Standardize Custom App Integrations on OIDC/SAML",
    description: "Migrate all custom-built applications away from legacy authentications (like LDAP bind) and standardize them on modern protocols (OIDC, OAuth 2.0, SAML) to centralize security controls and enable SSO."
  },
  "current-directory-q": {
    priority: "High",
    title: "Modernize Legacy Directories",
    description: "If relying heavily on legacy on-prem directories, begin a modernization strategy. Implement a cloud-based Universal Directory to act as an abstraction layer, allowing you to slowly deprecate legacy infrastructure without disrupting applications."
  },
  "dir-capabilities-q": {
    priority: "Medium",
    title: "Consolidate Disparate Directory Forests",
    description: "Managing multiple directory forests introduces security risks and synchronization nightmares. Utilize meta-directory synchronization or cloud directory federation to provide a unified identity view across the organization."
  },
  "data-residency-q": {
    priority: "High",
    title: "Enforce Data Sovereignty with Regional Tenants",
    description: "To meet strict data residency requirements (EU GDPR, DPDP), ensure your IAM vendor guarantees localized data hosting and processing. Avoid multi-tenant environments that replicate PII across restricted borders."
  },
  "dir-availability-q": {
    priority: "High",
    title: "Design for High Availability and Fault Tolerance",
    description: "Since identity is the control plane, an IAM outage means a business outage. Architect your deployment for high availability (active-active multi-region) and establish offline fallback access mechanisms for emergency situations."
  },
  "dir-audit-q": {
    priority: "Medium",
    title: "Centralize Directory Audit Logging",
    description: "Directory logs are a goldmine for threat hunting. Forward all directory read/write logs, authentication attempts, and schema changes to a centralized SIEM for real-time alerting on suspicious activity."
  },
  "pam-caps-q": {
    priority: "High",
    title: "Deploy Comprehensive Privileged Access Management",
    description: "Do not allow direct, unmonitored use of highly privileged accounts. Implement a PAM solution to vault credentials, isolate administrative sessions, and enforce strict checkout procedures."
  },
  "priv-users-q": {
    priority: "High",
    title: "Secure Third-Party and Vendor Access",
    description: "Third-party vendors are a common attack vector. Provide vendors with strictly scoped, time-bound, and fully recorded privileged access rather than granting them permanent VPN connectivity or standing AD accounts."
  },
  "session-record-q": {
    priority: "Medium",
    title: "Implement Privileged Session Recording",
    description: "For high-risk systems, vaulting passwords isn't enough. Implement full session recording (video and keystroke logging) to establish an irrefutable audit trail for forensics and compliance."
  },
  "devops-secrets-q": {
    priority: "High",
    title: "Eliminate Hardcoded DevOps Secrets",
    description: "Developers often embed secrets in code or configuration files. Deploy dynamic secrets management (e.g. HashiCorp Vault) to inject temporary, short-lived credentials directly into CI/CD pipelines at runtime."
  },
  "zsp-q": {
    priority: "High",
    title: "Enforce Zero Standing Privileges (ZSP)",
    description: "Permanent admin accounts are a massive risk. Transition to a Just-In-Time (JIT) elevation model where administrators request elevated access only when needed, which is automatically revoked after the task is completed."
  },
  "endpoint-pam-q": {
    priority: "Medium",
    title: "Remove Local Admin Rights via Endpoint PAM",
    description: "Revoke permanent local administrator rights from all end-user workstations. Implement Endpoint Privilege Management (EPM) tools to allow seamless, policy-based elevation for approved applications without exposing the whole OS."
  },
  "comp-frameworks-q": {
    priority: "High",
    title: "Map IAM Controls to Compliance Frameworks",
    description: "Ensure your IAM deployment directly maps to your required compliance frameworks (NIST, ISO). Utilize vendor-provided compliance reporting templates to drastically reduce the time spent gathering evidence for auditors."
  },
  "audit-needs-q": {
    priority: "Medium",
    title: "Implement Immutable Audit Logs",
    description: "To prevent attackers from covering their tracks, ensure that your IAM and PAM audit logs are immutable and securely stored. Integrate closely with your SIEM to generate automated incident tickets on policy violations."
  },
  "audit-freq-q": {
    priority: "Medium",
    title: "Transition to Continuous Compliance",
    description: "Infrequent, point-in-time audits leave large gaps in visibility. Implement automated compliance monitoring that alerts administrators the moment a configuration drifts out of alignment with your required baseline."
  },
  "ai-anomaly-q": {
    priority: "High",
    title: "Enable AI/ML Anomaly and Risk Detection",
    description: "Static rules cannot catch sophisticated attacks. Enable User and Entity Behavior Analytics (UEBA) within your IAM platform to detect impossible travel, abnormal access times, and deviations from typical peer group behavior."
  },
  "deploy-model-q": {
    priority: "Medium",
    title: "Evaluate SaaS vs Self-Managed Tradeoffs",
    description: "While SaaS IAM offers lower maintenance and rapid innovation, highly regulated or air-gapped environments may mandate on-prem or private cloud deployments. Ensure your vendor choice aligns with your long-term infrastructure strategy."
  },
  "cloud-platforms-q": {
    priority: "Medium",
    title: "Utilize Cloud Infrastructure Entitlement Management (CIEM)",
    description: "Managing permissions in AWS, Azure, and GCP requires specialized tools. Implement a CIEM solution to detect overly permissive cloud roles, analyze actual usage, and automatically right-size cloud IAM policies."
  },
  "integ-systems-q": {
    priority: "High",
    title: "Prioritize Out-of-the-Box Connectors",
    description: "Custom integrations drastically increase project timelines and maintenance overhead. Select IAM platforms that offer out-of-the-box connectors for your most critical SaaS apps, HR systems, and legacy infrastructure."
  },
  "network-arch-q": {
    priority: "High",
    title: "Shift to Identity as the New Perimeter",
    description: "In a cloud-first, work-from-anywhere world, legacy VPN perimeters are obsolete. Transition to a Zero Trust Network Access (ZTNA) model where access is brokered based on identity context, not network location."
  },
  "exist-siem-q": {
    priority: "Medium",
    title: "Bi-directional SIEM/SOAR Integration",
    description: "Integrate IAM with your SIEM/SOAR not just for logging, but for automated response. If the SOC detects a compromised device, the SOAR should automatically trigger the IAM platform to revoke sessions and force password resets."
  },
  "k8s-maturity-q": {
    priority: "Medium",
    title: "Secure Kubernetes Workload Identities",
    description: "Kubernetes introduces complex identity challenges. Utilize native capabilities like SPIFFE/SPIRE or cloud IAM roles for Service Accounts (IRSA) to grant workloads secure, short-lived identities instead of using static API keys."
  },
  "zt-maturity-q": {
    priority: "High",
    title: "Adopt an Identity-Centric Zero Trust Strategy",
    description: "Zero Trust begins with identity. Ensure every access request—whether human or machine—is explicitly verified, authenticated, and authorized continuously before establishing a connection to the requested resource."
  },
  "device-posture-q": {
    priority: "High",
    title: "Integrate Device Trust into Access Decisions",
    description: "A valid password on a malware-infected device is still a breach. Integrate IAM with your MDM/EDR tools (like CrowdStrike or Intune) to block access if a device falls out of compliance, lacks patches, or exhibits risk."
  },
  "cae-q": {
    priority: "High",
    title: "Implement Continuous Access Evaluation (CAE)",
    description: "Traditional SSO evaluates risk only at the moment of login. Implement CAE to continuously evaluate risk during the session, instantly revoking access tokens if a user's location, device status, or risk profile changes abruptly."
  },
  "threat-platforms-q": {
    priority: "Medium",
    title: "Ingest External Threat Intelligence",
    description: "Enhance your identity protection by ingesting signals from external threat platforms. If a user's credentials are discovered on the dark web, the IAM system should automatically force a high-friction MFA challenge or password reset."
  },
  "ai-caps-q": {
    priority: "Medium",
    title: "Leverage AI for Role Mining and Design",
    description: "Creating roles manually is inefficient and inaccurate. Utilize AI-driven role mining tools to analyze historical access patterns and automatically suggest optimized, least-privilege roles based on actual usage and peer groups."
  },
  "ai-cert-q": {
    priority: "Medium",
    title: "Streamline Reviews with AI Recommendations",
    description: "Reviewer fatigue leads to rubber-stamping. Implement AI/ML features within your IGA platform that highlight low-risk access for auto-approval, while flagging high-risk outliers for manual, rigorous manager review."
  },
  "nl-query-q": {
    priority: "Low",
    title: "Enhance Visibility with NLP Queries",
    description: "Enable natural language querying tools to allow non-technical business owners and auditors to easily query identity data (e.g. 'Who has admin access to Salesforce?') without needing complex SQL or API knowledge."
  },
  "budget-q": {
    priority: "Medium",
    title: "Align Capabilities with Budget Realities",
    description: "Full-suite identity platforms are expensive. If budget is tight, focus investment on foundational pillars (SSO/MFA) first, and evaluate capable mid-market alternatives or open-source solutions before committing to heavy enterprise IGA/PAM."
  },
  "timeline-q": {
    priority: "High",
    title: "Adopt Agile, Phased IAM Rollouts",
    description: "IAM 'big bang' deployments frequently fail. Break your implementation into aggressive, 90-day agile sprints, delivering immediate value (like SSO for top 10 apps) before tackling complex legacy integration or deep governance workflows."
  },
  "vendor-lock-q": {
    priority: "Medium",
    title: "Embrace Open Identity Standards",
    description: "To mitigate vendor lock-in, strictly enforce the use of open standards (SAML, OIDC, OAuth 2.0, SCIM) for all application integrations. Avoid proprietary vendor APIs for authentication wherever possible."
  },
  "multi-vendor-q": {
    priority: "Medium",
    title: "Evaluate Integrated Suites vs. Best-of-Breed",
    description: "While a single-vendor platform reduces integration friction and licensing complexity, highly specialized environments often require best-of-breed solutions for IGA or PAM. Balance the need for advanced features against operational overhead."
  },
  "support-level-q": {
    priority: "Medium",
    title: "Secure Enterprise-Grade Vendor Support",
    description: "Given the criticality of IAM, ensure your contracts include 24/7 support with strict SLAs. For complex migrations, mandate dedicated Technical Account Managers (TAMs) or involve specialized implementation partners."
  },
  "prev-eval-q": {
    priority: "Low",
    title: "Leverage Previous Vendor Evaluations",
    description: "Incorporate findings from past Proof of Concepts (PoCs). Identify specific functional gaps that disqualified previous vendors and ensure those use-cases form the core of your new testing criteria."
  },
  "past-failures-q": {
    priority: "High",
    title: "Learn from Past Implementation Failures",
    description: "Identify the root cause of past IAM failures (e.g., poor data quality, lack of executive sponsorship, over-customization) and explicitly address them in your new program charter to prevent repeating history."
  }
};
