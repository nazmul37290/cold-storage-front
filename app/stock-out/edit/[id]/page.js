"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditStockOut({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    srNo: "",
    bookingNo: "",
    customerName: "",
    bagsOut: 0,
    rate: 0,
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  // ✅ Fetch stock-in by ID
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-outs/${id}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setForm({
          srNo: data.srNo || "",
          bookingNo: data.bookingNo || "",
          customerName: data.customerName || "",
          bagsOut: data.bagsOut || 0,
          rate: data.rate || 0,
          totalAmount: data.totalAmount || 0,
          date: data.date?.split("T")[0] || new Date().toISOString().split("T")[0],
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    
    // Calculate total amount when bagsIn or rate changes
    if (name === "bagsOut" || name === "rate") {
      updatedForm.totalAmount = Number(updatedForm.bagsOut) * Number(updatedForm.rate);
    }
    
    setForm(updatedForm);
  };

  // ✅ Update API
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-outs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        bagsOut: Number(form.bagsOut),
        rate: Number(form.rate),
        totalAmount: Number(form.bagsOut) * Number(form.rate),
      }),
    });
    
    const data = await response.json();
    if (data.success) {
      router.push("/stock-out");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Edit Stock OUT</h2>

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
          name="bagsOut"
          label="Bags OUT"
          type="number"
          value={form.bagsOut}
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
          value={form.totalAmount}
          readonly
        />

        <Input
          name="date"
          label="Stock Out Date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end mt-4">
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Update Stock OUT
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