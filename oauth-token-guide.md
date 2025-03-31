# OAuth 2.0 Token Endpoint Guide

## Introduction

The `/oauth/token` endpoint is a standardized HTTP endpoint in the OAuth 2.0 framework used for obtaining access tokens. This endpoint is a crucial component of the OAuth 2.0 authorization framework, which enables secure delegated access to resources.

## Endpoint Details

- **URL:** `/oauth/token`
- **Method:** POST
- **Content-Type:** `application/json` or `application/x-www-form-urlencoded`

## Standard Grant Types

OAuth 2.0 defines several grant types, each designed for different scenarios. Below are the standard grant types and their corresponding request formats.

### 1. Client Credentials Grant

Used for server-to-server authentication where the client is acting on its own behalf.

```json
{
  "grant_type": "client_credentials",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "scope": "read write"
}
```

### 2. Authorization Code Grant

Used by web applications after receiving an authorization code.

```json
{
  "grant_type": "authorization_code",
  "code": "AUTHORIZATION_CODE_FROM_AUTH_SERVER",
  "redirect_uri": "https://client.example.com/callback",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

### 3. Password Grant

Used for direct username/password authentication (use cautiously).

```json
{
  "grant_type": "password",
  "username": "user@example.com",
  "password": "user_password",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "scope": "read write"
}
```

### 4. Refresh Token Grant

Used for obtaining a new access token using a refresh token.

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "PREVIOUSLY_ISSUED_REFRESH_TOKEN",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "scope": "read write"
}
```

## OAuth 2.0 Extensions

### 5. PKCE (Proof Key for Code Exchange)

Secure flow for public clients like mobile apps and SPAs.

```json
{
  "grant_type": "authorization_code",
  "code": "AUTHORIZATION_CODE_FROM_AUTH_SERVER",
  "redirect_uri": "https://client.example.com/callback",
  "client_id": "YOUR_CLIENT_ID",
  "code_verifier": "RANDOMLY_GENERATED_STRING"
}
```

### 6. Device Authorization Grant

For limited-input devices.

```json
{
  "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
  "device_code": "DEVICE_VERIFICATION_CODE",
  "client_id": "YOUR_CLIENT_ID"
}
```

### 7. JWT Bearer Token Grant

For requesting access tokens using a JWT assertion.

```json
{
  "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
  "assertion": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "client_id": "YOUR_CLIENT_ID"
}
```

### 8. SAML Bearer Assertion Grant

For requesting access tokens using SAML assertions.

```json
{
  "grant_type": "urn:ietf:params:oauth:grant-type:saml2-bearer",
  "assertion": "PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPSJ1cm46b2Fz...",
  "client_id": "YOUR_CLIENT_ID"
}
```

### 9. Token Exchange Grant

For exchanging one token for another.

```json
{
  "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
  "subject_token": "ACCESS_OR_ID_TOKEN",
  "subject_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "requested_token_type": "urn:ietf:params:oauth:token-type:refresh_token",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}
```

## Standard Response Format

A successful response from the token endpoint typically looks like this:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA...",
  "scope": "read write"
}
```

### Response Fields

- **access_token** (required): The token used to access protected resources
- **token_type** (required): The type of token, usually "Bearer"
- **expires_in** (recommended): Time in seconds until the token expires
- **refresh_token** (optional): Token used to get new access tokens
- **scope** (optional): Scope of the access token

## HTTP Headers

### Request Headers

```
Content-Type: application/json
Authorization: Basic base64(client_id:client_secret)
```

Note: Client credentials can be included either in the request body or using HTTP Basic Authentication.

### Response Headers

```
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache
```

## Error Responses

Error responses follow this format:

```json
{
  "error": "invalid_grant",
  "error_description": "Invalid authorization code",
  "error_uri": "https://auth.example.com/docs/errors"
}
```

Common error codes:

- `invalid_request`: The request is missing a required parameter
- `invalid_client`: Client authentication failed
- `invalid_grant`: The authorization grant is invalid
- `unauthorized_client`: The client is not authorized to use this grant type
- `unsupported_grant_type`: The authorization server does not support this grant type
- `invalid_scope`: The requested scope is invalid or unknown

## Best Practices

1. **Transport Security**: Always use HTTPS for the token endpoint
2. **Token Storage**: Store tokens securely
3. **Token Validation**: Validate tokens before using them
4. **Client Authentication**: Use strong client authentication methods
5. **Minimal Scope**: Request only the scopes needed
6. **Short Token Lifetimes**: Use short expiration times for access tokens

## References

- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [OAuth 2.0 Token Endpoint](https://tools.ietf.org/html/rfc6749#section-3.2)
- [Token Exchange RFC 8693](https://tools.ietf.org/html/rfc8693)
- [PKCE RFC 7636](https://tools.ietf.org/html/rfc7636)
- [Device Authorization Grant RFC 8628](https://tools.ietf.org/html/rfc8628)
