import type { Metadata } from "next";
import { TrafficLights } from "@/components/TrafficLights";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service – Zenith Open Source Projects",
  description:
    "Terms of use for the Zenith Open Source Projects website. MIT-licensed, provided as-is, with AI chat disclaimers.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  const lastUpdated = "July 2, 2026";

  return (
    <article className="space-y-8">
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
          <TrafficLights />
          <span className="text-xs text-dark-text-muted font-mono ml-2">
            terms_of_service.md
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <p className="text-xs text-dark-text-faint font-mono mb-2">
              Last updated: {lastUpdated}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-dark-text mb-3">
              Terms of Service
            </h1>
            <p className="text-sm text-dark-text-muted leading-relaxed max-w-[700px]">
              By accessing and using the Zenith Open Source Projects website
              (&quot;Site&quot;), you agree to these terms. If you do not agree,
              please do not use the Site.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">01</span>
              Open Source License
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                The source code for this website and all associated Zenith
                projects is released under the{" "}
                <strong className="text-dark-text">MIT License</strong>. You are
                free to use, copy, modify, merge, publish, distribute,
                sublicense, and/or sell copies of the software, subject to the
                license conditions.
              </p>
              <p>
                The full license text is available in the{" "}
                <a
                  href="https://github.com/roshhellwett/zenithopensourceprojects/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
                >
                  LICENSE
                </a>{" "}
                file.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">02</span>
              Disclaimer of Warranties
            </h2>
            <div className="bg-dark-bg border border-accent-salmon/30 rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p className="font-bold text-dark-text">
                THE SITE AND ALL CONTENT ARE PROVIDED &quot;AS IS&quot; AND
                &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER
                EXPRESS OR IMPLIED.
              </p>
              <p>
                We do not warrant that the Site will be uninterrupted,
                error-free, secure, or free of viruses. We make no warranties
                regarding the accuracy, reliability, or completeness of any
                content.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">03</span>
              AI Chat Disclaimer
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>The AI assistant feature is provided for informational and entertainment purposes only:</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-accent-salmon mt-0.5">⚠</span>
                  AI responses may contain inaccuracies, hallucinations, or
                  outdated information.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-salmon mt-0.5">⚠</span>
                  Responses do not constitute professional, legal, medical, or
                  financial advice.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-salmon mt-0.5">⚠</span>
                  The AI is powered by third-party models (Groq / GPT-OSS / Qwen)
                  and we do not control the model&apos;s output.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-salmon mt-0.5">⚠</span>
                  We are not responsible for any actions taken based on AI
                  responses.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">04</span>
              Intellectual Property
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                <strong className="text-dark-text">Source Code:</strong> All
                source code is MIT-licensed and open source. You are free to
                fork, modify, and redistribute it.
              </p>
              <p>
                <strong className="text-dark-text">Content:</strong> Written
                content, project descriptions, and documentation on this site
                are the intellectual property of Roshan Kr Singh unless
                otherwise noted. They are provided for informational purposes
                alongside the open source projects.
              </p>
              <p>
                <strong className="text-dark-text">Design Attribution:</strong>{" "}
                The UI design of this website draws visual inspiration from{" "}
                <a
                  href="https://posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
                >
                  PostHog
                </a>
                &apos;s website design. This is purely aesthetic inspiration —
                no PostHog code, assets, or trademarks are used. Zenith is not
                affiliated with, endorsed by, or connected to PostHog Inc.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">05</span>
              User Responsibilities
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              When using the Site, you agree to:
            </p>
            <ul className="space-y-1 text-sm text-dark-text-muted">
              <li className="flex items-start gap-2">
                <span className="text-dark-text-faint mt-0.5">◦</span>
                Not attempt to abuse, exploit, or overwhelm the AI chat or any
                other service.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-dark-text-faint mt-0.5">◦</span>
                Not use the Site for any unlawful purpose.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-dark-text-faint mt-0.5">◦</span>
                Comply with the rate limits imposed on the AI chat feature (20
                requests per minute).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-dark-text-faint mt-0.5">◦</span>
                Not misrepresent AI-generated content as professional advice.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">06</span>
              Limitation of Liability
            </h2>
            <div className="bg-dark-bg border border-accent-salmon/30 rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                To the maximum extent permitted by applicable law, Zenith Open
                Source Projects and its maintainers shall not be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including but not limited to loss of profits, data,
                use, or goodwill, arising from your use of or inability to use
                the Site.
              </p>
              <p>
                This limitation applies regardless of the legal theory (contract,
                tort, negligence, strict liability, or otherwise), even if we
                have been advised of the possibility of such damages.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">07</span>
              External Links
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              The Site contains links to external websites (GitHub, LinkedIn,
              Groq, Vercel, etc.) that are not operated by us. We have no
              control over the content and practices of these sites and accept
              no responsibility for them. Following external links is at your
              own risk.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">08</span>
              Governing Law
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              These terms are governed by and construed in accordance with the
              laws of India. Any disputes arising from these terms or the use of
              the Site shall be subject to the exclusive jurisdiction of the
              courts in India.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">09</span>
              Changes to Terms
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              We reserve the right to modify these terms at any time. Changes
              will be posted on this page with an updated date. Continued use of
              the Site after changes constitutes acceptance of the new terms.
              All changes are publicly tracked in our{" "}
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
          <section className="border-t border-dark-border-subtle pt-6">
            <p className="text-sm text-dark-text-muted leading-relaxed">
              Questions about these terms? Contact{" "}
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
