const API_BASE = import.meta.env.VITE_AGENT_API_URL || "http://localhost:8081";

export async function askAgent(message, history = []) {
  const res = await fetch(`${API_BASE}/api/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) throw new Error("Erreur agent");
  return res.json();
}