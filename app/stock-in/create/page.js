"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStockIn() {
  const router = useRouter();

  const [form, setForm] = useState({
    srNo: "",
    bookingNo: "",
    customerName: "",
    bagsIn: 0,
    rate: 0,
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stock-ins`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            bagsIn: Number(form.bagsIn),
            rate: Number(form.rate),
            totalAmount: Number(form.bagsIn) * Number(form.rate),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push("/stock-in");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Create Stock IN</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input
          name="srNo"
          label="SR No"
          value={form.srNo}
          onChange={handleChange}
        />

        <Input
          name="bookingNo"
          label="Booking No"
          value={form.bookingNo}
          onChange={handleChange}
        />

        <Input
          name="customerName"
          label="Customer Name"
          value={form.customerName}
          onChange={handleChange}
        />

        <Input
          name="bagsIn"
          label="Bags IN"
          type="number"
          value={form.bagsIn}
          onChange={handleChange}
        />

        <Input
          name="rate"
          label="Rate"
          type="number"
          value={form.rate}
          onChange={handleChange}
        />

        <Input
          name="totalAmount"
          label="Total Amount"
          type="number"
          value={form.bagsIn * form.rate}
          readonly
        />

        <Input
          name="date"
          label="Stock IN Date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end mt-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Save Stock IN
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===== Reusable Components ===== */

function Input({ readonly, label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>
      <input
        readOnly={readonly}
        {...props}
        className="w-full border rounded-lg px-3 py-2 text-black border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
