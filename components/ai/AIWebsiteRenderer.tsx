"use client";

import React from "react";
import type { AIStructure } from "./aiStructure";

/* ======================================================
   PROPS
====================================================== */

type Props = {
  username: string;
  structure: AIStructure;
  content: any;
  editMode: boolean;
};

/* ======================================================
   UTILS
====================================================== */

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ======================================================
   HERO VARIANTS
====================================================== */

function Hero({
  variant,
  content,
}: {
  variant: AIStructure["hero"]["variant"];
  content: any;
}) {
  switch (variant) {
    case "centered_text":
      return (
        <section className="py-24 text-center">
          <h1 className="text-5xl font-bold mb-4">{content.hero_headline}</h1>
          <p className="text-lg opacity-80 mb-6">{content.hero_subheadline}</p>
          <button className="px-6 py-3 rounded bg-black text-white">
            {content.cta_text}
          </button>
        </section>
      );

    case "image_background":
      return (
        <section className="py-24 text-center bg-gray-900 text-white">
          <h1 className="text-5xl font-bold mb-4">{content.hero_headline}</h1>
          <p className="text-lg opacity-80 mb-6">{content.hero_subheadline}</p>
          <button className="px-6 py-3 rounded bg-white text-black">
            {content.cta_text}
          </button>
        </section>
      );

    case "minimal":
      return (
        <section className="py-32 text-center">
          <h1 className="text-4xl font-bold">{content.hero_headline}</h1>
        </section>
      );

    case "split_image":
    default:
      return (
        <section className="py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              {content.hero_headline}
            </h1>
            <p className="text-lg opacity-80 mb-6">
              {content.hero_subheadline}
            </p>
            <button className="px-6 py-3 rounded bg-black text-white">
              {content.cta_text}
            </button>
          </div>
          <div className="h-64 bg-gray-200 rounded" />
        </section>
      );
  }
}

/* ======================================================
   SECTIONS
====================================================== */

function Trust({ content }: { content: any }) {
  return (
    <section className="py-16">
      <div className="grid grid-cols-3 gap-6 text-center">
        {(content.trust || []).map((t: any, i: number) => (
          <div key={i}>
            <div className="text-2xl font-bold">{t.value}</div>
            <div className="opacity-60">{t.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ content }: { content: any }) {
  return (
    <section className="py-20 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">{content.about_title}</h2>
      <p className="opacity-80">{content.about_text}</p>
    </section>
  );
}

function Services({ content }: { content: any }) {
  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-6">
        {(content.services || []).map((s: any, i: number) => (
          <div key={i} className="p-6 border rounded">
            <div className="font-semibold mb-2">{s.title}</div>
            <div className="opacity-70">{s.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Process({ content }: { content: any }) {
  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-6">
        {(content.process || []).map((p: any, i: number) => (
          <div key={i} className="p-6 border rounded">
            <div className="font-semibold">{p.title}</div>
            <div className="opacity-70">{p.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonial({ content }: { content: any }) {
  return (
    <section className="py-24 text-center bg-gray-100">
      <blockquote className="text-2xl font-semibold">
        “{content.testimonial_quote}”
      </blockquote>
      <div className="mt-4 opacity-60">
        — {content.testimonial_name}
      </div>
    </section>
  );
}

function CTA({ content }: { content: any }) {
  return (
    <section className="py-24 text-center">
      <h2 className="text-3xl font-bold mb-4">{content.cta_headline}</h2>
      <button className="px-6 py-3 rounded bg-black text-white">
        {content.cta_text}
      </button>
    </section>
  );
}

/* ======================================================
   FOOTER
====================================================== */

function Footer({ username }: { username: string }) {
  return (
    <footer className="py-10 text-center opacity-60">
      © {new Date().getFullYear()} {username}
    </footer>
  );
}

/* ======================================================
   MAIN RENDERER
====================================================== */

export default function AIWebsiteRenderer({
  username,
  structure,
  content,
  editMode,
}: Props) {
  return (
    <main
      className={cx(
        "min-h-screen",
        structure.theme.palette === "dark" && "bg-black text-white"
      )}
    >
      {editMode && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded text-sm z-50">
          Edit mode
        </div>
      )}

      <Hero variant={structure.hero.variant} content={content} />

      {structure.sections.map((section, i) => {
        switch (section) {
          case "trust":
            return <Trust key={i} content={content} />;
          case "about":
            return <About key={i} content={content} />;
          case "services":
            return <Services key={i} content={content} />;
          case "process":
            return <Process key={i} content={content} />;
          case "testimonial":
            return <Testimonial key={i} content={content} />;
          case "cta":
            return <CTA key={i} content={content} />;
          default:
            return null;
        }
      })}

      <Footer username={username} />
    </main>
  );
}
