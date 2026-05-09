"use client";

import { useState, useEffect, useRef } from "react";

const DEMO_PROMPT = "I run a plumbing business in Denver, CO. Licensed & insured, 24/7 emergency service.";
const DEMO_STEPS = [
  "Analyzing your business type & location",
  "Writing homepage copy & headlines",
  "Designing layout, colors & sections",
  "Adding SEO, mobile styles & lead forms",
];

export default function HomePage() {
  const [inputVal, setInputVal]       = useState("");
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [openFaq, setOpenFaq]         = useState<number | null>(null);
  const [mounted, setMounted]         = useState(false);

  // Demo animation
  const [demoPhase, setDemoPhase]     = useState<"typing" | "building" | "done">("typing");
  const [demoChar, setDemoChar]       = useState(0);
  const [demoStep, setDemoStep]       = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // typing phase
  useEffect(() => {
    if (!mounted || demoPhase !== "typing") return;
    if (demoChar < DEMO_PROMPT.length) {
      const t = setTimeout(() => setDemoChar(c => c + 1), 36);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setDemoPhase("building"); setDemoStep(0); }, 700);
    return () => clearTimeout(t);
  }, [mounted, demoPhase, demoChar]);

  // building phase
  useEffect(() => {
    if (demoPhase !== "building") return;
    if (demoStep < DEMO_STEPS.length) {
      const t = setTimeout(() => setDemoStep(s => s + 1), 800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDemoPhase("done"), 400);
    return () => clearTimeout(t);
  }, [demoPhase, demoStep]);

  // restart
  useEffect(() => {
    if (demoPhase !== "done") return;
    const t = setTimeout(() => { setDemoPhase("typing"); setDemoChar(0); setDemoStep(0); }, 5000);
    return () => clearTimeout(t);
  }, [demoPhase]);

  const go = () => {
    const dest = inputVal.trim()
      ? `/register?prompt=${encodeURIComponent(inputVal)}`
      : "/register";
    window.location.href = dest;
  };

  return (
    <div className="pg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#060608; --s1:#0f0f12; --s2:#16161c;
          --b1:rgba(255,255,255,0.06); --b2:rgba(255,255,255,0.11);
          --t1:#EDEAF8; --t2:#7E7D90; --t3:#4E4D5C;
          --g:#5EEAD4; --g2:#818CF8; --g3:#F472B6;
          --ff:'Fraunces',Georgia,serif; --fs:'DM Sans',sans-serif;
        }
        html{scroll-behavior:smooth}
        .pg{background:var(--bg);color:var(--t1);font-family:var(--fs);min-height:100vh;overflow-x:hidden}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.7)}}
        @keyframes glowDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.08)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes stepIn{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}

        .au{animation:fadeUp .8s cubic-bezier(.16,1,.3,1) both}
        .au1{animation-delay:.05s}.au2{animation-delay:.17s}.au3{animation-delay:.3s}.au4{animation-delay:.44s}
        .pre{opacity:0}

        /* ── NAV ── */
        .nav{position:fixed;inset:0 0 auto;z-index:400;height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 36px;transition:background .3s,border .3s}
        .nav.on{background:rgba(6,6,8,.93);backdrop-filter:blur(20px);border-bottom:1px solid var(--b1)}
        .logo{font-family:var(--ff);font-size:21px;font-weight:400;color:var(--t1);text-decoration:none;display:flex;align-items:center;gap:7px;letter-spacing:-.02em}
        .logo-dot{width:7px;height:7px;border-radius:50%;background:var(--g);animation:pulse 2.2s ease infinite}
        .nav-links{display:flex;gap:2px;align-items:center}
        .nl{font-size:13px;font-weight:500;color:var(--t2);text-decoration:none;padding:7px 14px;border-radius:8px;transition:color .18s,background .18s}
        .nl:hover{color:var(--t1);background:rgba(255,255,255,.04)}
        .nav-right{display:flex;gap:6px;align-items:center}
        .btn-ghost{font-size:13px;font-weight:500;color:var(--t2);text-decoration:none;padding:8px 14px;border-radius:9px;transition:color .18s}
        .btn-ghost:hover{color:var(--t1)}
        .btn-g{font-size:13px;font-weight:700;background:var(--g);color:#040507;padding:9px 20px;border-radius:9px;text-decoration:none;transition:filter .18s,transform .15s,box-shadow .18s;letter-spacing:-.01em}
        .btn-g:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 5px 18px rgba(94,234,212,.28)}
        .hb{display:none;flex-direction:column;gap:4px;background:none;border:none;cursor:pointer;padding:8px}
        .hb span{width:19px;height:1.5px;background:var(--t2);border-radius:2px}
        .mob{display:none;position:fixed;top:62px;inset:0 0 auto;background:rgba(6,6,8,.97);backdrop-filter:blur(20px);border-bottom:1px solid var(--b1);padding:16px 20px;flex-direction:column;gap:2px;z-index:399}
        .mob.open{display:flex}
        .mob a{font-size:15px;font-weight:500;color:var(--t2);text-decoration:none;padding:12px 14px;border-radius:10px;transition:color .18s}
        .mob a:last-child{background:var(--g);color:#040507;font-weight:700;text-align:center;margin-top:6px}

        /* ── HERO ── */
        .hero{min-height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 24px 60px;position:relative;overflow:hidden}
        .hero-bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:600px;background:radial-gradient(ellipse,rgba(94,234,212,.07) 0%,transparent 60%);pointer-events:none;animation:glowDrift 6s ease-in-out infinite;border-radius:50%}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)}
        .hero-tag{display:inline-flex;align-items:center;gap:7px;background:rgba(94,234,212,.07);border:1px solid rgba(94,234,212,.18);border-radius:100px;padding:5px 13px;font-size:11px;font-weight:700;color:var(--g);letter-spacing:.05em;text-transform:uppercase;margin-bottom:32px}
        .tag-dot{width:5px;height:5px;border-radius:50%;background:var(--g);animation:pulse 2s ease infinite}
        .hero-h{font-family:var(--ff);font-size:clamp(54px,9vw,120px);font-weight:300;line-height:.96;letter-spacing:-.04em;color:var(--t1);margin-bottom:28px;max-width:900px}
        .hero-h em{font-style:italic;color:var(--g)}
        .hero-h .dim{color:var(--t3)}
        .hero-sub{font-size:18px;font-weight:300;color:var(--t2);line-height:1.7;max-width:520px;margin:0 auto 36px}
        .hero-sub b{color:var(--t1);font-weight:500}
        .hero-input-wrap{display:flex;gap:0;background:var(--s1);border:1px solid var(--b2);border-radius:14px;overflow:hidden;width:100%;max-width:600px;margin:0 auto 14px;transition:border-color .25s,box-shadow .25s}
        .hero-input-wrap:focus-within{border-color:rgba(94,234,212,.4);box-shadow:0 0 0 4px rgba(94,234,212,.06)}
        .hero-input{flex:1;background:none;border:none;outline:none;font-family:var(--fs);font-size:15px;color:var(--t1);padding:16px 18px;min-width:0}
        .hero-input::placeholder{color:var(--t3)}
        .hero-submit{background:var(--g);color:#040507;border:none;cursor:pointer;font-family:var(--fs);font-size:13px;font-weight:700;padding:0 22px;white-space:nowrap;transition:filter .18s;flex-shrink:0;letter-spacing:.01em}
        .hero-submit:hover{filter:brightness(1.08)}
        .hero-meta{font-size:12px;color:var(--t3);display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}
        .hero-meta span{display:flex;align-items:center;gap:4px}
        .hm-dot{color:var(--g)}

        /* ── DEMO STRIP ── */
        .demo-strip{padding:80px 24px;background:var(--s1);border-top:1px solid var(--b1);border-bottom:1px solid var(--b1)}
        .demo-strip-inner{max-width:1060px;margin:0 auto}
        .strip-label{text-align:center;margin-bottom:48px}
        .strip-ey{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--g);margin-bottom:14px}
        .strip-h{font-family:var(--ff);font-size:clamp(32px,4vw,50px);font-weight:300;line-height:1.1;letter-spacing:-.03em}
        .strip-h em{font-style:italic;color:var(--g)}
        .demo-cols{display:grid;grid-template-columns:1fr 1.15fr;gap:40px;align-items:start}

        /* Demo left: input + steps */
        .demo-left{display:flex;flex-direction:column;gap:12px}
        .demo-box{background:var(--bg);border:1px solid var(--b2);border-radius:14px;overflow:hidden}
        .demo-bar{background:#08080a;padding:9px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.05)}
        .demo-dots{display:flex;gap:4px}
        .demo-dot{width:8px;height:8px;border-radius:50%}
        .demo-url{flex:1;background:rgba(255,255,255,.04);border-radius:5px;padding:3px 10px;font-size:9.5px;color:var(--t3);font-family:monospace}
        .demo-body{padding:14px 16px 16px}
        .demo-lbl{font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);margin-bottom:7px}
        .demo-typed{font-size:13px;color:var(--t1);line-height:1.6;min-height:44px}
        .demo-cur{display:inline-block;width:2px;height:13px;background:var(--g);margin-left:1px;animation:blink 1s step-end infinite;vertical-align:text-bottom}
        .demo-btn{margin-top:12px;width:100%;padding:10px;border-radius:9px;background:var(--g);color:#040507;font-family:var(--fs);font-size:12px;font-weight:700;border:none;transition:opacity .25s;letter-spacing:.01em}

        .demo-steps-box{background:var(--bg);border:1px solid var(--b2);border-radius:14px;overflow:hidden}
        .demo-steps-hd{padding:11px 16px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:8px}
        .demo-steps-title{font-size:11px;font-weight:600;color:var(--t2)}
        .demo-prog{margin:0 16px;height:2px;background:var(--b1);border-radius:2px;overflow:hidden}
        .demo-prog-fill{height:100%;background:linear-gradient(90deg,var(--g),var(--g2));border-radius:2px;transition:width .75s ease}
        .demo-steps-list{padding:10px 0}
        .ds{display:flex;align-items:center;gap:10px;padding:9px 16px;font-size:12px;color:var(--t3);transition:color .3s}
        .ds.act{color:var(--t1);animation:stepIn .3s ease both}
        .ds.done{color:var(--t2)}
        .ds-ic{width:18px;height:18px;border-radius:50%;border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:9px;flex-shrink:0}
        .ds-ic.done-ic{background:rgba(94,234,212,.12);border-color:rgba(94,234,212,.25);color:var(--g);font-size:10px}
        .ds-ic.act-ic{background:rgba(129,140,248,.12);border-color:rgba(129,140,248,.25)}
        .ds-spin{width:8px;height:8px;border-radius:50%;border:1.5px solid rgba(129,140,248,.25);border-top-color:var(--g2);animation:spin .8s linear infinite}

        /* Demo right: result */
        .demo-result{animation:popIn .45s cubic-bezier(.16,1,.3,1) both}
        .site-frame{background:var(--s1);border:1px solid var(--b2);border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.6)}
        .site-nav{background:#08080a;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.05)}
        .site-logo{font-family:var(--ff);font-size:10px;font-weight:500;color:#00E5FF;letter-spacing:.04em}
        .site-links{display:flex;gap:10px}
        .site-lnk{font-size:7.5px;color:#444;font-weight:500}
        .site-hero{padding:20px 16px 16px;background:linear-gradient(135deg,#071428,#0b1f3a)}
        .site-eye{font-size:7px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#00E5FF;margin-bottom:5px}
        .site-h1{font-family:var(--ff);font-size:13px;line-height:1.25;color:white;margin-bottom:5px;font-style:italic}
        .site-sub{font-size:7.5px;color:rgba(255,255,255,.45);line-height:1.6;margin-bottom:9px}
        .site-cta{display:inline-block;background:#00E5FF;color:#060608;font-size:7.5px;font-weight:700;padding:5px 10px;border-radius:5px;margin-right:5px}
        .site-cta2{display:inline-block;border:1px solid rgba(0,229,255,.3);color:#00E5FF;font-size:7.5px;font-weight:600;padding:5px 9px;border-radius:5px}
        .site-svcs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:10px 14px;background:var(--s2)}
        .svc{background:rgba(255,255,255,.03);border-radius:6px;padding:8px 7px}
        .svc-ic{font-size:12px;margin-bottom:3px}
        .svc-n{font-size:7.5px;font-weight:700;color:var(--t1);margin-bottom:1px}
        .svc-d{font-size:6.5px;color:#444;line-height:1.4}
        .site-footer{padding:7px 14px;background:#07070a;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.05)}
        .site-domain{font-size:7.5px;color:#00E5FF;font-family:monospace}
        .site-live{font-size:7px;color:#4ADE80;display:flex;align-items:center;gap:3px}
        .live-dot{width:4px;height:4px;border-radius:50%;background:#4ADE80;animation:pulse 2s ease infinite}
        .demo-chips{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
        .d-chip{background:var(--s1);border:1px solid var(--b2);border-radius:9px;padding:5px 11px;font-size:11px;font-weight:600;color:var(--t1);display:flex;align-items:center;gap:5px}

        /* placeholder before result */
        .demo-placeholder{background:var(--bg);border:1px solid var(--b1);border-radius:16px;height:320px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:10px}

        /* ── EXAMPLES ── */
        .examples{padding:100px 24px;background:var(--bg)}
        .examples-inner{max-width:1100px;margin:0 auto}
        .sec-ey{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--g);margin-bottom:14px;text-align:center}
        .sec-h{font-family:var(--ff);font-size:clamp(34px,4.5vw,56px);font-weight:300;line-height:1.1;letter-spacing:-.03em;text-align:center;margin-bottom:12px}
        .sec-h em{font-style:italic;color:var(--g)}
        .sec-sub{font-size:15px;font-weight:300;color:var(--t2);text-align:center;line-height:1.7;max-width:480px;margin:0 auto 52px}
        .ex-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .ex-card{background:var(--s1);border:1px solid var(--b1);border-radius:18px;overflow:hidden;transition:border-color .2s,transform .2s}
        .ex-card:hover{border-color:var(--b2);transform:translateY(-3px)}
        .ex-browser-bar{background:#08080a;padding:8px 12px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.05)}
        .ex-dots{display:flex;gap:4px}
        .ex-dot{width:7px;height:7px;border-radius:50%}
        .ex-url{flex:1;background:rgba(255,255,255,.04);border-radius:4px;padding:3px 9px;font-size:9px;color:var(--t3);font-family:monospace}
        .ex-body{padding:16px}
        .ex-tag{font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
        .ex-title{font-family:var(--ff);font-size:14px;font-style:italic;line-height:1.3;margin-bottom:7px;color:var(--t1)}
        .ex-desc{font-size:10px;color:var(--t3);line-height:1.6;margin-bottom:11px}
        .ex-cta{display:inline-block;font-size:9px;font-weight:700;padding:5px 11px;border-radius:5px;color:white}
        .ex-foot{padding:10px 16px;border-top:1px solid var(--b1);display:flex;align-items:center;justify-content:space-between}
        .ex-domain{font-size:9px;color:var(--t3);font-family:monospace}
        .ex-time{font-size:9px;color:var(--t3)}

        /* ── HOW ── */
        .how{padding:100px 24px;background:var(--s1);border-top:1px solid var(--b1)}
        .how-inner{max-width:1060px;margin:0 auto}
        .how-hd{text-align:center;margin-bottom:64px}
        .how-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}
        .how-step{background:var(--bg);padding:44px 36px;position:relative;overflow:hidden;transition:background .2s}
        .how-step:first-child{border-radius:18px 0 0 18px}
        .how-step:last-child{border-radius:0 18px 18px 0}
        .how-step:hover{background:var(--s2)}
        .how-n{font-family:var(--ff);font-size:88px;font-weight:300;position:absolute;top:-8px;right:14px;opacity:.05;line-height:1;user-select:none;pointer-events:none}
        .how-ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:24px;position:relative;z-index:1}
        .how-title{font-family:var(--ff);font-size:20px;font-weight:400;font-style:italic;letter-spacing:-.02em;margin-bottom:10px;position:relative;z-index:1}
        .how-body{font-size:13px;font-weight:300;color:var(--t2);line-height:1.75;position:relative;z-index:1}
        .how-body b{color:var(--t1);font-weight:500}

        /* ── PRICING ── */
        .pricing{padding:100px 24px;background:var(--bg);border-top:1px solid var(--b1)}
        .pricing-inner{max-width:780px;margin:0 auto}
        .pricing-hd{text-align:center;margin-bottom:52px}
        .pricing-note{font-size:14px;font-weight:300;color:var(--t2);margin-top:10px}
        .pricing-cards{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .pc{background:var(--s1);border:1px solid var(--b1);border-radius:22px;padding:38px 32px;position:relative}
        .pc-hot{border-color:rgba(94,234,212,.28);background:var(--s2);box-shadow:0 0 60px rgba(94,234,212,.06)}
        .pc-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--g);color:#040507;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:3px 14px;border-radius:100px;white-space:nowrap}
        .pc-tier{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);margin-bottom:16px}
        .pc-price{font-family:var(--ff);font-size:56px;font-weight:300;line-height:1;font-style:italic;letter-spacing:-.03em;margin-bottom:4px}
        .pc-cadence{font-size:12px;color:var(--t3);margin-bottom:24px}
        .pc-feats{display:flex;flex-direction:column;gap:8px}
        .pf{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:300}
        .pf-on{color:var(--t1)}.pf-off{color:var(--t3)}
        .pf-y{width:17px;height:17px;border-radius:50%;background:rgba(94,234,212,.12);color:var(--g);font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .pf-n{width:17px;height:17px;border-radius:50%;background:var(--s1);color:var(--t3);font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .pc-cta{display:block;margin-top:28px;padding:13px;border-radius:11px;text-align:center;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:.02em;border:1px solid;transition:all .18s;font-family:var(--fs);cursor:pointer}
        .pc-cta-out{border-color:var(--b2);color:var(--t2)}.pc-cta-out:hover{color:var(--t1);background:var(--s2)}
        .pc-cta-fill{background:var(--g);color:#040507;border-color:var(--g)}.pc-cta-fill:hover{filter:brightness(1.08);box-shadow:0 5px 18px rgba(94,234,212,.3)}
        .pc-guarantee{text-align:center;margin-top:24px;font-size:12px;color:var(--t3)}
        .pc-guarantee b{color:var(--t2)}

        /* ── BENTO FEATURES ── */
        .feats{padding:100px 24px;background:var(--s1);border-top:1px solid var(--b1)}
        .feats-inner{max-width:1060px;margin:0 auto}
        .feats-hd{text-align:center;margin-bottom:52px}
        .bento{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:auto;gap:12px}
        .b-card{background:var(--bg);border:1px solid var(--b1);border-radius:18px;padding:32px;position:relative;overflow:hidden;transition:border-color .2s,transform .2s}
        .b-card:hover{border-color:var(--b2);transform:translateY(-2px)}
        .b-card::before{content:'';position:absolute;inset:0;border-radius:18px;background:radial-gradient(circle at 80% 10%,var(--tint,transparent),transparent 60%);opacity:0;transition:opacity .3s}
        .b-card:hover::before{opacity:1}
        .b-wide{grid-column:span 7}
        .b-med{grid-column:span 5}
        .b-third{grid-column:span 4}
        .b-ic{width:44px;height:44px;border-radius:12px;border:1px solid var(--b2);display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:20px;position:relative;z-index:1}
        .b-tag{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;display:block;position:relative;z-index:1}
        .b-title{font-family:var(--ff);font-size:22px;font-weight:400;font-style:italic;letter-spacing:-.02em;margin-bottom:8px;color:var(--t1);position:relative;z-index:1}
        .b-body{font-size:13px;font-weight:300;color:var(--t2);line-height:1.65;position:relative;z-index:1}
        .b-example{margin-top:14px;background:rgba(255,255,255,.03);border:1px solid var(--b1);border-radius:10px;padding:10px 12px;position:relative;z-index:1}
        .b-ex-lbl{font-size:8.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;margin-bottom:5px;opacity:.6}
        .b-ex-txt{font-size:11px;color:var(--t2);line-height:1.55;font-style:italic}

        /* ── FAQ ── */
        .faq{padding:100px 24px;background:var(--bg);border-top:1px solid var(--b1)}
        .faq-inner{max-width:620px;margin:0 auto}
        .faq-hd{text-align:center;margin-bottom:52px}
        .faq-item{border-bottom:1px solid var(--b1)}
        .faq-q{width:100%;background:none;border:none;padding:20px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;text-align:left;font-size:15px;font-weight:500;color:var(--t1);font-family:var(--fs);gap:18px;letter-spacing:-.01em}
        .faq-icon{font-size:20px;color:var(--t3);transition:transform .28s;flex-shrink:0}
        .faq-icon.open{transform:rotate(45deg);color:var(--g)}
        .faq-a{overflow:hidden;max-height:0;opacity:0;transition:max-height .32s ease,opacity .28s,padding .28s;font-size:14px;font-weight:300;color:var(--t2);line-height:1.8}
        .faq-a.open{max-height:300px;opacity:1;padding-bottom:20px}

        /* ── FINAL CTA ── */
        .cta{padding:140px 24px;background:var(--s1);position:relative;overflow:hidden;border-top:1px solid var(--b1)}
        .cta-glow{position:absolute;bottom:-30%;left:50%;transform:translateX(-50%);width:800px;height:500px;background:radial-gradient(ellipse,rgba(94,234,212,.09) 0%,transparent 65%);pointer-events:none;border-radius:50%;animation:glowDrift 6s ease-in-out infinite}
        .cta-inner{max-width:580px;margin:0 auto;text-align:center;position:relative;z-index:1}
        .cta-h{font-family:var(--ff);font-size:clamp(40px,7vw,80px);font-weight:300;line-height:1;letter-spacing:-.04em;margin-bottom:20px}
        .cta-h em{font-style:italic;color:var(--g)}
        .cta-sub{font-size:17px;font-weight:300;color:var(--t2);line-height:1.7;margin-bottom:40px}
        .cta-btn{display:inline-block;background:var(--g);color:#040507;text-decoration:none;font-family:var(--fs);font-size:16px;font-weight:700;padding:17px 44px;border-radius:13px;transition:filter .18s,transform .15s,box-shadow .18s;letter-spacing:-.01em;margin-bottom:18px}
        .cta-btn:hover{filter:brightness(1.08);transform:translateY(-2px);box-shadow:0 8px 28px rgba(94,234,212,.32)}
        .cta-meta{display:flex;justify-content:center;gap:18px;flex-wrap:wrap;font-size:12px;color:var(--t3)}
        .cta-meta span::before{content:'✓ ';color:var(--g)}

        /* ── FOOTER ── */
        .footer{background:#030305;border-top:1px solid var(--b1);padding:48px 36px 36px}
        .footer-inner{max-width:1060px;margin:0 auto}
        .footer-top{display:grid;grid-template-columns:1fr auto;gap:48px;margin-bottom:40px;padding-bottom:36px;border-bottom:1px solid var(--b1);align-items:start}
        .footer-brand{max-width:260px}
        .footer-logo{font-family:var(--ff);font-size:20px;color:var(--t2);text-decoration:none;display:flex;align-items:center;gap:6px;margin-bottom:10px;font-style:italic}
        .footer-tagline{font-size:13px;color:var(--t3);line-height:1.6}
        .footer-cols{display:flex;gap:52px}
        .footer-col{display:flex;flex-direction:column;gap:9px}
        .fc-title{font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);margin-bottom:4px}
        .footer-a{font-size:13px;color:var(--t3);text-decoration:none;transition:color .18s;font-weight:300}
        .footer-a:hover{color:var(--t2)}
        .footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
        .footer-copy{font-size:12px;color:var(--t3)}

        /* ── RESPONSIVE ── */
        @media(max-width:860px){
          .nav{padding:0 18px}
          .nav-links{display:none}.btn-ghost{display:none}
          .hb{display:flex}
          .hero{padding:90px 20px 52px}
          .demo-cols{grid-template-columns:1fr;gap:20px}
          .ex-grid{grid-template-columns:1fr;gap:14px}
          .how-steps{grid-template-columns:1fr}
          .how-step:first-child{border-radius:18px 18px 0 0}
          .how-step:last-child{border-radius:0 0 18px 18px}
          .pricing-cards{grid-template-columns:1fr}
          .bento{grid-template-columns:1fr}
          .b-wide,.b-med,.b-third{grid-column:span 1}
          .footer-top{grid-template-columns:1fr;gap:32px}
          .footer-cols{gap:32px;flex-wrap:wrap}
        }
        @media(max-width:560px){
          .hero-input-wrap{flex-direction:column;border-radius:14px}
          .hero-submit{padding:14px;border-radius:0 0 13px 13px;width:100%}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? "on" : ""}`}>
        <a href="/" className="logo"><div className="logo-dot"/>AutopilotAI</a>
        <div className="nav-links">
          <a href="#how" className="nl">How it works</a>
          <a href="#pricing" className="nl">Pricing</a>
          <a href="#faq" className="nl">FAQ</a>
        </div>
        <div className="nav-right">
          <a href="/login" className="btn-ghost">Sign in</a>
          <a href="/register" className="btn-g">Start free →</a>
          <button className="hb" onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </nav>
      <div className={`mob ${mobileOpen ? "open" : ""}`}>
        <a href="#how" onClick={() => setMobileOpen(false)}>How it works</a>
        <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
        <a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a>
        <a href="/login" onClick={() => setMobileOpen(false)}>Sign in</a>
        <a href="/register" onClick={() => setMobileOpen(false)}>Start building free →</a>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg"/><div className="hero-grid"/>

        <div className={mounted ? "au au1" : "pre"}>
          <div className="hero-tag"><div className="tag-dot"/>AI Website Builder for Local Business</div>
        </div>

        <div className={mounted ? "au au2" : "pre"}>
          <h1 className="hero-h">
            Your business.<br/>
            <em>Online today.</em><br/>
          </h1>
        </div>

        <div className={mounted ? "au au3" : "pre"}>
          <p className="hero-sub">
            Describe what you do. AutopilotAI writes your copy, designs your site, and publishes it with your own domain. <b>No code. No designer. No agency.</b>
          </p>
        </div>

        <div className={mounted ? "au au4" : "pre"} style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div className="hero-input-wrap">
            <input
              ref={inputRef}
              className="hero-input"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && go()}
              placeholder="Describe your business — e.g. I run a plumbing company in Denver…"
            />
            <button className="hero-submit" onClick={go}>Build mine free →</button>
          </div>
          <div className="hero-meta">
            <span><span className="hm-dot">✓</span>Free to build</span>
            <span><span className="hm-dot">✓</span>No credit card needed</span>
            <span><span className="hm-dot">✓</span>Live in 60 seconds</span>
          </div>
        </div>
      </section>

      {/* ── DEMO STRIP ── */}
      <section className="demo-strip">
        <div className="demo-strip-inner">
          <div className="strip-label">
            <div className="strip-ey">Watch it happen</div>
            <h2 className="strip-h">Two sentences in.<br/><em>Full website out.</em></h2>
          </div>
          <div className="demo-cols">

            {/* Left */}
            <div className="demo-left">
              <div className="demo-box">
                <div className="demo-bar">
                  <div className="demo-dots">
                    {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} className="demo-dot" style={{background:c}}/>)}
                  </div>
                  <div className="demo-url">autopilotai.dev/generate</div>
                </div>
                <div className="demo-body">
                  <div className="demo-lbl">Describe your business</div>
                  <div className="demo-typed">
                    {demoPhase === "typing"
                      ? <>{DEMO_PROMPT.slice(0, demoChar)}{demoChar < DEMO_PROMPT.length && <span className="demo-cur"/>}</>
                      : DEMO_PROMPT
                    }
                  </div>
                  <button className="demo-btn" style={{opacity: demoPhase === "typing" && demoChar < DEMO_PROMPT.length ? 0.25 : 1}}>
                    {demoPhase === "building" ? "Building your website…" : demoPhase === "done" ? "✓ Website ready" : "Generate my website →"}
                  </button>
                </div>
              </div>

              {demoPhase !== "typing" && (
                <div className="demo-steps-box" style={{animation:"fadeUp .35s ease both"}}>
                  <div className="demo-steps-hd">
                    <div style={{width:6,height:6,borderRadius:"50%",background:demoPhase==="done"?"#4ADE80":var_g2,animation:"pulse 2s ease infinite"}}/>
                    <div className="demo-steps-title">
                      {demoPhase === "done" ? "Build complete" : `Building… (${demoStep}/${DEMO_STEPS.length})`}
                    </div>
                  </div>
                  <div style={{padding:"6px 16px 0"}}>
                    <div className="demo-prog">
                      <div className="demo-prog-fill" style={{width:`${demoPhase==="done"?100:(demoStep/DEMO_STEPS.length)*100}%`}}/>
                    </div>
                  </div>
                  <div className="demo-steps-list">
                    {DEMO_STEPS.map((s,i) => {
                      const done = i < demoStep;
                      const act  = i === demoStep && demoPhase === "building";
                      return (
                        <div key={i} className={`ds ${done?"done":""} ${act?"act":""}`}>
                          <div className={`ds-ic ${done?"done-ic":""} ${act?"act-ic":""}`}>
                            {done ? "✓" : act ? <div className="ds-spin"/> : <span style={{fontSize:8,color:"var(--t3)"}}>{i+1}</span>}
                          </div>
                          <span style={{color:done||act?"var(--t1)":"var(--t3)"}}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {demoPhase === "done" && (
                <div className="demo-chips" style={{animation:"fadeUp .4s .15s ease both"}}>
                  <div className="d-chip"><span style={{color:"#4ADE80",fontSize:8}}>●</span>Live</div>
                  <div className="d-chip"><span style={{color:"var(--g)"}}>✓</span>SEO indexed</div>
                  <div className="d-chip"><span style={{color:"var(--g2)"}}>✓</span>Mobile ready</div>
                  <div className="d-chip"><span style={{color:"var(--g3)"}}>✓</span>Lead forms active</div>
                </div>
              )}
            </div>

            {/* Right */}
            <div>
              {demoPhase === "done" ? (
                <div className="demo-result">
                  <div className="site-frame">
                    <div className="site-nav">
                      <div className="site-logo">🔧 DENVER PLUMBING PRO</div>
                      <div className="site-links">{["Services","Reviews","Contact"].map(l=><span key={l} className="site-lnk">{l}</span>)}</div>
                    </div>
                    <div className="site-hero">
                      <div className="site-eye">📍 Denver, CO · Licensed & Insured · BBB Accredited</div>
                      <div className="site-h1">Denver's Most Trusted Plumber — 24/7 Emergency Service, Guaranteed.</div>
                      <div className="site-sub">5-star rated · Serving Denver since 2018 · Same-day response · No surprise fees</div>
                      <div><span className="site-cta">Get a Free Quote</span><span className="site-cta2">Call Now</span></div>
                    </div>
                    <div className="site-svcs">
                      {[{ic:"🚿",n:"Emergency Repairs",d:"Burst pipes, leaks, floods — 24/7"},{ic:"🔥",n:"Water Heater Install",d:"Gas & electric, same-day"},{ic:"🪠",n:"Drain Cleaning",d:"Hydro-jetting, no mess"}].map((s,i)=>(
                        <div key={i} className="svc"><div className="svc-ic">{s.ic}</div><div className="svc-n">{s.n}</div><div className="svc-d">{s.d}</div></div>
                      ))}
                    </div>
                    <div className="site-footer">
                      <div className="site-domain">denverplumbingpro.com</div>
                      <div className="site-live"><div className="live-dot"/>Live · SEO indexed</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="demo-placeholder">
                  {demoPhase === "building" ? (
                    <><div style={{width:36,height:36,borderRadius:"50%",border:"2px solid var(--b2)",borderTop:"2px solid var(--g)",animation:"spin 1s linear infinite"}}/><div style={{fontSize:12,color:"var(--t3)"}}>Generating…</div></>
                  ) : (
                    <><div style={{fontSize:24}}>⬆️</div><div style={{fontSize:12,color:"var(--t3)"}}>Type above to see the result</div></>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXAMPLE OUTPUTS ── */}
      <section className="examples">
        <div className="examples-inner">
          <div className="sec-ey">Real outputs</div>
          <h2 className="sec-h">What AutopilotAI<br/><em>actually builds.</em></h2>
          <p className="sec-sub">Every site gets custom copy written for its industry and city. Not a template — a real website built for that specific business.</p>
          <div className="ex-grid">
            {[
              {domain:"sunriseyogaatx.com",color:"#FF6B9D",bg:"rgba(255,107,157,.12)",tag:"Yoga Studio · Austin, TX",title:"Austin's Premier Yoga Studio — Where Transformation Begins.",desc:"Beginner-friendly. Expert instructors. 20+ weekly classes. Your first class is on us.",cta:"Book Free Class",time:"Built in 58s"},
              {domain:"meyerlawgroup.com",color:"#818CF8",bg:"rgba(129,140,248,.12)",tag:"Law Firm · Chicago, IL",title:"Chicago's Trusted Family Law Attorneys — Fighting for What Matters Most.",desc:"15+ years of experience. Flat-fee consultations. Results you can count on.",cta:"Free Consultation",time:"Built in 2m 04s"},
              {domain:"sweetrootbakery.com",color:"#FF9A3C",bg:"rgba(255,154,60,.12)",tag:"Artisan Bakery · Portland, OR",title:"Portland's Favorite Artisan Bakery — Baked Fresh Every Morning.",desc:"Sourdough, pastries, custom cakes. Order online, pick up same day.",cta:"Order Online",time:"Built in 47s"},
            ].map((ex,i)=>(
              <div key={i} className="ex-card">
                <div className="ex-browser-bar">
                  <div className="ex-dots">{["#ff5f57","#febc2e","#28c840"].map((c,j)=><div key={j} className="ex-dot" style={{background:c}}/>)}</div>
                  <div className="ex-url">{ex.domain}</div>
                </div>
                <div className="ex-body">
                  <div className="ex-tag" style={{color:ex.color}}>{ex.tag}</div>
                  <div className="ex-title">{ex.title}</div>
                  <div className="ex-desc">{ex.desc}</div>
                  <div className="ex-cta" style={{background:ex.color}}>{ex.cta} →</div>
                </div>
                <div className="ex-foot">
                  <div className="ex-domain">{ex.domain}</div>
                  <div className="ex-time">⚡ {ex.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="how">
        <div className="how-inner">
          <div className="how-hd">
            <div className="sec-ey">How it works</div>
            <h2 className="sec-h" style={{marginBottom:10}}>Three steps.<br/><em>Under 60 seconds.</em></h2>
            <p className="sec-sub" style={{marginBottom:0}}>No design experience. No agency call. No 3-day build.</p>
          </div>
          <div className="how-steps">
            {[
              {n:"01",ic:"✍️",bg:"rgba(94,234,212,.08)",title:"Describe your business",body:"Two sentences. Your business type, your city, what sets you apart. That's all AutopilotAI needs — no brief, no questionnaire, no consultation call required."},
              {n:"02",ic:"🤖",bg:"rgba(129,140,248,.08)",title:"AI builds the whole site",body:"AutopilotAI writes your <b>headline, service descriptions, trust signals, and CTAs</b> — all specific to your industry and location. Plus SEO meta tags, lead forms, and mobile layout."},
              {n:"03",ic:"🚀",bg:"rgba(244,114,182,.08)",title:"Edit anything. Go live.",body:"Click any text to change it. Swap sections around. Then hit publish — your site goes live on your own domain. Customers in your city find you on Google <b>the same day</b>."},
            ].map((s,i)=>(
              <div key={i} className="how-step">
                <div className="how-n">{s.n}</div>
                <div className="how-ic" style={{background:s.bg}}>{s.ic}</div>
                <h3 className="how-title">{s.title}</h3>
                <p className="how-body" dangerouslySetInnerHTML={{__html:s.body}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing" id="pricing">
        <div className="pricing-inner">
          <div className="pricing-hd">
            <div className="sec-ey">Pricing</div>
            <h2 className="sec-h" style={{marginBottom:8}}>One plan. <em>No surprises.</em></h2>
            <p className="pricing-note">Build and preview your site completely free. Only pay when you want to go live with your own domain.</p>
          </div>
          <div className="pricing-cards">
            <div className="pc">
              <div className="pc-tier">Free</div>
              <div className="pc-price">$0</div>
              <div className="pc-cadence">Build and explore — no card ever</div>
              <div className="pc-feats">
                {([[true,"Build 1 website"],[true,"Unlimited edits"],[true,"10 AI generations"],[true,"Mobile preview"],[false,"Publish publicly"],[false,"Custom domain"],[false,"AI image generation"],[false,"Email, ad & content tools"]] as [boolean,string][]).map(([y,l],i)=>(
                  <div key={i} className={`pf ${y?"pf-on":"pf-off"}`}><div className={y?"pf-y":"pf-n"}>{y?"✓":"✕"}</div>{l}</div>
                ))}
              </div>
              <a href="/register" className="pc-cta pc-cta-out">Start building free</a>
            </div>
            <div className="pc pc-hot">
              <div className="pc-badge">Most popular</div>
              <div className="pc-tier">Starter</div>
              <div className="pc-price" style={{color:"var(--g)"}}>$10<span style={{fontSize:20,color:"var(--t3)"}}>/ mo</span></div>
              <div className="pc-cadence">14-day free trial · Cancel anytime</div>
              <div className="pc-feats">
                {[
                  "Publish your website publicly",
                  "Custom domain (yourbusiness.com)",
                  "Unlimited AI site generations",
                  "AI image generation — 5 styles",
                  "Email campaign writer",
                  "Ad copy generator",
                  "Blog & content writer",
                  "Analytics + lead capture forms",
                ].map((l,i)=>(
                  <div key={i} className="pf pf-on"><div className="pf-y">✓</div>{l}</div>
                ))}
              </div>
              <a href="/register?plan=starter" className="pc-cta pc-cta-fill">Start 14-day free trial →</a>
            </div>
          </div>
          <div className="pc-guarantee"><b>Not happy?</b> Full refund within 14 days — no questions.</div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section className="feats">
        <div className="feats-inner">
          <div className="feats-hd">
            <div className="sec-ey">What's included</div>
            <h2 className="sec-h" style={{marginBottom:10}}>One subscription.<br/><em>Everything you need.</em></h2>
            <p className="sec-sub" style={{marginBottom:0}}>No add-ons. No plugin shopping. No "upgrade to unlock." It's all here.</p>
          </div>
          <div className="bento">
            {/* Website builder — wide */}
            <div className="b-card b-wide" style={{"--tint":"rgba(94,234,212,.05)"} as any}>
              <div className="b-ic" style={{background:"rgba(94,234,212,.08)"}}>🌐</div>
              <span className="b-tag" style={{color:"var(--g)"}}>Website Builder</span>
              <div className="b-title">AI-built website, live in 60 seconds.</div>
              <div className="b-body">Describe your business. AutopilotAI writes the copy, designs the layout, adds your services, trust badges, contact form, SEO meta tags, and mobile styles — all automatically. Click anything to edit it.</div>
              <div className="b-example">
                <div className="b-ex-lbl" style={{color:"var(--g)"}}>Generated headline example</div>
                <div className="b-ex-txt">"Denver's Most Trusted Plumber — Licensed, Insured, and Available 24/7. Get a Free Quote Today."</div>
              </div>
            </div>
            {/* Domains */}
            <div className="b-card b-med" style={{"--tint":"rgba(129,140,248,.05)"} as any}>
              <div className="b-ic" style={{background:"rgba(129,140,248,.08)"}}>🔗</div>
              <span className="b-tag" style={{color:"var(--g2)"}}>Custom Domain</span>
              <div className="b-title">Your own domain. Not ours.</div>
              <div className="b-body">Publish at yourbusiness.com — not a branded subdomain that signals "I used a cheap tool." Included in every Starter plan. We walk you through setup in minutes.</div>
            </div>
            {/* Email AI */}
            <div className="b-card b-third" style={{"--tint":"rgba(94,234,212,.04)"} as any}>
              <div className="b-ic" style={{background:"rgba(94,234,212,.08)"}}>✉️</div>
              <span className="b-tag" style={{color:"var(--g)"}}>Email AI</span>
              <div className="b-title">Email campaigns in 30 seconds.</div>
              <div className="b-body">Welcome sequences, re-engagement flows, monthly newsletters — written in your voice, ready to send.</div>
            </div>
            {/* Ad Copy */}
            <div className="b-card b-third" style={{"--tint":"rgba(244,114,182,.04)"} as any}>
              <div className="b-ic" style={{background:"rgba(244,114,182,.08)"}}>📣</div>
              <span className="b-tag" style={{color:"var(--g3)"}}>Ad Copy</span>
              <div className="b-title">10 ad headlines. One click.</div>
              <div className="b-body">Describe your offer. Get Facebook headlines, Google descriptions, and Instagram captions — split-test ready, under a minute.</div>
            </div>
            {/* Content */}
            <div className="b-card b-third" style={{"--tint":"rgba(251,146,60,.04)"} as any}>
              <div className="b-ic" style={{background:"rgba(251,146,60,.08)"}}>✏️</div>
              <span className="b-tag" style={{color:"#FB923C"}}>Content Writer</span>
              <div className="b-title">Blog posts that rank.</div>
              <div className="b-body">1,200-word SEO blog posts, service page copy, social captions — all in under 30 seconds, with matching AI images.</div>
            </div>
            {/* AI Images */}
            <div className="b-card b-med" style={{"--tint":"rgba(129,140,248,.04)"} as any}>
              <div className="b-ic" style={{background:"rgba(129,140,248,.08)"}}>🖼️</div>
              <span className="b-tag" style={{color:"var(--g2)"}}>AI Images</span>
              <div className="b-title">Professional ad creatives, generated.</div>
              <div className="b-body">Five visual styles — Clean Corporate, Cinematic, Minimal, Social Thumbnail, Product Showcase. Generate a matching image for every ad, post, or blog in one click. No Canva subscription needed.</div>
            </div>
            {/* Analytics + Forms */}
            <div className="b-card b-wide" style={{"--tint":"rgba(94,234,212,.04)"} as any}>
              <div className="b-ic" style={{background:"rgba(94,234,212,.08)"}}>📊</div>
              <span className="b-tag" style={{color:"var(--g)"}}>Analytics + Lead Capture</span>
              <div className="b-title">Know who visits. Capture every lead.</div>
              <div className="b-body">Every site includes a built-in contact form that sends enquiries to your inbox automatically. Plus visitor analytics — page views, top pages, traffic sources — all without setting up Google Analytics or any third-party tool.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq" id="faq">
        <div className="faq-inner">
          <div className="faq-hd">
            <div className="sec-ey">FAQ</div>
            <h2 className="sec-h" style={{fontSize:"clamp(32px,4vw,48px)",marginBottom:0}}>Questions answered.</h2>
          </div>
          {[
            {q:"Is it actually free? What's the catch?",a:"No catch. Build, edit, and preview your site as many times as you want at zero cost. No credit card. No time limit. You only pay $10/month when you decide to publish with your own domain — and there's a 14-day trial for that too."},
            {q:"Will it look like a template everyone else is using?",a:"No. AutopilotAI writes custom copy for your specific business type and city — the headline, services, trust badges, and CTAs are all generated specifically for you. Every site looks different. It's not a template."},
            {q:"What exactly do I get for $10/month?",a:"Everything: your site published publicly, a custom domain (yourbusiness.com), unlimited AI generations, all 5 image styles, the email campaign writer, ad copy generator, content writer, visitor analytics, and built-in lead capture forms. Nothing is held back or sold separately."},
            {q:"What if I don't like what it generates?",a:"Click any word to edit it directly. Or type a new description and regenerate the entire site in seconds. You have full control. Most people are happy on the first generation — but there's no limit."},
            {q:"Can I cancel anytime?",a:"Yes. Cancel from your dashboard, no questions asked, no cancellation fee. Your site stays live through the end of your billing period. All your content is saved — nothing gets deleted."},
          ].map((f,i)=>(
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q}<span className={`faq-icon ${openFaq===i?"open":""}`}>+</span>
              </button>
              <div className={`faq-a ${openFaq===i?"open":""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta">
        <div className="cta-glow"/>
        <div className="cta-inner">
          <h2 className="cta-h">Your next customer<br/>is searching <em>right now.</em></h2>
          <p className="cta-sub">Give them somewhere to find you. Build your site free — it takes less than a minute.</p>
          <div><a href="/register" className="cta-btn">Build my site free →</a></div>
          <div className="cta-meta">
            <span>Free to build</span>
            <span>No credit card</span>
            <span>$10/mo to publish</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="/" className="footer-logo"><div className="logo-dot"/>AutopilotAI</a>
              <p className="footer-tagline">AI website builder for local businesses. Professional site in 60 seconds. $10/month to go live.</p>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <div className="fc-title">Product</div>
                <a href="#how" className="footer-a">How it works</a>
                <a href="#pricing" className="footer-a">Pricing</a>
                <a href="/features" className="footer-a">Features</a>
                <a href="/register" className="footer-a">Get started free</a>
              </div>
              <div className="footer-col">
                <div className="fc-title">Account</div>
                <a href="/login" className="footer-a">Sign in</a>
                <a href="/register" className="footer-a">Create account</a>
              </div>
              <div className="footer-col">
                <div className="fc-title">Legal</div>
                <a href="/privacy" className="footer-a">Privacy policy</a>
                <a href="/terms" className="footer-a">Terms of service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 AutopilotAI · Built with AutopilotAI</div>
            <div style={{fontSize:12,color:"var(--t3)"}}>For local businesses everywhere.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const var_g2 = "var(--g2)";
