# CORS Verification and Global Security Headers Standards

This document registers the learning and standards established after identifying and fixing a critical vulnerability where CORS origin checks were bypassable and standard security headers were missing.

## 🚨 Identified Vulnerabilities

### 1. Loose CORS Origin Suffix Check
The backend CORS configuration originally used a loose check to validate dynamic preview branch origins:
```typescript
origin.endsWith('.openmedq.pages.dev')
```
* **Attack Vector**: An attacker could register a domain such as `attackeropenmedq.pages.dev` or `malicious-openmedq.pages.dev` and perform cross-origin actions against users' authenticated sessions.
* **Impact**: Cross-origin action execution, session hijacking, or sensitive data leakage.

### 2. Missing Security Headers
The Hono backend lacked critical HTTP response headers to protect against web vulnerability classes such as clickjacking, MIME-type sniffing, cross-site scripting (XSS), and unencrypted connections.

---

## 🛠️ Standards and Remediation

### 1. Strict Regular Expression Checks for Domains
When verifying dynamic subdomains (e.g., Cloudflare Pages preview URLs), always use exact anchor patterns (`^` and `$`) and escape dot literals:
```typescript
/^https:\/\/[a-z0-9-]+\.openmedq\.pages\.dev$/i
```
This ensures only legitimate subdomains of `openmedq.pages.dev` (e.g., `branch-name.openmedq.pages.dev`) can bypass the CORS block.

### 2. Defense-in-Depth with Global Security Headers
Always apply Hono's native `secureHeaders()` middleware globally on the application instance. This middleware automatically appends:
* `X-Content-Type-Options: nosniff` (Prevents MIME-sniffing)
* `X-Frame-Options: SAMEORIGIN` (Protects against Clickjacking)
* `X-XSS-Protection: 0`
* `Strict-Transport-Security` (Enforces HTTPS)
* `Referrer-Policy: no-referrer`
* `Content-Security-Policy` (When configured)

```typescript
import { secureHeaders } from 'hono/secure-headers';

// Apply globally before Clerk authentication
app.use('*', secureHeaders());
```
