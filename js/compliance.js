(function () {
  const CONSENT_KEY = "dregal-consent-v1";
  const TERMS_KEY = "dregal-terms-acceptance-v1";
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  window.dregalCompliance = {
    validateEmail(email) { return EMAIL_RE.test(String(email || "").trim()); },
    getConsent() { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); },
    setConsent(value) { localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...value, updatedAt: new Date().toISOString() })); },
    acceptTerms(version = "2026-11-12") {
      localStorage.setItem(TERMS_KEY, JSON.stringify({ version, acceptedAt: new Date().toISOString() }));
    },
    requestData(action, email) {
      if (!this.validateEmail(email)) throw new Error("Enter a valid email address.");
      const request = { action, email: email.trim(), requestedAt: new Date().toISOString(), status: "pending-owner-review" };
      const existing = JSON.parse(localStorage.getItem("dregal-data-requests") || "[]");
      localStorage.setItem("dregal-data-requests", JSON.stringify([...existing, request]));
      return request;
    },
  };
})();
