import type { Metadata } from "next";
import { TrafficLights } from "@/components/TrafficLights";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: "Open Source & Licenses – Zenith Open Source Projects",
  description:
    "All Zenith code is MIT licensed. Learn about our open source philosophy, design attributions, and third-party dependencies.",
  alternates: { canonical: `${SITE_URL}/open-source` },
};

export default function OpenSourcePage() {
  const lastUpdated = "July 2, 2026";

  const dependencies = [
    { name: "Next.js", version: "16.x", license: "MIT", url: "https://nextjs.org" },
    { name: "React", version: "19.x", license: "MIT", url: "https://react.dev" },
    { name: "Tailwind CSS", version: "4.x", license: "MIT", url: "https://tailwindcss.com" },
    { name: "Framer Motion", version: "12.x", license: "MIT", url: "https://www.framer.com/motion/" },
    { name: "Lucide React", version: "Latest", license: "ISC", url: "https://lucide.dev" },
    { name: "Vercel Speed Insights", version: "Latest", license: "Apache-2.0", url: "https://vercel.com" },
  ];

  return (
    <article className="space-y-8">
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-dark-elevated px-4 py-2.5 flex items-center gap-2 border-b border-dark-border">
          <TrafficLights />
          <span className="text-xs text-dark-text-muted font-mono ml-2">
            open_source_licenses.md
          </span>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div>
            <p className="text-xs text-dark-text-faint font-mono mb-2">
              Last updated: {lastUpdated}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-dark-text mb-3">
              Open Source & Licenses
            </h1>
            <p className="text-sm text-dark-text-muted leading-relaxed max-w-[700px]">
              Zenith is built on the principle that software should be open, transparent, and accessible.
              We do not sell code or proprietary software. All projects are publicly available on GitHub.
            </p>
          </div>

          {/* Not Selling Code Banner */}
          <div className="bg-amber-button/10 border border-amber-button/30 rounded-lg p-4 flex items-start gap-3">
            <span className="text-amber-button text-lg mt-0.5 select-none">
              💡
            </span>
            <div>
              <p className="text-sm font-bold text-dark-text mb-1">
                Free & Open Source Software (FOSS)
              </p>
              <p className="text-sm text-dark-text-muted leading-relaxed">
                We do not monetize, lock behind paywalls, or sell our source code to anyone.
                Every repository under the Zenith umbrella is free to inspect, fork, and learn from under the terms of the MIT License.
              </p>
            </div>
          </div>

          {/* Section 1: MIT License */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">01</span>
              The MIT License
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 font-mono text-xs text-dark-text-muted space-y-2 leading-relaxed overflow-x-auto">
              <p className="font-bold text-dark-text">Copyright (c) 2026 Zenith Open Source Projects</p>
              <p>
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the &quot;Software&quot;), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>
              <p>
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>
              <p className="font-bold text-dark-text">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </section>

          {/* Section 2: Design Attribution */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">02</span>
              Design Inspiration & Attribution
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                The visual aesthetic, typography choices, and layout structure of the Zenith website mode draw strong inspiration from{" "}
                <a
                  href="https://posthog.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
                >
                  PostHog&apos;s open-source website design
                </a>
                .
              </p>
              <ul className="space-y-1 mt-2">
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">Purely Aesthetic:</strong> We have used PostHog as a visual reference for crafting clean, developer-friendly UI layouts and color palettes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">No Proprietary Code:</strong> No proprietary code, graphics, logos, or trademarks from PostHog Inc. have been copied or included in this repository.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dark-text-faint mt-0.5">◦</span>
                  <strong className="text-dark-text">No Affiliation:</strong> Zenith is an independent project by Roshan Kr Singh and is not affiliated with, endorsed by, or sponsored by PostHog Inc.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Dependencies */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">03</span>
              Third-Party Dependencies
            </h2>
            <p className="text-sm text-dark-text-muted leading-relaxed">
              We stand on the shoulders of giants. Below are the primary open-source libraries and frameworks that make Zenith possible:
            </p>
            <div className="border border-dark-border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-bg border-b border-dark-border select-none">
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Library</th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Version</th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">License</th>
                    <th className="text-left py-3 px-4 font-bold text-dark-text-muted">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {dependencies.map((dep) => (
                    <tr key={dep.name} className="border-t border-dark-border-subtle">
                      <td className="py-3 px-4 font-bold text-dark-text">{dep.name}</td>
                      <td className="py-3 px-4 font-mono text-xs text-dark-text-muted">{dep.version}</td>
                      <td className="py-3 px-4 text-dark-text-muted text-xs">
                        <span className="bg-dark-elevated border border-dark-border-subtle rounded px-1.5 py-0.5 font-mono">
                          {dep.license}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <a
                          href={dep.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-button hover:text-saffron-deep underline underline-offset-2"
                        >
                          Website →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Contributing */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-dark-text flex items-center gap-2">
              <span className="text-amber-button font-mono text-sm">04</span>
              Contributing
            </h2>
            <div className="bg-dark-bg border border-dark-border-subtle rounded-lg p-4 text-sm text-dark-text-muted space-y-2 leading-relaxed">
              <p>
                We welcome contributions, bug reports, and feature requests across all our open-source projects!
                If you would like to contribute, please visit our GitHub organization or individual repositories:
              </p>
              <p className="pt-1">
                <a
                  href="https://github.com/roshhellwett"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-amber-button hover:bg-saffron-deep text-black px-4 py-2 rounded-md text-xs font-bold transition-all"
                >
                  Explore Repositories on GitHub →
                </a>
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-dark-border-subtle pt-6">
            <p className="text-sm text-dark-text-muted leading-relaxed">
              Questions about licensing or open-source usage? Contact{" "}
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
