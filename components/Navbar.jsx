"use client";

import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ toggleSidebar }) => {
    const { data: session, status } = useSession();
    const [showLogout, setShowLogout] = useState(false);

    if (status === "loading") return null;

    return (
        <nav className='h-24 flex items-center justify-between px-8 bg-[#1a1a1e] shadow-sm lg:px-12 border-b border-gray-800'>
            <button
                type='button'
                className='text-2xl text-blue-500 hover:text-blue-400 transition lg:hidden'
                onClick={toggleSidebar}
            >
                <FaAlignLeft />
            </button>

            <div className="hidden lg:block text-xl font-semibold text-gray-200">
                Dashboard
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                {status === "authenticated" && session?.user ? (
                    <div className='relative'>
                        <button
                            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md shadow transition duration-200'
                            onClick={() => setShowLogout(!showLogout)}
                        >
                            <FaUserCircle />
                            <span className="capitalize">{session.user.name || session.user.email}</span>
                            <FaCaretDown />
                        </button>

                        <div
                            className={`absolute top-full right-0 mt-2 w-full min-w-[120px] bg-[#2a2a2e] shadow-md rounded-md p-2 text-center transition-all duration-200 z-10 border border-gray-700 ${showLogout ? "visible opacity-100" : "invisible opacity-0"}`}
                        >
                            <button
                                className='text-blue-400 tracking-wide font-medium bg-transparent border-none cursor-pointer w-full hover:underline'
                                onClick={() => signOut()}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
