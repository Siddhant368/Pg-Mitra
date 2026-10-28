export const instant = false;

import PgDetailsPage from "./PgDetailsClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <PgDetailsPage params={params} />;
}
