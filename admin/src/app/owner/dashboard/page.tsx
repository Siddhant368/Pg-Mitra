import { cookies } from "next/headers";
import DashboardClient, { type PgItem } from "./DashboardClient";

export const instant = false;

async function getInitialDashboardData(): Promise<PgItem[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/owner/pgs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.ok) {
      const pgs = await res.json();
      return Array.isArray(pgs) ? pgs : [];
    }
  } catch (err) {
    console.warn("SSR dashboard fetch skipped, falling back to client fetch:", err);
  }
  return null;
}

export default async function OwnerDashboard() {
  const initialPgs = await getInitialDashboardData();
  return <DashboardClient initialPgs={initialPgs} />;
}
