# Security Policy — Zenith Open Source Projects

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (main branch) | ✅ Active |
| Older commits | ❌ Not supported |

## Security Model

Zenith is a **client-side portfolio website** with an optional AI chat feature powered by Groq API. Here's our security posture:

### API Security
- **Rate limiting**: 20 requests/minute per IP on the AI chat endpoint
- **Input validation**: Message length capped at 2,000 characters, conversation depth capped at 20 messages
- **Request timeout**: 10-second abort on Groq API calls
- **Offline fallback**: Demo mode when API key is not configured — no sensitive data exposed

### HTTP Security Headers
All responses include:
- `Content-Security-Policy` — Restricts script/style/connect sources
- `Strict-Transport-Security` — HSTS with 2-year max-age
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` — Prevents clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — Disables camera, microphone, geolocation

### Data Handling
- **No user data is stored** — Chat conversations exist only in browser memory
- **No cookies** are set by the application
- **No analytics data** is collected beyond Vercel Speed Insights (anonymous)
- **All external links** use `rel="noopener noreferrer"`

## Reporting a Vulnerability

If you discover a security vulnerability in this project:

1. **Do NOT** open a public GitHub issue
2. **Email** the maintainer directly at: `roshhellwett@icloud.com`
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**Response time**: We aim to acknowledge reports within 48 hours and provide a fix within 7 days for critical issues.

## Responsible Disclosure

We follow responsible disclosure practices. Security researchers who report valid vulnerabilities will be credited in the project's changelog (unless they prefer to remain anonymous).

## License

This project is MIT-licensed. See [LICENSE](license) for details.
