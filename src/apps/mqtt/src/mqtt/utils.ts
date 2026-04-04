export function parsePayload(payload: unknown) {
  let parsed = payload;

  if (parsed instanceof Buffer) {
    parsed = parsed.toString('utf8');
  }

  if (typeof parsed === 'string') {
    try {
      return JSON.parse(parsed);
    } catch {
      return null;
    }
  }

  if (typeof parsed === 'object' && parsed !== null) {
    return parsed;
  }

  return null;
}
