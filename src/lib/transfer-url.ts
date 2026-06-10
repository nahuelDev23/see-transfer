import { randomBytes } from "crypto";

function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const port = process.env.APP_PORT?.trim();
  const hostWithPort = port ? `${trimmed}:${port}` : trimmed;

  return `http://${hostWithPort}`;
}

export function getAppBaseUrl(): string {
  const fromEnv =
    process.env.NGROK_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.APP_HOST?.trim();

  if (!fromEnv) {
    throw new Error(
      "Define NGROK_URL o APP_URL en .env (ej: APP_URL=http://192.168.2.127:3002).",
    );
  }

  return normalizeBaseUrl(fromEnv);
}

export function buildDownloadUrl(slug: string): string {
  return `${getAppBaseUrl()}/d/${slug}`;
}

export function generateSlug(originalName: string): string {
  const base = originalName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48);

  const suffix = randomBytes(3).toString("hex");
  return `${base || "archivo"}-${suffix}`;
}
