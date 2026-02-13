import { Suspense } from "react";
import StockInReportsClient from "./StockInReportsClient";

export default function StockInReports() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <StockInReportsClient />
    </Suspense>
  );
}
