export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081';

export async function getPatterns() {
  const res = await fetch(`${API_BASE_URL}/api/patterns`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  return res.json();
}
