"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditStockOut({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    srNo: "",
    bookingId: "",
    bookingNo: "",
    bagsOut: 0,
    date: new Date().toISOString().split("T")[0],
  });

  /* ===============================
     Fetch Existing Stock Out
  ================================= */
  useEffect(() => {
    const fetchStockOut = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stock-outs/${id}`
      );
      const { data } = await res.json();

      setForm({
        srNo: data.srNo || "",
        bookingId: data.bookingId?._id || data.bookingId || "",
        bookingNo: data.bookingNo || "",
        bagsOut: data.bagsOut || 0,
        date:
          data.date?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });

      setSelectedBooking(data.bookingId || null);
      setQuery(data.bookingNo || "");

      setLoading(false);
    };

    fetchStockOut();
  }, [id]);

  /* ===============================
     Fetch Bookings
  ================================= */
  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`
      );
      const data = await res.json();
      setBookings(data.data || []);
    };

    fetchBookings();
  }, []);

  /* ===============================
     Combobox Logic
  ================================= */
  const filtered = query
    ? bookings.filter((b) =>
        (b.bookingNo || "")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : bookings.slice(0, 10);

  const onSelectBooking = (b) => {
    setSelectedBooking(b);
    setForm((prev) => ({
      ...prev,
      bookingId: b._id || b.id,
      bookingNo: b.bookingNo,
    }));
    setQuery(b.bookingNo);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===============================
     Update API
  ================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stock-outs/${id}`,
      {
        method: "PATCH",
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
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex gap-10">
      {/* ================= FORM ================= */}
      <div className="w-full bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-bold mb-6 text-black">
          Edit Stock Out
        </h2>

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

          {/* Booking Combobox */}
          <div className="relative md:col-span-2">
            <label className="text-sm text-slate-600 mb-1 block">
              Booking No
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full border rounded-lg px-3 py-2 text-black border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {showDropdown && filtered.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border rounded shadow">
                {filtered.map((b) => (
                  <li
                    key={b._id}
                    onClick={() => onSelectBooking(b)}
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                  >
                    <div className="text-sm font-medium">
                      {b.bookingNo}
                    </div>
                    <div className="text-xs text-slate-500">
                      {b.customerName}
                    </div>
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
              Update Stock Out
            </button>
          </div>
        </form>
      </div>

      {/* ================= BOOKING DETAILS PANEL ================= */}
      <div className="bg-white p-4 w-[500px] rounded-md shadow-lg">
        <h2 className="font-semibold text-indigo-600 uppercase">
          Booking Details
        </h2>

        <div className="mt-4 space-y-3">
          <Detail label="Booking No" value={selectedBooking?.bookingNo} />
          <Detail label="Booking Type" value={selectedBooking?.bookingType} />
          <Detail label="Customer Name" value={selectedBooking?.customerName} />
          <Detail label="Total Booked Bags" value={selectedBooking?.qtyOfBags} />
          <Detail label="Rate" value={selectedBooking?.rate} />
          <Detail
            label="Total Amount"
            value={
              Number(selectedBooking?.qtyOfBags) *
                Number(selectedBooking?.rate) || 0
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ================= Reusable Components ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600 mb-1 block">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 text-black border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <label className="text-sm text-zinc-600 mb-1 block">{label}</label>
      <div className="text-sm">{value ?? "-"}</div>
    </div>
  );
}