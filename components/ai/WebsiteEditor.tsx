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
  regen_count?: number;
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

const REGEN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 3,
  pro: 5,
};

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("autopilot_token") ||
    sessionStorage.getItem("autopilot_token")
  );
}

function buildEditorScript() {
  return `
<script>
(function() {
  var _selected = null;
  var _toolbar = null;
  var _overlay = null;

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
    ['H1','H2','H3','P'].forEach(function(s){
      var b=mkBtn(s,function(){ applyTag(s); }); t.appendChild(b);
    });
    t.appendChild(sep());
    ['Bold','Italic'].forEach(function(cmd){
      var b=mkBtn(cmd==='Bold'?'<b>B</b>':'<i>I</i>',function(){ document.execCommand(cmd.toLowerCase(),false,null); });
      b.innerHTML=cmd==='Bold'?'<b>B</b>':'<i>I</i>'; t.appendChild(b);
    });
    t.appendChild(sep());
    t.appendChild(mkBtn('↩',function(){ document.execCommand('undo',false,null); }));
    var done=document.createElement('button');
    done.textContent='✓ Done';
    done.style.cssText='background:#059669;border:1px solid #059669;color:#fff;border-radius:6px;padding:4px 12px;cursor:pointer;font-size:12px;font-weight:600';
    done.onclick=deselect;
    t.appendChild(done);
    document.body.appendChild(t);
    return t;
  }

  function mkBtn(label,fn){
    var b=document.createElement('button');
    b.innerHTML=label;
    b.style.cssText='background:#27272a;border:1px solid #3f3f46;color:#a1a1aa;border-radius:6px;padding:4px 9px;cursor:pointer;font-size:12px;transition:all .15s';
    b.onmouseenter=function(){ b.style.background='#3f3f46'; b.style.color='#fff'; };
    b.onmouseleave=function(){ b.style.background='#27272a'; b.style.color='#a1a1aa'; };
    b.onclick=fn; return b;
  }

  function sep(){
    var d=document.createElement('div');
    d.style.cssText='width:1px;height:20px;background:#3f3f46;margin:0 2px';
    return d;
  }

  function getOverlay(){
    if (_overlay) return _overlay;
    _overlay=document.createElement('div');
    _overlay.id='__ap_overlay';
    _overlay.style.cssText='position:fixed;pointer-events:none;z-index:99990;border:2px solid #059669;border-radius:4px;box-shadow:0 0 0 3px rgba(5,150,105,0.15);display:none';
    document.body.appendChild(_overlay);
    return _overlay;
  }

  function positionOverlay(el){
    var r=el.getBoundingClientRect(), o=getOverlay();
    o.style.display='block';
    o.style.top=(r.top-3)+'px'; o.style.left=(r.left-3)+'px';
    o.style.width=(r.width+6)+'px'; o.style.height=(r.height+6)+'px';
  }

  function hideOverlay(){ if(_overlay) _overlay.style.display='none'; }

  var EDITABLE='h1,h2,h3,h4,h5,h6,p,li,span,a,button,label,td,th,blockquote,figcaption,strong,em';

  function isEditable(el){
    if (!el||el.id==='__ap_toolbar'||el.id==='__ap_overlay') return false;
    if (el.closest&&el.closest('#__ap_toolbar')) return false;
    if (['IMG','INPUT','TEXTAREA','SELECT'].indexOf(el.tagName)>-1) return false;
    return el.matches&&el.matches(EDITABLE);
  }

  function select(el){
    if (_selected===el) return;
    deselect();
    _selected=el;
    el.contentEditable='true';
    el.style.outline='none';
    positionOverlay(el);
    if (!_toolbar) _toolbar=createToolbar();
    _toolbar.style.display='flex';
    el.focus();
    window.parent.postMessage({type:'AP_EDITING'},'*');
  }

  function deselect(){
    if (!_selected) return;
    _selected.contentEditable='false';
    hideOverlay();
    if (_toolbar) _toolbar.style.display='none';
    window.parent.postMessage({type:'AP_HTML_CHANGE',html:document.documentElement.outerHTML},'*');
    _selected=null;
  }

  function applyTag(tag){
    if (!_selected) return;
    var newEl=document.createElement(tag==='P'?'p':tag.toLowerCase());
    newEl.innerHTML=_selected.innerHTML;
    newEl.className=_selected.className;
    _selected.replaceWith(newEl);
    select(newEl);
  }

  // ── IMAGE EDITOR WITH FILE UPLOAD ──────────────────────────────────────
  function showImageEditor(img){
    var origW=img.offsetWidth||img.naturalWidth||0;
    var origH=img.offsetHeight||img.naturalHeight||0;

    var box=document.createElement('div');
    box.id='__ap_imgbox';
    box.style.cssText='position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,sans-serif;backdrop-filter:blur(4px)';

    var card=document.createElement('div');
    card.style.cssText='background:#18181b;border:1px solid #3f3f46;border-radius:16px;padding:28px;width:480px;max-width:92vw;max-height:90vh;overflow-y:auto';

    function el(tag,css,html){
      var e=document.createElement(tag);
      if(css) e.style.cssText=css;
      if(html) e.innerHTML=html;
      return e;
    }

    card.appendChild(el('p','margin:0 0 4px;font-size:18px;font-weight:700;color:#fff','Change Image'));
    card.appendChild(el('p','margin:0 0 20px;font-size:13px;color:#71717a','Upload from your device or paste a URL. Image fits the original size.'));

    // Hidden file input
    var fileInput=el('input'); fileInput.type='file'; fileInput.accept='image/*'; fileInput.style.display='none';
    card.appendChild(fileInput);

    // Upload zone
    var zone=el('div','border:2px dashed #3f3f46;border-radius:10px;padding:24px;text-align:center;cursor:pointer;margin-bottom:16px;transition:border-color .2s,background .2s',
      '<div style="font-size:28px;margin-bottom:8px">📁</div><p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#e4e4e7">Click to upload or drag & drop</p><p style="margin:0;font-size:12px;color:#71717a">JPG, PNG, WebP, GIF — from your device or phone</p>');
    zone.onmouseenter=function(){ zone.style.borderColor='#059669'; zone.style.background='rgba(5,150,105,0.05)'; };
    zone.onmouseleave=function(){ zone.style.borderColor='#3f3f46'; zone.style.background=''; };
    zone.onclick=function(){ fileInput.click(); };
    zone.ondragover=function(e){ e.preventDefault(); zone.style.borderColor='#059669'; zone.style.background='rgba(5,150,105,0.08)'; };
    zone.ondragleave=function(){ zone.style.borderColor='#3f3f46'; zone.style.background=''; };
    zone.ondrop=function(e){
      e.preventDefault(); zone.style.borderColor='#3f3f46'; zone.style.background='';
      var f=e.dataTransfer.files[0];
      if(f&&f.type.startsWith('image/')) handleFile(f);
    };
    card.appendChild(zone);

    // Divider
    var divRow=el('div','display:flex;align-items:center;gap:10px;margin-bottom:16px');
    divRow.appendChild(el('div','flex:1;height:1px;background:#27272a'));
    divRow.appendChild(el('span','font-size:12px;color:#52525b;white-space:nowrap','or paste URL'));
    divRow.appendChild(el('div','flex:1;height:1px;background:#27272a'));
    card.appendChild(divRow);

    // URL input
    var inp=el('input','width:100%;box-sizing:border-box;background:#09090b;border:1px solid #3f3f46;border-radius:8px;padding:10px 14px;color:#fff;font-size:14px;outline:none;margin-bottom:14px;font-family:inherit');
    inp.type='text'; inp.placeholder='https://images.unsplash.com/...';
    inp.value=(img.src&&!img.src.startsWith('data:'))?img.src:'';
    card.appendChild(inp);

    // Preview
    var previewWrap=el('div','width:100%;height:160px;border-radius:8px;margin-bottom:16px;background:#09090b;border:1px solid #27272a;overflow:hidden;display:none;align-items:center;justify-content:center');
    var preview=el('img','max-width:100%;max-height:160px;object-fit:contain;display:block;margin:auto');
    previewWrap.appendChild(preview);
    card.appendChild(previewWrap);

    var statusLbl=el('p','margin:-10px 0 14px;font-size:11px;color:#4ade80;display:none');
    card.appendChild(statusLbl);

    var pendingDataUrl=null;

    function showPreview(src,label){
      preview.src=src; previewWrap.style.display='flex';
      if(label){ statusLbl.textContent=label; statusLbl.style.display='block'; }
      else statusLbl.style.display='none';
    }

    function handleFile(f){
      var reader=new FileReader();
      reader.onload=function(ev){
        pendingDataUrl=ev.target.result;
        inp.value=''; inp.placeholder=f.name;
        showPreview(pendingDataUrl,'✓ '+f.name+' ('+Math.round(f.size/1024)+' KB)');
        zone.innerHTML='<div style="font-size:24px;margin-bottom:6px">✅</div><p style="margin:0;font-size:13px;font-weight:600;color:#4ade80">'+f.name+' ready</p>';
      };
      reader.readAsDataURL(f);
    }

    fileInput.onchange=function(){ if(fileInput.files[0]) handleFile(fileInput.files[0]); };
    inp.addEventListener('input',function(){
      pendingDataUrl=null;
      var v=inp.value.trim();
      if(v.startsWith('http')) showPreview(v,'');
      else previewWrap.style.display='none';
    });
    if(img.src&&!img.src.startsWith('data:')) showPreview(img.src,'');

    // Buttons
    var row=el('div','display:flex;gap:10px;justify-content:flex-end');
    var cancel=el('button','background:#27272a;border:1px solid #3f3f46;color:#a1a1aa;border-radius:8px;padding:9px 20px;cursor:pointer;font-size:14px;font-family:inherit','Cancel');
    cancel.onclick=function(){ document.body.removeChild(box); };
    var apply=el('button','background:#059669;border:none;color:#fff;border-radius:8px;padding:9px 20px;cursor:pointer;font-size:14px;font-weight:600;font-family:inherit','Apply Image');
    apply.onclick=function(){
      var src=pendingDataUrl||inp.value.trim();
      if(!src) return;
      img.src=src; img.removeAttribute('srcset');
      if(origW) img.style.width=origW+'px';
      if(origH) img.style.height=origH+'px';
      img.style.objectFit='cover';
      document.body.removeChild(box);
      window.parent.postMessage({type:'AP_HTML_CHANGE',html:document.documentElement.outerHTML},'*');
    };
    row.appendChild(cancel); row.appendChild(apply); card.appendChild(row);
    box.appendChild(card); document.body.appendChild(box);
    setTimeout(function(){ inp.focus(); },50);
  }

  // ── HOVER ─────────────────────────────────────────────────────────────────
  document.addEventListener('mouseover',function(e){
    if(_selected) return;
    if(e.target.tagName==='IMG'){
      e.target.style.cursor='pointer';
      e.target.style.outline='2px dashed #0ea5e9';
      e.target.style.outlineOffset='2px';
    } else if(isEditable(e.target)){
      e.target.style.cursor='text';
      e.target.style.outline='2px dashed #3f3f46';
      e.target.style.outlineOffset='2px';
    }
  });

  document.addEventListener('mouseout',function(e){
    if(_selected&&_selected===e.target) return;
    e.target.style.outline=''; e.target.style.outlineOffset='';
  });

  // ── CLICK ─────────────────────────────────────────────────────────────────
  document.addEventListener('click',function(e){
    if(e.target.closest&&e.target.closest('#__ap_toolbar')) return;
    if(e.target.closest&&e.target.closest('#__ap_imgbox')) return;
    if(e.target.tagName==='IMG'){
      e.preventDefault(); e.stopPropagation();
      if(_selected) deselect();
      showImageEditor(e.target); return;
    }
    var el=e.target, found=null;
    for(var i=0;i<5;i++){
      if(!el) break;
      if(isEditable(el)){ found=el; break; }
      el=el.parentElement;
    }
    if(found){ e.preventDefault(); select(found); }
    else if(_selected&&!_selected.contains(e.target)) deselect();
  });

  // ── KEYBOARD ─────────────────────────────────────────────────────────────
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&_selected) deselect();
    if((e.metaKey||e.ctrlKey)&&e.key==='s'){
      e.preventDefault();
      if(_selected) deselect();
      window.parent.postMessage({type:'AP_SAVE'},'*');
    }
  });

  window.addEventListener('scroll',function(){ if(_selected) positionOverlay(_selected); },true);
  window.addEventListener('resize',function(){ if(_selected) positionOverlay(_selected); });

  window.parent.postMessage({type:'AP_EDITOR_READY'},'*');
  console.log('[AutopilotAI Editor] Ready — click any text or image to edit.');
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
  const [regenCount, setRegenCount] = useState(initialData.regen_count || 0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const toastTimer = useRef<any>(null);

  const plan = (userPlan || "free").toLowerCase();
  const regenLimit = REGEN_LIMITS[plan] ?? 1;
  const regenRemaining = Math.max(0, regenLimit - regenCount);
  const canPublish = ["starter", "pro", "business"].includes(plan);

  const showToast = useCallback((type: Toast["type"], text: string) => {
    setToast({ type, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }, []);

  const writeIframe = useCallback((html: string) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const cleaned = html
      .replace(/<script[\s\S]*?AP_EDITOR_READY[\s\S]*?<\/script>/gi, "")
      .replace(/<div id="__ap_toolbar"[\s\S]*?<\/div>/gi, "")
      .replace(/<div id="__ap_overlay"[\s\S]*?<\/div>/gi, "");

    const withEditor = cleaned.includes("</body>")
      ? cleaned.replace("</body>", buildEditorScript() + "\n</body>")
      : cleaned + buildEditorScript();

    const isFullDoc =
      withEditor.trimStart().startsWith("<!DOCTYPE") ||
      withEditor.trimStart().startsWith("<html");

    const fullDoc = isFullDoc
      ? withEditor
      : `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;min-height:100vh;}a{color:inherit;text-decoration:none;}</style></head><body>${withEditor}</body></html>`;

    doc.open();
    doc.write(fullDoc);
    doc.close();
  }, []);

  useEffect(() => {
    writeIframe(currentHtml);
  }, []); // eslint-disable-line

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data || typeof e.data !== "object") return;
      switch (e.data.type) {
        case "AP_EDITOR_READY":
          setEditorReady(true);
          break;
        case "AP_HTML_CHANGE": {
          const clean = (e.data.html as string)
            .replace(/<script[\s\S]*?AP_EDITOR_READY[\s\S]*?<\/script>/gi, "")
            .replace(/<div id="__ap_toolbar"[\s\S]*?<\/div>/gi, "")
            .replace(/<div id="__ap_overlay"[\s\S]*?<\/div>/gi, "");
          setCurrentHtml(clean);
          setHasUnsaved(true);
          break;
        }
        case "AP_SAVE":
          handleSave();
          break;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [currentHtml]); // eslint-disable-line

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/dashboard/websites/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ html: currentHtml, business_name: businessName, prompt }),
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

  const handlePublishToggle = async () => {
    if (!canPublish && !isPublished) {
      showToast("error", "Upgrade to Starter or Pro to publish");
      return;
    }
    try {
      setIsPublishing(true);
      const token = getToken();
      const endpoint = isPublished ? "unpublish" : "publish";
      const res = await fetch(`${API_BASE}/api/dashboard/websites/${username}/${endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      if (!result.ok) throw new Error(result.detail || "Failed");
      setIsPublished(!isPublished);
      showToast("success", isPublished ? "Website unpublished" : `🚀 Live at autopilotai.dev/r/${username}`);
    } catch (err: any) {
      showToast("error", err.message || "Failed");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRegenerate = async () => {
    if (regenRemaining <= 0) {
      showToast("error", `Limit reached (${regenLimit} for ${plan} plan). Upgrade for more.`);
      return;
    }
    if (!prompt.trim() || !businessName.trim()) {
      showToast("error", "Fill in business name and description first");
      return;
    }
    try {
      setIsRegenerating(true);
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/dashboard/websites/${username}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ business_name: businessName.trim(), prompt: prompt.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).detail || "Regeneration failed");
      }
      const result = await res.json();
      if (!result.ok) throw new Error(result.detail || "Failed");

      const freshRes = await fetch(`${API_BASE}/api/dashboard/websites/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (freshRes.ok) {
        const freshResult = await freshRes.json();
        if (freshResult.ok && freshResult.data) {
          const newHtml = freshResult.data.html;
          const newCount = freshResult.data.regen_count ?? regenCount + 1;
          setCurrentHtml(newHtml);
          setData(freshResult.data);
          setRegenCount(newCount);
          setHasUnsaved(false);
          writeIframe(newHtml);
          const left = regenLimit - newCount;
          showToast("success", `Regenerated! (${left} use${left !== 1 ? "s" : ""} left)`);
        }
      }
    } catch (err: any) {
      showToast("error", err.message || "Regeneration failed");
    } finally {
      setIsRegenerating(false);
    }
  };

  const Spinner = ({ color = "#fff", track = "rgba(255,255,255,0.3)" }: { color?: string; track?: string }) => (
    <div style={{ width: 13, height: 13, border: `2px solid ${track}`, borderTopColor: color, borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
  );

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#09090b", fontFamily: "'DM Sans', system-ui, sans-serif", zIndex: 30 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ap-btn:hover:not(:disabled) { filter: brightness(1.15) !important; }
        .ap-tab:hover { background: #27272a !important; }
        .ap-input:focus { border-color: #059669 !important; box-shadow: 0 0 0 3px rgba(5,150,105,0.12) !important; outline: none; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ height: 54, background: "#18181b", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", flexShrink: 0, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <a href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, color: "#71717a", textDecoration: "none", fontSize: 13, fontWeight: 500, padding: "5px 10px", borderRadius: 8, border: "1px solid #27272a", background: "#09090b", flexShrink: 0 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Dashboard
          </a>
          <div style={{ height: 18, width: 1, background: "#27272a" }} />
          <span style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 15, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
            {businessName || username}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: isPublished ? "rgba(5,150,105,0.12)" : "rgba(63,63,70,0.5)", color: isPublished ? "#4ade80" : "#71717a", border: `1px solid ${isPublished ? "rgba(5,150,105,0.3)" : "#3f3f46"}`, flexShrink: 0 }}>
            {isPublished ? "● Live" : "Draft"}
          </span>
          {hasUnsaved && (
            <span style={{ fontSize: 11, color: "#f59e0b", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
              Unsaved
            </span>
          )}
        </div>

        <div style={{ fontSize: 12, color: "#52525b", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, pointerEvents: "none" }}>
          {editorReady
            ? <><span style={{ color: "#4ade80", fontSize: 8 }}>●</span> Click any text or image to edit</>
            : <><Spinner color="#059669" track="#3f3f46" /> Loading editor…</>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {isPublished && (
            <a href={`/r/${username}`} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: "#a1a1aa", textDecoration: "none", padding: "6px 12px", borderRadius: 8, border: "1px solid #27272a", background: "#09090b", fontWeight: 500 }}>
              View Live ↗
            </a>
          )}
          <button className="ap-btn" onClick={handleSave} disabled={isSaving}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "1px solid #3f3f46", background: "#27272a", color: "#e4e4e7", fontSize: 13, fontWeight: 600, cursor: isSaving ? "not-allowed" : "pointer", opacity: isSaving ? 0.6 : 1, fontFamily: "inherit" }}>
            {isSaving ? <Spinner color="#fff" track="#52525b" /> : (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button className="ap-btn" onClick={handlePublishToggle} disabled={isPublishing}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: "none", background: isPublished ? "#27272a" : "#059669", color: "#fff", fontSize: 13, fontWeight: 600, cursor: isPublishing ? "not-allowed" : "pointer", opacity: isPublishing ? 0.6 : 1, fontFamily: "inherit" }}>
            {isPublishing ? <Spinner /> : isPublished ? (
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

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width: 272, background: "#18181b", borderRight: "1px solid #27272a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ display: "flex", borderBottom: "1px solid #27272a", padding: "8px 8px 0", gap: 4 }}>
            {(["edit", "settings"] as const).map((tab) => (
              <button key={tab} className="ap-tab" onClick={() => setActivePanel(tab)}
                style={{ flex: 1, padding: "8px 0", borderRadius: "8px 8px 0 0", border: "none", background: activePanel === tab ? "#09090b" : "transparent", color: activePanel === tab ? "#fff" : "#71717a", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", borderBottom: activePanel === tab ? "2px solid #059669" : "2px solid transparent" }}>
                {tab === "edit" ? "✏️ Edit" : "⚙️ Settings"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            {activePanel === "edit" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                {/* Guide */}
                <div style={{ background: "rgba(5,150,105,0.06)", border: "1px solid rgba(5,150,105,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: "#4ade80", textTransform: "uppercase", letterSpacing: "0.06em" }}>How to edit</p>
                  {[
                    ["🖱️", "Click any text to edit it inline"],
                    ["🖼️", "Click any image to replace it"],
                    ["📁", "Upload from device or paste a URL"],
                    ["⌨️", "Esc to finish · Cmd+S to save"],
                  ].map(([icon, text]) => (
                    <div key={String(text)} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, width: 20, flexShrink: 0 }}>{icon}</span>
                      <span style={{ fontSize: 12, color: "#71717a" }}>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Business name */}
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>Business Name</label>
                  <input className="ap-input" type="text" value={businessName}
                    onChange={(e) => { setBusinessName(e.target.value); setHasUnsaved(true); }}
                    placeholder="Your business name"
                    style={{ width: "100%", background: "#09090b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff", padding: "9px 12px", fontSize: 14, fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" }} />
                </div>

                <div style={{ height: 1, background: "#27272a" }} />

                {/* Regenerate */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Regenerate with AI</label>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: regenRemaining > 0 ? "rgba(5,150,105,0.1)" : "rgba(239,68,68,0.1)", color: regenRemaining > 0 ? "#4ade80" : "#f87171", border: `1px solid ${regenRemaining > 0 ? "rgba(5,150,105,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                      {regenRemaining}/{regenLimit} left
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#52525b", marginBottom: 10, lineHeight: 1.6 }}>
                    AI rebuilds the whole site from scratch with your description.
                  </p>
                  <textarea className="ap-input" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5}
                    placeholder="Describe your business, services, location..."
                    style={{ width: "100%", background: "#09090b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff", padding: "9px 12px", fontSize: 13, fontFamily: "inherit", resize: "none", lineHeight: 1.6, marginBottom: 10, transition: "border-color .15s, box-shadow .15s" }} />
                  <button onClick={handleRegenerate}
                    disabled={isRegenerating || regenRemaining <= 0 || !prompt.trim() || !businessName.trim()}
                    style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: regenRemaining > 0 ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "#27272a", color: regenRemaining > 0 ? "#fff" : "#52525b", fontSize: 13, fontWeight: 600, cursor: (isRegenerating || regenRemaining <= 0) ? "not-allowed" : "pointer", opacity: (isRegenerating || !prompt.trim() || !businessName.trim()) ? 0.5 : 1, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    {isRegenerating ? <><Spinner /> Regenerating…</> : regenRemaining <= 0 ? "🔒 Limit reached — upgrade for more" : "🔄 Regenerate Website"}
                  </button>
                  {regenRemaining <= 0 && (
                    <a href="/upgrade" style={{ display: "block", textAlign: "center", marginTop: 8, fontSize: 12, color: "#f59e0b", textDecoration: "none", fontWeight: 600 }}>
                      Upgrade now →
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Site URL</p>
                  <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#a1a1aa", fontFamily: "monospace" }}>
                    autopilotai.dev/r/{username}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Visibility</p>
                  <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#fff" }}>{isPublished ? "Published" : "Draft"}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#52525b" }}>{isPublished ? "Visible to everyone" : "Only visible to you"}</p>
                    </div>
                    <button onClick={handlePublishToggle} disabled={isPublishing}
                      style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: isPublished ? "#3f3f46" : "#059669", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                      {isPublished ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Custom Domain</p>
                  <a href="/dashboard/domains" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#09090b", border: "1px solid #27272a", borderRadius: 8, padding: "12px 14px", textDecoration: "none", color: "#a1a1aa", fontSize: 13 }}>
                    <span>{data.custom_domain || "Connect a domain →"}</span>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </a>
                </div>
                <div style={{ background: canPublish ? "rgba(5,150,105,0.06)" : "rgba(245,158,11,0.06)", border: `1px solid ${canPublish ? "rgba(5,150,105,0.15)" : "rgba(245,158,11,0.15)"}`, borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: canPublish ? "#4ade80" : "#fbbf24" }}>
                    {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#71717a" }}>
                    {canPublish ? "You can publish and use custom domains." : "Upgrade to Starter ($10/mo) to publish."}
                  </p>
                  {!canPublish && <a href="/upgrade" style={{ display: "inline-block", marginTop: 8, fontSize: 12, fontWeight: 600, color: "#f59e0b", textDecoration: "none" }}>Upgrade now →</a>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* IFRAME PREVIEW */}
        <div style={{ flex: 1, overflow: "hidden", background: "#09090b" }}>
          <iframe ref={iframeRef} title={`${businessName || username} — editor`}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: "inherit", animation: "slideUp 0.25s ease", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", background: toast.type === "success" ? "#052e16" : toast.type === "error" ? "#1c0a0a" : "#0c1a2e", border: `1px solid ${toast.type === "success" ? "#166534" : toast.type === "error" ? "#7f1d1d" : "#1e3a5f"}`, color: toast.type === "success" ? "#4ade80" : toast.type === "error" ? "#f87171" : "#60a5fa", whiteSpace: "nowrap" }}>
          {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"} {toast.text}
        </div>
      )}
    </div>
  );
}