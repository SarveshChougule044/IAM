// backend/utils/recommendationEngine.js
// Maps questionnaire answers to IAM product scores and produces recommendations

const PRODUCTS = {
  okta: {
    id: "okta",
    name: "Okta Workforce Identity",
    tagline: "Best-in-class SSO, MFA, and developer-friendly IAM platform",
    description:
      "Okta is the leading cloud-native Identity-as-a-Service platform, excelling at SSO, adaptive MFA, SCIM provisioning, and a vast 7,000+ integration network. Ideal for modern SaaS-first organisations requiring rapid deployment.",
    logo: "Shield",
    color: "#00A1EA",
    bestFor: [
      "Cloud-first SSO & MFA rollout",
      "SCIM automated provisioning",
      "Developer SDK & API-first integrations",
      "Zero trust identity perimeter",
    ],
    advantages: [
      "7,000+ pre-built app integrations",
      "Best-in-class developer experience",
      "Rapid SaaS deployment (weeks, not months)",
      "Strong adaptive MFA & risk engine",
    ],
    disadvantages: [
      "Higher cost at enterprise scale",
      "Limited on-prem support",
      "IGA capabilities less mature than SailPoint",
    ],
  },
  entra: {
    id: "entra",
    name: "Microsoft Entra ID",
    tagline: "Seamless hybrid & Azure-native identity platform",
    description:
      "Microsoft Entra ID (formerly Azure AD) is the dominant choice for Microsoft 365 / Azure ecosystems. Unmatched Active Directory integration, Conditional Access, and enterprise compliance with deep Microsoft product synergy.",
    logo: "Cloud",
    color: "#0078D4",
    bestFor: [
      "Microsoft 365 / Azure ecosystem",
      "Hybrid AD + cloud identity bridge",
      "Conditional Access policies",
      "Enterprise compliance (SOX, SOC2)",
    ],
    advantages: [
      "Native M365 / Teams / Azure integration",
      "Included in Microsoft E3/E5 licensing",
      "Mature Conditional Access engine",
      "Strong compliance & audit capabilities",
    ],
    disadvantages: [
      "Limited non-Microsoft app support",
      "Complex licensing tiers",
      "Less flexible for multi-cloud / GCP-heavy environments",
    ],
  },
  cyberark: {
    id: "cyberark",
    name: "CyberArk",
    tagline: "Enterprise-grade Privileged Access Management leader",
    description:
      "CyberArk is the global PAM leader, providing privileged credential vaulting, session isolation, just-in-time access, and secrets management. The definitive choice for organisations with strict privileged user governance requirements.",
    logo: "Lock",
    color: "#C8102E",
    bestFor: [
      "Privileged credential vaulting & rotation",
      "Session recording & forensics",
      "Just-in-time privilege elevation",
      "Secrets management for DevOps",
    ],
    advantages: [
      "Industry-leading PAM platform",
      "Comprehensive session recording",
      "Strong regulatory compliance (PCI-DSS, HIPAA)",
      "Secrets management for CI/CD pipelines",
    ],
    disadvantages: [
      "Complex deployment and configuration",
      "Higher total cost of ownership",
      "Primarily focused on PAM, not full IAM",
    ],
  },
  sailpoint: {
    id: "sailpoint",
    name: "SailPoint Identity Security",
    tagline: "Enterprise identity governance and compliance automation",
    description:
      "SailPoint leads in Identity Governance & Administration (IGA), providing access certification, role management, SoD enforcement, and AI-powered access reviews. The gold standard for regulated industries requiring comprehensive governance.",
    logo: "FileText",
    color: "#1A73E8",
    bestFor: [
      "Access certification & reviews",
      "Separation of Duties (SoD) enforcement",
      "Role mining & governance",
      "Compliance reporting (SOX, SOC2)",
    ],
    advantages: [
      "Most mature IGA platform",
      "AI-powered access certifications",
      "Strong SoD & compliance reporting",
      "Excellent for regulated industries",
    ],
    disadvantages: [
      "High implementation complexity",
      "Expensive licensing model",
      "Longer deployment timelines",
    ],
  },
  ping: {
    id: "ping",
    name: "Ping Identity",
    tagline: "High-scale CIAM and federation for customer-facing applications",
    description:
      "Ping Identity excels at Customer IAM (CIAM), federation, and open standards (OIDC, SAML, SCIM). Designed for high-scale consumer identity workloads and enterprises requiring vendor-neutral, standards-based IAM.",
    logo: "Server",
    color: "#FF5733",
    bestFor: [
      "Customer Identity (CIAM)",
      "SAML 2.0 & OIDC federation",
      "High-scale identity workloads",
      "Open standards & vendor neutrality",
    ],
    advantages: [
      "Best CIAM at massive scale",
      "Strong open standards commitment",
      "Flexible deployment (cloud, on-prem, hybrid)",
      "Excellent federation capabilities",
    ],
    disadvantages: [
      "Less intuitive admin experience",
      "Higher upfront implementation effort",
      "IGA requires additional products",
    ],
  },
  hashicorp: {
    id: "hashicorp",
    name: "HashiCorp Vault",
    tagline: "Secrets management & DevOps identity for cloud-native teams",
    description:
      "HashiCorp Vault is the industry standard for secrets management in cloud-native and DevOps environments. Manages API keys, certificates, database credentials, and cloud provider secrets with dynamic secret generation.",
    logo: "Server",
    color: "#7B42BC",
    bestFor: [
      "Kubernetes & container secrets",
      "CI/CD pipeline credential management",
      "Dynamic secret generation",
      "Infrastructure-as-Code (Terraform) integration",
    ],
    advantages: [
      "Industry-standard DevOps secrets platform",
      "Dynamic secret generation & rotation",
      "Extensive cloud provider integrations",
      "Open source core with enterprise features",
    ],
    disadvantages: [
      "Focused on secrets — not a full IAM platform",
      "Requires DevOps expertise to operate",
      "Limited UI for non-technical users",
    ],
  },
  forgerock: {
    id: "forgerock",
    name: "ForgeRock (now Ping Identity)",
    tagline: "Open-source IAM with deep on-premise & CIAM capabilities",
    description:
      "ForgeRock (acquired by Ping Identity) offers a comprehensive, open standards-based IAM platform with strong on-premise deployment support, CIAM, and IoT/OT identity management capabilities.",
    logo: "Cloud",
    color: "#2E7D32",
    bestFor: [
      "On-premise or hybrid deployment",
      "IoT & OT device identities",
      "Open standards (OIDC, SAML, SCIM)",
      "Complex multi-tenant scenarios",
    ],
    advantages: [
      "Strong on-prem & hybrid deployment support",
      "Open standards DNA",
      "IoT identity management",
      "Flexible licensing model",
    ],
    disadvantages: [
      "Now absorbed into Ping Identity roadmap",
      "Implementation complexity is high",
      "Smaller ecosystem than Okta/Microsoft",
    ],
  },
};

// ─── Scoring rules ─────────────────────────────────────────────────────────────
// Each selected option ID maps to { productId: points } increments

const SCORING_MAP = {
  // Q1 — Org type
  q1_a: { okta: 3, ping: 2 }, // Startup → Okta, Ping
  q1_b: { okta: 2, entra: 2 },
  q1_c: { entra: 3, sailpoint: 2, cyberark: 2 },
  q1_d: { entra: 3, sailpoint: 3, cyberark: 3, ping: 2 },
  q1_e: { entra: 2, cyberark: 3, sailpoint: 3 },
  q1_f: { okta: 2, forgerock: 2 },

  // Q7 — Auth methods
  q7_a: { okta: 4, entra: 3, ping: 3 }, // SSO
  q7_b: { okta: 3, entra: 4, cyberark: 2 }, // MFA
  q7_c: { okta: 4, ping: 3 }, // Passwordless
  q7_d: { okta: 3, ping: 2 }, // Social login
  q7_e: { ping: 4, forgerock: 4, entra: 3 }, // SAML
  q7_f: { okta: 3, ping: 3, forgerock: 3 }, // OIDC
  q7_g: { entra: 4, forgerock: 3 }, // Kerberos
  q7_h: { cyberark: 3, forgerock: 3 }, // PKI/X.509
  q7_i: { okta: 4, entra: 3 }, // Adaptive MFA
  q7_j: { cyberark: 3, entra: 2 }, // Hardware token

  // Q8 — CIAM
  q8_a: { ping: 5, okta: 3, forgerock: 4 },
  q8_b: { ping: 4, okta: 3, forgerock: 3 },
  q8_c: { okta: 3, entra: 3 },

  // Q9 — Lifecycle
  q9_a: { okta: 3, sailpoint: 3 },
  q9_b: { sailpoint: 4, okta: 2 },
  q9_c: { sailpoint: 4, okta: 3 },
  q9_d: { okta: 4, sailpoint: 3 },
  q9_e: { sailpoint: 4, entra: 3 },
  q9_f: { okta: 3 },
  q9_g: { sailpoint: 3, entra: 2 },
  q9_h: { ping: 3, forgerock: 3, sailpoint: 2 },

  // Q10 — Developer experience
  q10_d: { okta: 4 },
  q10_e: { okta: 5, hashicorp: 3 },

  // Q11 — Identity store
  q11_a: { entra: 4, forgerock: 3 }, // AD on-prem
  q11_b: { entra: 5 }, // Azure AD
  q11_c: { okta: 3, ping: 2 }, // Google Workspace
  q11_d: { sailpoint: 4, okta: 3 }, // Workday/SAP

  // Q12 — Machine identities
  q12_b: { cyberark: 3, hashicorp: 3 },
  q12_c: { hashicorp: 4, cyberark: 3 },
  q12_d: { hashicorp: 5, cyberark: 3 },
  q12_e: { forgerock: 4, hashicorp: 3 },
  q12_f: { hashicorp: 5, cyberark: 3 },

  // Q14 — Access control models
  q14_a: { sailpoint: 3, okta: 2 }, // RBAC
  q14_b: { sailpoint: 4, forgerock: 3 }, // ABAC
  q14_c: { sailpoint: 4, ping: 3 }, // PBAC
  q14_d: { okta: 4, entra: 4 }, // ZTNA
  q14_e: { cyberark: 4, sailpoint: 3 }, // JIT
  q14_f: { cyberark: 3, sailpoint: 3 }, // Least privilege

  // Q16 — IGA
  q16_a: { sailpoint: 5 },
  q16_b: { sailpoint: 5 },
  q16_c: { sailpoint: 5, cyberark: 2 },
  q16_d: { sailpoint: 4 },
  q16_e: { sailpoint: 5, entra: 3 },
  q16_f: { sailpoint: 4, ping: 2 },

  // Q17 — Access reviews
  q17_c: { sailpoint: 4 },
  q17_d: { sailpoint: 5 },

  // Q26 — PAM capabilities
  q26_a: { cyberark: 5 },
  q26_b: { cyberark: 5 },
  q26_c: { cyberark: 5 },
  q26_d: { hashicorp: 5, cyberark: 3 },
  q26_e: { cyberark: 4, hashicorp: 3 },
  q26_f: { cyberark: 4 },
  q26_g: { cyberark: 4 },
  q26_h: { cyberark: 4 },
  q26_i: { cyberark: 4 },
  q26_j: { hashicorp: 5, cyberark: 2 },

  // Q29 — Secrets management
  q29_a: { hashicorp: 5 },
  q29_b: { hashicorp: 5 },
  q29_c: { hashicorp: 5 },
  q29_d: { hashicorp: 5 },

  // Q32 — Compliance frameworks
  q32_a: { entra: 3, okta: 3 }, // GDPR
  q32_b: { cyberark: 4, sailpoint: 4 }, // HIPAA
  q32_c: { sailpoint: 5, entra: 3 }, // SOX
  q32_d: { cyberark: 5, sailpoint: 4 }, // PCI-DSS
  q32_e: { entra: 3, sailpoint: 3 }, // ISO 27001
  q32_f: { sailpoint: 4, entra: 3 }, // SOC2
  q32_g: { entra: 4, cyberark: 3 }, // FedRAMP

  // Q36 — Deployment
  q36_a: { okta: 5, entra: 4, ping: 3 }, // Cloud SaaS
  q36_b: { forgerock: 4, cyberark: 3, entra: 3 }, // On-prem
  q36_c: { entra: 4, forgerock: 3 }, // Hybrid
  q36_d: { forgerock: 4, hashicorp: 3 }, // Open source

  // Q37 — Cloud platforms
  q37_a: { okta: 3, hashicorp: 3 }, // AWS
  q37_b: { entra: 5 }, // Azure
  q37_c: { okta: 3, hashicorp: 3 }, // GCP

  // Q41 — Kubernetes maturity
  q41_c: { hashicorp: 3 },
  q41_d: { hashicorp: 5 },
  q41_e: { hashicorp: 5 },

  // Q42 — Zero trust
  q42_c: { okta: 4, entra: 4 },
  q42_d: { okta: 3, entra: 3, cyberark: 2 },
  q42_e: { okta: 4, entra: 4, cyberark: 3 },

  // Q46 — AI/ML
  q46_a: { sailpoint: 4 },
  q46_b: { entra: 3, okta: 3 },
  q46_e: { okta: 4, entra: 3 },
  q46_f: { sailpoint: 4 },
  q46_g: { sailpoint: 4 },

  // Q49 — Budget
  q49_a: { forgerock: 3, hashicorp: 3 }, // Open source
  q49_b: { okta: 2 },
  q49_c: { okta: 3, entra: 3 },
  q49_d: { okta: 3, entra: 3, sailpoint: 2 },
  q49_e: { cyberark: 4, sailpoint: 4, entra: 3 },
  q49_f: { cyberark: 5, sailpoint: 5, entra: 4 },

  // Q51 — Vendor lock-in concern
  q51_c: { forgerock: 3, ping: 3 },
  q51_d: { forgerock: 4, ping: 4, hashicorp: 3 },

  // Section 11 ratings (r_*) handled separately in engine
};

/**
 * Main scoring function
 * @param {Object} answers - { q1: ["q1_a", "q1_c"], q56: { r_sso: 5, r_mfa: 4 }, ... }
 * @returns {{ topProduct, otherProducts, scores, capabilityProfile }}
 */
function computeRecommendations(answers) {
  const scores = {
    okta: 0,
    entra: 0,
    cyberark: 0,
    sailpoint: 0,
    ping: 0,
    hashicorp: 0,
    forgerock: 0,
  };

  // Score checkbox answers
  for (const [qId, selectedOptions] of Object.entries(answers)) {
    if (qId === "q56" || !Array.isArray(selectedOptions)) continue;
    for (const optionId of selectedOptions) {
      const rule = SCORING_MAP[optionId];
      if (rule) {
        for (const [product, pts] of Object.entries(rule)) {
          if (scores[product] !== undefined) scores[product] += pts;
        }
      }
    }
  }

  // Score Section 11 ratings
  const ratings = answers.q56 || {};
  const ratingProductMap = {
    r_sso: { okta: 1.5, entra: 1, ping: 1 },
    r_mfa: { okta: 1, entra: 1.5, cyberark: 0.5 },
    r_passwordless: { okta: 1.5, ping: 1 },
    r_iga: { sailpoint: 2, okta: 0.5 },
    r_scim: { okta: 1.5, sailpoint: 1 },
    r_pam: { cyberark: 2 },
    r_session: { cyberark: 1.5 },
    r_directory: { okta: 1.5, entra: 1 },
    r_api: { okta: 2 },
    r_compliance: { sailpoint: 1.5, entra: 1 },
    r_zerotrust: { okta: 1.5, entra: 1.5 },
    r_siem: { entra: 1, sailpoint: 1 },
    r_ai: { sailpoint: 1.5, entra: 1 },
    r_secrets: { hashicorp: 2, cyberark: 1 },
    r_ciam: { ping: 2, forgerock: 1.5 },
    r_epm: { cyberark: 2 },
    r_adaptive: { okta: 1.5, entra: 1 },
    r_certify: { sailpoint: 2 },
  };

  for (const [capId, rating] of Object.entries(ratings)) {
    const mult = Number(rating) || 0;
    const rule = ratingProductMap[capId];
    if (rule) {
      for (const [product, weight] of Object.entries(rule)) {
        if (scores[product] !== undefined) scores[product] += mult * weight;
      }
    }
  }

  // Sort by score descending
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ ...PRODUCTS[id], score }));

  const topProduct = sorted[0] || null;
  const otherProducts = sorted.slice(1, 4); // next 3

  // Build capability profile from ratings
  const capabilityProfile = Object.entries(ratings).map(([id, rating]) => ({
    id,
    label: id.replace("r_", "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    rating: Number(rating) || 0,
  }));

  return { topProduct, otherProducts, scores, capabilityProfile };
}

module.exports = { computeRecommendations, PRODUCTS };
