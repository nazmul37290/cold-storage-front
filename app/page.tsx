"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [bookingNo, setBookingNo] = useState("");
  const [srNo, setSrNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ===============================
     Fetch Statistics
  ================================= */
  const fetchStats = async () => {
    try {
      setLoading(true);

      const params: any = {};

      if (bookingNo) params.bookingNo = bookingNo;
      if (srNo) params.srNo = srNo;   
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/statistics`,
        { params }
      );

      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  /* ===============================
     Date Preset Filters
  ================================= */
  const setPreset = async (type: string) => {
    let formattedStart = "";
    let formattedEnd = "";

    if (type !== "all") {
      const today = new Date();
      let start: Date | undefined;
      let end: Date | undefined;

      switch (type) {
        case "today":
          start = end = today;
          break;

        case "yesterday":
          const y = new Date();
          y.setDate(today.getDate() - 1);
          start = end = y;
          break;

        case "7days":
          start = new Date();
          start.setDate(today.getDate() - 6);
          end = today;
          break;

        case "month":
          start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          end = new Date(today.getFullYear(), today.getMonth(), 0);
          break;
      }

      formattedStart = start?.toISOString().split("T")[0] || "";
      formattedEnd = end?.toISOString().split("T")[0] || "";
    }

    // Update UI
    setStartDate(formattedStart);
    setEndDate(formattedEnd);

    // Fetch instantly
    try {
      setLoading(true);

      const params: any = {};

      if (formattedStart) params.startDate = formattedStart;
      if (formattedEnd) params.endDate = formattedEnd;
      if (bookingNo) params.bookingNo = bookingNo;
      if (srNo) params.srNo = srNo; 
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/statistics`,
        { params }
      );

      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      setLoading(true);

      setBookingNo("");
      setSrNo("");        // ✅ added
      setStartDate("");
      setEndDate("");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/statistics`
      );

      setStats(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" space-y-6">

      {/* ================= HEADER ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">

        <div>
          <label className="text-sm block mb-1">Booking No</label>
          <input
            value={bookingNo}
            onChange={(e) => setBookingNo(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
            placeholder="Enter booking no"
          />
        </div>
        <div>
          <label className="text-sm block mb-1">SR No</label>
          <input
            value={srNo}
            onChange={(e) => setSrNo(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
            placeholder="Enter SR no"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <button
          onClick={fetchStats}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Apply
        </button>
        <button
          onClick={clearAll}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          Clear 
        </button>
      </div>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-3 flex-wrap">
          <FilterBtn label="All" onClick={() => setPreset("all")} />
          <FilterBtn label="Today" onClick={() => setPreset("today")} />
          <FilterBtn label="Yesterday" onClick={() => setPreset("yesterday")} />
          <FilterBtn label="Last 7 Days" onClick={() => setPreset("7days")} />
          <FilterBtn label="Last Month" onClick={() => setPreset("month")} />
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

          <Card title="Total Bookings" value={stats.totalBookings} />
          <Card title="Paid Bookings" value={stats.totalPaidBookings} />
          <Card title="Normal Bookings" value={stats.totalNormalBookings} />
          <Card title="Paid Booked Bags" value={stats.totalPaidBookedBags} />
          <Card title="Normal Booked Bags" value={stats.totalNormalBookedBags} />
          <Card title="Total Revenue" value={`₹ ${stats.totalRevenue}`} />
          <Card title="Total Bags In" value={stats.totalBagsIn} />
          <Card title="Total Bags Out" value={stats.totalBagsOut} />
          <Card
            title="Stock Balance"
            value={stats.totalStockBalance}
            highlight
          />

        </div>
      )}
    </div>
  );
}

/* ================= Reusable Components ================= */

function Card({ title, value, highlight = false }: any) {
  return (
    <div className={`p-5 rounded-xl shadow border 
      ${highlight ? "bg-green-50 border-green-400" : "bg-white"}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

function FilterBtn({ label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border rounded-lg hover:bg-indigo-600 hover:text-white transition"
    >
      {label}
    </button>
  );
}