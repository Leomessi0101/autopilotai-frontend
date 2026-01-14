"use client";

import React from "react";

/* ======================================================
   TYPES
====================================================== */

type AISection =
  | { type: "features"; variant: "grid_3" }
  | { type: "about"; variant: "image_left" }
  | { type: "testimonials"; variant: "cards" }
  | { type: "cta"; variant: "centered" };

type AIStructure = {
  hero: {
    variant: "split_image" | "centered_text" | "image_background";
    cta_style: "primary" | "secondary";
  };
  sections: AISection[];
  theme: {
    palette: "light" | "dark";
    accent: "indigo" | "orange" | "emerald";
    font: "inter";
  };
  footer: {
    variant: "minimal";
  };
};

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

function Hero({ structure, content }: { structure: AIStructure["hero"]; content: any }) {
  switch (structure.variant) {
    case "centered_text":
      return (
        <section className="py-24 text-center">
          <h1 className="text-5xl font-bold mb-4">{content.hero_headline}</h1>
          <p className="text-lg opacity-80 mb-6">{content.hero_subheadline}</p>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded">
            {content.cta_text}
          </button>
        </section>
      );

    case "image_background":
      return (
        <section className="py-24 text-center bg-gray-900 text-white">
          <h1 className="text-5xl font-bold mb-4">{content.hero_headline}</h1>
          <p className="text-lg opacity-80 mb-6">{content.hero_subheadline}</p>
          <button className="px-6 py-3 bg-indigo-600 rounded">
            {content.cta_text}
          </button>
        </section>
      );

    case "split_image":
    default:
      return (
        <section className="py-24 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">{content.hero_headline}</h1>
            <p className="text-lg opacity-80 mb-6">{content.hero_subheadline}</p>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded">
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

function Features({ content }: { content: any }) {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(content.features || []).map((f: string, i: number) => (
          <div key={i} className="p-6 border rounded">
            {f}
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div className="h-64 bg-gray-200 rounded" />
      <div>
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="opacity-80">
          We help businesses launch fast with modern, AI-generated websites.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 border rounded">
            “Amazing experience.”
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA({ content }: { content: any }) {
  return (
    <section className="py-24 text-center bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">
        Ready to get started?
      </h2>
      <button className="px-6 py-3 bg-indigo-600 text-white rounded">
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

      <Hero structure={structure.hero} content={content} />

      {structure.sections.map((section, i) => {
        switch (section.type) {
          case "features":
            return <Features key={i} content={content} />;
          case "about":
            return <About key={i} />;
          case "testimonials":
            return <Testimonials key={i} />;
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
