"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditStockIn({ params }) {
  const router = useRouter();
    const { id } = use(params);

  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    srNo: "",
    bookingId: "", // ✅ important
    bookingNo: "", // display only
    bagsIn: 0,
    date: new Date().toISOString().split("T")[0],
  });
  
  const [bookings, setBookings] = useState([]);
  const [query, setQuery] = useState();
  const [selectedBooking, setSelectedBooking] = useState(bookings.find(booking=>booking.bookingNo===query));
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // compute total amount when bagsIn or rate change
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      totalAmount: Number(prev.bagsIn) * Number(prev.rate),
    }));
  }, [form.bagsIn, form.rate]);

  // fetch bookings list (for combobox)
  useEffect(() => {
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

  // ✅ fetch stock-in by ID (and prefill)
  useEffect(() => {
    const fetchStockIn = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-ins/${id}`);
        const json = await res.json();
        const data = json.data;

        // if your backend populates bookingNo, it will be an object
        const bookingObj =
          data.bookingNo && typeof data.bookingNo === "object" ? data.bookingNo : null;

        const bookingId =
          bookingObj?._id || data.bookingId || data.bookingNo || ""; // depends on your response

        const bookingNoText =
          bookingObj?.bookingNo || data.bookingNo || "";

        setForm({
          srNo: data.srNo || "",
          bookingId: bookingId,
          bookingNo: bookingNoText,
          bagsIn: data.bagsIn ?? 0,
          rate: data.rate ?? 0,
          totalAmount: data.totalAmount ?? (Number(data.bagsIn) * Number(data.rate)) ?? 0,
          date: (data.date ? String(data.date).split("T")[0] : new Date().toISOString().split("T")[0]),
        });

        // preselect booking panel if populated
        if (bookingObj) {
          setSelectedBooking(bookingObj);
          setQuery(bookingNoText);
        } else {
          setQuery(bookingNoText);
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchStockIn();
  }, [id]);

  // filter bookings for dropdown
  const filtered = query
    ? bookings.filter((b) =>
        String(b.bookingNo || b.booking_no || "")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : bookings.slice(0, 10);

  const onSelectBooking = (b) => {
    setSelectedBooking(b);

    const bookingId = b._id || "";
    const bookingNoText = b.bookingNo || b.booking_no || "";

    setForm((prev) => ({
      ...prev,
      bookingId,
      bookingNo: bookingNoText,
      rate: b.rate ?? b.defaultRate ?? prev.rate,
      totalAmount: Number(prev.bagsIn) * Number(b.rate ?? b.defaultRate ?? prev.rate),
    }));

    setQuery(bookingNoText);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      srNo: form.srNo,
      bookingId: form.bookingId,
      bookingNo:form.bookingNo, // ✅ send object id
      bagsIn: Number(form.bagsIn),
      date: form.date,
    };

    console.log(payload)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stock-ins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (data.success) router.push("/stock-in");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex gap-10">
      <div className="w-full mx-auto bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-bold mb-6 text-black">Edit Stock IN</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="srNo" label="SR No" value={form.srNo} onChange={handleChange} />

          <Input
            name="bagsIn"
            label="Bags IN"
            type="number"
            value={form.bagsIn}
            onChange={handleChange}
          />

          {/* ✅ Combobox like Create */}
          <div ref={dropdownRef} className="relative md:col-span-2">
            <label className="text-sm text-slate-600 mb-1 block">Booking No</label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search booking no..."
              className="w-full border rounded-lg px-3 py-2 text-black border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {showDropdown && query !== "" && filtered.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border rounded shadow">
                {filtered.map((b) => (
                  <li
                    key={b.id || b._id || b.bookingNo}
                    onClick={() => onSelectBooking(b)}
                    className="px-3 py-2 hover:bg-slate-100 cursor-pointer"
                  >
                    <div className="text-sm font-medium">{b.bookingNo || b.booking_no}</div>
                    <div className="text-xs text-slate-500">
                      {b.customerName || b.customer || ""}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Input
            name="date"
            label="Stock IN Date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Update Stock IN
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Booking details panel like Create */}
      <div className="bg-white p-4 w-[500px] rounded-md shadow-lg">
        <h2 className="font-semibold text-indigo-600 uppercase">Booking Details</h2>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-zinc-600 mb-1 block">Booking No</label>
            <div className="text-sm font-medium">
              {selectedBooking ? (selectedBooking.bookingNo || selectedBooking.booking_no) : "-"}
            </div>
          </div>
          <div>
          <label className="text-sm text-zinc-600 mb-1 block">Booking Type</label>
          <div className="text-sm font-medium">{selectedBooking?.bookingType || "-"}</div>
        </div>

          <div>
            <label className="text-sm text-zinc-600 mb-1 block">Customer Name</label>
            <div className="text-sm">
              {selectedBooking ? (selectedBooking.customerName || selectedBooking.customer || "-") : "-"}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-600 mb-1 block">Total Booked Bags</label>
            <div className="text-sm">
              {selectedBooking ? (selectedBooking.qtyOfBags ?? "-") : "-"}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-600 mb-1 block">Rate</label>
            <div className="text-sm">
              {selectedBooking ? (selectedBooking.rate ?? selectedBooking.defaultRate ?? "-") : "-"}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-600 mb-1 block">Total Amount</label>
            <div className="text-sm">
              {selectedBooking
                ? Number(selectedBooking?.qtyOfBags) * Number(selectedBooking?.rate)
                : 0}
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
