"use client";

import { use, useEffect, useState } from "react";

export default function ViewStockIn({ params }) {
  const [stockIn, setStockIn] = useState(null);
  const { id } = use(params);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-ins/${id}`)
      .then((res) => res.json())
      .then((data) => setStockIn(data.data));
  }, [id]);

  if (!stockIn) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Stock IN Details</h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <Field label="SR No" value={stockIn.srNo} />
        <Field label="Booking No" value={stockIn.bookingNo} />
        <Field label="Customer Name" value={stockIn.customerName} />
        <Field label="Bags IN" value={stockIn.bagsIn} />
        <Field label="Rate" value={`৳${stockIn.rate}`} />
        <Field label="Total Amount" value={`৳${stockIn.totalAmount}`} />
        <Field label="Stock IN Date" value={stockIn.date} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-black">{value}</p>
    </div>
  );
}
