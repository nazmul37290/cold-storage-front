"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreateStockOut() {
  const router = useRouter();
  const [selectedBooking,setSelectedBooking]=useState(null);

  const [form, setForm] = useState({
    srNo: "",
    bookingId: "",
    bookingNo: "",
    bagsOut: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const [bookings, setBookings] = useState([]);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    // fetch bookings for combobox
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`);
        const data = await res.json();
        setBookings(data.data || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    fetchBookings();
  }, []);

  // simple combobox helpers
  const filtered = query
    ? bookings.filter((b) => (b.bookingNo || "").toLowerCase().includes(query.toLowerCase()))
    : bookings.slice(0, 10);

  const onSelectBooking = (b) => {
    setSelectedBooking(b);
    setForm((prev) => ({
      ...prev,
      bookingId: b.id || b._id || "",
      bookingNo: b.bookingNo || b.booking_no || "",
      totalBags: b.qtyOfBags || 0,
    }));
    setQuery(b.bookingNo || b.booking_no || "");
  };


  return (
    <div className="flex  gap-10">
    <div className="w-full mx-auto bg-white rounded-xl shadow border p-6">
      <h2 className="text-xl font-bold mb-6 text-black">Create Stock Out</h2>

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
          name="bagsOut"
          label="Bags Out"
          type="number"
          value={form.bagsOut}
          onChange={handleChange}
        />

        {/* Combobox for Booking No (shadcn-like) */}
        <div className="relative md:col-span-2">
          <label className="text-sm text-slate-600 mb-1 block">Booking No</label>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search booking no..."
            className="w-full border rounded-lg px-3 py-2 text-black border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {showDropdown && query !== "" && filtered.length > 0 && (
            <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border rounded shadow">
              {filtered.map((b) => (
                <li
                  key={b.id || b._id || b.bookingNo}
                      onClick={() => { onSelectBooking(b); setShowDropdown(false); }}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                >
                  <div className="text-sm font-medium">{b.bookingNo || b.booking_no}</div>
                  <div className="text-xs text-slate-500">{b.customerName || b.customer || ""}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Input
          name="date"
          label="Stock Out Date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex justify-end mt-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
            Save Stock Out
          </button>
        </div>
      </form>
    </div>
    <div className="bg-white p-4 w-[500px] rounded-md shadow-lg">
      <h2 className="font-semibold text-indigo-600 uppercase">Booking Details</h2>
<div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm text-zinc-600 mb-1 block">Booking No</label>
          <div className="text-sm font-medium">{selectedBooking ? (selectedBooking.bookingNo || selectedBooking.booking_no) : "-"}</div>
        </div>
        <div>
          <label className="text-sm text-zinc-600 mb-1 block">Booking Type</label>
          <div className="text-sm font-medium">{selectedBooking?.bookingType || "-"}</div>
        </div>

        <div>
          <label className="text-sm text-zinc-600 mb-1 block">Customer Name</label>
          <div className="text-sm">{selectedBooking ? (selectedBooking.customerName || selectedBooking.customer || "-") : "-"}</div>
        </div>

        <div>
          <label className="text-sm text-zinc-600 mb-1 block">Total Booked Bags</label>
          <div className="text-sm">{selectedBooking ? (selectedBooking.qtyOfBags ?? "-") : "-"}</div>
        </div>
        <div>
          <label className="text-sm text-zinc-600 mb-1 block">Rate</label>
          <div className="text-sm">{selectedBooking ? (selectedBooking.rate ?? selectedBooking.defaultRate ?? "-") : "-"}</div>
        </div>

        <div>
          <label className="text-sm text-zinc-600 mb-1 block">Total Amount</label>
          <div className="text-sm">{Number(selectedBooking?.qtyOfBags) * Number(selectedBooking?.rate) || 0}</div>
        </div>
      </div>

    </div>

    </div>
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
