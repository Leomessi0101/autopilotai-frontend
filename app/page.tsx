"use client";

import { useState, useEffect, useRef } from "react";

const BUSINESSES = [
  { type: "Plumber", city: "Denver", domain: "denverplumbingpro", color: "#00E5FF", icon: "🔧", time: "1m 12s" },
  { type: "Yoga Studio", city: "Austin", domain: "sunriseyogaatx", color: "#FF6B9D", icon: "🧘", time: "58s" },
  { type: "Law Firm", city: "Chicago", domain: "meyerlawgroup", color: "#7C6FFF", icon: "⚖️", time: "2m 04s" },
  { type: "Bakery", city: "Portland", domain: "sweetrootbakery", color: "#FF9A3C", icon: "🍞", time: "47s" },
  { type: "Dog Groomer", city: "Nashville", domain: "pawfectgrooming", color: "#4ADE80", icon: "🐾", time: "1m 33s" },
];

const IMAGE_STYLES = [
  { name: "Clean Corporate", desc: "Modern SaaS — crisp, premium.", bg: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", accent: "#00E5FF" },
  { name: "Cinematic", desc: "Moody, dramatic, high-contrast.", bg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", accent: "#E94560" },
  { name: "Minimal Illustration", desc: "Simple shapes, soft composition.", bg: "linear-gradient(135deg,#f0f4f8,#dde6ed,#c8d8e4)", accent: "#6EE7B7" },
  { name: "Social Thumbnail", desc: "Bold framing, attention-grabbing.", bg: "linear-gradient(135deg,#f7971e,#ffd200)", accent: "#ff6b35" },
  { name: "Product Showcase", desc: "Hero lighting, premium scene.", bg: "linear-gradient(135deg,#141414,#1f1f1f,#2a2a2a)", accent: "#c9a84c" },
];

export default function HomePage() {
  const [inputVal, setInputVal] = useState("");
  const [activeBiz, setActiveBiz] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const phrases = [
    "I run a dog grooming salon in Nashville…",
    "I'm a freelance photographer in Miami…",
    "I own a restaurant in San Francisco…",
    "I'm a personal trainer in New York…",
  ];

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const bizInterval = setInterval(() => setActiveBiz(p => (p + 1) % BUSINESSES.length), 2800);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(bizInterval); };
  }, []);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    const speed = isDeleting ? 22 : 48;
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < phrase.length) setTypedText(phrase.slice(0, typedText.length + 1));
        else setTimeout(() => setIsDeleting(true), 2000);
      } else {
        if (typedText.length > 0) setTypedText(phrase.slice(0, typedText.length - 1));
        else { setIsDeleting(false); setPhraseIdx(p => (p + 1) % phrases.length); }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx]);

  const handleBuild = () => { window.location.href = `/upgrade?prompt=${encodeURIComponent(inputVal)}`; };
  const biz = BUSINESSES[activeBiz];
  const style = IMAGE_STYLES[activeStyle];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#060608;--bg2:#0C0C10;--surface:#111116;--surface2:#18181F;
          --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
          --text:#F0EEF8;--text2:#8A8899;--text3:#6B6A7A;
          --accent:#6EE7B7;--accent2:#818CF8;--accent3:#F472B6;
          --display:'Fraunces',Georgia,serif;--body:'DM Sans',sans-serif;
        }
        html{scroll-behavior:smooth}
        .root{background:var(--bg);color:var(--text);font-family:var(--body);min-height:100vh;overflow-x:hidden}
        .root::after{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity:0.5}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes glowPulse{0%,100%{opacity:0.4}50%{opacity:0.8}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes imgSwap{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}
        .fu1{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.05s both}
        .fu2{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.18s both}
        .fu3{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both}
        .fu4{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.42s both}
        .fu5{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.56s both}
        .preinit{opacity:0}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:300;height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;transition:all 0.35s}
        .nav.scrolled{background:rgba(6,6,8,0.88);backdrop-filter:blur(24px);border-bottom:1px solid var(--border)}
        .nav-logo{font-family:var(--display);font-size:22px;font-weight:500;letter-spacing:-0.02em;color:var(--text);text-decoration:none;display:flex;align-items:center;gap:8px}
        .logo-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite}
        .nav-right{display:flex;gap:8px;align-items:center}
        .nav-link{font-size:13px;font-weight:500;color:var(--text2);text-decoration:none;padding:8px 16px;border-radius:8px;transition:color 0.2s,background 0.2s}
        .nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05)}
        .nav-cta{font-size:13px;font-weight:600;background:var(--accent);color:#060608;padding:9px 20px;border-radius:10px;text-decoration:none;transition:filter 0.2s,transform 0.15s;letter-spacing:-0.01em}
        .nav-cta:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 16px rgba(110,231,183,0.28)}

        /* HERO */
        .hero{min-height:100vh;padding:110px 40px 80px;position:relative;display:flex;align-items:center;overflow:hidden}
        .hero-glow{position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse,rgba(110,231,183,0.08) 0%,transparent 65%);pointer-events:none;z-index:0;animation:glowPulse 4s ease-in-out infinite}
        .hero-grid-bg{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 100%)}
        .hero-inner{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.05fr 0.95fr;gap:72px;align-items:center;position:relative;z-index:1}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(110,231,183,0.08);border:1px solid rgba(110,231,183,0.2);border-radius:100px;padding:6px 14px;font-size:12px;font-weight:600;color:var(--accent);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:28px}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite}
        .hero-h1{font-family:var(--display);font-size:clamp(52px,6.5vw,96px);font-weight:300;line-height:1.0;letter-spacing:-0.03em;color:var(--text);margin-bottom:28px}
        .hero-h1 em{font-style:italic;color:var(--accent);font-weight:300}
        .hero-h1 .dim{color:#4A4959}
        .hero-sub{font-size:17px;font-weight:300;color:var(--text2);line-height:1.75;max-width:460px;margin-bottom:40px;letter-spacing:-0.01em}
        .hero-sub strong{color:var(--text);font-weight:500}
        .build-wrap{background:var(--surface);border:1px solid var(--border2);border-radius:18px;overflow:hidden;margin-bottom:16px;transition:border-color 0.25s,box-shadow 0.25s}
        .build-wrap:focus-within{border-color:rgba(110,231,183,0.4);box-shadow:0 0 0 4px rgba(110,231,183,0.06),0 0 32px rgba(110,231,183,0.06)}
        .build-input{width:100%;border:none;outline:none;font-family:var(--body);font-size:15px;font-weight:400;color:var(--text);padding:20px 22px 8px;background:transparent;letter-spacing:-0.01em}
        .build-input::placeholder{color:transparent}
        .build-bottom{display:flex;justify-content:space-between;align-items:center;padding:10px 12px 14px 22px}
        .build-placeholder{font-size:13px;color:var(--text3);pointer-events:none;font-style:italic}
        .cursor-blink{animation:blink 1s step-end infinite}
        .build-btn{background:var(--accent);color:#060608;border:none;cursor:pointer;font-family:var(--body);font-size:13px;font-weight:700;letter-spacing:0.02em;padding:12px 22px;border-radius:10px;transition:filter 0.2s,transform 0.15s;white-space:nowrap}
        .build-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 20px rgba(110,231,183,0.35)}
        .hero-trust{display:flex;gap:20px;flex-wrap:wrap;font-size:12px;color:var(--text3);font-weight:400;margin-bottom:36px}
        .hero-trust span{display:flex;align-items:center;gap:5px}
        .trust-check{color:var(--accent);font-size:11px}
        .social-row{display:flex;align-items:center;gap:14px}
        .avs{display:flex}
        .av{width:30px;height:30px;border-radius:50%;border:2px solid var(--bg);font-size:9px;font-weight:700;color:white;display:flex;align-items:center;justify-content:center;margin-left:-8px;flex-shrink:0}
        .av:first-child{margin-left:0}
        .social-text{font-size:13px;font-weight:500;color:var(--text2)}
        .social-stars{color:#F59E0B;font-size:11px}

        /* MOCKUP */
        .mockup-col{position:relative}
        .mockup-frame{background:var(--surface);border:1px solid var(--border2);border-radius:20px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,0.5),0 40px 80px rgba(0,0,0,0.6);position:relative}
        .mbar{background:#0A0A0D;padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.05);position:relative;z-index:1}
        .mdots{display:flex;gap:5px}
        .mdot{width:9px;height:9px;border-radius:50%}
        .murl{flex:1;background:rgba(255,255,255,0.05);border-radius:6px;padding:5px 12px;font-size:10px;color:var(--text3);display:flex;align-items:center;gap:5px;font-family:monospace;overflow:hidden;white-space:nowrap}
        .murl-lock{color:var(--accent);font-size:8px}
        .murl-text{overflow:hidden;text-overflow:ellipsis}
        .mbody{height:320px;position:relative;overflow:hidden}
        .mslide{position:absolute;inset:0;padding:20px;transition:opacity 0.5s ease,transform 0.5s ease}
        .mcard{border-radius:12px;padding:18px;margin-bottom:12px}
        .mcard-eye{font-size:8px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px}
        .mcard-title{font-family:var(--display);font-size:15px;line-height:1.25;margin-bottom:8px}
        .mcard-body{font-size:10px;color:#888;margin-bottom:11px;line-height:1.6}
        .mcard-ctas{display:flex;gap:6px}
        .mcta-main{padding:7px 12px;border-radius:6px;font-size:10px;font-weight:700;color:white}
        .mcta-ghost{padding:7px 12px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid;background:transparent}
        .mfeats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
        .mfeat{background:rgba(255,255,255,0.04);border-radius:8px;padding:9px 6px;text-align:center}
        .mfeat-text{font-size:8px;color:#666;font-weight:600}
        .mtabs{background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);padding:10px 12px;display:flex;gap:5px;flex-wrap:wrap;position:relative;z-index:1}
        .mtab{padding:4px 9px;border-radius:100px;font-size:9px;font-weight:700;cursor:pointer;border:1px solid;background:transparent;font-family:var(--body);transition:all 0.2s}
        .float-chip{position:absolute;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:9px 14px;font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:7px;box-shadow:0 8px 32px rgba(0,0,0,0.4);white-space:nowrap;z-index:10}
        .chip-live{width:6px;height:6px;border-radius:50%;background:#4ADE80;animation:pulse 2s ease infinite}
        .chip-top{top:-16px;left:50%;transform:translateX(-50%)}
        .chip-br{bottom:60px;right:-16px;animation:float 3.5s ease-in-out infinite;will-change:transform}
        .chip-bl{bottom:110px;left:-20px;animation:float 4s ease-in-out 1s infinite;font-size:10px;will-change:transform}

        /* TICKER */
        .ticker{overflow:hidden;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--surface)}
        .ticker-track{display:flex;animation:ticker 30s linear infinite}
        .ticker-item{padding:0 28px;font-size:11px;font-weight:600;color:var(--text3);white-space:nowrap;letter-spacing:0.08em;text-transform:uppercase;display:flex;align-items:center}
        .ticker-item.hi{color:var(--accent)}
        .ticker-sep{margin:0 28px;color:var(--text3);opacity:0.3}

        /* PROBLEM */
        .problem{padding:120px 40px;background:var(--bg);position:relative}
        .problem-inner{max-width:1100px;margin:0 auto}
        .problem-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .section-eyebrow{font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:20px}
        .section-h{font-family:var(--display);font-size:clamp(40px,5vw,66px);font-weight:300;line-height:1.1;letter-spacing:-0.03em;margin-bottom:20px}
        .section-h em{font-style:italic;color:var(--accent)}
        .section-body{font-size:16px;font-weight:300;color:var(--text2);line-height:1.8;max-width:440px}
        .prob-cards{display:flex;flex-direction:column;gap:12px}
        .prob-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px 22px;display:flex;align-items:center;gap:16px;transition:border-color 0.2s,background 0.2s,transform 0.2s,box-shadow 0.2s}
        .prob-card:hover{border-color:var(--border2);background:var(--surface2);transform:translateX(4px);box-shadow:0 8px 32px rgba(0,0,0,0.3)}
        .prob-emoji{font-size:22px;flex-shrink:0}
        .prob-label{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
        .prob-desc{font-size:12px;color:var(--text3);font-weight:300}
        .prob-x{margin-left:auto;flex-shrink:0;width:22px;height:22px;border-radius:50%;background:rgba(239,68,68,0.1);color:#EF4444;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}

        /* PROCESS - FIXED */
        .process{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .process-inner{max-width:1100px;margin:0 auto}
        .process-header{text-align:center;max-width:560px;margin:0 auto 80px}
        .steps{display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;gap:0;align-items:stretch}
        .step{background:var(--surface);padding:48px 36px;position:relative;overflow:visible;transition:background 0.25s}
        .step:first-child{border-radius:20px 0 0 20px}
        .step:last-child{border-radius:0 20px 20px 0}
        .step:hover{background:var(--surface2)}
        .step-num{font-family:var(--display);font-size:100px;font-weight:300;position:absolute;top:-10px;right:16px;opacity:0.06;color:var(--text);user-select:none;line-height:1;pointer-events:none}
        .step-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:28px;border:1px solid var(--border2);position:relative;z-index:1}
        .step-title{font-family:var(--display);font-size:22px;font-weight:400;letter-spacing:-0.02em;margin-bottom:12px;position:relative;z-index:1;font-style:italic}
        .step-body{font-size:14px;font-weight:300;color:var(--text2);line-height:1.75;position:relative;z-index:1}
        .step-arrow{margin-top:28px;font-size:20px;color:var(--accent);position:relative;z-index:1}
        .step-divider{display:flex;align-items:center;justify-content:center;background:var(--surface);padding:0 4px}
        .step-divider-icon{font-size:22px;color:var(--text2)}

        /* TOOLS */
        .tools{padding:120px 40px;background:var(--bg)}
        .tools-inner{max-width:1100px;margin:0 auto}
        .tools-header{margin-bottom:56px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px;flex-wrap:wrap}
        .tools-header-left{max-width:480px}
        .tools-header-right{font-size:14px;font-weight:300;color:var(--text2);max-width:280px;line-height:1.7}
        .tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
        .tool-card{background:var(--surface);padding:40px 32px 52px;position:relative;overflow:hidden;text-decoration:none;display:block;transition:background 0.25s}
        .tool-card:first-child{border-radius:20px 0 0 20px}
        .tool-card:last-child{border-radius:0 20px 20px 0}
        .tool-card:hover{background:var(--surface2)}
        .tool-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,var(--tc,transparent) 0%,transparent 50%);opacity:0;transition:opacity 0.3s}
        .tool-card:hover::before{opacity:1}
        .tool-icon-bg{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:24px;border:1px solid var(--border2);position:relative;z-index:1}
        .tool-tag{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:12px;display:block;position:relative;z-index:1}
        .tool-name{font-family:var(--display);font-size:26px;font-weight:400;font-style:italic;color:var(--text);margin-bottom:10px;letter-spacing:-0.02em;position:relative;z-index:1}
        .tool-desc{font-size:13px;font-weight:300;color:var(--text3);line-height:1.65;position:relative;z-index:1}
        .tool-cta{position:absolute;bottom:28px;right:28px;font-size:18px;color:var(--text3);z-index:1;transition:color 0.2s,transform 0.2s}
        .tool-card:hover .tool-cta{color:var(--text);transform:translate(3px,-3px)}

        /* AI IMAGES - NEW */
        .ai-images{padding:120px 40px;background:var(--bg);border-top:1px solid var(--border);position:relative;overflow:hidden}
        .ai-images-glow{position:absolute;top:-80px;right:-80px;width:600px;height:600px;pointer-events:none;background:radial-gradient(ellipse,rgba(129,140,248,0.07) 0%,transparent 65%);animation:glowPulse 5s ease-in-out infinite;border-radius:50%}
        .ai-images-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1}
        .ai-images-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .ai-powered-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(129,140,248,0.08);border:1px solid rgba(129,140,248,0.22);border-radius:100px;padding:6px 14px 6px 8px;font-size:12px;font-weight:600;color:var(--accent2);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:24px}
        .ai-powered-icon{width:20px;height:20px;border-radius:50%;background:rgba(129,140,248,0.18);display:flex;align-items:center;justify-content:center;font-size:11px}
        .ai-h{font-family:var(--display);font-size:clamp(38px,4.5vw,60px);font-weight:300;line-height:1.1;letter-spacing:-0.03em;margin-bottom:20px}
        .ai-h em{font-style:italic;color:var(--accent2)}
        .ai-p{font-size:16px;font-weight:300;color:var(--text2);line-height:1.8;margin-bottom:32px;max-width:420px}
        .ai-p strong{color:var(--text);font-weight:500}
        .style-list{display:flex;flex-direction:column;gap:8px;margin-bottom:32px}
        .style-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;border:1px solid var(--border);background:var(--surface);cursor:pointer;transition:all 0.2s}
        .style-row.active{border-color:rgba(129,140,248,0.4);background:rgba(129,140,248,0.06)}
        .style-row:hover:not(.active){border-color:var(--border2);background:var(--surface2)}
        .style-dot{width:8px;height:8px;border-radius:50%;background:var(--border2);flex-shrink:0;transition:background 0.2s}
        .style-row.active .style-dot{background:var(--accent2)}
        .style-name{font-size:13px;font-weight:600;color:var(--text);letter-spacing:-0.01em}
        .style-desc{font-size:11px;color:var(--text3);font-weight:300;margin-left:auto}
        .use-chips{display:flex;gap:8px;flex-wrap:wrap}
        .use-chip{display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;border:1px solid var(--border);font-size:11px;font-weight:600;color:var(--text2);background:var(--surface)}
        .use-chip-dot{width:5px;height:5px;border-radius:50%}

        /* AI preview panel */
        .ai-preview-wrap{position:relative}
        .ai-preview-frame{background:var(--surface);border:1px solid var(--border2);border-radius:20px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,0.5),0 40px 80px rgba(0,0,0,0.5)}
        .ai-preview-bar{background:#0A0A0D;padding:11px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .ai-tab{padding:5px 12px;border-radius:7px;font-size:10px;font-weight:600;color:var(--text3);font-family:var(--body)}
        .ai-tab.on{background:var(--surface2);color:var(--text)}
        .ai-preview-body{padding:20px}
        .ai-gen-image{border-radius:12px;overflow:hidden;height:190px;position:relative;margin-bottom:14px;animation:imgSwap 0.45s ease both}
        .ai-gen-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 55%)}
        .ai-gen-label{position:absolute;bottom:12px;left:14px;font-size:10px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:0.03em}
        .ai-gen-badge{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:3px 10px;font-size:8.5px;font-weight:700;color:white;letter-spacing:0.06em;text-transform:uppercase}
        .ai-prompt-bar{background:rgba(255,255,255,0.04);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px}
        .ai-prompt-text{font-size:11px;color:var(--text3);font-style:italic;flex:1}
        .ai-regen{font-size:10px;font-weight:700;color:var(--accent2);background:rgba(129,140,248,0.1);border:1px solid rgba(129,140,248,0.2);border-radius:6px;padding:4px 10px;cursor:pointer;font-family:var(--body);transition:background 0.2s;white-space:nowrap}
        .ai-regen:hover{background:rgba(129,140,248,0.2)}
        .ai-float-chip{position:absolute;top:-14px;right:20px;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:8px 14px;font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:7px;box-shadow:0 8px 32px rgba(0,0,0,0.4);white-space:nowrap;z-index:10}

        /* PROOF */
        .proof{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border)}
        .proof-inner{max-width:1100px;margin:0 auto}
        .proof-header{text-align:center;max-width:500px;margin:0 auto 64px}
        .proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .proof-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:32px;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s}
        .proof-card:hover{border-color:var(--border2);transform:translateY(-3px);box-shadow:0 20px 60px rgba(0,0,0,0.5)}
        .proof-earned{display:inline-block;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:20px;color:#060608}
        .proof-quote{font-family:var(--display);font-size:15px;font-style:italic;font-weight:300;color:var(--text);line-height:1.7;margin-bottom:24px;letter-spacing:-0.01em}
        .proof-person{display:flex;align-items:center;gap:10px}
        .proof-av{width:36px;height:36px;border-radius:50%;font-size:11px;font-weight:700;color:#060608;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .proof-name{font-size:13px;font-weight:600;color:var(--text)}
        .proof-role{font-size:11px;color:var(--text3);font-weight:300}

        /* FEATURES */
        .features{padding:120px 40px;background:var(--bg)}
        .features-inner{max-width:1100px;margin:0 auto}
        .features-layout{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center}
        .features-list{margin-top:48px;display:flex;flex-direction:column;gap:0}
        .feat-row{padding:22px 0;border-bottom:1px solid var(--border);display:flex;gap:16px;align-items:flex-start;transition:padding-left 0.2s}
        .feat-row:first-child{border-top:1px solid var(--border)}
        .feat-row:hover{padding-left:6px}
        .feat-icon{width:38px;height:38px;border-radius:10px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .feat-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:3px}
        .feat-body{font-size:13px;font-weight:300;color:var(--text3);line-height:1.65}
        .metrics{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .metric{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:28px 24px;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s}
        .metric:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 16px 48px rgba(0,0,0,0.4)}
        .metric-val{font-family:var(--display);font-size:48px;font-weight:300;line-height:1;margin-bottom:10px;letter-spacing:-0.03em;font-style:italic}
        .metric-desc{font-size:12px;font-weight:300;color:var(--text3);line-height:1.5}

        /* PRICING */
        .pricing{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border)}
        .pricing-inner{max-width:720px;margin:0 auto}
        .pricing-header{text-align:center;margin-bottom:64px}
        .pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .price-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:40px 36px;position:relative}
        .price-card-featured{background:var(--surface2);border-color:rgba(110,231,183,0.3);box-shadow:0 0 0 1px rgba(110,231,183,0.1),0 0 80px rgba(110,231,183,0.1),0 20px 60px rgba(0,0,0,0.4)}
        .price-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#060608;font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 16px;border-radius:100px;white-space:nowrap}
        .price-tier{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text3);margin-bottom:20px}
        .price-amount{font-family:var(--display);font-size:64px;font-weight:300;line-height:1;margin-bottom:6px;font-style:italic;letter-spacing:-0.03em}
        .price-sub{font-size:13px;color:var(--text3);font-weight:300;margin-bottom:32px}
        .price-feats{display:flex;flex-direction:column;gap:10px}
        .pf{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:300}
        .pf-on{color:var(--text)}.pf-off{color:var(--text3)}
        .pfc{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700}
        .pfc-y{background:rgba(110,231,183,0.15);color:var(--accent)}
        .pfc-n{background:var(--surface);color:var(--text3)}
        .price-cta{display:block;margin-top:36px;padding:14px;border-radius:12px;text-align:center;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.02em;border:1px solid;transition:filter 0.2s,transform 0.15s,box-shadow 0.2s,background 0.2s,color 0.2s;font-family:var(--body);cursor:pointer}
        .price-cta-outline{border-color:var(--border2);color:var(--text2);background:transparent}
        .price-cta-outline:hover{background:var(--surface2);color:var(--text)}
        .price-cta-filled{background:var(--accent);color:#060608;border-color:var(--accent)}
        .price-cta-filled:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 20px rgba(110,231,183,0.35)}

        /* FAQ */
        .faq{padding:120px 40px;background:var(--bg)}
        .faq-inner{max-width:640px;margin:0 auto}
        .faq-title{text-align:center;margin-bottom:64px}
        .faq-item{border-bottom:1px solid var(--border)}
        .faq-btn{width:100%;background:none;border:none;padding:22px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;text-align:left;font-size:15px;font-weight:500;color:var(--text);font-family:var(--body);gap:20px;letter-spacing:-0.01em}
        .faq-icon{font-size:20px;color:var(--text3);transition:transform 0.3s;flex-shrink:0;line-height:1}
        .faq-icon.open{transform:rotate(45deg);color:var(--accent)}
        .faq-body{overflow:hidden;max-height:0;opacity:0;transition:max-height 0.35s ease,opacity 0.3s,padding 0.3s;font-size:14px;font-weight:300;color:var(--text2);line-height:1.8}
        .faq-body.open{max-height:320px;opacity:1;padding-bottom:22px}

        /* FINAL */
        .final{padding:140px 40px;background:var(--bg);position:relative;overflow:hidden;border-top:1px solid var(--border)}
        .final-glow{position:absolute;bottom:-200px;left:50%;transform:translateX(-50%);width:900px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(110,231,183,0.1) 0%,transparent 65%);pointer-events:none;animation:glowPulse 5s ease-in-out infinite}
        .final-inner{max-width:640px;margin:0 auto;text-align:center;position:relative;z-index:1}
        .final-h{font-family:var(--display);font-size:clamp(44px,7vw,88px);font-weight:300;line-height:1.0;letter-spacing:-0.03em;color:var(--text);margin-bottom:24px}
        .final-h em{font-style:italic;color:var(--accent)}
        .final-sub{font-size:17px;font-weight:300;color:var(--text2);line-height:1.75;margin-bottom:48px}
        .final-box{background:var(--surface);border:1px solid var(--border2);border-radius:16px;overflow:hidden;margin-bottom:16px;transition:border-color 0.25s,box-shadow 0.25s;max-width:480px;margin-left:auto;margin-right:auto}
        .final-box:focus-within{border-color:rgba(110,231,183,0.4);box-shadow:0 0 32px rgba(110,231,183,0.06)}
        .final-input{width:100%;background:transparent;border:none;outline:none;font-family:var(--body);font-size:14px;color:var(--text);padding:16px 18px 8px;letter-spacing:-0.01em}
        .final-input::placeholder{color:var(--text3)}
        .final-bottom{padding:8px 8px 10px 18px;display:flex;justify-content:space-between;align-items:center}
        .final-hint{font-size:12px;color:var(--text3);font-style:italic}
        .final-btn{background:var(--accent);color:#060608;border:none;cursor:pointer;font-family:var(--body);font-size:12px;font-weight:700;padding:10px 18px;border-radius:8px;transition:filter 0.2s,transform 0.15s;white-space:nowrap}
        .final-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 16px rgba(110,231,183,0.3)}
        .final-trust{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;font-size:12px;color:var(--text3)}
        .final-trust span::before{content:'\\2713 ';color:var(--accent)}

        /* FOOTER */
        .footer{background:#030304;border-top:1px solid var(--border);padding:32px 40px}
        .footer-inner{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
        .footer-logo{font-family:var(--display);font-size:20px;color:var(--text2);text-decoration:none;font-weight:300;font-style:italic}
        .footer-copy{font-size:12px;color:var(--text3);font-weight:300}
        .footer-links{display:flex;gap:20px}
        .footer-link{font-size:12px;color:var(--text3);text-decoration:none;transition:color 0.2s}
        .footer-link:hover{color:var(--text2)}

        /* MOBILE */
        @media(max-width:900px){
          .nav{padding:0 20px}
          .hero{padding:90px 20px 60px}
          .hero-inner{grid-template-columns:1fr;gap:52px}
          .problem{padding:80px 20px}
          .problem-layout{grid-template-columns:1fr;gap:48px}
          .process{padding:80px 20px}
          .steps{grid-template-columns:1fr}
          .step:first-child{border-radius:20px 20px 0 0}
          .step:last-child{border-radius:0 0 20px 20px}
          .step-divider{display:none}
          .tools{padding:80px 20px}
          .tools-header{flex-direction:column}
          .tools-grid{grid-template-columns:1fr}
          .tool-card:first-child{border-radius:20px 20px 0 0}
          .tool-card:last-child{border-radius:0 0 20px 20px}
          .ai-images{padding:80px 20px}
          .ai-images-layout{grid-template-columns:1fr;gap:52px}
          .proof{padding:80px 20px}
          .proof-grid{grid-template-columns:1fr}
          .features{padding:80px 20px}
          .features-layout{grid-template-columns:1fr;gap:52px}
          .pricing{padding:80px 20px}
          .pricing-grid{grid-template-columns:1fr}
          .faq{padding:80px 20px}
          .final{padding:100px 20px}
          .footer{padding:24px 20px}
        }
        @media(max-width:560px){
          .metrics{grid-template-columns:1fr 1fr}
          .nav-link{display:none}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo"><div className="logo-dot" />AutopilotAI</a>
        <div className="nav-right">
          <a href="/login" className="nav-link">Sign in</a>
          <a href="/upgrade" className="nav-cta">Start free →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" /><div className="hero-grid-bg" />
        <div className="hero-inner">
          <div>
            <div className={mounted?"fu1":"preinit"}>
              <div className="hero-eyebrow"><span className="eyebrow-dot" />AI Website Builder</div>
            </div>
            <div className={mounted?"fu2":"preinit"}>
              <h1 className="hero-h1">Get more clients.<br /><em>Not more stress.</em><br /><span className="dim">In under a minute.</span></h1>
            </div>
            <div className={mounted?"fu3":"preinit"}>
              <p className="hero-sub">Tell AutopilotAI about your business. It builds a <strong>professional, conversion-ready website</strong> in seconds — custom copy, smart design, ready to publish. <strong>No code. No designer. $10/mo.</strong></p>
            </div>
            <div className={mounted?"fu4":"preinit"}>
              <div className="build-wrap">
                <input ref={inputRef} className="build-input" value={inputVal} onChange={e=>setInputVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleBuild()} placeholder="type here" />
                <div className="build-bottom">
                  {inputVal===""?(<div className="build-placeholder">{typedText}<span className="cursor-blink">|</span></div>):<div style={{flex:1}}/>}
                  <button className="build-btn" onClick={handleBuild}>Build my site →</button>
                </div>
              </div>
              <div className="hero-trust">
                <span><span className="trust-check">✓</span>No credit card needed</span>
                <span><span className="trust-check">✓</span>No design skills required</span>
                <span><span className="trust-check">✓</span>Cancel anytime</span>
              </div>
              <div className="social-row">
                <div className="avs">
                  {[["LM","#6EE7B7"],["DK","#818CF8"],["RS","#F472B6"],["JP","#FB923C"],["AW","#4ADE80"]].map(([i,c],idx)=>(
                    <div key={idx} className="av" style={{background:c}}>{i}</div>
                  ))}
                </div>
                <div>
                  <div className="social-text">Trusted by 2,800+ local businesses</div>
                  <div className="social-stars">★★★★★ <span style={{color:"var(--text3)",fontSize:11}}>4.9/5</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className={`mockup-col ${mounted?"fu5":"preinit"}`}>
            <div className="float-chip chip-top"><span className="chip-live" />AI generating live</div>
            <div className="mockup-frame">
              <div className="mbar">
                <div className="mdots">{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} className="mdot" style={{background:c}}/>)}</div>
                <div className="murl"><span className="murl-lock">🔒</span><span className="murl-text" key={activeBiz} style={{animation:"slideIn 0.4s ease both"}}>{biz.domain}.com</span></div>
              </div>
              <div className="mbody">
                {BUSINESSES.map((b,i)=>(
                  <div key={i} className="mslide" style={{opacity:activeBiz===i?1:0,transform:activeBiz===i?"none":"scale(0.97)",pointerEvents:activeBiz===i?"auto":"none"}}>
                    <div className="mcard" style={{background:`linear-gradient(135deg,${b.color}14,${b.color}05)`,borderLeft:`3px solid ${b.color}`}}>
                      <div className="mcard-eye" style={{color:b.color}}>{b.icon} {b.type} · {b.city}</div>
                      <div className="mcard-title" style={{color:"var(--text)"}}>The Most Trusted {b.type} in {b.city} — <em style={{color:b.color}}>Guaranteed.</em></div>
                      <div className="mcard-body">Licensed & insured. 5-star rated. Serving {b.city} since 2019.</div>
                      <div className="mcard-ctas">
                        <div className="mcta-main" style={{background:b.color}}>Get Free Quote</div>
                        <div className="mcta-ghost" style={{borderColor:`${b.color}50`,color:b.color}}>See Our Work</div>
                      </div>
                    </div>
                    <div className="mfeats">{["✅ Licensed","⭐ 5-Star","⚡ Same Day"].map((f,fi)=><div key={fi} className="mfeat"><div className="mfeat-text">{f}</div></div>)}</div>
                  </div>
                ))}
              </div>
              <div className="mtabs">
                {BUSINESSES.map((b,i)=>(
                  <button key={i} className="mtab" onClick={()=>setActiveBiz(i)} style={{borderColor:activeBiz===i?b.color:"rgba(255,255,255,0.08)",background:activeBiz===i?`${b.color}18`:"transparent",color:activeBiz===i?b.color:"var(--text3)"}}>
                    {b.icon} {b.type}
                  </button>
                ))}
              </div>
            </div>
            <div className="float-chip chip-br">⚡ Built in {biz.time}</div>
            <div className="float-chip chip-bl">🔒 <span style={{color:"var(--text3)"}}>SEO ready</span></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div style={{overflow:"hidden"}}>
          <div className="ticker-track">
            {["Professional website in 60 seconds","Custom AI-written copy","$10/month to go live","No code required","14-day free trial","SEO-optimized from day one","Mobile perfect always","Cancel anytime","Professional website in 60 seconds","Custom AI-written copy","$10/month to go live","No code required","14-day free trial","SEO-optimized from day one","Mobile perfect always","Cancel anytime"].map((t,i)=>(
              <div key={i} className={`ticker-item ${i%4===0?"hi":""}`}>{t}<span className="ticker-sep">◆</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-layout">
            <div>
              <div className="section-eyebrow">Why it exists</div>
              <h2 className="section-h">Getting a great site<br /><em>shouldn't cost</em><br />a fortune.</h2>
              <p className="section-body">You've wasted hours on drag-and-drop builders that still look amateur. Agency quotes start at $5,000 and take 6 weeks. You just need something that looks great and actually gets you customers.<br /><br />AutopilotAI does the whole thing while you have coffee.</p>
            </div>
            <div className="prob-cards">
              {[{icon:"😩",label:"Squarespace / Wix",desc:"You spend 3 days and still hate the result"},{icon:"💸",label:"Hire a web agency",desc:"$5,000 minimum. 6-week timeline. Revisions cost extra."},{icon:"😅",label:"Learn to code",desc:"Great idea in theory. Not happening in practice."},{icon:"🙈",label:"Do nothing",desc:"Your competitor has a site. Your customers notice."}].map((p,i)=>(
                <div key={i} className="prob-card">
                  <div className="prob-emoji">{p.icon}</div>
                  <div><div className="prob-label">{p.label}</div><div className="prob-desc">{p.desc}</div></div>
                  <div className="prob-x">✕</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="process-inner">
          <div className="process-header">
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-h">Three steps.<br /><em>Zero headaches.</em></h2>
            <p className="section-body" style={{textAlign:"center",maxWidth:400,margin:"16px auto 0"}}>No design experience needed. No waiting around. Just describe your business and go.</p>
          </div>
          <div className="steps">
            {[
              {n:"01",icon:"✍️",bg:"rgba(110,231,183,0.1)",title:"Tell us about your business",body:"60 seconds of typing. Your business type, your city, your vibe. Our AI figures out the rest — no brief, no call, no back-and-forth."},
              {n:"02",icon:"🤖",bg:"rgba(129,140,248,0.1)",title:"AI builds your whole site",body:"Custom copy written for your industry. Conversion-optimized layout. Professional design. All generated in under a minute, tailored to you."},
              {n:"03",icon:"🚀",bg:"rgba(244,114,182,0.1)",title:"Edit, publish, and grow",body:"Click any element to change it. Hit publish. Your site goes live at your own domain. Real customers start finding you the same day."},
            ].map((s,i,arr)=>[
              <div key={i} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-icon" style={{background:s.bg}}>{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
                <div className="step-arrow">→</div>
              </div>,
              i<arr.length-1 && <div key={`div-${i}`} className="step-divider"><span className="step-divider-icon">›</span></div>
            ])}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="tools">
        <div className="tools-inner">
          <div className="tools-header">
            <div className="tools-header-left">
              <div className="section-eyebrow">More than a website</div>
              <h2 className="section-h">Your whole<br /><em>marketing toolkit.</em></h2>
            </div>
            <p className="tools-header-right">Once your site is live, keep customers coming. Every plan includes AI tools for email, ads, and content — all in one place.</p>
          </div>
          <div className="tools-grid">
            {[
              {icon:"✉️",tag:"Email AI",name:"Email Campaigns",desc:"Cold outreach, newsletters, follow-ups — written in your voice, optimized to convert.",color:"#6EE7B7",bg:"rgba(110,231,183,0.1)",href:"/dashboard/email"},
              {icon:"📣",tag:"Ads AI",name:"Ad Copy",desc:"Facebook, Google, Instagram — ready-to-run headlines, hooks, and CTAs in seconds.",color:"#818CF8",bg:"rgba(129,140,248,0.1)",href:"/dashboard/ads"},
              {icon:"✏️",tag:"Content AI",name:"Content Writer",desc:"Blog posts, social captions, product descriptions — plus AI-generated images in 5 pro styles.",color:"#F472B6",bg:"rgba(244,114,182,0.1)",href:"/dashboard/content"},
            ].map((tool,i)=>(
              <a key={i} href={tool.href} className="tool-card" style={{"--tc":`${tool.color}12`} as any}>
                <div className="tool-icon-bg" style={{background:tool.bg}}>{tool.icon}</div>
                <span className="tool-tag" style={{color:tool.color}}>{tool.tag}</span>
                <div className="tool-name">{tool.name}</div>
                <p className="tool-desc">{tool.desc}</p>
                <span className="tool-cta">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AI IMAGE GENERATION - NEW */}
      <section className="ai-images">
        <div className="ai-images-glow" />
        <div className="ai-images-inner">
          <div className="ai-images-layout">

            {/* Left */}
            <div>
              <div className="ai-powered-pill">
                <div className="ai-powered-icon">✦</div>
                Powered by Nano Banana Pro
              </div>
              <h2 className="ai-h">Write the post.<br /><em>Generate the image.</em><br /><span style={{color:"var(--text3)"}}>In one click.</span></h2>
              <p className="ai-p">Every piece of content you create can come with a <strong>matching AI-generated image</strong> — ads, social posts, blog headers, product shots. Five professional styles. No Canva. No Photoshop. No freelancer.</p>
              <div className="style-list">
                {IMAGE_STYLES.map((s,i)=>(
                  <div key={i} className={`style-row ${activeStyle===i?"active":""}`} onClick={()=>setActiveStyle(i)}>
                    <div className="style-dot"/>
                    <span className="style-name">{s.name}</span>
                    <span className="style-desc">{s.desc}</span>
                  </div>
                ))}
              </div>
              <div className="use-chips">
                {[["Facebook Ads","#818CF8"],["Instagram Posts","#F472B6"],["Blog Headers","#6EE7B7"],["Google Ads","#FB923C"],["LinkedIn","#38BDF8"]].map(([label,color],i)=>(
                  <div key={i} className="use-chip"><div className="use-chip-dot" style={{background:color}}/>{label}</div>
                ))}
              </div>
            </div>

            {/* Right — interactive preview */}
            <div className="ai-preview-wrap">
              <div className="ai-float-chip">
                <span style={{color:"var(--accent2)"}}>✦</span> Nano Banana Pro
              </div>
              <div className="ai-preview-frame">
                <div className="ai-preview-bar">
                  {["Content","Emails","Ads"].map((t,i)=>(
                    <div key={i} className={`ai-tab ${i===0?"on":""}`}>{t}</div>
                  ))}
                  <div style={{marginLeft:"auto",fontSize:10,color:"var(--text3)",display:"flex",alignItems:"center",gap:5}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#4ADE80",display:"inline-block"}}/> Generate AI Image
                  </div>
                </div>
                <div className="ai-preview-body">
                  {/* Generated image — changes when style is clicked */}
                  <div className="ai-gen-image" key={activeStyle} style={{background:style.bg}}>
                    {/* Style-specific art */}
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {activeStyle===0&&<div style={{textAlign:"center"}}><div style={{fontSize:30,marginBottom:8}}>🔧</div><div style={{fontSize:12,fontWeight:700,color:"#00E5FF",letterSpacing:"0.06em"}}>DENVER PLUMBING CO.</div><div style={{fontSize:9,color:"rgba(255,255,255,0.45)",marginTop:4}}>Available 24/7 · Licensed & Insured</div></div>}
                      {activeStyle===1&&<div style={{textAlign:"center"}}><div style={{fontSize:10,letterSpacing:"0.2em",color:"#E94560",textTransform:"uppercase",marginBottom:8}}>Instagram Reel</div><div style={{fontSize:18,fontWeight:700,color:"white",fontFamily:"Georgia,serif",fontStyle:"italic"}}>Transform your space.</div><div style={{width:40,height:2,background:"#E94560",margin:"10px auto"}}/></div>}
                      {activeStyle===2&&<div style={{textAlign:"center"}}><div style={{width:52,height:52,borderRadius:"50%",background:"rgba(110,231,183,0.2)",border:"2px solid #6EE7B7",margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div><div style={{fontSize:13,color:"#333",fontWeight:600}}>Minimal Blog Header</div></div>}
                      {activeStyle===3&&<div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",color:"#ff6b35",textTransform:"uppercase"}}>LIMITED OFFER</div><div style={{fontSize:24,fontWeight:900,color:"white",marginTop:6,lineHeight:1.1}}>50% OFF<br/>TODAY ONLY</div></div>}
                      {activeStyle===4&&<div style={{textAlign:"center"}}><div style={{fontSize:30,marginBottom:8}}>📦</div><div style={{fontSize:11,fontWeight:600,color:"#c9a84c",letterSpacing:"0.1em",textTransform:"uppercase"}}>Premium Product</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:4}}>Hero lighting · Studio quality</div></div>}
                    </div>
                    <div className="ai-gen-overlay"/>
                    <div className="ai-gen-label">Generated for your business</div>
                    <div className="ai-gen-badge">{style.name}</div>
                  </div>
                  {/* Prompt bar */}
                  <div className="ai-prompt-bar">
                    <span style={{fontSize:14,flexShrink:0}}>✦</span>
                    <div className="ai-prompt-text">"Professional {style.name.toLowerCase()} image for a local business ad…"</div>
                    <button className="ai-regen">Regenerate</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="proof">
        <div className="proof-inner">
          <div className="proof-header">
            <div className="section-eyebrow">Real results</div>
            <h2 className="section-h">What people<br /><em>actually say.</em></h2>
          </div>
          <div className="proof-grid">
            {[
              {earned:"+$2k/mo",quote:"My phone hasn't stopped ringing since I published. Three new jobs in the first 48 hours — I was shocked.",name:"Lisa M.",role:"Plumbing business, Ohio",initials:"LM",color:"#6EE7B7"},
              {earned:"+$2.5k/mo",quote:"I tried Squarespace for three days and gave up. AutopilotAI gave me a better site in four minutes. Not kidding.",name:"David K.",role:"Marketing consultant, TX",initials:"DK",color:"#818CF8"},
              {earned:"+$4.2k/mo",quote:"Sent the link to a prospect on Monday. Signed the contract on Wednesday. The site paid for itself in one deal.",name:"Rachel S.",role:"Freelance designer, CA",initials:"RS",color:"#F472B6"},
            ].map((t,i)=>(
              <div key={i} className="proof-card">
                <div className="proof-earned" style={{background:t.color}}>{t.earned}</div>
                <p className="proof-quote">"{t.quote}"</p>
                <div className="proof-person">
                  <div className="proof-av" style={{background:t.color}}>{t.initials}</div>
                  <div><div className="proof-name">{t.name}</div><div className="proof-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-inner">
          <div className="features-layout">
            <div>
              <div className="section-eyebrow">Everything included</div>
              <h2 className="section-h">Built in.<br /><em>Nothing extra.</em></h2>
              <p className="section-body" style={{marginTop:16}}>One tool. No plugin shopping. No duct tape. Everything to get clients online is already here.</p>
              <div className="features-list">
                {[
                  {icon:"✏️",title:"Click-to-edit anything",body:"Text, images, colors, layout — all editable with zero code."},
                  {icon:"🖼️",title:"AI image generation",body:"Create ad creatives, blog headers, and social images in 5 pro styles. Powered by Nano Banana Pro."},
                  {icon:"📊",title:"Built-in analytics",body:"Visitor counts, top pages, and leads — all native, no setup."},
                  {icon:"📬",title:"Lead capture forms",body:"Collect enquiries and emails automatically. No plugin needed."},
                  {icon:"🌐",title:"Your own domain",body:"A real domain — not a branded subdomain that loses trust."},
                  {icon:"📱",title:"Perfectly mobile",body:"Every site is 100% responsive from the first generation."},
                ].map((f,i)=>(
                  <div key={i} className="feat-row">
                    <div className="feat-icon">{f.icon}</div>
                    <div><div className="feat-title">{f.title}</div><div className="feat-body">{f.body}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="metrics">
              {[
                {val:"60s",label:"Average time from description to live preview",color:"var(--accent)"},
                {val:"$10",label:"Per month to publish on your own domain",color:"var(--accent2)"},
                {val:"5",label:"AI image styles — cinematic, corporate, minimal and more",color:"var(--accent3)"},
                {val:"4.9★",label:"Average customer satisfaction rating",color:"#FB923C"},
              ].map((m,i)=>(
                <div key={i} className="metric">
                  <div className="metric-val" style={{color:m.color}}>{m.val}</div>
                  <div className="metric-desc">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing">
        <div className="pricing-inner">
          <div className="pricing-header">
            <div className="section-eyebrow">Pricing</div>
            <h2 className="section-h" style={{textAlign:"center"}}>Honest pricing.<br /><em>No gotchas.</em></h2>
            <p className="section-body" style={{textAlign:"center",margin:"16px auto 0",maxWidth:400}}>Build and edit everything free. Only pay when you're ready to go live.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free forever</div>
              <div className="price-amount">$0</div>
              <div className="price-sub">Build and explore — no card needed</div>
              <div className="price-feats">
                {([[true,"Build 1 website"],[true,"Unlimited edits"],[true,"10 AI generations"],[true,"Mobile responsive"],[false,"Custom domain"],[false,"Publish publicly"],[false,"AI image generation"]] as [boolean,string][]).map(([y,l],i)=>(
                  <div key={i} className={`pf ${y?"pf-on":"pf-off"}`}><div className={`pfc ${y?"pfc-y":"pfc-n"}`}>{y?"✓":"✕"}</div>{l}</div>
                ))}
              </div>
              <a href="/upgrade" className="price-cta price-cta-outline">Start building free</a>
            </div>
            <div className="price-card price-card-featured">
              <div className="price-badge">Most popular</div>
              <div className="price-tier">Starter</div>
              <div className="price-amount" style={{color:"var(--accent)"}}>$10<span style={{fontSize:20,color:"var(--text3)"}}>/mo</span></div>
              <div className="price-sub">14-day free trial — cancel anytime</div>
              <div className="price-feats">
                {["Publish your website","Custom domain included","Unlimited AI generations","20 AI images/month (Nano Banana Pro)","5 image styles included","Analytics dashboard","Priority support"].map((l,i)=>(
                  <div key={i} className="pf pf-on"><div className="pfc pfc-y">✓</div>{l}</div>
                ))}
              </div>
              <a href="/upgrade" className="price-cta price-cta-filled">Start 14-day free trial →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="faq-inner">
          <div className="faq-title">
            <div className="section-eyebrow" style={{textAlign:"center"}}>FAQ</div>
            <h2 className="section-h" style={{textAlign:"center",fontSize:"clamp(36px,5vw,56px)"}}>Common questions</h2>
          </div>
          {[
            {q:"Is it really free to start?",a:"Yes — build, edit, and preview your site for free, forever. You only pay $10/month when you're ready to publish with your own domain. No credit card required to start."},
            {q:"Will my site actually look professional?",a:"Yes. Every design is conversion-optimized with custom copy written for your specific industry. Most customers say it looks better than sites they've paid thousands for."},
            {q:"What are the AI images used for?",a:"You can generate images for Facebook ads, Instagram posts, blog headers, Google ad creatives, and more. Choose from 5 professional styles — Clean Corporate, Cinematic, Minimal Illustration, Social Thumbnail, and Product Showcase. All powered by Nano Banana Pro."},
            {q:"Can I edit my site after the AI builds it?",a:"Click any text to edit. Swap images. Add sections. Or just type a new prompt and regenerate entirely. No code, no friction, no waiting."},
            {q:"Do I need a domain name already?",a:"Your $10/month plan includes connecting your own domain. If you don't have one yet, we'll walk you through getting one for under $15/year."},
          ].map((f,i)=>(
            <div key={i} className="faq-item">
              <button className="faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                {f.q}<span className={`faq-icon ${openFaq===i?"open":""}`}>+</span>
              </button>
              <div className={`faq-body ${openFaq===i?"open":""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="final-glow"/>
        <div className="final-inner">
          <h2 className="final-h">Your next client<br />is <em>searching</em><br />right now.</h2>
          <p className="final-sub">On Google. Looking for exactly what you offer. Don't let them land on a competitor's site.</p>
          <div className="final-box">
            <input className="final-input" placeholder="Describe your business..." onKeyDown={e=>e.key==="Enter"&&handleBuild()}/>
            <div className="final-bottom">
              <span className="final-hint">Press enter or click →</span>
              <button className="final-btn" onClick={handleBuild}>Build free →</button>
            </div>
          </div>
          <div className="final-trust"><span>No credit card</span><span>2-minute setup</span><span>Try before you pay</span></div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <a href="/" className="footer-logo">AutopilotAI</a>
          <div className="footer-copy">© 2026 AutopilotAI · Built with AutopilotAI</div>
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy</a>
            <a href="/terms" className="footer-link">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}