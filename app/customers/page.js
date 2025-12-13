"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiEye, FiEdit, FiTrash, FiPlus } from "react-icons/fi";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`)
      .then((res) => res.json())
      .then((data) => {
       
        setCustomers(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this booking?")) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}`, {
      method: "DELETE",
    });

    setCustomers((prev) => prev.filter((item) => item._id !== id));
  };

  if (loading) return <p>Loading...</p>;

  console.log(customers)
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-slate-800">Bookings</h2>
        <Link
          href="/bookings/create"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          <FiPlus />
          Create Booking
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">SL</th>
              <th className="p-3 text-left">Customer ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((item, index) => (
              <tr key={item._id} className="border-b text-zinc-500 hover:bg-slate-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-medium">{item.customerId}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">
                  {/* <div className="flex justify-center gap-2">
                    <Link
                      href={`/bookings/${item._id}`}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded"
                    >
                      <FiEye />
                    </Link>

                    <Link
                      href={`/bookings/edit/${item._id}`}
                      className="p-2 bg-yellow-50 text-yellow-600 rounded"
                    >
                      <FiEdit />
                    </Link>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 bg-red-50 text-red-600 rounded"
                    >
                      <FiTrash />
                    </button>
                  </div> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
