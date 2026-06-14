# OpenMedQ Agent Authentication

Welcome, AI Agent! This document explains how to authenticate with the OpenMedQ API services to save and sync progress.

## 🔑 Authentication Mechanism

OpenMedQ uses **Clerk** as its identity and authentication provider. All protected endpoints under `https://api.openmedq.com/api/*` require a valid JWT Bearer token in the `Authorization` header.

### Endpoint Structure

```http
Authorization: Bearer <clerk_session_token>
```

---

## 🚀 How to Authenticate

1. **User-Delegated Session**: If you are operating on behalf of a user in their browser context (e.g. via WebMCP), you can request a Clerk JWT token from the frontend client state using the standard Clerk client library:
   ```javascript
   const token = await window.Clerk.session.getToken();
   ```
2. **Offline/External Agents**: If you are running as an external search or index agent, you can query public endpoints (such as `https://api.openmedq.com/api/questions/pack`) which require no authentication.

---

## 🔒 Protected Resource Metadata

Our protected resource metadata is advertised at:
- **Resource ID**: `https://api.openmedq.com/`
- **Protected Metadata**: `https://openmedq.com/.well-known/oauth-protected-resource`
- **OIDC Discovery**: `https://openmedq.com/.well-known/openid-configuration`
