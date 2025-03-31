const http = require("http");
const crypto = require("crypto");

// Hardcoded user credentials
const users = {
  alice: "abcdef",
  bob: "123456",
  charlie: "password123",
};

// In-memory token storage
const tokenStore = {
  // Structure: { token: { userId, expiresAt } }
};

// Generate a random token
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Create OAuth token response
function createTokenResponse(userId) {
  const accessToken = generateToken();
  const expiresIn = 3600; // 1 hour
  const refreshToken = generateToken();

  // Store token in memory
  tokenStore[accessToken] = {
    userId,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn,
    refresh_token: refreshToken,
  };
}

// Debug logger
function logDebug(label, data) {
  console.log(`=== ${label} ===`);
  console.log(typeof data === "object" ? JSON.stringify(data, null, 2) : data);
  console.log("=".repeat(label.length + 8));
}

// Get auth credentials from authorization header
function getCredentialsFromAuthHeader(req) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Basic ")) {
    try {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "utf-8",
      );
      const [username, password] = credentials.split(":");

      logDebug("Auth Header Credentials", { username, password });
      return { username, password };
    } catch (error) {
      logDebug("Auth Header Parse Error", error.message);
      return { username: "", password: "" };
    }
  }

  logDebug("No Auth Header", { authHeader });
  return { username: "", password: "" };
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Log request info
  logDebug("Request", {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  // Parse URL
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  logDebug("Parsed URL", {
    pathname: reqUrl.pathname,
    search: reqUrl.search,
    username: reqUrl.username,
    password: reqUrl.password,
  });

  // Handle token endpoint
  if (reqUrl.pathname === "/oauth/token" && req.method === "POST") {
    // Try to get credentials from URL
    let { username, password } = {
      username: reqUrl.username,
      password: reqUrl.password,
    };

    // If URL credentials are empty, try authorization header
    if (!username || !password) {
      const headerCreds = getCredentialsFromAuthHeader(req);
      username = headerCreds.username;
      password = headerCreds.password;
    }

    logDebug("Final Credentials", { username, password });

    // Validate credentials
    const isValidUser =
      username && users[username] && users[username] === password;
    logDebug("Authentication Result", {
      isValidUser,
      usernameExists: username in users,
      passwordMatches: users[username] === password,
    });

    if (isValidUser) {
      // Read request body
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        logDebug("Request Body", body);

        try {
          let requestData = {};

          // Handle both JSON and form-urlencoded content types
          const contentType = req.headers["content-type"] || "";
          logDebug("Content-Type", contentType);

          if (contentType.includes("application/json")) {
            requestData = JSON.parse(body || "{}");
          } else if (
            contentType.includes("application/x-www-form-urlencoded")
          ) {
            requestData = Object.fromEntries(new URLSearchParams(body));
          } else {
            // Try to parse as JSON first, then fall back to form-urlencoded
            try {
              requestData = JSON.parse(body || "{}");
            } catch (e) {
              logDebug("JSON Parse Failed", e.message);
              requestData = Object.fromEntries(new URLSearchParams(body));
            }
          }

          logDebug("Parsed Request Data", requestData);

          // Check grant type (supporting password grant for this implementation)
          if (requestData.grant_type === "password") {
            const tokenResponse = createTokenResponse(username);
            logDebug("Token Response", tokenResponse);

            res.writeHead(200, {
              "Content-Type": "application/json",
              "Cache-Control": "no-store",
              Pragma: "no-cache",
            });
            res.end(JSON.stringify(tokenResponse));
          } else {
            // Unsupported grant type
            const errorResponse = {
              error: "unsupported_grant_type",
              error_description:
                "The authorization grant type is not supported",
            };
            logDebug("Error Response", errorResponse);

            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify(errorResponse));
          }
        } catch (error) {
          logDebug("Request Processing Error", error.message);

          const errorResponse = {
            error: "invalid_request",
            error_description: "Invalid request format",
          };

          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(errorResponse));
        }
      });
    } else {
      // Authentication failed
      const errorResponse = {
        error: "invalid_client",
        error_description: "Client authentication failed",
      };
      logDebug("Auth Failed Response", errorResponse);

      res.writeHead(401, {
        "Content-Type": "application/json",
        "WWW-Authenticate": 'Basic realm="OAuth Token Server"',
      });
      res.end(JSON.stringify(errorResponse));
    }
  } else if (reqUrl.pathname === "/validate" && req.method === "GET") {
    // Endpoint to validate tokens (for testing)
    const authHeader = req.headers.authorization;
    logDebug("Validate Token Request", { authHeader });

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const tokenData = tokenStore[token];

      logDebug("Token Data", {
        token,
        tokenExists: !!tokenData,
        tokenData,
        isExpired: tokenData ? tokenData.expiresAt < Date.now() : true,
      });

      if (tokenData && tokenData.expiresAt > Date.now()) {
        const response = {
          valid: true,
          userId: tokenData.userId,
          expires_in: Math.floor((tokenData.expiresAt - Date.now()) / 1000),
        };
        logDebug("Valid Token Response", response);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
        return;
      }
    }

    const response = { valid: false, error: "Invalid or expired token" };
    logDebug("Invalid Token Response", response);

    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  } else {
    // Handle 404 for other endpoints
    const response = { error: "Not Found" };
    logDebug("Not Found Response", response);

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("\n=== OAuth Token Server Started ===");
  console.log(`Port: ${PORT}`);
  console.log(`Token endpoint: http://localhost:${PORT}/oauth/token`);
  console.log(`Token validation endpoint: http://localhost:${PORT}/validate`);
  console.log("\n=== Usage Examples ===");
  console.log("1. Using Basic Auth header:");
  console.log("   curl -X POST http://localhost:3000/oauth/token \\");
  console.log('     -H "Authorization: Basic YWxpY2U6YWJjZGVm" \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"grant_type":"password"}\'');
  console.log("\n2. Using URL credentials:");
  console.log(
    "   curl -X POST http://alice:abcdef@localhost:3000/oauth/token \\",
  );
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"grant_type":"password"}\'');
  console.log("\n3. Validating a token:");
  console.log("   curl -X GET http://localhost:3000/validate \\");
  console.log('     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"');
  console.log("\n=== Available Test Users ===");
  console.log(JSON.stringify(users, null, 2));
  console.log("===============================\n");
});
