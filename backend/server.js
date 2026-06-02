const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT_DIR = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(__dirname, "config.json");

const DEFAULT_CONFIG = {
  port: 8787,
  openaiEndpoint: "https://api.openai.com/v1/chat/completions",
  defaultModel: "gpt-4o-mini"
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

function readConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CONFIG,
      ...parsed
    };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function applyApiCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendNoContent(response, statusCode) {
  response.writeHead(statusCode);
  response.end();
}

function parseJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large."));
      }
    });

    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", () => {
      reject(new Error("Failed to read request body."));
    });
  });
}

function sendStaticFile(requestPath, response) {
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const absolutePath = path.resolve(ROOT_DIR, `.${normalizedPath}`);

  if (!absolutePath.startsWith(ROOT_DIR)) {
    sendJson(response, 403, { error: "Forbidden path." });
    return;
  }

  fs.readFile(absolutePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendJson(response, 404, { error: "Not found." });
        return;
      }

      sendJson(response, 500, { error: "Failed to read file." });
      return;
    }

    const extension = path.extname(absolutePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream"
    });
    response.end(data);
  });
}

async function handleRecipeProxy(request, response) {
  const config = readConfig();
  const apiKey = String(config.openaiApiKey || "").trim();
  const endpoint = String(config.openaiEndpoint || "").trim();

  if (!apiKey) {
    sendJson(response, 500, {
      error: {
        message: "OpenAI API key is not configured. Add it to backend/config.json."
      }
    });
    return;
  }

  if (!endpoint) {
    sendJson(response, 500, {
      error: {
        message: "OpenAI endpoint is missing in backend/config.json."
      }
    });
    return;
  }

  try {
    const body = await parseJsonBody(request);

    const upstreamResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const text = await upstreamResponse.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      payload = {
        error: {
          message: text || "Unexpected upstream response."
        }
      };
    }

    sendJson(response, upstreamResponse.status, payload);
  } catch (error) {
    sendJson(response, 500, {
      error: {
        message: error instanceof Error ? error.message : "Failed to process recipe request."
      }
    });
  }
}

function handleLLMStatus(response) {
  const config = readConfig();
  const hasApiKey = Boolean(String(config.openaiApiKey || "").trim());

  sendJson(response, 200, {
    hasApiKey,
    defaultModel: config.defaultModel || DEFAULT_CONFIG.defaultModel,
    endpointConfigured: Boolean(String(config.openaiEndpoint || "").trim())
  });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url || "/", "http://localhost");
  const requestPath = requestUrl.pathname;
  const normalizedPath = requestPath.length > 1 ? requestPath.replace(/\/+$/, "") : requestPath;

  if (normalizedPath.startsWith("/api/")) {
    applyApiCorsHeaders(response);

    if (request.method === "OPTIONS") {
      sendNoContent(response, 204);
      return;
    }
  }

  if (request.method === "GET" && normalizedPath === "/api/llm/status") {
    handleLLMStatus(response);
    return;
  }

  if (request.method === "POST" && normalizedPath === "/api/recipes") {
    await handleRecipeProxy(request, response);
    return;
  }

  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  sendStaticFile(requestPath, response);
});

const config = readConfig();
const port = Number(config.port) || DEFAULT_CONFIG.port;

server.listen(port, () => {
  // Keep startup logs short and beginner-friendly.
  console.log(`Pantry-to-Plate running at http://localhost:${port}`);
});