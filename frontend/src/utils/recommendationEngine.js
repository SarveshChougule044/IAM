import { iamProducts } from "../data/products";

export function determineRecommendedProducts(selectedDetailIds = []) {
  if (selectedDetailIds.length === 0) return { topProduct: null, otherProducts: [] };

  const scores = {
    okta: 0,
    entra: 0,
    sailpoint: 0,
    cyberark: 0,
    ping: 0,
  };

  selectedDetailIds.forEach((id) => {
    // Scoring logic based on question IDs
    switch (id) {
      // Okta / CIAM / SSO / Developer heavy
      case "ciam-need-q":
      case "dev-experience-q":
      case "auth-methods-q":
      case "cloud-platforms-q":
        scores.okta += 3;
        scores.entra += 1;
        break;

      // Microsoft / Enterprise / Broad
      case "device-posture-q":
      case "exist-siem-q":
        scores.entra += 3;
        break;

      // IGA / Compliance / Access Reviews
      case "need-iga-q":
      case "auto-reviews-q":
      case "audit-freq-q":
      case "ai-cert-q":
      case "comp-frameworks-q":
      case "policy-sim-q":
        scores.sailpoint += 4;
        break;

      // PAM / Secrets / Privileged Access
      case "pam-caps-q":
      case "priv-users-q":
      case "session-record-q":
      case "devops-secrets-q":
      case "zsp-q":
      case "endpoint-pam-q":
        scores.cyberark += 4;
        break;

      // Legacy / Complex Directory / On-Prem
      case "current-directory-q":
      case "dir-capabilities-q":
      case "network-arch-q":
        scores.ping += 3;
        scores.entra += 2;
        break;
        
      default:
        // Generic questions add a little to Okta/Entra as they are broad platforms
        scores.okta += 1;
        scores.entra += 1;
        break;
    }
  });

  // Convert scores object to an array of { id, score }
  const scoreArray = Object.entries(scores).map(([id, score]) => ({ id, score }));
  
  // Sort descending by score
  scoreArray.sort((a, b) => b.score - a.score);

  const bestProductId = scoreArray[0].id;
  const topProduct = iamProducts.find((p) => p.id === bestProductId);

  // Filter out the top product, and only include other products if they have a score > 0
  const otherProducts = scoreArray
    .slice(1) // skip the top product
    .filter(item => item.score > 0)
    .map(item => iamProducts.find(p => p.id === item.id))
    .slice(0, 3); // Take up to 3 runners-up

  // If no other products had a score > 0, just provide some fallbacks so the UI isn't empty
  if (otherProducts.length === 0) {
    const fallbacks = iamProducts.filter(p => p.id !== bestProductId).slice(0, 2);
    return { topProduct, otherProducts: fallbacks };
  }

  return { topProduct, otherProducts };
}
