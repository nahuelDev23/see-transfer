export function getSessionSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error("Define SESSION_SECRET en .env (mínimo 16 caracteres).");
  }

  return new TextEncoder().encode(secret);
}
