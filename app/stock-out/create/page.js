"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStockOut() {
  const router = useRouter();
const [srNo, setSrNo] = useState("");
const [availableBags,setAvailableBags]=useState(0)

  const [form, setForm] = useState({
    srNo: "",
    bookingNo: "",
    customerName: "",
    bagsOut: 0,
    rate: 0,
    totalAmount: 0,
    date: new Date().toISOString().split("T")[0],
  });

const handleChange = (e) => {
  const { name, value } = e.target;

  setForm((prev) => ({ ...prev, [name]: value }));

  if (name === "srNo") {
    setSrNo(value);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stock-outs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            bagsOut: Number(form.bagsOut),
            rate: Number(form.rate),
            totalAmount: Number(form.bagsOut) * Number(form.rate),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push("/stock-out");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
  if (!srNo) return;

  const timer = setTimeout(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stock-outs/by-sr/${srNo}`
      );

     

      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({
          ...prev,
          customerName: data?.data?.customerName,
          bookingNo: data?.data?.bookingNo,
        }));
        setAvailableBags(data?.data?.availableBags);
      } else {
        
        setForm((prev) => ({
          ...prev,
          customerName: "",
          bookingNo: "",
        }));

        setAvailableBags(0)
      }
    } catch (err) {
      console.error(err);
    }
  }, 500); // ⏱️ 500ms debounce delay

  // ✅ Cleanup (important)
  return () => clearTimeout(timer);
}, [srNo]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Create Stock OUT</h2>

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
          readonly={true}
        />

        <Input
          name="customerName"
          label="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          readonly={true}
        />
        <Input
          name=""
          label="Available Bags "
          value={availableBags}
          readonly={true}
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
          value={form.bagsOut * form.rate}
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
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Save Stock OUT
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
