import { Suspense } from "react";
import ReportsClient from "./ReportsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ReportsClient />
    </Suspense>
  );
}
