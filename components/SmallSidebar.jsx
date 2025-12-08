
import { FaTimes } from "react-icons/fa";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaWpforms, FaAlignLeft, FaUserCircle, FaChartPie } from "react-icons/fa";

const SmallSidebar = ({ showSidebar, toggleSidebar }) => {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", icon: <FaChartBar />, label: "Stats" },
        { href: "/all-jobs", icon: <FaAlignLeft />, label: "All Jobs" },
        { href: "/add-job", icon: <FaWpforms />, label: "Add Job" },
        { href: "/profile", icon: <FaUserCircle />, label: "Profile" },
        { href: "/analytics", icon: <FaChartPie />, label: "Analytics" },
    ];

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-center items-center transition-all duration-300 ${showSidebar ? "bg-black/50 visible opacity-100" : "invisible opacity-0"
                } lg:hidden`}
            onClick={toggleSidebar}
        >
            <div
                className='bg-[#1a1a1e] w-11/12 max-w-sm p-6 rounded-lg shadow-xl relative border border-gray-800'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className='absolute top-4 left-4 text-red-500 text-2xl hover:scale-110 transition'
                    onClick={toggleSidebar}
                >
                    <FaTimes />
                </button>
                <div className='flex justify-center mb-8 mt-4'>
                    <Logo />
                </div>
                <div className='flex flex-col gap-4'>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                href={link.href}
                                key={link.label}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-lg transition duration-200 ${isActive
                                    ? "bg-blue-900/20 text-blue-500 font-medium"
                                    : "text-gray-400 hover:bg-[#2a2a2e] hover:text-gray-200"
                                    }`}
                                onClick={toggleSidebar}
                            >
                                <span className='text-xl'>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default SmallSidebar;
