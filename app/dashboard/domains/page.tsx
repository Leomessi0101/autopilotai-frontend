"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, Link, Search, Plus, Trash2, ExternalLink, CheckCircle, Clock, AlertCircle, ChevronRight, ArrowLeft } from "lucide-react";

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
// API
// ─────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://autopilotai-api.onrender.com";

async function apiFetch(path: string, opts?: RequestInit) {
  const token = localStorage.getItem("autopilot_token");
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts?.headers,
    },
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
  const router = useRouter();
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
    const token = localStorage.getItem("autopilot_token");
    if (!token) { router.push("/login"); return; }
    fetchDomains();
  }, [fetchDomains, router]);

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .domain-card:hover { border-color: #2a2a2a !important; background: #141414 !important; }
        .tab-btn:hover { color: #ccc !important; }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-ghost:hover { border-color: #444 !important; color: #ccc !important; }
        .result-row:hover { background: #141414 !important; border-color: #2a2a2a !important; }
        .copy-btn:hover { background: #2a2a2a !important; color: #fff !important; }
        input:focus { border-color: #059669 !important; box-shadow: 0 0 0 3px rgba(5,150,105,0.12) !important; outline: none; }

        /* ─────────────────────────────────────────────
           MOBILE RESPONSIVE — added only, nothing changed above
           ───────────────────────────────────────────── */

        /* Sidebar: hidden on mobile, shown on desktop */
        .sidebar-col {
          width: 240px;
          background: #0d0d0d;
          border-right: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          flex-shrink: 0;
          min-height: 100vh;
        }
        @media (max-width: 700px) {
          .sidebar-col { display: none; }
        }

        /* Mobile top nav bar (hidden on desktop) */
        .mobile-nav {
          display: none;
        }
        @media (max-width: 700px) {
          .mobile-nav {
            display: flex;
            align-items: center;
            gap: 0;
            background: #0d0d0d;
            border-bottom: 1px solid #1a1a1a;
            padding: 0 16px;
            position: sticky;
            top: 0;
            z-index: 10;
          }
          .mobile-nav-back {
            display: flex;
            align-items: center;
            gap: 6px;
            background: none;
            border: none;
            color: #555;
            cursor: pointer;
            font-size: 13px;
            font-family: inherit;
            padding: 14px 12px 14px 0;
          }
          .mobile-nav-tabs {
            display: flex;
            flex: 1;
            justify-content: center;
            gap: 4px;
          }
          .mobile-nav-tab {
            background: none;
            border: none;
            color: #555;
            font-size: 13px;
            font-weight: 600;
            font-family: inherit;
            padding: 14px 12px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: color 0.15s, border-color 0.15s;
          }
          .mobile-nav-tab.active {
            color: #f4f4f5;
            border-bottom-color: #059669;
          }
        }

        /* Tab content padding */
        .tab-content-wrap {
          flex: 1;
          padding: 40px 48px;
          max-width: 900px;
          width: 100%;
        }
        @media (max-width: 860px) {
          .tab-content-wrap { padding: 28px 24px; }
        }
        @media (max-width: 700px) {
          .tab-content-wrap { padding: 20px 16px 80px; }
        }

        /* Tab header: stack on mobile */
        .tab-header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 36px;
          gap: 16px;
        }
        @media (max-width: 560px) {
          .tab-header-wrap {
            flex-direction: column;
            margin-bottom: 24px;
            gap: 14px;
          }
        }

        /* Domain card: stack on mobile */
        .domain-card-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .domain-card-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .domain-card-right-wrap {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
        }

        /* Search form: stack on very small screens */
        .search-form-wrap {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (max-width: 480px) {
          .search-form-wrap {
            flex-direction: column;
          }
        }

        /* Result row: stack on small screens */
        .result-row-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        @media (max-width: 480px) {
          .result-row-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }

        /* Modal actions: stack on very small */
        .modal-actions-wrap {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        @media (max-width: 400px) {
          .modal-actions-wrap { flex-direction: column-reverse; }
          .modal-actions-wrap button,
          .modal-actions-wrap a { width: 100%; justify-content: center; }
        }

        /* Form grid: single col on mobile */
        .form-grid-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 4px;
        }
        @media (max-width: 480px) {
          .form-grid-wrap { grid-template-columns: 1fr; }
          .form-grid-wrap > div[style*="1 / -1"] { grid-column: auto !important; }
        }

        /* DNS row: allow value to wrap on mobile */
        .dns-row-wrap {
          display: flex;
          align-items: center;
          padding: 11px 16px;
          border-bottom: 1px solid #111;
          gap: 12px;
        }
        @media (max-width: 500px) {
          .dns-row-wrap {
            flex-wrap: wrap;
          }
          .dns-field-label { width: auto !important; font-weight: 700; }
          .dns-value-val { flex: unset; width: 100%; margin-top: 2px; word-break: break-all; }
        }

        /* Empty state buttons */
        .empty-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>

      {/* MOBILE NAV (visible only on small screens) */}
      <div className="mobile-nav">
        <button className="mobile-nav-back" onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={15} /> Dashboard
        </button>
        <div className="mobile-nav-tabs">
          <button
            className={`mobile-nav-tab ${tab === "connected" ? "active" : ""}`}
            onClick={() => setTab("connected")}
          >
            My Domains
          </button>
          <button
            className={`mobile-nav-tab ${tab === "purchase" ? "active" : ""}`}
            onClick={() => setTab("purchase")}
          >
            Buy a Domain
          </button>
        </div>
      </div>

      {/* SIDEBAR (hidden on mobile via CSS) */}
      <aside className="sidebar-col">
        <button onClick={() => router.push("/dashboard")} style={s.backBtn}>
          <ArrowLeft size={15} />
          Dashboard
        </button>

        <div style={s.sidebarLogo}>
          <div style={s.logoIcon}><Globe size={18} color="#059669" /></div>
          <span style={s.logoText}>Domains</span>
        </div>

        <nav style={s.nav}>
          <button
            style={{ ...s.navItem, ...(tab === "connected" ? s.navItemActive : {}) }}
            onClick={() => setTab("connected")}
          >
            <Link size={15} />
            My Domains
            {domains.length > 0 && (
              <span style={s.navBadge}>{domains.length}</span>
            )}
          </button>
          <button
            style={{ ...s.navItem, ...(tab === "purchase" ? s.navItemActive : {}) }}
            onClick={() => setTab("purchase")}
          >
            <Search size={15} />
            Buy a Domain
          </button>
        </nav>

        <div style={s.sidebarFooter}>
          <div style={s.sidebarFooterText}>
            <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6 }}>
              Connect your domain or buy a new one. DNS configures automatically.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={s.main}>
        {tab === "connected" ? (
          <ConnectedTab
            domains={domains}
            loading={loading}
            onRefresh={fetchDomains}
            onSelectDomain={setSelectedDomain}
            onConnectClick={() => setConnectOpen(true)}
          />
        ) : (
          <PurchaseTab />
        )}
      </main>

      {/* MODALS */}
      {connectOpen && (
        <ConnectModal
          onClose={() => setConnectOpen(false)}
          onSuccess={(domain) => {
            setConnectOpen(false);
            fetchDomains();
            setSelectedDomain(domain);
          }}
        />
      )}

      {selectedDomain && (
        <DNSModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
          onVerified={() => { fetchDomains(); setSelectedDomain(null); }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONNECTED TAB
// ─────────────────────────────────────────────

function ConnectedTab({ domains, loading, onRefresh, onSelectDomain, onConnectClick }: {
  domains: Domain[];
  loading: boolean;
  onRefresh: () => void;
  onSelectDomain: (d: Domain) => void;
  onConnectClick: () => void;
}) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (domain: Domain) => {
    if (!confirm(`Remove ${domain.domain}?`)) return;
    setDeleting(domain.id);
    try {
      await apiFetch(`/domains/${domain.id}`, { method: "DELETE" });
      onRefresh();
    } catch (e: any) { alert(e.message); }
    finally { setDeleting(null); }
  };

  return (
    <div className="tab-content-wrap fade-up">
      {/* Header */}
      <div className="tab-header-wrap">
        <div>
          <h1 style={s.tabTitle}>My Domains</h1>
          <p style={s.tabSubtitle}>Manage domains connected to your AutopilotAI site.</p>
        </div>
        <button style={s.btnPrimary} className="btn-primary" onClick={onConnectClick}>
          <Plus size={15} />
          Connect Domain
        </button>
      </div>

      {loading ? (
        <div style={s.centered}>
          <div style={s.spinner} />
        </div>
      ) : domains.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}><Globe size={32} color="#333" /></div>
          <h3 style={s.emptyTitle}>No domains connected yet</h3>
          <p style={s.emptyDesc}>Connect your own domain or buy a new one and we'll configure everything automatically.</p>
          <div className="empty-btns">
            <button style={s.btnPrimary} className="btn-primary" onClick={onConnectClick}>
              <Link size={15} /> Connect a Domain
            </button>
          </div>
        </div>
      ) : (
        <div style={s.domainList}>
          {domains.map((d) => (
            <DomainCard
              key={d.id}
              domain={d}
              deleting={deleting === d.id}
              onInspect={() => onSelectDomain(d)}
              onDelete={() => handleDelete(d)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// DOMAIN CARD
// ─────────────────────────────────────────────

function DomainCard({ domain, deleting, onInspect, onDelete }: {
  domain: Domain;
  deleting: boolean;
  onInspect: () => void;
  onDelete: () => void;
}) {
  const statusMap: Record<DomainStatus, { label: string; color: string; bg: string; dot: string }> = {
    active:    { label: "Active",    color: "#4ade80", bg: "rgba(74,222,128,0.08)",  dot: "#4ade80" },
    pending:   { label: "Pending DNS", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", dot: "#fbbf24" },
    verifying: { label: "Verifying", color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  dot: "#60a5fa" },
    failed:    { label: "DNS Error", color: "#f87171", bg: "rgba(248,113,113,0.08)", dot: "#f87171" },
    suspended: { label: "Suspended", color: "#6b7280", bg: "rgba(107,114,128,0.08)", dot: "#6b7280" },
  };
  const st = statusMap[domain.status];

  return (
    <div className="domain-card" style={s.domainCard}>
      <div className="domain-card-inner">
        <div style={s.domainCardLeft}>
          <div style={s.domainCardIcon}>
            {domain.source === "purchased" ? "🏷️" : "🔗"}
          </div>
          <div>
            <div style={{ ...s.domainName, wordBreak: "break-all" }}>{domain.domain}</div>
            <div style={s.domainMeta}>
              {domain.source === "purchased" ? "Purchased" : "Connected"} ·{" "}
              {domain.expires_at
                ? `Expires ${new Date(domain.expires_at).toLocaleDateString()}`
                : `Added ${new Date(domain.created_at).toLocaleDateString()}`}
            </div>
          </div>
        </div>

        <div className="domain-card-right-wrap" style={s.domainCardRight}>
          <div style={{ ...s.statusPill, color: st.color, background: st.bg }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, display: "inline-block", animation: domain.status === "active" ? "pulse 2s infinite" : "none" }} />
            {st.label}
          </div>

          {domain.status !== "active" && (
            <button className="btn-ghost" style={s.btnGhost} onClick={onInspect}>
              View Setup
            </button>
          )}
          {domain.status === "active" && (
            <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer" style={s.btnGhost} className="btn-ghost">
              Visit ↗
            </a>
          )}
          <button
            style={{ ...s.btnDelete, opacity: deleting ? 0.5 : 1 }}
            onClick={onDelete}
            disabled={deleting}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CONNECT MODAL
// ─────────────────────────────────────────────

function ConnectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (d: Domain) => void }) {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true); setError("");
    try {
      const data = await apiFetch("/domains/connect", {
        method: "POST",
        body: JSON.stringify({ domain: domain.trim() }),
      });
      onSuccess(data);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Overlay onClose={onClose}>
      <div style={s.modalTitle}>Connect a Domain</div>
      <p style={s.modalDesc}>Enter the domain you want to connect to your site. We'll give you DNS instructions.</p>
      <form onSubmit={handleSubmit}>
        <label style={s.label}>Your Domain</label>
        <input
          style={s.input}
          type="text"
          placeholder="myplumbingco.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          autoFocus
          spellCheck={false}
        />
        {error && <div style={s.errorBox}>{error}</div>}
        <div className="modal-actions-wrap">
          <button type="button" style={s.btnSecondary} onClick={onClose}>Cancel</button>
          <button type="submit" style={s.btnPrimary} className="btn-primary" disabled={loading || !domain.trim()}>
            {loading ? "Checking…" : "Get DNS Instructions →"}
          </button>
        </div>
      </form>
    </Overlay>
  );
}

// ─────────────────────────────────────────────
// DNS INSTRUCTIONS MODAL
// ─────────────────────────────────────────────

function DNSModal({ domain, onClose, onVerified }: { domain: Domain; onClose: () => void; onVerified: () => void }) {
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const ins = domain.dns_instructions;

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const verify = async () => {
    setVerifying(true); setResult(null);
    try {
      const r = await apiFetch(`/domains/connect/${domain.id}/verify`, { method: "POST" });
      setResult(r);
      if (r.verified) onVerified();
    } catch (e: any) { setResult({ verified: false, error: e.message }); }
    finally { setVerifying(false); }
  };

  return (
    <Overlay onClose={onClose} wide>
      <div style={s.modalTitle}>DNS Setup — {domain.domain}</div>

      {domain.status === "active" ? (
        <div style={s.successBox}>
          <CheckCircle size={18} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 600, color: "#4ade80" }}>Domain is active!</div>
            <div style={{ fontSize: 13, color: "#86efac", marginTop: 3 }}>
              Your site is live at <a href={`https://${domain.domain}`} target="_blank" style={{ color: "#86efac" }}>{domain.domain}</a>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p style={s.modalDesc}>Add this DNS record at your registrar (GoDaddy, Namecheap, Cloudflare, etc.):</p>

          {ins && (
            <>
              <div style={s.dnsBlock}>
                <div style={s.dnsBlockLabel}>
                  <span style={s.recommendedBadge}>Recommended</span> CNAME Record
                </div>
                {[
                  { field: "Type", value: ins.recommended.type },
                  { field: "Name / Host", value: ins.recommended.name },
                  { field: "Value / Points to", value: ins.recommended.value },
                  { field: "TTL", value: ins.recommended.ttl },
                ].map(({ field, value }) => (
                  <div key={field} className="dns-row-wrap">
                    <span className="dns-field-label" style={s.dnsField}>{field}</span>
                    <span className="dns-value-val" style={s.dnsValue}>{value}</span>
                    {(field === "Name / Host" || field === "Value / Points to") && (
                      <button className="copy-btn" style={s.copyBtn} onClick={() => copy(value, field)}>
                        {copied === field ? "✓ Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <details style={{ marginBottom: 16 }}>
                <summary style={{ cursor: "pointer", color: "#6366f1", fontSize: 13, padding: "6px 0", userSelect: "none" }}>
                  Can't use CNAME? Use an A record instead
                </summary>
                <div style={{ ...s.dnsBlock, marginTop: 10 }}>
                  {[
                    { field: "Type", value: ins.alternative.type },
                    { field: "Name / Host", value: ins.alternative.name },
                    { field: "IP Address", value: ins.alternative.value },
                    { field: "TTL", value: ins.alternative.ttl },
                  ].map(({ field, value }) => (
                    <div key={field} className="dns-row-wrap">
                      <span className="dns-field-label" style={s.dnsField}>{field}</span>
                      <span className="dns-value-val" style={s.dnsValue}>{value}</span>
                    </div>
                  ))}
                </div>
              </details>

              <p style={{ fontSize: 12, color: "#444", marginBottom: 20 }}>⏱ {ins.propagation_note}</p>
            </>
          )}

          {result && !result.verified && (
            <div style={s.errorBox}>{result.error || "DNS not verified yet — check your settings and try again."}</div>
          )}

          <div className="modal-actions-wrap">
            <button style={s.btnSecondary} onClick={onClose}>Close</button>
            <button style={s.btnPrimary} className="btn-primary" onClick={verify} disabled={verifying}>
              {verifying ? <><span style={s.spinnerSm} /> Checking…</> : "✓ Verify DNS"}
            </button>
          </div>
        </>
      )}
    </Overlay>
  );
}

// ─────────────────────────────────────────────
// PURCHASE TAB
// ─────────────────────────────────────────────

function PurchaseTab() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [error, setError] = useState("");
  const [purchasing, setPurchasing] = useState<SearchResult | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true); setError(""); setResults(null);
    try {
      const data = await apiFetch(`/domains/search?q=${encodeURIComponent(query.trim())}`);
      setResults(data.results);
    } catch (err: any) { setError(err.message); }
    finally { setSearching(false); }
  };

  return (
    <div className="tab-content-wrap fade-up">
      <div className="tab-header-wrap">
        <div>
          <h1 style={s.tabTitle}>Buy a Domain</h1>
          <p style={s.tabSubtitle}>Search availability and purchase — DNS configures automatically.</p>
        </div>
      </div>

      <form onSubmit={search} className="search-form-wrap">
        <div style={s.searchWrap}>
          <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }} />
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search for a domain… e.g. myplumbingco"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" style={s.btnPrimary} className="btn-primary" disabled={searching || !query.trim()}>
          {searching ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <div style={s.errorBox}>{error}</div>}

      {results && (
        <div style={s.resultsList}>
          {results.map((r) => (
            <div key={r.domain} className="result-row" style={{ ...s.resultRow, opacity: r.available ? 1 : 0.45 }}>
              <div className="result-row-inner" style={{ width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ ...s.resultDomain, wordBreak: "break-all" }}>{r.domain}</span>
                  {r.popular && r.available && <span style={s.popularBadge}>Popular</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                  {r.available ? (
                    <>
                      <div style={{ textAlign: "right" }}>
                        <span style={s.price}>{r.display_price}</span>
                        <span style={s.priceLabel}>/yr</span>
                      </div>
                      <button style={s.btnPrimary} className="btn-primary" onClick={() => setPurchasing(r)}>
                        Buy
                      </button>
                    </>
                  ) : (
                    <span style={s.takenBadge}>Taken</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {purchasing && (
        <PurchaseModal domain={purchasing} onClose={() => setPurchasing(null)} onSuccess={() => setPurchasing(null)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PURCHASE MODAL
// ─────────────────────────────────────────────

function PurchaseModal({ domain, onClose, onSuccess }: { domain: SearchResult; onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<"contact" | "payment" | "done">("contact");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", address1: "", city: "", state: "", postal_code: "", country: "US" });

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["first_name", "last_name", "email", "phone", "address1", "city", "state", "postal_code"];
    for (const f of required) {
      if (!form[f as keyof typeof form]) { setError(`${f.replace("_", " ")} is required`); return; }
    }
    setError(""); setStep("payment");
  };

  const purchase = async () => {
    setLoading(true); setError("");
    try {
      await apiFetch("/domains/purchase", {
        method: "POST",
        body: JSON.stringify({ domain: domain.domain, registrant: form, years: 1, stripe_payment_method_id: "pm_card_visa" }),
      });
      setStep("done");
      setTimeout(onSuccess, 2500);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <Overlay onClose={step !== "done" ? onClose : undefined} wide>
      {step === "done" ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🚀</div>
          <div style={s.modalTitle}>Domain Registered!</div>
          <p style={s.modalDesc}><strong style={{ color: "#fff" }}>{domain.domain}</strong> is being set up. Your site will be live automatically within a few minutes.</p>
        </div>
      ) : step === "contact" ? (
        <>
          <div style={s.modalTitle}>Register {domain.domain}</div>
          <p style={s.modalDesc}>ICANN requires contact info. WHOIS privacy is enabled by default — your details stay private.</p>
          <form onSubmit={submitContact}>
            <div className="form-grid-wrap">
              {[
                { k: "first_name", label: "First Name", ph: "Jane" },
                { k: "last_name", label: "Last Name", ph: "Smith" },
                { k: "email", label: "Email", ph: "jane@example.com" },
                { k: "phone", label: "Phone", ph: "+12125551234" },
                { k: "address1", label: "Address", ph: "123 Main St", full: true },
                { k: "city", label: "City", ph: "New York" },
                { k: "state", label: "State", ph: "NY" },
                { k: "postal_code", label: "ZIP Code", ph: "10001" },
              ].map(({ k, label, ph, full }) => (
                <div key={k} style={{ gridColumn: full ? "1 / -1" : "auto" }}>
                  <label style={s.label}>{label}</label>
                  <input style={s.input} placeholder={ph} value={form[k as keyof typeof form]} onChange={update(k)} />
                </div>
              ))}
            </div>
            {error && <div style={s.errorBox}>{error}</div>}
            <div className="modal-actions-wrap">
              <button type="button" style={s.btnSecondary} onClick={onClose}>Cancel</button>
              <button type="submit" style={s.btnPrimary} className="btn-primary">Continue →</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div style={s.modalTitle}>Payment</div>
          <div style={s.orderBox}>
            <div style={s.orderRow}>
              <span>{domain.domain} (1 year)</span>
              <span>{domain.display_price}</span>
            </div>
            <div style={{ ...s.orderRow, borderBottom: "none", fontWeight: 600, color: "#fff" }}>
              <span>Total today</span>
              <span>{domain.display_price}</span>
            </div>
          </div>
          <div style={s.paymentPlaceholder}>
            💳 Integrate <strong>@stripe/react-stripe-js</strong> here for the card form
          </div>
          {error && <div style={s.errorBox}>{error}</div>}
          <div className="modal-actions-wrap">
            <button style={s.btnSecondary} onClick={() => setStep("contact")}>← Back</button>
            <button style={s.btnPrimary} className="btn-primary" onClick={purchase} disabled={loading}>
              {loading ? "Processing…" : `Pay ${domain.display_price}`}
            </button>
          </div>
        </>
      )}
    </Overlay>
  );
}

// ─────────────────────────────────────────────
// OVERLAY WRAPPER
// ─────────────────────────────────────────────

function Overlay({ children, onClose, wide }: { children: React.ReactNode; onClose?: () => void; wide?: boolean }) {
  return (
    <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div style={{ ...s.modal, maxWidth: wide ? 580 : 440 }}>
        {onClose && <button style={s.closeBtn} onClick={onClose}>✕</button>}
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f4f4f5",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    flexDirection: "row",
  },
  sidebar: {
    width: 240,
    background: "#0d0d0d",
    borderRight: "1px solid #1a1a1a",
    display: "flex",
    flexDirection: "column",
    padding: "24px 16px",
    flexShrink: 0,
    minHeight: "100vh",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "#555",
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    padding: "6px 8px",
    borderRadius: 8,
    marginBottom: 28,
    transition: "color 0.15s",
  },
  sidebarLogo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 8px",
    marginBottom: 28,
  },
  logoIcon: {
    width: 34,
    height: 34,
    background: "rgba(5,150,105,0.12)",
    border: "1px solid rgba(5,150,105,0.2)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: 20,
    fontWeight: 400,
    color: "#f4f4f5",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "none",
    color: "#555",
    fontSize: 14,
    fontFamily: "inherit",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s, color 0.15s",
    width: "100%",
  },
  navItemActive: {
    background: "#1a1a1a",
    color: "#f4f4f5",
  },
  navBadge: {
    marginLeft: "auto",
    background: "#2a2a2a",
    color: "#888",
    borderRadius: 999,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
  },
  sidebarFooter: {
    borderTop: "1px solid #1a1a1a",
    paddingTop: 20,
    marginTop: 20,
  },
  sidebarFooterText: {},
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    overflowY: "auto",
  },
  tabContent: {
    flex: 1,
    padding: "40px 48px",
    maxWidth: 900,
    width: "100%",
  },
  tabHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    gap: 16,
  },
  tabTitle: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: 34,
    fontWeight: 400,
    letterSpacing: "-0.5px",
    marginBottom: 6,
    color: "#f4f4f5",
  },
  tabSubtitle: {
    color: "#555",
    fontSize: 14,
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    padding: 80,
  },
  spinner: {
    width: 28,
    height: 28,
    border: "2px solid #1e1e1e",
    borderTopColor: "#059669",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerSm: {
    display: "inline-block",
    width: 13,
    height: 13,
    border: "2px solid rgba(255,255,255,0.2)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    verticalAlign: "middle",
    marginRight: 6,
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 32px",
    color: "#555",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  emptyTitle: {
    color: "#f4f4f5",
    fontSize: 20,
    fontWeight: 500,
    fontFamily: "'Instrument Serif', Georgia, serif",
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    lineHeight: 1.7,
    maxWidth: 400,
    margin: "0 auto 28px",
  },
  domainList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  domainCard: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 14,
    padding: "18px 22px",
    transition: "border-color 0.15s, background 0.15s",
    cursor: "default",
  },
  domainCardLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  domainCardIcon: {
    width: 42,
    height: 42,
    background: "#1a1a1a",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  domainName: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 3,
    color: "#f4f4f5",
  },
  domainMeta: {
    fontSize: 12,
    color: "#555",
  },
  domainCardRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 12px",
    borderRadius: 999,
  },
  btnPrimary: {
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    whiteSpace: "nowrap",
    transition: "filter 0.15s, transform 0.15s",
    textDecoration: "none",
  },
  btnSecondary: {
    background: "#1a1a1a",
    color: "#888",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnGhost: {
    background: "none",
    color: "#888",
    border: "1px solid #2a2a2a",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "none",
    display: "inline-block",
    transition: "border-color 0.15s, color 0.15s",
  },
  btnDelete: {
    background: "none",
    border: "1px solid rgba(239,68,68,0.15)",
    color: "#ef4444",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background 0.15s",
  },
  searchForm: {
    display: "flex",
    gap: 12,
    marginBottom: 28,
  },
  searchWrap: {
    flex: 1,
    position: "relative",
  },
  searchInput: {
    width: "100%",
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 10,
    color: "#f4f4f5",
    padding: "12px 16px 12px 44px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  resultRow: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 12,
    padding: "16px 20px",
    transition: "background 0.15s, border-color 0.15s",
  },
  resultDomain: {
    fontSize: 15,
    fontWeight: 500,
    color: "#f4f4f5",
  },
  popularBadge: {
    background: "rgba(245,158,11,0.12)",
    color: "#fbbf24",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
  },
  price: {
    fontSize: 16,
    fontWeight: 600,
    color: "#f4f4f5",
  },
  priceLabel: {
    fontSize: 13,
    color: "#555",
    marginLeft: 2,
  },
  takenBadge: {
    fontSize: 13,
    color: "#555",
    background: "#1a1a1a",
    padding: "6px 14px",
    borderRadius: 8,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: 20,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: 18,
    padding: 32,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "none",
    border: "none",
    color: "#555",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    padding: 4,
  },
  modalTitle: {
    fontFamily: "'Instrument Serif', Georgia, serif",
    fontSize: 24,
    fontWeight: 400,
    color: "#f4f4f5",
    marginBottom: 10,
  },
  modalDesc: {
    color: "#666",
    fontSize: 14,
    lineHeight: 1.65,
    marginBottom: 24,
  },
  modalActions: {
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 24,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#666",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  input: {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #2a2a2a",
    borderRadius: 10,
    color: "#f4f4f5",
    padding: "11px 14px",
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none",
    marginBottom: 4,
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  },
  errorBox: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "#fca5a5",
    fontSize: 13,
    marginTop: 12,
    lineHeight: 1.5,
  },
  successBox: {
    background: "rgba(74,222,128,0.08)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    color: "#4ade80",
  },
  dnsBlock: {
    background: "#0d0d0d",
    border: "1px solid #1e1e1e",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
  },
  dnsBlockLabel: {
    padding: "10px 16px",
    borderBottom: "1px solid #1a1a1a",
    fontSize: 11,
    fontWeight: 700,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  recommendedBadge: {
    background: "rgba(99,102,241,0.15)",
    color: "#818cf8",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 700,
  },
  dnsRow: {
    display: "flex",
    alignItems: "center",
    padding: "11px 16px",
    borderBottom: "1px solid #111",
    gap: 12,
  },
  dnsField: {
    width: 150,
    fontSize: 13,
    color: "#555",
    flexShrink: 0,
  },
  dnsValue: {
    flex: 1,
    fontSize: 13,
    fontFamily: "monospace",
    color: "#f4f4f5",
  },
  copyBtn: {
    background: "#1e1e1e",
    border: "none",
    color: "#888",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.15s, color 0.15s",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 4,
  },
  orderBox: {
    background: "#0d0d0d",
    border: "1px solid #1e1e1e",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "13px 18px",
    fontSize: 14,
    borderBottom: "1px solid #1a1a1a",
    color: "#888",
  },
  paymentPlaceholder: {
    border: "2px dashed #2a2a2a",
    borderRadius: 12,
    padding: "28px 24px",
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
};