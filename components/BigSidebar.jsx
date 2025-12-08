
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartBar, FaWpforms, FaAlignLeft, FaUserCircle, FaChartPie } from "react-icons/fa";

const BigSidebar = () => {
    const pathname = usePathname();

    const links = [
        { href: "/dashboard", icon: <FaChartBar />, label: "Stats" },
        { href: "/all-jobs", icon: <FaAlignLeft />, label: "All Jobs" },
        { href: "/add-job", icon: <FaWpforms />, label: "Add Job" },
        { href: "/profile", icon: <FaUserCircle />, label: "Profile" },
        { href: "/analytics", icon: <FaChartPie />, label: "Analytics" },
    ];

    return (
        <aside className='bg-[#1a1a1e] min-h-screen w-64 shadow-lg hidden lg:block border-r border-gray-800'>
            <div className='sticky top-0 px-6 py-6'>
                <header className='mb-8'>
                    <Logo />
                </header>

                <div className='flex flex-col gap-4'>
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-lg transition duration-200 ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <span className='text-xl'>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};
export default BigSidebar;
