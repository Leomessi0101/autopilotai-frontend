"use client";

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type DomainStatus = "pending" | "verifying" | "active" | "failed" | "suspended";

interface Domain {
  id: string;
  domain: string;
  status: DomainStatus;
  source: "connected" | "purchased";
  verified_at?: string;
  created_at: string;
  expires_at?: string;
  dns_instructions?: DNSInstructions;
}

interface DNSInstructions {
  domain: string;
  recommended: { type: string; name: string; value: string; ttl: string; note: string };
  alternative: { type: string; name: string; value: string; ttl: string; note: string };
  www_record: { type: string; name: string; value: string; ttl: string; note: string };
  propagation_note: string;
}

interface SearchResult {
  domain: string;
  available: boolean;
  tld: string;
  display_price: string;
  display_price_cents: number;
  renewal_price_cents: number;
  popular: boolean;
}

// ─────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL || "";

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function DomainsPage() {
  const [tab, setTab] = useState<"connected" | "purchase">("connected");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectOpen, setConnectOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const fetchDomains = useCallback(async () => {
    try {
      const data = await apiFetch("/domains/");
      setDomains(data.domains || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>Custom Domains</h1>
          <p style={styles.subtitle}>
            Connect your domain or buy a new one — your site goes live automatically.
          </p>
        </div>
        <button style={styles.btnPrimary} onClick={() => setConnectOpen(true)}>
          + Connect Domain
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === "connected" ? styles.tabActive : {}) }}
          onClick={() => setTab("connected")}
        >
          Connected Domains
          {domains.length > 0 && (
            <span style={styles.badge}>{domains.length}</span>
          )}
        </button>
        <button
          style={{ ...styles.tab, ...(tab === "purchase" ? styles.tabActive : {}) }}
          onClick={() => setTab("purchase")}
        >
          Buy a Domain
        </button>
      </div>

      {/* Tab content */}
      {tab === "connected" ? (
        <ConnectedDomainsTab
          domains={domains}
          loading={loading}
          onRefresh={fetchDomains}
          onSelectDomain={setSelectedDomain}
          onConnectClick={() => setConnectOpen(true)}
        />
      ) : (
        <PurchaseTab onDomainPurchased={fetchDomains} />
      )}

      {/* Connect domain modal */}
      {connectOpen && (
        <ConnectDomainModal
          onClose={() => setConnectOpen(false)}
          onSuccess={(domain) => {
            setConnectOpen(false);
            fetchDomains();
            setSelectedDomain(domain);
          }}
        />
      )}

      {/* DNS instructions panel */}
      {selectedDomain && (
        <DNSInstructionsPanel
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
          onVerified={fetchDomains}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONNECTED DOMAINS TAB
// ─────────────────────────────────────────────

function ConnectedDomainsTab({
  domains, loading, onRefresh, onSelectDomain, onConnectClick
}: {
  domains: Domain[];
  loading: boolean;
  onRefresh: () => void;
  onSelectDomain: (d: Domain) => void;
  onConnectClick: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Remove ${domain.domain}? This will stop routing traffic to your site.`)) return;
    setDeleting(domain.id);
    try {
      await apiFetch(`/domains/${domain.id}`, { method: "DELETE" });
      onRefresh();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.empty}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (domains.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🌐</div>
        <h3 style={styles.emptyTitle}>No custom domains yet</h3>
        <p style={styles.emptyDesc}>
          Connect your existing domain or buy a new one to give your site a professional address.
        </p>
        <button style={styles.btnPrimary} onClick={onConnectClick}>
          Connect your first domain
        </button>
      </div>
    );
  }

  return (
    <div style={styles.domainList}>
      {domains.map((domain) => (
        <DomainCard
          key={domain.id}
          domain={domain}
          deleting={deleting === domain.id}
          onInspect={() => onSelectDomain(domain)}
          onDelete={() => handleDelete(domain)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// DOMAIN CARD
// ─────────────────────────────────────────────

function DomainCard({
  domain, deleting, onInspect, onDelete
}: {
  domain: Domain;
  deleting: boolean;
  onInspect: () => void;
  onDelete: () => void;
}) {
  const statusConfig: Record<DomainStatus, { label: string; color: string; bg: string }> = {
    active:    { label: "Active",    color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    verifying: { label: "Checking",  color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    failed:    { label: "DNS Error", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    suspended: { label: "Suspended", color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
  };

  const s = statusConfig[domain.status];

  return (
    <div style={styles.domainCard}>
      <div style={styles.domainCardLeft}>
        <div style={styles.domainCardIcon}>
          {domain.source === "purchased" ? "🏷️" : "🔗"}
        </div>
        <div>
          <div style={styles.domainName}>{domain.domain}</div>
          <div style={styles.domainMeta}>
            {domain.source === "purchased" ? "Purchased" : "Connected"} ·{" "}
            {domain.expires_at
              ? `Expires ${new Date(domain.expires_at).toLocaleDateString()}`
              : `Added ${new Date(domain.created_at).toLocaleDateString()}`}
          </div>
        </div>
      </div>

      <div style={styles.domainCardRight}>
        <span style={{ ...styles.statusBadge, color: s.color, background: s.bg }}>
          {s.label}
        </span>

        {domain.status !== "active" && (
          <button style={styles.btnGhost} onClick={onInspect}>
            {domain.status === "pending" || domain.status === "failed"
              ? "View Setup"
              : "Details"}
          </button>
        )}

        {domain.status === "active" && (
          <a
            href={`https://${domain.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.btnGhost}
          >
            Visit ↗
          </a>
        )}

        <button
          style={{ ...styles.btnDanger, opacity: deleting ? 0.5 : 1 }}
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? "…" : "Remove"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONNECT DOMAIN MODAL
// ─────────────────────────────────────────────

function ConnectDomainModal({
  onClose, onSuccess
}: {
  onClose: () => void;
  onSuccess: (domain: Domain) => void;
}) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/domains/connect", {
        method: "POST",
        body: JSON.stringify({ domain: domain.trim() }),
      });
      onSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Connect a Domain</h2>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <p style={styles.modalDesc}>
          Enter the domain you want to connect. We'll give you DNS instructions to point it at your site.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Domain</label>
            <input
              style={styles.input}
              type="text"
              placeholder="myplumbingco.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              autoFocus
              spellCheck={false}
            />
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.modalActions}>
            <button type="button" style={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.btnPrimary} disabled={loading || !domain.trim()}>
              {loading ? "Checking…" : "Get DNS Instructions →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DNS INSTRUCTIONS PANEL
// ─────────────────────────────────────────────

function DNSInstructionsPanel({
  domain: initialDomain, onClose, onVerified
}: {
  domain: Domain;
  onClose: () => void;
  onVerified: () => void;
}) {
  const [domain, setDomain] = useState(initialDomain);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const instructions = domain.dns_instructions;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const verify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await apiFetch(`/domains/connect/${domain.id}/verify`, { method: "POST" });
      setVerifyResult(result);
      if (result.verified) {
        setDomain({ ...domain, status: "active" });
        onVerified();
      }
    } catch (e: any) {
      setVerifyResult({ verified: false, error: e.message });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.modal, maxWidth: 620 }}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>DNS Setup</h2>
            <p style={{ ...styles.modalDesc, marginBottom: 0, marginTop: 4 }}>{domain.domain}</p>
          </div>
          <button style={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        {domain.status === "active" ? (
          <div style={styles.successBanner}>
            <span>✅</span>
            <div>
              <strong>Domain is active!</strong>
              <p style={{ margin: "4px 0 0", color: "#86efac", fontSize: 14 }}>
                Your site is now live at{" "}
                <a href={`https://${domain.domain}`} target="_blank" style={{ color: "#86efac" }}>
                  {domain.domain}
                </a>
              </p>
            </div>
          </div>
        ) : (
          <>
            <p style={styles.modalDesc}>
              Add one of these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
            </p>

            {/* Recommended: CNAME */}
            {instructions && (
              <>
                <div style={styles.dnsSection}>
                  <div style={styles.dnsSectionLabel}>
                    <span style={styles.recommended}>Recommended</span> CNAME Record
                  </div>
                  <div style={styles.dnsTable}>
                    {[
                      { field: "Type", value: instructions.recommended.type },
                      { field: "Name", value: instructions.recommended.name },
                      { field: "Value / Points to", value: instructions.recommended.value },
                      { field: "TTL", value: instructions.recommended.ttl },
                    ].map(({ field, value }) => (
                      <div key={field} style={styles.dnsRow}>
                        <span style={styles.dnsField}>{field}</span>
                        <span style={styles.dnsValue}>{value}</span>
                        {field !== "Type" && field !== "TTL" && (
                          <button style={styles.copyBtn} onClick={() => copy(value, field)}>
                            {copied === field ? "✓" : "Copy"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Also add www */}
                <div style={styles.dnsSection}>
                  <div style={styles.dnsSectionLabel}>Also Add — www Subdomain</div>
                  <div style={styles.dnsTable}>
                    {[
                      { field: "Type", value: instructions.www_record.type },
                      { field: "Name", value: instructions.www_record.name },
                      { field: "Value / Points to", value: instructions.www_record.value },
                      { field: "TTL", value: instructions.www_record.ttl },
                    ].map(({ field, value }) => (
                      <div key={field} style={styles.dnsRow}>
                        <span style={styles.dnsField}>{field}</span>
                        <span style={styles.dnsValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternative: A record */}
                <details style={styles.details}>
                  <summary style={styles.detailsSummary}>
                    Can't use CNAME? Use an A record instead
                  </summary>
                  <div style={{ ...styles.dnsSection, marginTop: 12 }}>
                    <div style={styles.dnsTable}>
                      {[
                        { field: "Type", value: instructions.alternative.type },
                        { field: "Name", value: instructions.alternative.name },
                        { field: "Value / IP Address", value: instructions.alternative.value },
                        { field: "TTL", value: instructions.alternative.ttl },
                      ].map(({ field, value }) => (
                        <div key={field} style={styles.dnsRow}>
                          <span style={styles.dnsField}>{field}</span>
                          <span style={styles.dnsValue}>{value}</span>
                          {field === "Value / IP Address" && (
                            <button style={styles.copyBtn} onClick={() => copy(value, "ip")}>
                              {copied === "ip" ? "✓" : "Copy"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </details>

                <p style={styles.propagationNote}>
                  ⏱ {instructions.propagation_note}
                </p>
              </>
            )}

            {/* Verify button */}
            {verifyResult && !verifyResult.verified && (
              <div style={styles.errorBox}>{verifyResult.error || "DNS not verified yet."}</div>
            )}

            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={onClose}>Close</button>
              <button style={styles.btnPrimary} onClick={verify} disabled={verifying}>
                {verifying ? (
                  <><span style={styles.spinnerSm} /> Checking DNS…</>
                ) : (
                  "✓ Verify DNS"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PURCHASE TAB
// ─────────────────────────────────────────────

function PurchaseTab({ onDomainPurchased }: { onDomainPurchased: () => void }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState("");
  const [purchasingDomain, setPurchasingDomain] = useState<SearchResult | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setResults(null);
    try {
      const data = await apiFetch(`/domains/search?q=${encodeURIComponent(query.trim())}`);
      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      {/* Search box */}
      <form onSubmit={search} style={styles.searchForm}>
        <div style={styles.searchInputWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search for a domain name… (e.g. myplumbingco)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" style={styles.btnPrimary} disabled={searching || !query.trim()}>
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div style={styles.errorBox}>{error}</div>}

      {/* Results */}
      {results && (
        <div style={styles.searchResults}>
          {results.length === 0 ? (
            <p style={styles.emptyDesc}>No results found.</p>
          ) : (
            results.map((r) => (
              <div key={r.domain} style={{
                ...styles.searchResultRow,
                opacity: r.available ? 1 : 0.5,
              }}>
                <div style={styles.searchResultLeft}>
                  <span style={styles.searchDomain}>{r.domain}</span>
                  {r.popular && r.available && (
                    <span style={styles.popularBadge}>Popular</span>
                  )}
                </div>
                <div style={styles.searchResultRight}>
                  {r.available ? (
                    <>
                      <div style={styles.priceBlock}>
                        <span style={styles.price}>{r.display_price}</span>
                        <span style={styles.priceLabel}>/yr</span>
                      </div>
                      <button
                        style={styles.btnPrimary}
                        onClick={() => setPurchasingDomain(r)}
                      >
                        Buy
                      </button>
                    </>
                  ) : (
                    <span style={styles.unavailable}>Taken</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Purchase modal */}
      {purchasingDomain && (
        <PurchaseModal
          domain={purchasingDomain}
          onClose={() => setPurchasingDomain(null)}
          onSuccess={() => {
            setPurchasingDomain(null);
            onDomainPurchased();
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PURCHASE MODAL
// ─────────────────────────────────────────────

function PurchaseModal({
  domain, onClose, onSuccess
}: {
  domain: SearchResult;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState<"contact" | "payment" | "processing" | "done">("contact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Contact form state
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    address1: "", city: "", state: "", postal_code: "", country: "US",
  });

  // Payment (in a real app this would use Stripe Elements)
  // For now we show a placeholder that accepts a test payment method
  const [paymentMethodId, setPaymentMethodId] = useState("pm_card_visa");

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["first_name", "last_name", "email", "phone", "address1", "city", "state", "postal_code"];
    for (const f of required) {
      if (!form[f as keyof typeof form]) {
        setError(`${f.replace("_", " ")} is required`);
        return;
      }
    }
    setError("");
    setStep("payment");
  };

  const purchase = async () => {
    setLoading(true);
    setError("");
    setStep("processing");
    try {
      await apiFetch("/domains/purchase", {
        method: "POST",
        body: JSON.stringify({
          domain: domain.domain,
          registrant: form,
          years: 1,
          stripe_payment_method_id: paymentMethodId,
        }),
      });
      setStep("done");
      setTimeout(() => { onSuccess(); }, 2500);
    } catch (err: any) {
      setError(err.message);
      setStep("payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && step !== "processing" && onClose()}>
      <div style={{ ...styles.modal, maxWidth: 560 }}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>
              {step === "done" ? "🎉 Domain Registered!" : `Register ${domain.domain}`}
            </h2>
            {step !== "done" && step !== "processing" && (
              <p style={{ ...styles.modalDesc, marginBottom: 0, marginTop: 4 }}>
                {domain.display_price}/yr · renews at ${(domain.renewal_price_cents / 100).toFixed(2)}/yr
              </p>
            )}
          </div>
          {step !== "processing" && step !== "done" && (
            <button style={styles.modalClose} onClick={onClose}>✕</button>
          )}
        </div>

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🚀</div>
            <p style={{ color: "#a1a1aa" }}>
              <strong style={{ color: "#fff" }}>{domain.domain}</strong> is being registered.
              DNS will be configured automatically — your site will be live within a few minutes.
            </p>
          </div>
        )}

        {step === "processing" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ ...styles.spinner, margin: "0 auto 16px" }} />
            <p style={{ color: "#a1a1aa" }}>Processing payment and registering domain…</p>
          </div>
        )}

        {step === "contact" && (
          <form onSubmit={submitContact}>
            <p style={styles.modalDesc}>
              ICANN requires contact information for domain registration. Your details are kept private with WHOIS privacy enabled by default.
            </p>
            <div style={styles.formGrid}>
              {[
                { key: "first_name", label: "First Name", ph: "Jane" },
                { key: "last_name", label: "Last Name", ph: "Smith" },
                { key: "email", label: "Email", ph: "jane@example.com", type: "email" },
                { key: "phone", label: "Phone", ph: "+12125551234" },
                { key: "address1", label: "Address", ph: "123 Main St", full: true },
                { key: "city", label: "City", ph: "New York" },
                { key: "state", label: "State", ph: "NY" },
                { key: "postal_code", label: "ZIP Code", ph: "10001" },
              ].map(({ key, label, ph, type, full }) => (
                <div key={key} style={{ gridColumn: full ? "1 / -1" : "auto" }}>
                  <label style={styles.label}>{label}</label>
                  <input
                    style={styles.input}
                    type={type || "text"}
                    placeholder={ph}
                    value={form[key as keyof typeof form]}
                    onChange={update(key)}
                  />
                </div>
              ))}
            </div>
            {error && <div style={styles.errorBox}>{error}</div>}
            <div style={styles.modalActions}>
              <button type="button" style={styles.btnSecondary} onClick={onClose}>Cancel</button>
              <button type="submit" style={styles.btnPrimary}>Continue to Payment →</button>
            </div>
          </form>
        )}

        {step === "payment" && (
          <div>
            <div style={styles.orderSummary}>
              <div style={styles.orderRow}>
                <span>{domain.domain} registration (1 year)</span>
                <span>{domain.display_price}</span>
              </div>
              <div style={{ ...styles.orderRow, ...styles.orderTotal }}>
                <span>Total today</span>
                <span>{domain.display_price}</span>
              </div>
            </div>

            {/* In production: replace with <StripeElements> component */}
            <div style={styles.paymentPlaceholder}>
              <span style={{ color: "#6b7280", fontSize: 14 }}>
                💳 Stripe payment form — integrate with @stripe/react-stripe-js
              </span>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}
            <div style={styles.modalActions}>
              <button style={styles.btnSecondary} onClick={() => setStep("contact")}>← Back</button>
              <button style={styles.btnPrimary} onClick={purchase} disabled={loading}>
                {loading ? "Processing…" : `Pay ${domain.display_price}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f4f4f5",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "40px 32px",
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    gap: 16,
  },
  h1: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: 32,
    fontWeight: 400,
    margin: "0 0 8px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#71717a",
    fontSize: 15,
    margin: 0,
  },
  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid #1f1f23",
    marginBottom: 32,
  },
  tab: {
    background: "none",
    border: "none",
    color: "#71717a",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
    borderBottom: "2px solid transparent",
    marginBottom: -1,
    display: "flex",
    alignItems: "center",
    gap: 8,
    transition: "color 0.15s",
  },
  tabActive: {
    color: "#f4f4f5",
    borderBottomColor: "#6366f1",
  },
  badge: {
    background: "#1f1f23",
    color: "#a1a1aa",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 12,
  },
  domainList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  domainCard: {
    background: "#111113",
    border: "1px solid #1f1f23",
    borderRadius: 12,
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    transition: "border-color 0.15s",
  },
  domainCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  domainCardIcon: {
    fontSize: 20,
    width: 40,
    height: 40,
    background: "#1a1a1e",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  domainName: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 3,
  },
  domainMeta: {
    fontSize: 13,
    color: "#71717a",
  },
  domainCardRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 999,
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 32px",
    color: "#71717a",
  },
  empty: {
    display: "flex",
    justifyContent: "center",
    padding: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    color: "#f4f4f5",
    fontSize: 18,
    fontWeight: 500,
    margin: "0 0 8px",
    fontFamily: "'Instrument Serif', Georgia, serif",
  },
  emptyDesc: {
    fontSize: 14,
    lineHeight: 1.6,
    margin: "0 auto 24px",
    maxWidth: 380,
  },
  // Buttons
  btnPrimary: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap" as const,
  },
  btnSecondary: {
    background: "#1f1f23",
    color: "#a1a1aa",
    border: "1px solid #2f2f33",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnGhost: {
    background: "none",
    color: "#a1a1aa",
    border: "1px solid #2f2f33",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    display: "inline-block",
  },
  btnDanger: {
    background: "none",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 16,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#111113",
    border: "1px solid #1f1f23",
    borderRadius: 16,
    padding: 28,
    width: "100%",
    maxWidth: 480,
    maxHeight: "90vh",
    overflowY: "auto" as const,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: 22,
    fontWeight: 400,
    margin: 0,
  },
  modalDesc: {
    color: "#71717a",
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  modalClose: {
    background: "none",
    border: "none",
    color: "#71717a",
    cursor: "pointer",
    fontSize: 18,
    padding: 4,
    lineHeight: 1,
  },
  modalActions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 13,
    color: "#a1a1aa",
    marginBottom: 6,
    fontWeight: 500,
  },
  input: {
    width: "100%",
    background: "#0a0a0a",
    border: "1px solid #2f2f33",
    borderRadius: 8,
    color: "#f4f4f5",
    padding: "10px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  errorBox: {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 8,
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: 13,
    marginTop: 12,
  },
  successBanner: {
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.2)",
    borderRadius: 10,
    padding: "16px 20px",
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    color: "#86efac",
    fontSize: 15,
  },
  // DNS table
  dnsSection: {
    background: "#0a0a0a",
    border: "1px solid #1f1f23",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  dnsSectionLabel: {
    padding: "10px 16px",
    borderBottom: "1px solid #1f1f23",
    fontSize: 12,
    fontWeight: 600,
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  recommended: {
    background: "rgba(99,102,241,0.15)",
    color: "#818cf8",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
  },
  dnsTable: {
    display: "flex",
    flexDirection: "column" as const,
  },
  dnsRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    borderBottom: "1px solid #1a1a1e",
    gap: 12,
  },
  dnsField: {
    width: 140,
    fontSize: 13,
    color: "#71717a",
    flexShrink: 0,
  },
  dnsValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: "monospace",
    color: "#f4f4f5",
  },
  copyBtn: {
    background: "#1f1f23",
    border: "none",
    color: "#a1a1aa",
    borderRadius: 4,
    padding: "4px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  details: {
    marginBottom: 12,
  },
  detailsSummary: {
    cursor: "pointer",
    color: "#6366f1",
    fontSize: 13,
    padding: "8px 0",
    userSelect: "none" as const,
  },
  propagationNote: {
    color: "#52525b",
    fontSize: 12,
    margin: "8px 0 0",
  },
  // Search
  searchForm: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  searchInputWrap: {
    flex: 1,
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute" as const,
    left: 14,
    fontSize: 16,
    pointerEvents: "none" as const,
  },
  searchInput: {
    width: "100%",
    background: "#111113",
    border: "1px solid #2f2f33",
    borderRadius: 8,
    color: "#f4f4f5",
    padding: "11px 14px 11px 42px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  searchResults: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  searchResultRow: {
    background: "#111113",
    border: "1px solid #1f1f23",
    borderRadius: 10,
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchResultLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  searchDomain: {
    fontSize: 15,
    fontWeight: 500,
  },
  popularBadge: {
    background: "rgba(99,102,241,0.15)",
    color: "#818cf8",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
  },
  searchResultRight: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  priceBlock: {
    textAlign: "right" as const,
  },
  price: {
    fontSize: 16,
    fontWeight: 600,
    color: "#f4f4f5",
  },
  priceLabel: {
    fontSize: 13,
    color: "#71717a",
    marginLeft: 2,
  },
  unavailable: {
    fontSize: 13,
    color: "#52525b",
    background: "#1a1a1e",
    padding: "6px 12px",
    borderRadius: 6,
  },
  // Purchase modal
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 4,
  },
  orderSummary: {
    background: "#0a0a0a",
    border: "1px solid #1f1f23",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 16px",
    fontSize: 14,
    borderBottom: "1px solid #1a1a1e",
    color: "#a1a1aa",
  },
  orderTotal: {
    borderBottom: "none",
    color: "#f4f4f5",
    fontWeight: 600,
  },
  paymentPlaceholder: {
    border: "2px dashed #2f2f33",
    borderRadius: 10,
    padding: 24,
    textAlign: "center" as const,
    marginBottom: 4,
  },
  // Spinner
  spinner: {
    width: 24,
    height: 24,
    border: "2px solid #2f2f33",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerSm: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.2)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};