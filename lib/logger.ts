/**
 * Minimal structured logger.
 *
 * Wraps console to give us a single seam to redirect logs to Axiom / Logtail /
 * OpenTelemetry later without touching every call site. Also enforces a
 * consistent shape (`{ event, ...fields }`) so logs are greppable and
 * queryable.
 *
 * Intentionally tiny — no log levels beyond info/warn/error, no transports,
 * no PII scrubbing. Upgrade when we adopt a real observability stack.
 */

type Fields = Record<string, unknown>;

function emit(level: "info" | "warn" | "error", event: string, fields?: Fields) {
  const payload = { level, event, ...fields, ts: new Date().toISOString() };
  // In Node/Edge, stdout is parsed by Vercel / container hosts. JSON is
  // friendlier to log aggregators than interleaved key-value strings.
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info(event: string, fields?: Fields) {
    emit("info", event, fields);
  },
  warn(event: string, fields?: Fields) {
    emit("warn", event, fields);
  },
  error(event: string, fields?: Fields) {
    emit("error", event, fields);
  },
};
