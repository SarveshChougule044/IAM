export const iamProducts = [
  {
    id: "okta",
    name: "Okta / Auth0",
    description: "The industry leader in workforce SSO and Customer IAM (CIAM). Best for organizations with a heavy reliance on SaaS apps, needing rapid deployment, seamless developer experience, and modern cloud-native architectures.",
    bestFor: ["SSO", "CIAM", "B2B/B2C Identity", "SaaS Heavy"],
    logo: "Cloud",
    advantages: [
      "Extensive out-of-the-box integration catalog (OIN).",
      "Exceptional developer experience (Auth0) for custom apps.",
      "Cloud-native, highly available architecture."
    ],
    disadvantages: [
      "Pricing can become prohibitive at massive scale.",
      "Less robust for deep legacy, on-prem infrastructure.",
      "Basic IGA capabilities require add-ons or separate products."
    ]
  },
  {
    id: "entra",
    name: "Microsoft Entra ID",
    description: "Ideal for organizations heavily invested in the Microsoft 365 and Azure ecosystem. Provides excellent conditional access, identity protection, and seamless integration for Windows-centric environments.",
    bestFor: ["Microsoft Ecosystem", "Conditional Access", "Workforce Identity"],
    logo: "Shield",
    advantages: [
      "Often included in existing E3/E5 enterprise agreements (cost-effective).",
      "Deep integration with Windows, Office 365, and Azure.",
      "Powerful conditional access and device posture policies."
    ],
    disadvantages: [
      "Steep learning curve for complex hybrid deployments.",
      "Can be rigid when integrating with non-Microsoft ecosystem tools.",
      "Customer IAM (B2C) offerings lag behind specialized competitors."
    ]
  },
  {
    id: "sailpoint",
    name: "SailPoint",
    description: "The gold standard for Identity Governance and Administration (IGA). Best for large enterprises facing strict regulatory compliance, requiring deep access reviews, role mining, and automated provisioning.",
    bestFor: ["IGA", "Access Reviews", "Compliance", "Automated Provisioning"],
    logo: "FileText",
    advantages: [
      "Unmatched capabilities for access certification and SoD.",
      "AI/ML driven role mining and access recommendations.",
      "Extremely flexible for complex enterprise entitlements."
    ],
    disadvantages: [
      "High implementation complexity and cost.",
      "Requires dedicated IGA engineering teams to maintain.",
      "Not an access management (SSO/MFA) solution; requires integration with Okta/Entra."
    ]
  },
  {
    id: "cyberark",
    name: "CyberArk",
    description: "The premier solution for Privileged Access Management (PAM). Essential for organizations that need to secure admin accounts, vault credentials, implement zero standing privileges, and monitor privileged sessions.",
    bestFor: ["PAM", "Secrets Management", "Session Recording", "Zero Standing Privileges"],
    logo: "Lock",
    advantages: [
      "Industry-leading credential vaulting and session isolation.",
      "Strong capabilities for DevOps and machine identity secrets.",
      "Comprehensive endpoint privilege management (EPM)."
    ],
    disadvantages: [
      "Can introduce significant friction for administrators.",
      "Complex architecture requires specialized expertise.",
      "High licensing costs."
    ]
  },
  {
    id: "ping",
    name: "Ping Identity",
    description: "Excellent for complex, hybrid enterprise environments that still maintain significant on-premises infrastructure alongside cloud services. Offers high flexibility for legacy application integrations.",
    bestFor: ["Hybrid IAM", "Legacy Apps", "Complex Enterprise"],
    logo: "Server",
    advantages: [
      "Exceptional flexibility for complex on-prem/cloud hybrid setups.",
      "Strong support for legacy protocols (Header-based auth).",
      "Highly customizable policy engine."
    ],
    disadvantages: [
      "Configuration and maintenance can be highly complex.",
      "Cloud-native SaaS offering is less mature than Okta.",
      "Smaller developer community for custom extensions."
    ]
  }
];
