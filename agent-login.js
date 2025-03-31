// Hardcoded user credentials for demonstration
// try this with: curl http://alice:123456@localhost:8787
// also works in browser! try visiting http://@localhost:8787

const userCredentials = {
  alice: {
    password: "123456",
    scopes: "read write",
  },
  bob: {
    password: "abcdef",
    scopes: "read write admin",
  },
};

export default {
  /**
   * Simplified OAuth 2.0 Token Endpoint Implementation
   * Only supports password grant type with Basic authentication
   *
   * @param {Request} request
   * @returns {Response}
   */
  fetch: async (request) => {
    // 1. Parse the Authorization header to get username/password
    const authorization = request.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Basic ")) {
      // Could supply visitor ux here
      return new Response(
        JSON.stringify({
          error: "invalid_client",
          error_description: "Missing or invalid Authorization header",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "WWW-Authenticate": 'Basic realm="OAuth"',
          },
        },
      );
    }

    // Extract username and password from Basic auth
    const [username, password] = atob(
      authorization.slice("Basic ".length),
    ).split(":");

    // 2. Default to password grant type
    // 3. Validate credentials
    if (
      !userCredentials[username] ||
      userCredentials[username].password !== password
    ) {
      return new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid username or password",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Generate a simple access token (in production, use a proper JWT library)
    const accessToken = btoa(`${username}:${Date.now()}:${Math.random()}`);

    // Return OAuth token response
    return new Response(
      JSON.stringify({
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
        scope: userCredentials[username].scopes,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          Pragma: "no-cache",
        },
      },
    );
  },
};
