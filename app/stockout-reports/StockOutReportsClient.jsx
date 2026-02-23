"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import formatGlobalDate from '../../lib/formatGlobalDate'
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import axios from "axios";
import * as XLSX from "xlsx";
const formatBookingsForExcel = (data = []) => {
    return data.map((item, index) => ({
        "SL": index + 1,
        "Date": new Date(item.date).toLocaleDateString('en-GB'),
        "Customer Name": item.bookingId.customerName,
        "Booking type": item.bookingId.bookingType,
        "Booking No": item.bookingNo,
        "Sr No": item.srNo,
        "Qty (Bags)": item.bagsIn,
    }));
};

const StockOutReportsClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "individual");
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [bookingNo, setBookingNo] = useState('');
    const [srNo, setSrNo] = useState('');
    const [metadata, setMetadata] = useState(null);
    const [summary, setSummary] = useState({
        totalStockOuts: reportData?.data?.length,
        totalBagsOut: reportData?.data?.reduce((acc,cur)=>acc+cur.bagsOut,0)
    })
console.log(summary)
    // Individual tab state
    const [individualStartDate, setIndividualStartDate] = useState("");
    const [individualEndDate, setIndividualEndDate] = useState("");

    // Custom tab state
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Update URL when tab changes
    useEffect(() => {
        router.push(`?tab=${activeTab}`, { scroll: false });
    }, [activeTab, router]);

    const fetchIndividualReport = async () => {
      
        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock-outs`, {
                params: {
                    ...(individualStartDate && { startDate: individualStartDate }),
                    ...(individualEndDate && { endDate: individualEndDate }),
                    ...(bookingNo && { bookingNo }),
                    ...(srNo && { srNo }),
                },
            });
            setReportData(response.data);
            setSummary({
                totalStockOuts:response.data.data.length,
                totalBagsOut: response.data.data.reduce((acc, cur) => acc + cur.bagsOut, 0)
            })
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomReport = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date must be before end date");
            return;
        }

        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stock-outs/custom-report`, {
                params: {
                    startDate: startDate,
                    endDate: endDate,
                },
            });
            setMetadata(response.data);
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Failed to fetch report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!reportData.success) return;
        const excelData = formatBookingsForExcel(reportData.data);
        // Convert data to worksheet format
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `booking-report-${timestamp}.xlsx`;

        XLSX.writeFile(wb, filename);
    };
    const exportToExcelMeta = () => {
        if (!metadata.success) return;
        const excelData = ([metadata.data]);
        // Convert data to worksheet format
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split("T")[0];
        const filename = `booking-report-meta-${timestamp}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    
    return (
        <div className="max-w-full">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Stock Out Reports</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                <button
                    onClick={() => setActiveTab("individual")}
                    className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === "individual"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-600 hover:text-slate-800"
                        }`}
                >
                    Individual Date Report
                </button>
                <button
                    onClick={() => setActiveTab("custom")}
                    className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === "custom"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-600 hover:text-slate-800"
                        }`}
                >
                    Metadata Report
                </button>
            </div>

            {/* Individual Tab */}
            {activeTab === "individual" && (
                <>
                    <Card className="bg-teal-50">
                        <CardHeader>
                            <CardTitle>Individual Date Report</CardTitle>
                        </CardHeader>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Select Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={individualStartDate}
                                        onChange={(e) => setIndividualStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Select End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={individualEndDate}
                                        onChange={(e) => setIndividualEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Booking No
                                    </label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={bookingNo} onChange={(e)=>setBookingNo(e.target.value)} />
                                    {/* <select value={bookingType} onChange={(e) => setBookingType(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value={'paid'}>Paid</option>
                                        <option value={'normal'}>Normal</option>
                                    </select> */}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        SR No
                                    </label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" value={srNo} onChange={(e)=>setSrNo(e.target.value)} />
                                    {/* <select value={bookingType} onChange={(e) => setBookingType(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value={'paid'}>Paid</option>
                                        <option value={'normal'}>Normal</option>
                                    </select> */}
                                </div>
                            </div>

                            <button
                                onClick={fetchIndividualReport}
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition"
                            >
                                {loading ? "Loading..." : "Get Report"}
                            </button>
                        </div>
                    </Card>


                    {/* Report Data Display */}
                    {reportData?.success && (
                        <div className="mt-8">
                            <div className="flex gap-4 items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Report Results</h3>
                                <button
                                    onClick={exportToExcel}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Export to Excel
                                </button>
                            </div>
                            <div className="my-4 flex gap-4 flex-wrap">
                                <div className="bg-white border shadow rounded-md p-10 flex items-center justify-center w-fit">
                                    <p className="font-medium  flex flex-col text-center"> <span className="font-semibold text-2xl">{summary?.totalStockOuts}</span>Stock Outs</p>
                                </div>
                                <div className="bg-white border shadow rounded-md p-10 flex items-center justify-center w-fit">
                                    <p className="font-medium  flex flex-col text-center"> <span className="font-semibold text-2xl">{summary?.totalBagsOut}</span>Bags Out</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg  shadow w-full">
                                {/* scroll container */}
                                <div className=" overflow-x-auto ">
                                    <table className="w-full text-sm ">
                                        <thead className="sticky top-0 z-10 bg-slate-100">
                                                {reportData?.data?.length > 0 && 
                                            <tr className="border-b">
                                                    <th
                                                        
                                                        className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                        SL
                                                    </th>
                                                    <th
                                                        
                                                        className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                        SR No
                                                    </th>
                                                    <th
                                                        
                                                        className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                        Booking No
                                                    </th>
                                                    <th
                                                        
                                                        className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                        Customer Info
                                                    </th>
                                                    <th
                                                        
                                                        className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                       Bags out                                                   </th>
                                                    <th
                                                        
                                                        className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                    >
                                                       Date
                                                    </th>
                                            </tr>
}
                                        </thead>

                                        <tbody className="divide-y">
                                            {reportData?.data?.map((row, index) => (
                                                <tr key={index} className="hover:bg-slate-50"> 
                                                        <td
                                                            className="px-4 py-3 text-slate-700 align-top"
                                                        >
                                                         {index+1}   
                                                        </td>
                                                        <td
                                                            className="px-4 py-3 text-slate-700 align-top"
                                                        >
                                                         {row.srNo}   
                                                        </td>
                                                        <td
                                                            className="px-4 py-3 text-slate-700 align-top"
                                                        >
                                                         {row.bookingNo}   
                                                        </td>
                                                        <td
                                                            className="px-4 py-3 text-slate-700 align-top"
                                                        >
                                                            <p>

                                                         {row?.bookingId?.customerName}   
                                                            </p>
                                                            <p>

                                                         {row?.bookingId?.phone}   
                                                            </p>
                                                            <p>

                                                         {row?.bookingId?.address}   
                                                            </p>
                                                         
                                                        </td>
                                                    <td
                                                        className="px-4 py-3 text-slate-700 align-top"
                                                    >
                                                        {row.bagsOut}
                                                    </td>
                                                    <td
                                                        className="px-4 py-3 text-slate-700 align-top"
                                                    >
                                                        {
                                                            formatGlobalDate(row.date)
                                                        }
                                                        
                                                    </td>
                                                   
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}

            {/* Custom Tab */}
            {activeTab === "custom" && (
                <>
                    <Card className="bg-teal-50">
                        <CardHeader>
                            <CardTitle>Metadata Report</CardTitle>
                        </CardHeader>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={fetchCustomReport}
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition"
                            >
                                {loading ? "Loading..." : "Get Report"}
                            </button>
                        </div>
                    </Card>
                    {/* Report Data Display */}
                    {metadata?.success && (
                        <div className="mt-8">
                            <div className="flex gap-4 items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Report Results</h3>
                                <button
                                    onClick={exportToExcelMeta}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Export to Excel
                                </button>
                            </div>
                            <div className="bg-white rounded-lg shadow max-w-7xl">
                                {/* scroll container */}
                                <div className=" overflow-x-auto ">
                                    <table className=" text-sm ">
                                        <thead className="sticky top-0 z-10 bg-slate-100">
                                            <tr className="border-b">
                                                {metadata?.data &&
                                                    Object.keys(metadata?.data).map((key) => (
                                                        <th
                                                            key={key}
                                                            className="px-4 py-3 text-left font-semibold text-slate-700 whitespace-nowrap"
                                                        >
                                                            {key}
                                                        </th>
                                                    ))}
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y">
                                            <tr className="hover:bg-slate-50">
                                                {Object.entries(metadata.data).map(([k, value], i) => (
                                                    <td
                                                        key={`${k}-${i}`}
                                                        className="px-4 py-3 text-slate-700 align-top"
                                                    >
                                                        <div className="max-w-[260px] break-words">
                                                            {typeof value === "object" && value !== null
                                                                ? JSON.stringify(value)
                                                                : String(value ?? "")}
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>
                    )}
                </>
            )}

        </div>
    )
};

export default StockOutReportsClient;