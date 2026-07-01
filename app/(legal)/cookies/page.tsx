import type { Metadata } from "next";
import { TrafficLights } from "@/components/TrafficLights";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Cookie & Storage Policy – Zenith Open Source Projects",
  description:
    "Zenith uses zero tracking cookies. Learn what localStorage items we use and why.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function CookiesPage() {
  const lastUpdated = "July 2, 2026";

  const storageItems = [
    {
      key: "zenith_sound_enabled",
      type: "localStorage",
      purpose: "Stores your retro sound effects preference (on/off).",
      values: '"true" or "false"',
      expires: "Until you clear browser data",
    },
    {
      key: "zenith_cookie_consent",
      type: "localStorage",
      purpose:
        'Records that you dismissed the privacy consent banner so it doesn\'t reappear.',
      values: '"true"',
      expires: "Until you clear browser data",
    },
    {
      key: "zenith_booted",
      type: "sessionStorage",
      purpose:
        "Skips the boot animation on subsequent page views within the same session.",
      values: '"true"',
      expires: "When you close the browser tab",
    },
  ];

  return (
    <article className="space-y-8">
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
          <TrafficLights />
          <span className="text-xs text-dark-text-muted font-mono ml-2">
            cookie_policy.md
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <p className="text-xs text-dark-text-faint font-mono mb-2">
              Last updated: {lastUpdated}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-dark-text mb-3">
              Cookie & Storage Policy
            </h1>
            <p className="text-sm text-dark-text-muted leading-relaxed max-w-[700px]">
              Zenith does not use any tracking cookies, advertising cookies, or
              analytics cookies. This page explains exactly what browser storage
              we do use and why.
            </p>
          </div>

          {/* No cookies banner */}
          <div className="bg-accent-teal/10 border border-accent-teal/30 rounded-lg p-4 flex items-start gap-3">
            <span className="text-accent-teal text-lg mt-0.5 select-none">
              🍪
            </span>
            <div>
              <p className="text-sm font-bold text-dark-text mb-1">
                Zero Tracking Cookies
              </p>
              <p className="text-sm text-dark-text-muted leading-relaxed">
                This website sets <strong className="text-dark-text">zero HTTP cookies</strong>.
                No tracking pixels, no advertising identifiers, no
                fingerprinting. We use browser localStorage and sessionStorage
                for three user-preference items only.
              </p>
            </div>
          </div>

          {/* Storage items table */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">01</span>
              What We Store Locally
            </h2>
            <div className="border border-dark-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-bg border-b border-dark-border select-none">
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">
                      Key
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">
                      Purpose
                    </th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">
                      Expires
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {storageItems.map((item) => (
                    <tr
                      key={item.key}
                      className="border-t border-dark-border-subtle"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-amber-button">
                        {item.key}
                      </td>
                      <td className="py-3 px-4 text-dark-text-muted text-xs">
                        <span className="bg-dark-elevated border border-dark-border-subtle rounded px-1.5 py-0.5 font-mono">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-dark-text-muted">
                        {item.purpose}
                      </td>
                      <td className="py-3 px-4 text-dark-text-faint text-xs">
                        {item.expires}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Third-party cookies */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">02</span>
              Third-Party Cookies
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                <strong className="text-dark-text">
                  Vercel Speed Insights:
                </strong>{" "}
                May use temporary, anonymous session identifiers for performance
                measurement. No persistent tracking cookies are set. See{" "}
                <a
                  href="https://vercel.com/docs/speed-insights/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
                >
                  Vercel&apos;s policy
                </a>
                .
              </p>
              <p>
                <strong className="text-dark-text">Google Fonts:</strong>{" "}
                Fonts are loaded from Google&apos;s CDN, which may log standard
                web server access information. Google states it does not use
                font requests to build user profiles.
              </p>
            </div>
          </section>

          {/* How to clear */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">03</span>
              How to Clear Stored Data
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-3 leading-relaxed">
              <p>You can clear all Zenith-stored data at any time:</p>
              <div className="bg-dark-surface border border-dark-border rounded-lg p-3 font-mono text-xs text-dark-text-muted">
                <p className="text-dark-text-faint mb-1">
                  {"//"} Open browser DevTools (F12) → Console tab:
                </p>
                <p className="text-accent-teal">
                  localStorage.removeItem(&quot;zenith_sound_enabled&quot;);
                </p>
                <p className="text-accent-teal">
                  localStorage.removeItem(&quot;zenith_cookie_consent&quot;);
                </p>
                <p className="text-accent-teal">
                  sessionStorage.removeItem(&quot;zenith_booted&quot;);
                </p>
              </div>
              <p className="text-xs text-dark-text-faint">
                Alternatively, use your browser&apos;s &quot;Clear site
                data&quot; feature in Settings → Privacy.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-dark-border-subtle pt-6">
            <p className="text-sm text-dark-text-muted leading-relaxed">
              Questions about our cookie and storage practices? Contact{" "}
              <a
                href="mailto:zenithprojects@icloud.com"
                className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
              >
                zenithprojects@icloud.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
