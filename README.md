# Chatly Omnichannel Gmail Service

This service is a gRPC-based microservice built for managing Gmail integrations in an omnichannel communication platform.

## 🚀 Features

- ✅ gRPC API for seamless and performant communication
- ✅ OAuth2 authentication with Google accounts
- ✅ Support for **multiple Gmail accounts per user**
- ✅ Fetch and manage Gmail inboxes
- ✅ Built with **PostgreSQL** for persistence
- ✅ Multi-authentication/session support
- ✅ Soft delete & session status tracking

## 🔧 Tech Stack

- .NET Core / gRPC
- PostgreSQL
- Google OAuth 2.0
- Entity Framework Core

## 🔐 Authentication Flow

1. Get Google login URL
2. Authenticate with Google and receive OAuth tokens
3. Store Gmail session with access/refresh tokens
4. Use tokens to access Gmail inbox securely

---

## 📦 Setup

```bash
dotnet ef database update
dotnet run



In AppSetting of  Grpc service add
  "Google": {
    "ClientId": "<your-client-id>",
    "ClientSecret": "<your-client-secret>",
    "RedirectUri": "https://your-app.com/oauth/callback"
  },


