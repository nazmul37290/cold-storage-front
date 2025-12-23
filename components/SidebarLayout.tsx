"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiMenu,
    FiHome,
    FiFileText,
    FiSettings,
    
    FiUser,
} from "react-icons/fi";
import { FaUsers } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: FiHome },
        { name: "Customers", href: "/customers", icon: FaUsers },
        { name: "Bookings", href: "/bookings", icon: FiFileText },
        { name: "Stock In", href: "/stock-in", icon: GiExitDoor },
        { name: "Profile", href: "/profile", icon: FiUser },
        { name: "Settings", href: "/settings", icon: FiSettings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* ===== Mobile Overlay ===== */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                />
            )}

            {/* ===== Sidebar ===== */}
            <aside
                className={`fixed lg:static z-50 w-64 bg-white border-r shadow-sm transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b font-bold text-slate-800 text-lg">
                    MyApp
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
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
                        );
                    })}
                </nav>
            </aside>

            {/* ===== Main Content ===== */}
            <div className="flex-1 flex flex-col">
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
                <main className="flex-1 p-5 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
