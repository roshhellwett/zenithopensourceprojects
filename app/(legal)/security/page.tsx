import type { Metadata } from "next";
import { TrafficLights } from "@/components/TrafficLights";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Security Policy – Zenith Open Source Projects",
  description:
    "Zenith security model, API rate limiting, HTTP security headers, data handling, and vulnerability reporting guidelines.",
  alternates: { canonical: `${SITE_URL}/security` },
};

export default function SecurityPage() {
  const lastUpdated = "July 2, 2026";

  const headers = [
    { name: "Content-Security-Policy", desc: "Restricts script, style, image, and connect sources to prevent XSS." },
    { name: "Strict-Transport-Security", desc: "HSTS enforced with 2-year max-age to guarantee HTTPS." },
    { name: "X-Content-Type-Options: nosniff", desc: "Prevents MIME-type sniffing attacks." },
    { name: "X-Frame-Options: DENY", desc: "Prevents clickjacking and embedding in unauthorized frames." },
    { name: "Referrer-Policy: strict-origin-when-cross-origin", desc: "Protects sensitive URL paths when navigating across origins." },
    { name: "Permissions-Policy", desc: "Explicitly disables camera, microphone, geolocation, and payment APIs." },
  ];

  return (
    <article className="space-y-8">
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
          <TrafficLights />
          <span className="text-xs text-dark-text-muted font-mono ml-2">
            security_policy.md
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <p className="text-xs text-dark-text-faint font-mono mb-2">
              Last updated: {lastUpdated}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-dark-text mb-3">
              Security Policy
            </h1>
            <p className="text-sm text-dark-text-muted leading-relaxed max-w-[700px]">
              We take security seriously, even for a client-side portfolio and open-source registry.
              Here is an overview of our security posture, API protections, and reporting procedures.
            </p>
          </div>

          {/* Section 1: Supported Versions */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">01</span>
              Supported Versions
            </h2>
            <div className="border border-dark-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-bg border-b border-dark-border select-none">
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Version</th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-dark-border-subtle">
                    <td className="py-3 px-4 font-mono text-xs text-dark-text font-bold">Latest (main branch)</td>
                    <td className="py-3 px-4 text-xs">
                      <span className="bg-accent-teal/10 text-accent-teal border border-accent-teal/30 rounded px-2 py-0.5 font-bold">
                        ✅ Supported
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-text-muted text-xs">Active development and security updates</td>
                  </tr>
                  <tr className="border-t border-dark-border-subtle">
                    <td className="py-3 px-4 font-mono text-xs text-dark-text-muted">Older commits / releases</td>
                    <td className="py-3 px-4 text-xs">
                      <span className="bg-accent-salmon/10 text-accent-salmon border border-accent-salmon/30 rounded px-2 py-0.5 font-bold">
                        ❌ Not Supported
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-text-muted text-xs">Please upgrade to the latest commit on main</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Security Model */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">02</span>
              API & Application Security
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-3 leading-relaxed">
              <p>
                Zenith is a static web application augmented with a server-side AI chat endpoint powered by the Groq API.
                To prevent abuse and protect user sessions, we implement several server-side safeguards:
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-accent-teal mt-0.5 font-bold">✓</span>
                  <div>
                    <strong className="text-dark-text">Rate Limiting:</strong> Enforced at 20 requests per minute per IP address on the `/api/ai/chat` route to prevent Denial of Service (DoS) and API quota exhaustion.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-teal mt-0.5 font-bold">✓</span>
                  <div>
                    <strong className="text-dark-text">Input Validation & Sanitization:</strong> All incoming messages are rigorously validated. Individual messages are capped at 2,000 characters, and conversation depth is restricted to 20 messages to prevent token-flooding.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-teal mt-0.5 font-bold">✓</span>
                  <div>
                    <strong className="text-dark-text">Request Timeouts:</strong> All server-to-server outbound calls to the AI provider include an explicit 10-second AbortController timeout to prevent hung sockets.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-teal mt-0.5 font-bold">✓</span>
                  <div>
                    <strong className="text-dark-text">Memory Leak Prevention:</strong> In-memory rate limiting structures automatically evict expired timestamp entries to ensure stable performance on serverless edge runtimes.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: HTTP Headers */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">03</span>
              HTTP Security Headers
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              Every HTTP response served by Zenith includes strict security headers configured via Next.js proxy middleware:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {headers.map((h) => (
                <div key={h.name} className="bg-dark-bg border border-dark-border-subtle rounded-lg p-3 space-y-1">
                  <p className="font-mono text-xs font-bold text-amber-button">{h.name}</p>
                  <p className="text-xs text-dark-text-muted leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Reporting */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">04</span>
              Reporting a Vulnerability
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-3 leading-relaxed">
              <p>
                If you discover a security vulnerability within any of the Zenith Open Source repositories or this website, please report it responsibly:
              </p>
              <div className="bg-accent-salmon/10 border border-accent-salmon/30 rounded-lg p-3 text-xs text-dark-text">
                <strong className="text-accent-salmon font-bold">Please DO NOT open a public GitHub issue!</strong> Public disclosure before a patch is available puts all users and deployments at risk.
              </div>
              <ol className="list-decimal list-inside space-y-1 pt-1">
                <li>Email the maintainer directly at <strong className="text-dark-text">zenithprojects@icloud.com</strong>.</li>
                <li>Include a clear description of the vulnerability and potential impact.</li>
                <li>Provide step-by-step reproduction instructions or proof-of-concept code.</li>
              </ol>
              <p className="text-xs text-dark-text-faint pt-1">
                <strong className="text-dark-text">Response Time:</strong> We aim to acknowledge receipt of vulnerability reports within 48 hours and release a remediation patch within 7 business days for critical issues.
              </p>
            </div>
          </section>

          {/* Section 5: Responsible Disclosure */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">05</span>
              Responsible Disclosure & Recognition
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              We deeply value the work of security researchers and developers who help keep open-source software safe. Anyone who responsibly discloses a valid security vulnerability will be explicitly credited in our repository changelogs and release notes (unless anonymity is preferred).
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-dark-border-subtle pt-6">
            <p className="text-sm text-dark-text-muted leading-relaxed">
              For direct security inquiries or PGP key requests, reach out to{" "}
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
