import { useEffect, useState } from "react";
import { http } from "../api/http";

export function Health() {
  const [msg, setMsg] = useState<string>("Loading...");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    http<string>("/health")
      .then(setMsg)
      .catch((e) => setErr(String(e.message ?? e)));
  }, []);

  if (err) return <div style={{ padding: 16 }}>Error: {err}</div>;

  return <div style={{ padding: 16 }}>API says: {msg}</div>;
}
