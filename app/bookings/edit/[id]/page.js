"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBooking({ params }) {
  const router = useRouter();
  const {id}=use(params);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    sl: "",
    bookingType: "",
    bookingNo: "",
    customerName: "",
    address: "",
    phone: "",
    qty: "",
    rate: "",
    amount: form.qty * form.rate,
    paid: "",
    balance: "",
    date: "",
  });

  // ✅ Fetch booking by ID
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`)
      .then((res) => res.json())
      .then(({data}) => {
        setForm({
          sl: data.sl || "",
          bookingType: data.bookingType || "Normal",
          bookingNo: data.bookingNo || "",
          customerName: data.customerName || "",
          address: data.address || "",
          phone: data.phone || "",
          qty: data.qty || "",
          rate: data.rate || "",
          amount: data.amount || "",
          paid: data.paid || "",
          balance: data.balance || "",
          date: data.date?.split("T")[0] || "",
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update API
  const handleSubmit = async (e) => {
    e.preventDefault();

   const response= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        qty: Number(form.qty),
        rate: Number(form.rate),
        amount: Number(form.amount),
        paid: Number(form.paid),
        balance: Number(form.balance),
      }),
    });
const data = await response.json();
if(data.success){
  router.push("/bookings");
}
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Edit Booking</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input name="sl" label="SL No" value={form.sl} onChange={handleChange} />
        <Input
          name="bookingType"
          label="Booking Type"
          value={form.bookingType}
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
          name="address"
          label="Address"
          value={form.address}
          onChange={handleChange}
        />
        <Input
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Input
          name="qty"
          label="Quantity"
          type="number"
          value={form.qty}
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
          name="amount"
          label="Amount"
          type="number"
          readonly
          value={form.amount}
          onChange={handleChange}
        />
        <Input
          name="paid"
          label="Paid"
          type="number"
          value={form.paid}
          onChange={handleChange}
        />

        <Input
          name="balance"
          label="Balance"
          type="number"
          value={form.balance}
          onChange={handleChange}
        />
        <Input
          name="date"
          label="Booking Date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end mt-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Update Booking
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===== Reusable Components ===== */

function Input({readonly, label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>
      <input readOnly={readonly}
        {...props}
        className="w-full border text-black rounded-lg px-3 py-2 border-zinc-300"
      />
    </div>
  );
}

function Select({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>
      <select
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="Normal">Normal</option>
        <option value="Urgent">Urgent</option>
        <option value="VIP">VIP</option>
      </select>
    </div>
  );
}
