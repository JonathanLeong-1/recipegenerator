const http = require("http");
const fs = require("fs");
const path = require("path");

function loadLocalEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, "utf8");
  const lines = raw.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
}

loadLocalEnvFile();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8000);
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error("Request body too large."));
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function getLLMConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  return {
    apiKey,
    baseUrl: baseUrl.replace(/\/$/, ""),
    model,
    configured: Boolean(apiKey)
  };
}

function buildPrompt(ingredients, matches, prompt) {
  const topMatches = matches
    .slice(0, 3)
    .map((recipe) => {
      const available = Array.isArray(recipe.available) ? recipe.available.join(", ") : "";
      const missing = Array.isArray(recipe.missing) ? recipe.missing.join(", ") : "";
      return `- ${recipe.name}: have ${available || "nothing listed"}; missing ${missing || "nothing"}; method ${recipe.notes}`;
    })
    .join("\n");

  return [
    "You are a concise cooking assistant.",
    `Create one practical recipe idea using these ingredients when possible: ${ingredients.join(", ")}.`,
    prompt ? `Additional user preferences: ${prompt}` : "",
    "Keep the answer under 180 words.",
    "Return exactly these sections with short labels:",
    "Title:",
    "Ingredients:",
    "Steps:",
    "Tips:",
    topMatches ? `Use these local app matches as inspiration:\n${topMatches}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

async function generateRecipeSuggestion(ingredients, matches, prompt) {
  const config = getLLMConfig();

  if (!config.configured) {
    throw new Error("OPENAI_API_KEY is missing. Add it to .env and restart the server.");
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: "You produce simple home-cooking recipes based on pantry ingredients."
        },
        {
          role: "user",
          content: buildPrompt(ingredients, matches, prompt)
        }
      ]
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const providerCode = payload?.error?.code || "";
    const providerMessage = payload?.error?.message || "";

    if (providerCode === "insufficient_quota" || /quota|billing/i.test(providerMessage)) {
      throw new Error(
        "OpenAI quota reached. Check billing/usage, then try again."
      );
    }

    const message = providerMessage || "LLM request failed.";
    throw new Error(message);
  }

  return payload?.choices?.[0]?.message?.content?.trim() || "No recipe text returned.";
}

function safePathFromUrl(requestUrl) {
  const parsedUrl = new URL(requestUrl, `http://${HOST}:${PORT}`);
  const pathname = parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;
  const resolvedPath = path.normalize(path.join(PUBLIC_DIR, pathname));

  if (!resolvedPath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return resolvedPath;
}

function serveFile(filePath, response) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendJson(response, 404, { error: "Not found." });
        return;
      }

      sendJson(response, 500, { error: "Failed to read requested file." });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[extension] || "application/octet-stream"
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    if (!request.url) {
      sendJson(response, 400, { error: "Missing request URL." });
      return;
    }

    const url = new URL(request.url, `http://${HOST}:${PORT}`);

    if (request.method === "GET" && url.pathname === "/api/health") {
      const { configured, model } = getLLMConfig();
      sendJson(response, 200, {
        configured,
        model,
        mode: configured ? "openai" : "missing-api-key"
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/generate-recipe") {
      const rawBody = await readRequestBody(request);
      const body = rawBody ? JSON.parse(rawBody) : {};
      const ingredients = Array.isArray(body.ingredients) ? body.ingredients.filter(Boolean) : [];
      const matches = Array.isArray(body.matches) ? body.matches : [];
      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

      if (ingredients.length === 0) {
        sendJson(response, 400, { error: "Provide at least one ingredient." });
        return;
      }

      const recipe = await generateRecipeSuggestion(ingredients, matches, prompt);
      sendJson(response, 200, { recipe });
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed." });
      return;
    }

    const filePath = safePathFromUrl(request.url);
    if (!filePath) {
      sendJson(response, 403, { error: "Forbidden." });
      return;
    }

    serveFile(filePath, response);
  } catch (error) {
    const statusCode = error instanceof SyntaxError ? 400 : 500;
    sendJson(response, statusCode, { error: error.message || "Unexpected server error." });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Pantry-to-Plate running at http://localhost:${PORT}`);
});