import { Suspense } from "react";
import StockOutReportsClient from "./StockOutReportsClient";

export default function StockOutReports() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <StockOutReportsClient />
    </Suspense>
  );
}
