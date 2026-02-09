"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBooking() {
  const router = useRouter();
  const [error,setError]=useState('')

  const [form, setForm] = useState({
    sl: "",
    bookingType: "normal book",
    bookingNo: "",
    customerName: "",
    address: "",
    phone: "",
    qty:0,
    rate: 0,
    amount: 0,
   
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
setError('')

try{

 const response=  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      qty: Number(form.qty),
      rate: Number(form.rate),
      amount: Number(form.qty) * Number(form.rate),
    
    }),
  });

  const data= await response.json();
  if(data.success){
    router.push("/bookings");
  }
  console.log(data)
 
}catch(err){
  setError(err.message)
  console.log(err)
}

    
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Create Booking</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Input name="sl" label="SL No"  value={form.sl} onChange={handleChange} />
        <Select name="bookingType"
          label="Booking Type"
          value={form.bookingType}
          onChange={handleChange}>

        </Select>

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
          value={form.qty * form.rate}
          readonly
         
        />
        

       
        <Input
          name="date"
          label="Booking Date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end mt-4">
        <p className="text-red-600">{error}</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Save Booking
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
      <input
      readOnly={readonly}
        {...props}
        className="w-full border rounded-lg px-3 py-2 text-black border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <option  value="normal book">Normal Book</option>
        <option value="paid book">Paid Book</option>
       
      </select>
    </div>
  );
}
