# Plasmic Configuration Guide

This document provides a comprehensive reference for configuring Plasmic services. It details all environment variables, their purposes, and recommended values for different deployment scenarios.

## Common Configuration Parameters

These parameters are used across multiple services:

| Parameter        | Description                                 | Default Value                    | Required            |
| ---------------- | ------------------------------------------- | -------------------------------- | ------------------- |
| `NODE_ENV`       | Environment mode (development/production)   | `development`                    | Yes                 |
| `DATABASE_URI`   | PostgreSQL connection string                | `postgresql://wab@localhost/wab` | Yes                 |
| `HOST`           | Public URL for the application              | -                                | Yes (in production) |
| `SESSION_SECRET` | Secret for session management               | -                                | Yes (in production) |
| `SENTRY_DSN`     | Sentry error tracking DSN                   | -                                | No                  |
| `WAB_DBNAME`     | Database name (alternative to full URI)     | `wab`                            | No                  |
| `WAB_DBPASSWORD` | Database password (alternative to full URI) | -                                | No                  |

## Backend Server Configuration

| Parameter                              | Description                               | Default Value                                  | Required |
| -------------------------------------- | ----------------------------------------- | ---------------------------------------------- | -------- |
| `BACKEND_PORT`                         | Port for the backend server               | `3004`                                         | No       |
| `SOCKET_HOST`                          | URL for the socket server                 | `http://localhost:3020`                        | Yes      |
| `CODEGEN_HOST`                         | URL for the codegen server                | `http://localhost:3004`                        | Yes      |
| `REACT_APP_DEFAULT_HOST_URL`           | URL for the host server                   | `http://localhost:3005/static/host.html`       | Yes      |
| `REACT_APP_PUBLIC_URL`                 | Public URL for the application            | `http://localhost:3003`                        | Yes      |
| `REACT_APP_CDN_URL`                    | URL for static assets                     | `http://localhost:3003`                        | Yes      |
| `INTEGRATIONS_HOST`                    | URL for integrations                      | `http://localhost:3003`                        | Yes      |
| `ENABLED_GET_EMAIL_VERIFICATION_TOKEN` | Enable email verification token retrieval | `true` (in development)                        | No       |
| `DISABLE_BWRAP`                        | Disable bubblewrap sandbox                | `1` (in development)                           | No       |
| `ADMIN_EMAILS`                         | JSON array of admin email addresses       | `["admin@admin.example.com"]` (in development) | No       |
| `MAIL_CONFIG`                          | JSON string with mail configuration       | -                                              | No       |

## Socket Server Configuration

| Parameter     | Description                | Default Value | Required |
| ------------- | -------------------------- | ------------- | -------- |
| `SOCKET_PORT` | Port for the socket server | `3020`        | Yes      |

## Codegen Server Configuration

| Parameter              | Description                    | Default Value           | Required |
| ---------------------- | ------------------------------ | ----------------------- | -------- |
| `BACKEND_PORT`         | Port for the codegen server    | `3008`                  | Yes      |
| `CODEGEN_HOST`         | URL for the codegen server     | -                       | Yes      |
| `INTEGRATIONS_HOST`    | URL for integrations           | `http://localhost:3003` | Yes      |
| `REACT_APP_PUBLIC_URL` | Public URL for the application | `http://localhost:3003` | Yes      |

## Host Server Configuration

| Parameter         | Description              | Default Value | Required |
| ----------------- | ------------------------ | ------------- | -------- |
| `HOSTSERVER_PORT` | Port for the host server | `3005`        | No       |

## Storage Configuration

| Parameter              | Description                    | Default Value                      | Required |
| ---------------------- | ------------------------------ | ---------------------------------- | -------- |
| `S3_ENDPOINT`          | S3-compatible storage endpoint | -                                  | No       |
| `SITE_ASSETS_BUCKET`   | Bucket name for site assets    | `plasmic-site-assets`              | No       |
| `SITE_ASSETS_BASE_URL` | Base URL for site assets       | `https://site-assets.plasmic.app/` | No       |
| `LOADER_ASSETS_BUCKET` | Bucket name for loader assets  | `plasmic-loader-assets-dev`        | No       |

## PM2 Configuration Parameters

These environment variables control the PM2 process manager configuration:

| Parameter                    | Description                  | Default Value | Required |
| ---------------------------- | ---------------------------- | ------------- | -------- |
| `PM2_BACKEND_ONLY`           | Run only backend services    | -             | No       |
| `PM2_WITH_HOSTING`           | Include hosting services     | -             | No       |
| `PM2_WITH_DEDICATED_CODEGEN` | Run dedicated codegen server | -             | No       |

## Configuration Examples

### Development Environment

```bash
# Basic configuration
export NODE_ENV=development
export DATABASE_URI=postgresql://wab@localhost/wab
export SESSION_SECRET=dev-secret

# Service URLs
export BACKEND_PORT=3004
export SOCKET_PORT=3020
export HOSTSERVER_PORT=3005
export SOCKET_HOST=http://localhost:3020
export CODEGEN_HOST=http://localhost:3004
export REACT_APP_DEFAULT_HOST_URL=http://localhost:3005/static/host.html
export REACT_APP_PUBLIC_URL=http://localhost:3003
export REACT_APP_CDN_URL=http://localhost:3003
export INTEGRATIONS_HOST=http://localhost:3003
```

### Production Environment

```bash
# Basic configuration
export NODE_ENV=production
export DATABASE_URI=postgresql://username:password@db-hostname:5432/wab
export SESSION_SECRET=your-secure-secret
export HOST=https://your-plasmic-domain.com

# Service URLs
export BACKEND_PORT=3004
export SOCKET_PORT=3020
export HOSTSERVER_PORT=3005
export SOCKET_HOST=https://socket.your-plasmic-domain.com
export CODEGEN_HOST=https://codegen.your-plasmic-domain.com
export REACT_APP_DEFAULT_HOST_URL=https://host.your-plasmic-domain.com/static/host.html
export REACT_APP_PUBLIC_URL=https://your-plasmic-domain.com
export REACT_APP_CDN_URL=https://cdn.your-plasmic-domain.com
export INTEGRATIONS_HOST=https://your-plasmic-domain.com
```

## Configuration Loading Mechanism

Plasmic loads configuration in the following order of precedence:

1. Environment variables
2. Configuration files
3. Default values

The main configuration loading happens in `platform/wab/src/wab/server/config.ts`, which defines the `Config` interface and provides a `loadConfig` function.

## Service-Specific Configuration Notes

### Backend Server

The backend server is the primary service and coordinates communication with other services. It requires configuration for database connection, socket server URL, and codegen server URL.

### Socket Server

The socket server handles WebSocket connections for real-time updates. It needs to be accessible by both the backend server and clients.

### Codegen Server

The codegen server can be run in two modes:

- Integrated with the backend server (default)
- As a dedicated service (when `PM2_WITH_DEDICATED_CODEGEN` is set)

### Host Server

The host server is a simple HTTP server that serves static files. It's used for hosting the application's frontend.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues, check:

- Database URI format: `postgresql://username:password@hostname:port/database`
- Database credentials
- Network connectivity between services and database

### Inter-Service Communication Issues

If services cannot communicate with each other:

- Verify that service URLs are correctly configured
- Check network connectivity between services
- Ensure services are running and accessible

### Session Management Issues

If you encounter session-related issues:

- Verify that `SESSION_SECRET` is set
- Ensure the database has the session table created
