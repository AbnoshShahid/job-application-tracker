"use client";

import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const ClientLayout = ({ children }) => {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
        return (
            <div className="min-h-screen flex flex-col">
                {children}
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 flex-grow">
                {children}
            </main>
            <footer className="bg-[#1a1a1e] py-4 mt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
                &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Job Application Tracker
            </footer>
        </div>
    );
};

export default ClientLayout;
