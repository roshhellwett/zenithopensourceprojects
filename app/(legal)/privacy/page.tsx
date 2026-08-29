import type { Metadata } from "next";
import { TrafficLights } from "@/components/TrafficLights";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy – Zenith Open Source Projects",
  description:
    "How Zenith handles your data: no tracking cookies, no personal data collection, no user accounts. Full transparency.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  const lastUpdated = "July 2, 2026";

  return (
    <article className="space-y-8">
      {/* Terminal window header */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
          <TrafficLights />
          <span className="text-xs text-dark-text-muted font-mono ml-2">
            privacy_policy.md
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <p className="text-xs text-dark-text-faint font-mono mb-2">
              Last updated: {lastUpdated}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-dark-text mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-dark-text-muted leading-relaxed max-w-[700px]">
              Zenith Open Source Projects (&quot;Zenith&quot;, &quot;we&quot;,
              &quot;us&quot;) is committed to transparency. This policy explains
              what data we collect (almost none), how we use it, and your
              rights.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">01</span>
              Information We Collect
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-dark-text mb-1">
                  We do NOT collect:
                </h3>
                <ul className="space-y-1 text-sm text-dark-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-teal mt-0.5">✓</span>
                    Personal information (no sign-ups, no accounts)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-teal mt-0.5">✓</span>
                    Email addresses, names, or contact details
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-teal mt-0.5">✓</span>
                    Payment or financial information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-teal mt-0.5">✓</span>
                    Location data, device identifiers, or IP addresses
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-teal mt-0.5">✓</span>
                    Tracking cookies or advertising pixels
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-dark-text mb-1">
                  What we DO use:
                </h3>
                <ul className="space-y-1 text-sm text-dark-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-dark-text-faint mt-0.5">◦</span>
                    <span>
                      <strong className="text-dark-text">
                        Vercel Speed Insights
                      </strong>{" "}
                      — Anonymous, aggregated performance metrics (page load
                      times, web vitals). No personally identifiable information
                      is collected. See{" "}
                      <a
                        href="https://vercel.com/docs/speed-insights/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
                      >
                        Vercel&apos;s privacy policy
                      </a>
                      .
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-dark-text-faint mt-0.5">◦</span>
                    <span>
                      <strong className="text-dark-text">
                        Browser localStorage
                      </strong>{" "}
                      — Stores your preferences (sound toggle, consent
                      dismissal) locally on your device. This data never leaves
                      your browser.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">02</span>
              AI Chat Feature
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                The Zenith AI assistant uses the{" "}
                <strong className="text-dark-text">Groq API</strong> (GPT-OSS / Qwen
                models) to generate responses. Here&apos;s how it works:
              </p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  Conversations exist only in your browser&apos;s memory (React
                  state). They are never saved to any database.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  Messages are sent to the Groq API through our server-side
                  endpoint for processing. We do not log or store these
                  messages.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  Closing or refreshing the page permanently erases all chat
                  history.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  Rate limiting (20 requests/minute per IP) is enforced
                  server-side using in-memory counters that reset automatically.
                  IP addresses are not stored persistently.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">03</span>
              Third-Party Services
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>We link to or integrate with:</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">GitHub</strong> — For
                  source code hosting (governed by GitHub&apos;s privacy policy)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">Vercel</strong> — For
                  hosting and Speed Insights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">Groq</strong> — For AI chat
                  processing (governed by Groq&apos;s privacy policy)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">Google Fonts</strong> — For
                  typography (IBM Plex Sans, Source Code Pro)
                </li>
              </ul>
              <p className="text-xs text-dark-text-faint mt-2">
                Each third-party service has its own privacy policy. We
                encourage you to review them.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">04</span>
              Children&apos;s Privacy
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              Zenith does not knowingly collect any personal data from anyone,
              including children under 13 years of age. Since we do not collect
              personal data at all, no special provisions are required under
              COPPA (Children&apos;s Online Privacy Protection Act) or similar
              regulations.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">05</span>
              Data Retention
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              We do not store user data on our servers. Browser localStorage
              data persists until you clear your browser data. AI chat
              conversations are erased when you close or refresh the page.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">06</span>
              Your Rights
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              Since we don&apos;t collect personal data, traditional data
              subject rights (access, deletion, portability) are not applicable.
              You can clear all locally stored preferences by clearing your
              browser&apos;s localStorage for this site at any time.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">07</span>
              Applicable Law
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              This project is developed in India. To the extent applicable, this
              privacy policy is designed to comply with the Information
              Technology Act, 2000 (India) and the Digital Personal Data
              Protection Act, 2023 (India). For users in the European Union, we
              note that we do not process personal data as defined under GDPR.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">08</span>
              Changes to This Policy
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              We may update this privacy policy from time to time. Changes will
              be reflected on this page with an updated &quot;Last updated&quot;
              date. Since this is an open source project, all changes are
              publicly tracked in our{" "}
              <a
                href="https://github.com/roshhellwett/zenithopensourceprojects/commits/main"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
              >
                Git history
              </a>
              .
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-dark-border-subtle pt-6 space-y-2">
            <h2 className="text-lg font-bold text-dark-text">Contact</h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              If you have questions about this privacy policy, contact the
              maintainer:
            </p>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 font-mono text-sm text-dark-text-muted">
              <p>
                <span className="text-dark-text-faint">Name:</span>{" "}
                <span className="text-dark-text">Roshan Kr Singh</span>
              </p>
              <p>
                <span className="text-dark-text-faint">Email:</span>{" "}
                <a
                  href="mailto:zenithprojects@icloud.com"
                  className="text-amber-button hover:text-saffron-deep"
                >
                  zenithprojects@icloud.com
                </a>
              </p>
              <p>
                <span className="text-dark-text-faint">GitHub:</span>{" "}
                <a
                  href="https://github.com/roshhellwett"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-button hover:text-saffron-deep"
                >
                  @roshhellwett
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
