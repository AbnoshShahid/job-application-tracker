"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaSearch } from "react-icons/fa";

const DashboardPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchJobs();
        }
    }, [status, router]);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/jobs");
            const data = await res.json();
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch {
            console.error("Failed to fetch jobs");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading Dashboard...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, {session?.user?.name || "User"}</p>
                </div>
                <Link
                    href="/add-job"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg transition"
                >
                    <FaPlus /> Add Job Application
                </Link>
            </div>

            {/* Stats Area (Placeholder for now) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 font-medium text-sm uppercase">Total Applications</h3>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{jobs.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 font-medium text-sm uppercase">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                        {jobs.filter(j => j.status === 'Pending').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 font-medium text-sm uppercase">Interviews</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {jobs.filter(j => j.status === 'Interview').length}
                    </p>
                </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Applications</h2>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No job applications found. Start by adding one!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {jobs.map(job => (
                                    <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{job.position}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{job.company}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                                ${job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    job.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
                                                        job.status === 'Declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/jobs/${job._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
