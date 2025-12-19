"use client";

import BigSidebar from "@/components/BigSidebar";
import Navbar from "@/components/Navbar";
import SmallSidebar from "@/components/SmallSidebar";
import { useState } from "react";

const DashboardLayout = ({ children }) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <main className='dashboard'>
            <SmallSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
            <BigSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
            <div>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className='dashboard-page'>
                    {children}
                </div>
            </div>
        </main>
    );
};
export default DashboardLayout;
