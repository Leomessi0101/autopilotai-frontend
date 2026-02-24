"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type WebsiteData = {
  id: number;
  username: string;
  template: string;
  html: string;
  metadata?: Record<string, any>;
  prompt?: string;
  business_name?: string;
  publish_status: "draft" | "published";
  custom_domain?: string;
  domain_verified?: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  username: string;
  initialData: WebsiteData;
  userPlan: string;
};

type Toast = { type: "success" | "error" | "info"; text: string };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  "https://autopilotai-api.onrender.com";

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("autopilot_token") ||
    sessionStorage.getItem("autopilot_token")
  );
}

// ─── inject this script into the iframe to enable click-to-edit ───────────
function buildEditorScript() {
  return `
<script>
(function() {
  var _selected = null;
  var _toolbar = null;
  var _overlay = null;

  // ── TOOLBAR ──────────────────────────────────────────────────────────────
  function createToolbar() {
    var t = document.createElement('div');
    t.id = '__ap_toolbar';
    t.style.cssText = [
      'position:fixed','top:12px','left:50%','transform:translateX(-50%)',
      'z-index:99999','display:none','align-items:center','gap:6px',
      'background:#18181b','border:1px solid #3f3f46','border-radius:12px',
      'padding:6px 10px','box-shadow:0 8px 32px rgba(0,0,0,0.5)',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-size:13px','color:#fff','white-space:nowrap'
    ].join(';');

    var sizes = ['H1','H2','H3','P'];
    sizes.forEach(function(s) {
      var b = document.createElement('button');
      b.textContent = s;
      b.dataset.cmd = s;
      b.style.cssText = 'background:#27272a;border:1px solid #3f3f46;color:#a1a1aa;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s';
      b.onmouseenter = function(){ b.style.background='#3f3f46'; b.style.color='#fff'; };
      b.onmouseleave = function(){ b.style.background='#27272a'; b.style.color='#a1a1aa'; };
      b.onclick = function(){ applyTag(s); };
      t.appendChild(b);
    });

    var sep = document.createElement('div');
    sep.style.cssText = 'width:1px;height:20px;background:#3f3f46;margin:0 2px';
    t.appendChild(sep);

    ['Bold','Italic'].forEach(function(cmd) {
      var b = document.createElement('button');
      b.innerHTML = cmd === 'Bold' ? '<b>B</b>' : '<i>I</i>';
      b.style.cssText = 'background:#27272a;border:1px solid #3f3f46;color:#a1a1aa;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:12px;transition:all .15s';
      b.onmouseenter = function(){ b.style.background='#3f3f46'; b.style.color='#fff'; };
      b.onmouseleave = function(){ b.style.background='#27272a'; b.style.color='#a1a1aa'; };
      b.onclick = function(){ document.execCommand(cmd.toLowerCase(), false, null); };
      t.appendChild(b);
    });

    var sep2 = sep.cloneNode();
    t.appendChild(sep2);

    var undoBtn = makeBtn('↩ Undo', function(){ document.execCommand('undo', false, null); });
    t.appendChild(undoBtn);

    var doneBtn = document.createElement('button');
    doneBtn.textContent = '✓ Done';
    doneBtn.style.cssText = 'background:#059669;border:1px solid #059669;color:#fff;border-radius:6px;padding:4px 12px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s';
    doneBtn.onmouseenter = function(){ doneBtn.style.background='#047857'; };
    doneBtn.onmouseleave = function(){ doneBtn.style.background='#059669'; };
    doneBtn.onclick = function(){ deselect(); };
    t.appendChild(doneBtn);

    document.body.appendChild(t);
    return t;
  }

  function makeBtn(label, fn) {
    var b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = 'background:#27272a;border:1px solid #3f3f46;color:#a1a1aa;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:12px;transition:all .15s';
    b.onmouseenter = function(){ b.style.background='#3f3f46'; b.style.color='#fff'; };
    b.onmouseleave = function(){ b.style.background='#27272a'; b.style.color='#a1a1aa'; };
    b.onclick = fn;
    return b;
  }

  // ── OUTLINE OVERLAY ───────────────────────────────────────────────────────
  function getOverlay() {
    if (_overlay) return _overlay;
    _overlay = document.createElement('div');
    _overlay.id = '__ap_overlay';
    _overlay.style.cssText = 'position:fixed;pointer-events:none;z-index:99990;border:2px solid #059669;border-radius:4px;transition:all .1s;box-shadow:0 0 0 3px rgba(5,150,105,0.15)';
    document.body.appendChild(_overlay);
    return _overlay;
  }

  function positionOverlay(el) {
    var r = el.getBoundingClientRect();
    var o = getOverlay();
    o.style.top = (r.top - 3) + 'px';
    o.style.left = (r.left - 3) + 'px';
    o.style.width = (r.width + 6) + 'px';
    o.style.height = (r.height + 6) + 'px';
    o.style.display = 'block';
  }

  function hideOverlay() {
    if (_overlay) _overlay.style.display = 'none';
  }

  // ── EDITABLE TAGS ────────────────────────────────────────────────────────
  var EDITABLE = 'h1,h2,h3,h4,h5,h6,p,li,span,a,button,label,td,th,blockquote,figcaption,caption,strong,em,div';

  function isEditable(el) {
    if (!el || el.id === '__ap_toolbar' || el.id === '__ap_overlay') return false;
    if (el.closest && el.closest('#__ap_toolbar')) return false;
    if (el.tagName === 'IMG' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return false;
    // Only match elements with direct text content (not just whitespace)
    var text = '';
    el.childNodes.forEach(function(n){ if(n.nodeType === 3) text += n.textContent; });
    if (!text.trim() && el.tagName === 'DIV') return false;
    return el.matches && el.matches(EDITABLE);
  }

  function select(el) {
    if (_selected === el) return;
    deselect();
    _selected = el;
    el.contentEditable = 'true';
    el.style.outline = 'none';
    el.setAttribute('data-ap-editing', '1');
    positionOverlay(el);
    if (!_toolbar) _toolbar = createToolbar();
    _toolbar.style.display = 'flex';
    el.focus();
    // Notify parent
    window.parent.postMessage({ type: 'AP_EDITING', tag: el.tagName }, '*');
  }

  function deselect() {
    if (!_selected) return;
    _selected.contentEditable = 'false';
    _selected.removeAttribute('data-ap-editing');
    hideOverlay();
    if (_toolbar) _toolbar.style.display = 'none';
    // Send full HTML back to parent
    window.parent.postMessage({ type: 'AP_HTML_CHANGE', html: document.documentElement.outerHTML }, '*');
    _selected = null;
  }

  function applyTag(tag) {
    if (!_selected) return;
    var newEl = document.createElement(tag === 'P' ? 'p' : tag.toLowerCase());
    newEl.innerHTML = _selected.innerHTML;
    // Copy classes
    newEl.className = _selected.className;
    _selected.replaceWith(newEl);
    select(newEl);
  }

  // ── IMAGE CLICK ───────────────────────────────────────────────────────────
  function showImageEditor(img) {
    var box = document.createElement('div');
    box.id = '__ap_imgbox';
    box.style.cssText = [
      'position:fixed','inset:0','z-index:999999',
      'background:rgba(0,0,0,0.75)','display:flex',
      'align-items:center','justify-content:center',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'backdrop-filter:blur(4px)'
    ].join(';');

    var card = document.createElement('div');
    card.style.cssText = 'background:#18181b;border:1px solid #3f3f46;border-radius:16px;padding:28px;width:440px;max-width:90vw';

    var title = document.createElement('p');
    title.textContent = 'Change Image';
    title.style.cssText = 'margin:0 0 6px;font-size:18px;font-weight:600;color:#fff';
    card.appendChild(title);

    var sub = document.createElement('p');
    sub.textContent = 'Paste a direct image URL (.jpg, .png, .webp, etc.)';
    sub.style.cssText = 'margin:0 0 18px;font-size:13px;color:#71717a';
    card.appendChild(sub);

    var inp = document.createElement('input');
    inp.type = 'text';
    inp.placeholder = 'https://images.unsplash.com/...';
    inp.value = img.src;
    inp.style.cssText = 'width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;outline:none;margin-bottom:16px';
    card.appendChild(inp);

    var preview = document.createElement('img');
    preview.style.cssText = 'width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:16px;display:none;background:#27272a';
    card.appendChild(preview);

    inp.addEventListener('input', function() {
      var v = inp.value.trim();
      if (v.startsWith('http')) {
        preview.src = v;
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
      }
    });

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;justify-content:flex-end';

    var cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.style.cssText = 'background:#27272a;border:1px solid #3f3f46;color:#a1a1aa;border-radius:8px;padding:9px 20px;cursor:pointer;font-size:14px';
    cancel.onclick = function(){ document.body.removeChild(box); };

    var apply = document.createElement('button');
    apply.textContent = 'Apply Image';
    apply.style.cssText = 'background:#059669;border:none;color:#fff;border-radius:8px;padding:9px 20px;cursor:pointer;font-size:14px;font-weight:600';
    apply.onclick = function() {
      var v = inp.value.trim();
      if (v) {
        img.src = v;
        img.removeAttribute('srcset');
        document.body.removeChild(box);
        window.parent.postMessage({ type: 'AP_HTML_CHANGE', html: document.documentElement.outerHTML }, '*');
      }
    };

    row.appendChild(cancel);
    row.appendChild(apply);
    card.appendChild(row);
    box.appendChild(card);
    document.body.appendChild(box);
    setTimeout(function(){ inp.focus(); inp.select(); }, 50);
  }

  // ── HOVER HINT ────────────────────────────────────────────────────────────
  var _hoverEl = null;
  document.addEventListener('mouseover', function(e) {
    if (_selected) return;
    var el = e.target;
    if (el.tagName === 'IMG') {
      el.style.cursor = 'pointer';
      el.style.outline = '2px dashed #0ea5e9';
      el.style.outlineOffset = '2px';
      _hoverEl = el;
      return;
    }
    if (isEditable(el)) {
      el.style.cursor = 'text';
      el.style.outline = '2px dashed #3f3f46';
      el.style.outlineOffset = '2px';
      _hoverEl = el;
    }
  });

  document.addEventListener('mouseout', function(e) {
    if (_selected) return;
    var el = e.target;
    if (el !== _selected) {
      el.style.outline = '';
      el.style.outlineOffset = '';
    }
  });

  // ── CLICK ─────────────────────────────────────────────────────────────────
  document.addEventListener('click', function(e) {
    if (e.target.closest && e.target.closest('#__ap_toolbar')) return;
    if (e.target.closest && e.target.closest('#__ap_imgbox')) return;

    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      e.stopPropagation();
      if (_selected) deselect();
      showImageEditor(e.target);
      return;
    }

    var el = e.target;
    // Walk up to find nearest editable
    var found = null;
    var cursor = el;
    for (var i = 0; i < 5; i++) {
      if (!cursor) break;
      if (isEditable(cursor)) { found = cursor; break; }
      cursor = cursor.parentElement;
    }

    if (found) {
      e.preventDefault();
      select(found);
    } else {
      if (_selected && !_selected.contains(el)) {
        deselect();
      }
    }
  });

  // ── KEYBOARD ─────────────────────────────────────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && _selected) {
      deselect();
    }
    // Cmd/Ctrl+S → save
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (_selected) deselect();
      window.parent.postMessage({ type: 'AP_SAVE' }, '*');
    }
    // Cmd/Ctrl+Z already handled by execCommand undo
  });

  // ── KEEP OVERLAY UPDATED ON SCROLL/RESIZE ─────────────────────────────────
  window.addEventListener('scroll', function() {
    if (_selected) positionOverlay(_selected);
  }, true);
  window.addEventListener('resize', function() {
    if (_selected) positionOverlay(_selected);
  });

  // ── READY ─────────────────────────────────────────────────────────────────
  window.parent.postMessage({ type: 'AP_EDITOR_READY' }, '*');
  console.log('[AutopilotAI Editor] Click any text or image to edit.');
})();
</script>`;
}

export default function WebsiteEditor({ username, initialData, userPlan }: Props) {
  const [data, setData] = useState(initialData);
  const [currentHtml, setCurrentHtml] = useState(initialData.html);
  const [prompt, setPrompt] = useState(initialData.prompt || "");
  const [businessName, setBusinessName] = useState(initialData.business_name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPublished, setIsPublished] = useState(initialData.publish_status === "published");
  const [editorReady, setEditorReady] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [activePanel, setActivePanel] = useState<"edit" | "settings">("edit");
  const [toast, setToast] = useState<Toast | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const toastTimer = useRef<any>(null);

  const canPublish = ["starter", "pro", "business"].includes(userPlan?.toLowerCase());

  // ── Show toast ────────────────────────────────────────────────────────────
  const showToast = useCallback((type: Toast["type"], text: string) => {
    setToast({ type, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Write HTML into iframe ─────────────────────────────────────────────────
  const writeIframe = useCallback((html: string) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Strip existing editor script if re-writing
    const cleaned = html
      .replace(/<script[\s\S]*?__ap_toolbar[\s\S]*?<\/script>/gi, "")
      .replace(/<div id="__ap_toolbar"[\s\S]*?<\/div>/gi, "")
      .replace(/<div id="__ap_overlay"[\s\S]*?<\/div>/gi, "");

    // Inject editor script before </body>
    const withEditor = cleaned.includes("</body>")
      ? cleaned.replace("</body>", buildEditorScript() + "\n</body>")
      : cleaned + buildEditorScript();

    // Wrap in full doc if it's a fragment
    const fullDoc = withEditor.trimStart().startsWith("<!DOCTYPE") || withEditor.trimStart().startsWith("<html")
      ? withEditor
      : `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;border:0;min-height:100vh;}a{color:inherit;text-decoration:none;}</style></head><body>${withEditor}</body></html>`;

    doc.open();
    doc.write(fullDoc);
    doc.close();
  }, []);

  // ── Initial render ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (iframeRef.current) {
      writeIframe(currentHtml);
    }
  }, []); // eslint-disable-line

  // ── Listen for messages from iframe ───────────────────────────────────────
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;

      switch (e.data.type) {
        case "AP_EDITOR_READY":
          setEditorReady(true);
          break;

        case "AP_HTML_CHANGE":
          // Strip injected editor scripts before storing
          const clean = (e.data.html as string)
            .replace(/<script[\s\S]*?AP_EDITOR_READY[\s\S]*?<\/script>/gi, "")
            .replace(/<div id="__ap_toolbar"[\s\S]*?<\/div>/gi, "")
            .replace(/<div id="__ap_overlay"[\s\S]*?<\/div>/gi, "");
          setCurrentHtml(clean);
          setHasUnsaved(true);
          break;

        case "AP_SAVE":
          handleSave();
          break;
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [currentHtml]); // eslint-disable-line

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/dashboard/websites/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          html: currentHtml,
          business_name: businessName,
          prompt,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const result = await res.json();
      if (!result.ok) throw new Error(result.detail || "Save failed");
      setHasUnsaved(false);
      showToast("success", "Changes saved!");
    } catch (err: any) {
      showToast("error", err.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  }, [currentHtml, businessName, prompt, username, showToast]);

  // ── PUBLISH / UNPUBLISH ────────────────────────────────────────────────────
  const handlePublishToggle = async () => {
    if (!canPublish && !isPublished) {
      showToast("error", "Upgrade to Starter or Pro to publish");
      return;
    }
    try {
      setIsPublishing(true);
      const token = getToken();
      const endpoint = isPublished ? "unpublish" : "publish";
      const res = await fetch(
        `${API_BASE}/api/dashboard/websites/${username}/${endpoint}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      if (!result.ok) throw new Error(result.detail || "Failed");
      setIsPublished(!isPublished);
      showToast(
        "success",
        isPublished
          ? "Website unpublished — now private"
          : `🚀 Live at autopilotai.dev/r/${username}`
      );
    } catch (err: any) {
      showToast("error", err.message || "Failed");
    } finally {
      setIsPublishing(false);
    }
  };

  // ── REGENERATE ────────────────────────────────────────────────────────────
  const handleRegenerate = async () => {
    if (!prompt.trim() || !businessName.trim()) {
      showToast("error", "Fill in business name and description first");
      return;
    }
    try {
      setIsRegenerating(true);
      const token = getToken();
      const res = await fetch(
        `${API_BASE}/api/dashboard/websites/${username}/regenerate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ business_name: businessName.trim(), prompt: prompt.trim() }),
        }
      );
      if (!res.ok) throw new Error("Regeneration failed");
      const result = await res.json();
      if (!result.ok) throw new Error(result.detail || "Failed");

      // Fetch fresh HTML
      const freshRes = await fetch(
        `${API_BASE}/api/dashboard/websites/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (freshRes.ok) {
        const freshResult = await freshRes.json();
        if (freshResult.ok && freshResult.data) {
          const newHtml = freshResult.data.html;
          setCurrentHtml(newHtml);
          setData(freshResult.data);
          setHasUnsaved(false);
          writeIframe(newHtml);
          showToast("success", "Website regenerated!");
        }
      }
    } catch (err: any) {
      showToast("error", err.message || "Regeneration failed");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "#09090b",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        zIndex: 30,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .editor-btn:hover { filter: brightness(1.15) !important; }
        .side-tab:hover { background: #27272a !important; color: #fff !important; }
        .panel-input:focus { border-color: #059669 !important; box-shadow: 0 0 0 3px rgba(5,150,105,0.12) !important; outline: none; }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 54,
          background: "#18181b",
          borderBottom: "1px solid #27272a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
          gap: 12,
        }}
      >
        {/* Left: back + site name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <a
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#71717a",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500,
              padding: "5px 10px",
              borderRadius: 8,
              border: "1px solid #27272a",
              background: "#09090b",
              transition: "color 0.15s",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </a>

          <div
            style={{
              height: 20,
              width: 1,
              background: "#27272a",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 16,
                color: "#fff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 180,
              }}
            >
              {businessName || username}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                background: isPublished ? "rgba(5,150,105,0.12)" : "rgba(63,63,70,0.5)",
                color: isPublished ? "#4ade80" : "#71717a",
                border: `1px solid ${isPublished ? "rgba(5,150,105,0.3)" : "#3f3f46"}`,
                flexShrink: 0,
              }}
            >
              {isPublished ? "● Live" : "Draft"}
            </span>
          </div>

          {hasUnsaved && (
            <span
              style={{
                fontSize: 11,
                color: "#f59e0b",
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                padding: "2px 8px",
                borderRadius: 999,
                flexShrink: 0,
              }}
            >
              Unsaved
            </span>
          )}
        </div>

        {/* Center: hint */}
        <div
          style={{
            fontSize: 12,
            color: "#52525b",
            textAlign: "center",
            flex: 1,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {editorReady ? (
            <>
              <span style={{ color: "#4ade80", fontSize: 7 }}>●</span>
              Click any text or image to edit
            </>
          ) : (
            <>
              <div style={{ width: 12, height: 12, border: "2px solid #3f3f46", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Loading editor…
            </>
          )}
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {isPublished && (
            <a
              href={`/r/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#a1a1aa",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #27272a",
                background: "#09090b",
                fontWeight: 500,
                transition: "color 0.15s",
              }}
            >
              View Live ↗
            </a>
          )}

          <button
            className="editor-btn"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid #3f3f46",
              background: "#27272a",
              color: "#e4e4e7",
              fontSize: 13,
              fontWeight: 600,
              cursor: isSaving ? "not-allowed" : "pointer",
              opacity: isSaving ? 0.6 : 1,
              fontFamily: "inherit",
              transition: "filter 0.15s",
            }}
          >
            {isSaving ? (
              <div style={{ width: 13, height: 13, border: "2px solid #52525b", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {isSaving ? "Saving…" : "Save"}
          </button>

          <button
            className="editor-btn"
            onClick={handlePublishToggle}
            disabled={isPublishing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              borderRadius: 8,
              border: "none",
              background: isPublished ? "#27272a" : "#059669",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: isPublishing ? "not-allowed" : "pointer",
              opacity: isPublishing ? 0.6 : 1,
              fontFamily: "inherit",
              transition: "filter 0.15s",
            }}
          >
            {isPublishing ? (
              <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : isPublished ? (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
            {isPublishing ? "…" : isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* ── BODY: sidebar + preview ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div
          style={{
            width: 280,
            background: "#18181b",
            borderRight: "1px solid #27272a",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #27272a",
              padding: "8px 8px 0",
              gap: 4,
            }}
          >
            {(["edit", "settings"] as const).map((tab) => (
              <button
                key={tab}
                className="side-tab"
                onClick={() => setActivePanel(tab)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: "8px 8px 0 0",
                  border: "none",
                  background: activePanel === tab ? "#09090b" : "transparent",
                  color: activePanel === tab ? "#fff" : "#71717a",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  borderBottom: activePanel === tab ? "2px solid #059669" : "2px solid transparent",
                }}
              >
                {tab === "edit" ? "✏️ Edit" : "⚙️ Settings"}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {activePanel === "edit" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Quick guide */}
                <div
                  style={{
                    background: "rgba(5,150,105,0.06)",
                    border: "1px solid rgba(5,150,105,0.15)",
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    How to edit
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { icon: "🖱️", text: "Click any text to edit it" },
                      { icon: "🖼️", text: "Click any image to replace it" },
                      { icon: "⌨️", text: "Esc to finish editing" },
                      { icon: "⌘S", text: "Cmd+S to save quickly" },
                    ].map(({ icon, text }) => (
                      <div key={text} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 14, width: 20, flexShrink: 0 }}>{icon}</span>
                        <span style={{ fontSize: 12, color: "#71717a" }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business name */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Business Name
                  </label>
                  <input
                    className="panel-input"
                    type="text"
                    value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); setHasUnsaved(true); }}
                    placeholder="Your business name"
                    style={{
                      width: "100%",
                      background: "#09090b",
                      border: "1px solid #3f3f46",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "9px 12px",
                      fontSize: 14,
                      fontFamily: "inherit",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  />
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "#27272a" }} />

                {/* Regenerate section */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Regenerate with AI
                  </label>
                  <p style={{ fontSize: 12, color: "#52525b", marginBottom: 10, lineHeight: 1.6 }}>
                    Describe your business and AI will rebuild the whole site from scratch.
                  </p>
                  <textarea
                    className="panel-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    placeholder="Describe your business, services, location..."
                    style={{
                      width: "100%",
                      background: "#09090b",
                      border: "1px solid #3f3f46",
                      borderRadius: 8,
                      color: "#fff",
                      padding: "9px 12px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      resize: "none",
                      lineHeight: 1.6,
                      transition: "border-color 0.15s, box-shadow 0.15s",
                      marginBottom: 10,
                    }}
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating || !prompt.trim() || !businessName.trim()}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      border: "none",
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: isRegenerating ? "not-allowed" : "pointer",
                      opacity: (isRegenerating || !prompt.trim() || !businessName.trim()) ? 0.5 : 1,
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 7,
                      transition: "opacity 0.15s, filter 0.15s",
                    }}
                  >
                    {isRegenerating ? (
                      <>
                        <div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        Regenerating…
                      </>
                    ) : (
                      <>🔄 Regenerate Website</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Site URL */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Site URL
                  </p>
                  <div
                    style={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "#a1a1aa",
                      fontFamily: "monospace",
                    }}
                  >
                    autopilotai.dev/r/{username}
                  </div>
                </div>

                {/* Publish status */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Visibility
                  </p>
                  <div
                    style={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: 8,
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#fff" }}>
                        {isPublished ? "Published" : "Draft"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#52525b" }}>
                        {isPublished ? "Visible to everyone" : "Only visible to you"}
                      </p>
                    </div>
                    <button
                      onClick={handlePublishToggle}
                      disabled={isPublishing}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 6,
                        border: "none",
                        background: isPublished ? "#3f3f46" : "#059669",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>

                {/* Custom domain link */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Custom Domain
                  </p>
                  <a
                    href="/dashboard/domains"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: 8,
                      padding: "12px 14px",
                      textDecoration: "none",
                      color: "#a1a1aa",
                      fontSize: 13,
                      transition: "border-color 0.15s",
                    }}
                  >
                    <span>{data.custom_domain || "Connect a domain →"}</span>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {/* Plan */}
                <div
                  style={{
                    background: canPublish ? "rgba(5,150,105,0.06)" : "rgba(245,158,11,0.06)",
                    border: `1px solid ${canPublish ? "rgba(5,150,105,0.15)" : "rgba(245,158,11,0.15)"}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: canPublish ? "#4ade80" : "#fbbf24" }}>
                    {userPlan ? userPlan.charAt(0).toUpperCase() + userPlan.slice(1) : "Free"} Plan
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>
                    {canPublish
                      ? "You can publish and use custom domains."
                      : "Upgrade to Starter ($10/mo) to publish your site."}
                  </p>
                  {!canPublish && (
                    <a
                      href="/upgrade"
                      style={{
                        display: "inline-block",
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#f59e0b",
                        textDecoration: "none",
                      }}
                    >
                      Upgrade now →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PREVIEW */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#09090b" }}>
          <iframe
            ref={iframeRef}
            title={`${businessName || username} — editor`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>

      {/* ── TOAST ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            animation: "slideDown 0.25s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            background:
              toast.type === "success" ? "#052e16" :
              toast.type === "error" ? "#1c0a0a" : "#0c1a2e",
            border: `1px solid ${
              toast.type === "success" ? "#166534" :
              toast.type === "error" ? "#7f1d1d" : "#1e3a5f"
            }`,
            color:
              toast.type === "success" ? "#4ade80" :
              toast.type === "error" ? "#f87171" : "#60a5fa",
            whiteSpace: "nowrap",
          }}
        >
          {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"} {toast.text}
        </div>
      )}
    </div>
  );
}