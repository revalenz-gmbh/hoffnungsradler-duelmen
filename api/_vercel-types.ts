/**
 * Minimale Typen fuer die Vercel-Funktionen in diesem Ordner.
 *
 * Ersetzt das Paket @vercel/node, das hier nur fuer diese beiden Typen gebraucht
 * wurde, aber selbst in der neuesten Version Abhaengigkeiten mit bekannten
 * Sicherheitsluecken mitbringt. Vercel stellt die Laufzeit selbst bereit; die
 * Typen verschwinden beim Kompilieren.
 *
 * Dateien mit fuehrendem Unterstrich behandelt Vercel nicht als Funktion.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[] | undefined>;
  cookies: Record<string, string>;
  body: unknown;
}

export interface VercelResponse extends ServerResponse {
  status(statusCode: number): VercelResponse;
  json(body: unknown): VercelResponse;
  send(body: unknown): VercelResponse;
}
