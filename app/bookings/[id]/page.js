"use client";

import { use, useEffect, useState } from "react";

export default function ViewBooking({ params }) {
  const [booking, setBooking] = useState(null);
const {id}= use(params);
console.log(use(params))
  useEffect(() => {
    fetch(`http://localhost:4000/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => setBooking(data.data));
  }, [id]);

  if (!booking) return <p>Loading...</p>;

//   console.log(boo)
  return (
    <div className="max-w-4xl mx-auto bg-white  rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Booking Details</h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <Field label="SL No" value={booking.sl} />
        <Field label="Booking Type" value={booking.bookingType} />
        <Field label="Booking No" value={booking.bookingNo} />
        <Field label="Customer Name" value={booking.customerName} />
        <Field label="Phone" value={booking.phone} />
        <Field label="Address" value={booking.address} />
        <Field label="Quantity" value={booking.qty} />
        <Field label="Rate" value={`৳${booking.rate}`} />
        <Field label="Amount" value={`৳${booking.amount}`} />
        <Field label="Paid" value={`৳${booking.paid}`} />
        <Field label="Balance" value={`৳${booking.balance}`} />
        <Field label="Booking Date" value={booking.date} />
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
