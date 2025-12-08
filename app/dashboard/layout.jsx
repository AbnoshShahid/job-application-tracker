
"use client";

import { useState } from "react";
import BigSidebar from "@/components/BigSidebar";
import SmallSidebar from "@/components/SmallSidebar";

const DashboardLayout = ({ children }) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <section className="flex bg-[#0f0f12] min-h-screen">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <BigSidebar showSidebar={showSidebar} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Sidebar (Conditionally Rendered/Visible) */}
                <SmallSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />

                <div className="p-8 lg:p-12 flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default DashboardLayout;
