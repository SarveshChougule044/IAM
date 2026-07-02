const assessmentQuestions = [
  {
    id: "org-profile",
    title: "Organization Profile",
    description: "Assess your organization type, scale, and multi-entity structure.",
    icon: "building",
    color: "blue",
    subConcepts: [
      {
        id: "org-type",
        title: "Organization type",
        description: "Why it matters: The size and type of org (startup vs global enterprise vs public sector) changes IAM scale, complexity, and typical budget.",
        details: [
          { id: "org-type-q", title: "What type of organization are you?" }
        ]
      },
      {
        id: "ind-sector",
        title: "Industry sector",
        description: "Why it matters: Industry drives regulatory requirements (e.g. finance → SOX, PCI; healthcare → HIPAA) and IAM complexity.",
        details: [
          { id: "ind-sector-q", title: "Which industry best describes your organization?" }
        ]
      },
      {
        id: "num-identities",
        title: "Number of identities",
        description: "Why it matters: Identity count directly affects product tier, performance needs, and pricing model.",
        details: [
          { id: "num-identities-q", title: "How many user identities need to be managed (employees, contractors, partners, customers)?" }
        ]
      },
      {
        id: "iam-maturity",
        title: "Current IAM maturity",
        description: "Why it matters: Prevents recommending tools that are too simple or too advanced for where they are today.",
        details: [
          { id: "iam-maturity-q", title: "What is your current IAM maturity level (from no formal IAM to advanced zero‑trust, AI‑driven IAM)?" }
        ]
      },
      {
        id: "identity-growth",
        title: "Expected identity growth",
        description: "Why it matters: Rapid growth may rule out rigid per‑seat licensing and favors scalable, consumption‑based IAM.",
        details: [
          { id: "identity-growth-q", title: "What is your expected identity growth rate over the next 3 years?" }
        ]
      },
      {
        id: "multi-entity",
        title: "Multi‑entity structure (M&A, subsidiaries)",
        description: "Why it matters: Multi‑entity environments need federation, multi‑tenant design, and flexible trust boundaries.",
        details: [
          { id: "multi-entity-q", title: "Do you have subsidiaries, joint ventures, or active M&A in scope?" }
        ]
      }
    ]
  },
  {
    id: "identity-management",
    title: "Identity Management",
    description: "Assess your authentication methods, CIAM, and identity lifecycle needs.",
    icon: "users",
    color: "teal",
    subConcepts: [
      {
        id: "auth-methods",
        title: "Authentication methods",
        description: "Why it matters: Determines which identity providers and standards the solution must support.",
        details: [
          { id: "auth-methods-q", title: "Which authentication methods do you require (SSO, MFA, passwordless/FIDO2, biometrics, SAML, OIDC, Kerberos, certificates, adaptive MFA, hardware tokens)?" }
        ]
      },
      {
        id: "ciam-need",
        title: "Customer Identity (CIAM)",
        description: "Why it matters: CIAM products and workforce IAM products can be different; some platforms cover both.",
        details: [
          { id: "ciam-need-q", title: "Do you need CIAM for external customers, workforce IAM only, or both?" }
        ]
      },
      {
        id: "id-lifecycle",
        title: "Identity lifecycle capabilities",
        description: "Why it matters: Lifecycle automation is key for security (no orphan accounts) and for reducing manual work.",
        details: [
          { id: "id-lifecycle-q", title: "Which identity lifecycle features do you require (automated onboarding/offboarding, SCIM 2.0 provisioning, HR‑driven sync, self‑service, delegated admin, guest identities)?" }
        ]
      },
      {
        id: "dev-experience",
        title: "Developer experience importance",
        description: "Why it matters: If they build many custom apps, they need strong APIs and SDKs; otherwise simpler admin‑only tools may be fine.",
        details: [
          { id: "dev-experience-q", title: "How important is developer experience (SDKs, APIs, good docs) for your team?" }
        ]
      },
      {
        id: "primary-store",
        title: "Primary identity store (source of truth)",
        description: "Why it matters: The IAM platform must integrate cleanly with the real source of truth.",
        details: [
          { id: "primary-store-q", title: "What is your current primary identity store (on‑prem AD, Entra ID, Google Workspace, HR system, custom DB, none, multiple sources)?" }
        ]
      },
      {
        id: "non-human",
        title: "Non‑human / workload identities",
        description: "Why it matters: Workload identities push you towards platforms that support secrets management and non‑human lifecycle.",
        details: [
          { id: "non-human-q", title: "Do you need to manage machine identities (service accounts, CI/CD, cloud workloads, Kubernetes pods, IoT devices)?" }
        ]
      },
      {
        id: "self-service",
        title: "Self‑service importance",
        description: "Why it matters: High self‑service expectations require user‑friendly portals and workflows.",
        details: [
          { id: "self-service-q", title: "How important is self‑service (password reset, MFA enrollment, profile updates) for end users?" }
        ]
      }
    ]
  },
  {
    id: "access-gov",
    title: "Access Management & Governance",
    description: "Evaluate your access control models, governance, and review processes.",
    icon: "clipboard",
    color: "purple",
    subConcepts: [
      {
        id: "access-models",
        title: "Access control models",
        description: "Why it matters: Determines whether simple role‑based IAM is enough or policy/attribute‑based tools are required.",
        details: [
          { id: "access-models-q", title: "Which access control models do you need (RBAC, ABAC, PBAC, ZTNA, JIT access, least privilege)?" }
        ]
      },
      {
        id: "resources-scope",
        title: "Resources in scope",
        description: "Why it matters: Defines the integration surface for connectors and policy enforcement points.",
        details: [
          { id: "resources-scope-q", title: "Which systems require access governance (web apps, SaaS, servers, databases, APIs, cloud consoles, VPN, file shares, DevOps pipelines)?" }
        ]
      },
      {
        id: "need-iga",
        title: "Need for IGA",
        description: "Why it matters: IGA capabilities separate simple SSO tools from full governance platforms like SailPoint or Saviynt.",
        details: [
          { id: "need-iga-q", title: "Do you need Identity Governance and Administration (access request workflows, periodic reviews, SoD, role mining, compliance reporting, contractor governance)?" }
        ]
      },
      {
        id: "auto-reviews",
        title: "Importance of automated access reviews",
        description: "Why it matters: Mandatory reviews for SOX/HIPAA/ISO 27001 need built‑in campaigns and reminders.",
        details: [
          { id: "auto-reviews-q", title: "How important are automated access reviews and certifications?" }
        ]
      },
      {
        id: "granularity",
        title: "Granularity of access enforcement",
        description: "Why it matters: Fine‑grained needs may require ABAC/PBAC and deeper app integration.",
        details: [
          { id: "granularity-q", title: "How granular must your access policies be (coarse app‑level vs feature‑level vs row/field‑level)?" }
        ]
      },
      {
        id: "policy-sim",
        title: "Policy simulation / “what‑if” analysis",
        description: "Why it matters: For heavy compliance/SoD, safe “what‑if” testing helps avoid breaking access or opening gaps.",
        details: [
          { id: "policy-sim-q", title: "Do you need to simulate policy changes before they go live?" }
        ]
      },
      {
        id: "custom-apps",
        title: "Number of custom apps to integrate",
        description: "Why it matters: Many custom apps push you towards developer‑friendly, API‑rich platforms.",
        details: [
          { id: "custom-apps-q", title: "How many custom applications must integrate with IAM?" }
        ]
      }
    ]
  },
  {
    id: "directory-services",
    title: "Directory Services",
    description: "Assess your current directories, HA requirements, and audit needs.",
    icon: "folder",
    color: "amber",
    subConcepts: [
      {
        id: "current-directory",
        title: "Current directory environment",
        description: "Why it matters: Drives whether you need cloud directory, AD sync, or multi‑directory federation.",
        details: [
          { id: "current-directory-q", title: "What directory systems are in use (on‑prem AD, Entra ID, OpenLDAP, Oracle/IBM directories, none, multiple)?" }
        ]
      },
      {
        id: "dir-capabilities",
        title: "Directory capabilities needed",
        description: "Why it matters: These decide between pure cloud directory vs hybrid vs on‑prem‑focused solutions.",
        details: [
          { id: "dir-capabilities-q", title: "Which directory features are required (cloud universal directory, AD sync, LDAP v3, multi‑forest, custom attributes, GPO, real‑time sync, HR mastering)?" }
        ]
      },
      {
        id: "data-residency",
        title: "Data residency / sovereignty",
        description: "Why it matters: Limits which clouds/regions and vendors are acceptable.",
        details: [
          { id: "data-residency-q", title: "Do you have data residency requirements (EU, India DPDP, US‑only, other regions, or none)?" }
        ]
      },
      {
        id: "dir-availability",
        title: "Directory availability requirements",
        description: "Why it matters: Higher SLAs push architecture to active‑active, multi‑region and change cost/complexity.",
        details: [
          { id: "dir-availability-q", title: "How important is high availability (best effort, 99.9, 99.95, 99.99)?" }
        ]
      },
      {
        id: "dir-audit",
        title: "Directory audit logging",
        description: "Why it matters: Audit needs drive logging volume, storage, and SIEM connectors.",
        details: [
          { id: "dir-audit-q", title: "Do you require directory‑level audit logs (who changed what, read logging, SIEM integration)?" }
        ]
      }
    ]
  },
  {
    id: "pam-section",
    title: "Privileged Access Management (PAM)",
    description: "Manage privileged users, credentials, and session monitoring.",
    icon: "shield",
    color: "red",
    subConcepts: [
      {
        id: "pam-caps",
        title: "PAM capabilities",
        description: "Why it matters: Determines whether you need full Enterprise PAM or lighter secrets management.",
        details: [
          { id: "pam-caps-q", title: "Which PAM features do you need (credential vaulting, session isolation/recording, JIT elevation, secrets management, rotation, vendor access, endpoint privilege mgmt, ZSP, cloud privilege security, DevOps secrets integration)?" }
        ]
      },
      {
        id: "priv-users",
        title: "Privileged user types",
        description: "Why it matters: Scope of privileged identities shapes licensing and rollout.",
        details: [
          { id: "priv-users-q", title: "Who are the primary privileged users (IT admins, DBAs, cloud engineers, developers, third‑party vendors, SOC analysts, executives)?" }
        ]
      },
      {
        id: "session-record",
        title: "Importance of session recording",
        description: "Why it matters: PCI‑DSS/HIPAA/forensics often require full session capture; some orgs only need basic logging.",
        details: [
          { id: "session-record-q", title: "How critical is privileged session recording?" }
        ]
      },
      {
        id: "devops-secrets",
        title: "DevOps / cloud secrets management",
        description: "Why it matters: Drives you toward tools like Vault vs traditional jump‑box‑centric PAM.",
        details: [
          { id: "devops-secrets-q", title: "Do you need secrets management for DevOps pipelines and cloud (Kubernetes, Terraform, CI/CD tokens, cloud secret stores)?" }
        ]
      },
      {
        id: "zsp",
        title: "Zero Standing Privileges (ZSP)",
        description: "Why it matters: Strong ZSP requirement forces JIT access models and modern PAM.",
        details: [
          { id: "zsp-q", title: "How important is Zero Standing Privileges (no permanent admin accounts)?" }
        ]
      },
      {
        id: "endpoint-pam",
        title: "Endpoint privilege management",
        description: "Why it matters: Endpoint PAM is a distinct capability; not all PAM tools handle this well.",
        details: [
          { id: "endpoint-pam-q", title: "Do you need endpoint privilege management for desktops and servers (Windows, macOS, Linux)?" }
        ]
      }
    ]
  },
  {
    id: "comp-audit",
    title: "Compliance & Audit",
    description: "Align IAM with regulatory frameworks, reporting, and anomaly detection.",
    icon: "file-text",
    color: "blue",
    subConcepts: [
      {
        id: "comp-frameworks",
        title: "Compliance frameworks",
        description: "Why it matters: Some vendors have specific certifications and mappings; this filters the shortlist.",
        details: [
          { id: "comp-frameworks-q", title: "Which frameworks must the IAM solution support (GDPR, HIPAA, SOX, PCI‑DSS, ISO 27001, SOC 2, FedRAMP, NIST CSF, DPDP, none)?" }
        ]
      },
      {
        id: "audit-needs",
        title: "Audit & reporting needs",
        description: "Why it matters: Strong audit programs need built‑in reporting and SIEM compatibility.",
        details: [
          { id: "audit-needs-q", title: "What audit/reporting features do you require (immutable logs, real‑time alerts, templates, SIEM integration, UBA, dashboards, evidence export)?" }
        ]
      },
      {
        id: "audit-freq",
        title: "Audit frequency",
        description: "Why it matters: Frequent audits require always‑ready reports and automation.",
        details: [
          { id: "audit-freq-q", title: "How often are you audited (ad‑hoc, annual, quarterly, monthly, continuous)?" }
        ]
      },
      {
        id: "ai-anomaly",
        title: "AI / ML anomaly detection",
        description: "Why it matters: This distinguishes basic log collection from intelligent analytics.",
        details: [
          { id: "ai-anomaly-q", title: "Do you require AI/ML‑based anomaly detection (UEBA, risk scoring, SoD violation alerts)?" }
        ]
      }
    ]
  },
  {
    id: "deploy-integ",
    title: "Deployment & Integrations",
    description: "Determine deployment models, cloud strategies, and target systems.",
    icon: "server",
    color: "teal",
    subConcepts: [
      {
        id: "deploy-model",
        title: "Deployment model preference",
        description: "Why it matters: Eliminates vendors that don’t match their hosting/security policies.",
        details: [
          { id: "deploy-model-q", title: "What is your preferred deployment model (SaaS, on‑prem, hybrid, open source self‑managed)?" }
        ]
      },
      {
        id: "cloud-platforms",
        title: "Cloud platforms in use",
        description: "Why it matters: Native cloud IAM and integrations depend on these platforms.",
        details: [
          { id: "cloud-platforms-q", title: "Which clouds are you using (AWS, Azure, GCP, multi‑cloud, private cloud, none yet)?" }
        ]
      },
      {
        id: "integ-systems",
        title: "Systems to integrate with",
        description: "Why it matters: Connector availability is a major factor in project cost and success.",
        details: [
          { id: "integ-systems-q", title: "Which systems must IAM integrate with (AD/LDAP, Microsoft 365, HR systems, Salesforce, ServiceNow, GitHub/GitLab, AWS IAM, Azure AD, SAP/Oracle, Slack, Google Workspace, custom APIs)?" }
        ]
      },
      {
        id: "network-arch",
        title: "Network architecture",
        description: "Why it matters: Zero‑trust or air‑gapped networks may need different deployment topologies.",
        details: [
          { id: "network-arch-q", title: "What is your network architecture (fully cloud‑native, traditional VPN‑based, zero‑trust model, mixed, air‑gapped)?" }
        ]
      },
      {
        id: "exist-siem",
        title: "Existing SIEM / SOC",
        description: "Why it matters: Favors IAM products with native SIEM integrations rather than custom log shipping.",
        details: [
          { id: "exist-siem-q", title: "Do you already have a SIEM/SOC platform (Splunk, Sentinel, QRadar, Elastic, other, none)?" }
        ]
      },
      {
        id: "k8s-maturity",
        title: "Container / Kubernetes maturity",
        description: "Why it matters: Heavy K8s usage benefits from Kubernetes‑native IAM and secrets management.",
        details: [
          { id: "k8s-maturity-q", title: "What is your container/Kubernetes maturity (none, dev‑only, limited prod, heavy prod, with service mesh)?" }
        ]
      }
    ]
  },
  {
    id: "zero-trust",
    title: "Zero Trust & Security Strategy",
    description: "Align identity with Zero Trust, device posture, and risk evaluation.",
    icon: "lock",
    color: "purple",
    subConcepts: [
      {
        id: "zt-maturity",
        title: "Zero trust maturity",
        description: "Why it matters: Determines whether IAM must act as a key policy enforcement point across traffic.",
        details: [
          { id: "zt-maturity-q", title: "What is your current zero trust maturity (not started, planned, identity‑centric, network ZTNA, full zero trust)?" }
        ]
      },
      {
        id: "device-posture",
        title: "Device posture in access decisions",
        description: "Why it matters: Requires integration with endpoint management tools and device signals.",
        details: [
          { id: "device-posture-q", title: "Do you require device trust checks (MDM/EDR status, OS patch level) as part of access decisions?" }
        ]
      },
      {
        id: "cae",
        title: "Continuous access evaluation (CAE)",
        description: "Why it matters: CAE support affects which vendors and architectures are appropriate.",
        details: [
          { id: "cae-q", title: "How important is continuous access evaluation (revoking sessions in real time when risk changes)?" }
        ]
      },
      {
        id: "threat-platforms",
        title: "Existing threat/risk platforms",
        description: "Why it matters: IAM should integrate with existing risk signals if present.",
        details: [
          { id: "threat-platforms-q", title: "Do you already use threat intelligence or risk platforms (Defender, CrowdStrike, Cortex, others, none)?" }
        ]
      }
    ]
  },
  {
    id: "ai-auto",
    title: "AI & Automation",
    description: "Evaluate AI-driven access reviews, NLP querying, and role mining.",
    icon: "cpu",
    color: "amber",
    subConcepts: [
      {
        id: "ai-caps",
        title: "AI/ML capabilities needed",
        description: "Why it matters: Helps decide if advanced AI‑driven IAM is needed or basic rules suffice.",
        details: [
          { id: "ai-caps-q", title: "Which AI/ML features are important (AI role mining, anomaly detection, NL access requests, auto‑remediation, peer group analysis, AI recommendations, AI copilot for policies)?" }
        ]
      },
      {
        id: "ai-cert",
        title: "Intelligent auto‑certification",
        description: "Why it matters: Large orgs with huge review volumes benefit from automated low‑risk approvals.",
        details: [
          { id: "ai-cert-q", title: "How important is AI‑based auto‑certification of access reviews?" }
        ]
      },
      {
        id: "nl-query",
        title: "Natural language querying of IAM data",
        description: "Why it matters: Influences choice of vendors that support conversational or NL query interfaces.",
        details: [
          { id: "nl-query-q", title: "Do you want natural language querying (e.g. “who has admin on production?”)?" }
        ]
      }
    ]
  },
  {
    id: "comm-vendor",
    title: "Commercial & Vendor Strategy",
    description: "Identify budget, timelines, and preferred vendor strategies.",
    icon: "shopping-cart",
    color: "red",
    subConcepts: [
      {
        id: "budget",
        title: "Annual IAM budget",
        description: "Why it matters: Filters vendor tiers and pricing models.",
        details: [
          { id: "budget-q", title: "What is your annual IAM budget (from open‑source only up to large enterprise budgets)?" }
        ]
      },
      {
        id: "timeline",
        title: "Go‑live timeline",
        description: "Why it matters: Complex platforms may not fit aggressive timelines.",
        details: [
          { id: "timeline-q", title: "What is your target go‑live timeline (immediate, 1–3 months, 3–6 months, 6–12 months, >12 months)?" }
        ]
      },
      {
        id: "vendor-lock",
        title: "Vendor lock‑in tolerance",
        description: "Why it matters: Strong “no lock‑in” preference pushes toward standards‑first platforms.",
        details: [
          { id: "vendor-lock-q", title: "How important is avoiding vendor lock‑in vs using open standards (OIDC, SAML, SCIM)?" }
        ]
      },
      {
        id: "multi-vendor",
        title: "Multi‑vendor vs single platform",
        description: "Why it matters: Determines if best‑of‑breed (IGA + PAM + CIAM separate) is acceptable.",
        details: [
          { id: "multi-vendor-q", title: "What is your tolerance for a multi‑vendor IAM architecture vs a single integrated platform?" }
        ]
      },
      {
        id: "support-level",
        title: "Support level required",
        description: "Why it matters: Some vendors only offer enterprise support at higher tiers.",
        details: [
          { id: "support-level-q", title: "What level of vendor support do you need (community only, business hours, 24/7 with SLA, dedicated TAM, professional services)?" }
        ]
      },
      {
        id: "prev-eval",
        title: "Vendors already evaluated",
        description: "Why it matters: Lets your engine factor in existing preferences or exclusions.",
        details: [
          { id: "prev-eval-q", title: "Have you evaluated or shortlisted any IAM vendors already?" }
        ]
      },
      {
        id: "past-failures",
        title: "Past IAM failures / lessons learned",
        description: "Why it matters: Helps avoid recommending approaches that repeat past mistakes.",
        details: [
          { id: "past-failures-q", title: "What were key failure points or gaps in any previous IAM deployment?" }
        ]
      }
    ]
  }
];

module.exports = assessmentQuestions;