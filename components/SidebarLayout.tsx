"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiMenu,
    FiHome,
    FiFileText,
    FiChevronDown,
} from "react-icons/fi";
import { FaUsers } from "react-icons/fa6";
import { GoReport } from "react-icons/go";
import { GiEntryDoor, GiExitDoor } from "react-icons/gi";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: FiHome },
        { name: "Customers", href: "/customers", icon: FaUsers },
        { name: "Bookings", href: "/bookings", icon: FiFileText },
        { name: "Stock In", href: "/stock-in", icon: GiExitDoor },
        { name: "Stock Out", href: "/stock-out", icon: GiEntryDoor },
        {
            name: "Reports", href: "/reports", icon: GoReport, children: [
                { name: "Booking reports", href: "/booking-reports", icon: FiFileText },
                { name: "Stock In reports", href: "/stockin-reports", icon: FiFileText },
                { name: "Stock Out reports", href: "/stockout-reports", icon: FiFileText },
            ]
        },
        
    ];

    return (
        <div className="flex min-h-screen  bg-slate-50">
            {/* ===== Mobile Overlay ===== */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
            )}

            {/* ===== Sidebar ===== */}
            <aside
                className={`fixed lg:static shrink-0 z-50 w-64 min-h-screen bg-white border-r shadow-sm transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b font-bold text-slate-800 text-lg">
                    MyApp
                </div>

                {/* Navigation */}
                <nav className="p-4  space-y-2">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        const Icon = item.icon;
                        const hasChildren = item.children && item.children.length > 0;
                        const isExpanded = expandedAccordion === item.name;

                        return (
                            <div key={item.name}>
                                {hasChildren ? (
                                    <>
                                        <button
                                            onClick={() => setExpandedAccordion(isExpanded ? null : item.name)}
                                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                                ${active
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : "text-slate-600 hover:bg-slate-100"
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {item.name}
                                            <FiChevronDown
                                                size={18}
                                                className={`ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                        {isExpanded && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {item.children.map((child) => {
                                                    const childActive = pathname === child.href;
                                                    const ChildIcon = child.icon;
                                                    return (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            onClick={() => setOpen(false)}
                                                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                                        ${childActive
                                                                    ? "bg-indigo-50 text-indigo-600"
                                                                    : "text-slate-600 hover:bg-slate-100"
                                                                }`}
                                                        >
                                                            <ChildIcon size={16} />
                                                            {child.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                prefetch
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
                                ${active
                                                ? "bg-indigo-50 text-indigo-600"
                                                : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* ===== Main Content ===== */}
            <div className=" flex flex-col w-full">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6">
                    <button onClick={() => setOpen(true)} className="lg:hidden">
                        <FiMenu size={22} />
                    </button>

                    <h1 className="text-lg font-semibold text-slate-800">
                        Dashboard
                    </h1>

                    {/* User Avatar */}
                    <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                        U
                    </div>
                </header>

                {/* Page Content */}
                <div className="">
                <main className="  p-5 lg:p-8">{children}</main>
                </div>
            </div>
        </div>
    );
}
