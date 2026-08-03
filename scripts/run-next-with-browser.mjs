import { spawn } from "node:child_process";
import http from "node:http";
import https from "node:https";
import { fileURLToPath } from "node:url";

const mode = process.argv[2];

if (mode !== "dev" && mode !== "start") {
  console.error("Usage: node scripts/run-next-with-browser.mjs <dev|start>");
  process.exit(1);
}

const suppliedArguments = process.argv.slice(3);
const browserDisabled = suppliedArguments.includes("--no-open");
const nextArguments = suppliedArguments.filter((argument) => argument !== "--no-open");
const nextCli = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const ansiPattern = new RegExp(
  `${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`,
  "g",
);

let detectedUrl;
let outputBuffer = "";
let browserOpened = false;
let pollTimer;

const server = spawn(process.execPath, [nextCli, mode, ...nextArguments], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

function openBrowser(url) {
  if (browserDisabled || browserOpened) return;

  browserOpened = true;
  let command;
  let args;

  if (process.platform === "win32") {
    command = "cmd.exe";
    args = ["/d", "/s", "/c", "start", '""', url];
  } else if (process.platform === "darwin") {
    command = "open";
    args = [url];
  } else {
    command = "xdg-open";
    args = [url];
  }

  const opener = spawn(command, args, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  opener.once("error", (error) => {
    console.warn(`Could not open the browser automatically: ${error.message}`);
    console.warn(`Open ${url} manually.`);
  });
  opener.unref();
}

function schedulePoll(url) {
  if (server.exitCode === null && !browserOpened) {
    pollTimer = setTimeout(() => pollServer(url), 250);
  }
}

function pollServer(url) {
  const transport = url.startsWith("https:") ? https : http;
  const request = transport.get(
    url,
    { rejectUnauthorized: false },
    (response) => {
      response.resume();
      openBrowser(url);
    },
  );

  request.setTimeout(1000, () => request.destroy());
  request.once("error", () => schedulePoll(url));
}

function browserSafeUrl(value) {
  const url = new URL(value);

  if (url.hostname === "0.0.0.0" || url.hostname === "[::]") {
    url.hostname = "localhost";
  }

  return url.toString();
}

function inspectOutput(chunk, destination) {
  destination.write(chunk);

  if (detectedUrl) return;

  outputBuffer = `${outputBuffer}${chunk.toString().replace(ansiPattern, "")}`.slice(
    -4096,
  );
  const match = outputBuffer.match(/Local:\s+(https?:\/\/\S+)/);

  if (match) {
    detectedUrl = browserSafeUrl(match[1]);
    pollServer(detectedUrl);
  }
}

server.stdout.on("data", (chunk) => inspectOutput(chunk, process.stdout));
server.stderr.on("data", (chunk) => inspectOutput(chunk, process.stderr));

server.once("error", (error) => {
  clearTimeout(pollTimer);
  console.error(`Could not start Next.js: ${error.message}`);
  process.exitCode = 1;
});

server.once("exit", (code) => {
  clearTimeout(pollTimer);
  process.exitCode = code ?? 1;
});
