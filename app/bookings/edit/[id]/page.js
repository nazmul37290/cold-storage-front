"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditBooking({ params }) {
  const router = useRouter();
  const {id}=use(params);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
   bookingType: "normal",
    bookingNo: "",
    customerName: "",
    address: "",
    phone: "",
    qtyOfBags:0,
    rate: 0,
    amount: 0,
    advanceAmount: 0,
   
    date: '',
  });

  // ✅ Fetch booking by ID
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`)
      .then((res) => res.json())
      .then(({data}) => {
        setForm({
          bookingType: data.bookingType || "normal",
          bookingNo: data.bookingNo || "",
          customerName: data.customerName || "",
          address: data.address || "",
          phone: data.phone || "",
          qtyOfBags: data.qtyOfBags || 0,
          rate: data.rate || "",
          advanceAmount: data.advanceAmount || 0,
       
          date: data.date?.split("T")[0] || "",
        });
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
if(e.target.name === 'qtyOfBags' || e.target.name === 'advanceAmount' ){

      setForm({ ...form, [e.target.name]: Number(e.target.value) });
    }
    else{

      setForm({ ...form, [e.target.name]: e.target.value });
    }  };

  // ✅ Update API
  const handleSubmit = async (e) => {
    e.preventDefault();

   const response= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        qty: Number(form.qtyOfBags),
        rate: Number(form.rate),
        amount: Number(form.qtyOfBags) * Number(form.rate),
        
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
       
     <Select name="bookingType"
          label="Booking Type"
          required
          value={form.bookingType}
          onChange={handleChange}>
            

        </Select>

        <Input
          name="bookingNo"
          label="Booking No"
          value={form.bookingNo}
          onChange={handleChange}
          required
        />
        <Input
          name="customerName"
          label="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          required
        />

        <Input
          name="address"
          label="Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <Input
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <Input
          name="qtyOfBags"
          label="Quantity"
          type="number"
          value={form.qtyOfBags}
          onChange={handleChange}
          required
        />
        <Input
          name="rate"
          label="Rate"
          type="number"
          value={form.rate}
          onChange={handleChange}
          required
        />
        <Input
          name="advanceAmount"
          label="Advance"
          type="number"
          value={form.advanceAmount}
          onChange={handleChange}
          
        />

        <Input
          name="amount"
          label="Amount"
          type="number"
          value={form.qtyOfBags * form.rate}
          readonly
         required
        />
        

       
        <Input
          name="date"
          label="Booking Date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
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
        className="w-full border text-black rounded-lg px-3 py-2 border-zinc-300"
      >
        <option value="normal book">Normal Book</option>
        <option value="paid book">Paid Book</option>
       
      </select>
    </div>
  );
}
