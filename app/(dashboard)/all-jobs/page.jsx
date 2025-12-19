"use client";

import SearchContainer from "@/components/SearchContainer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/jobs");
            if (res.ok) {
                const data = await res.json();
                setJobs(data.jobs);
            } else {
                toast.error("Failed to fetch jobs");
            }
        } catch (error) {
            toast.error("Error loading jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const deleteJob = async (id) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            const res = await fetch(`/api/jobs?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                toast.success("Job deleted");
                fetchJobs();
            } else {
                toast.error("Failed to delete job");
            }
        } catch (error) {
            toast.error("Error deleting job");
        }
    };

    if (loading) {
        return <div className="text-center text-xl mt-12 text-gray-500 animate-pulse">Loading jobs...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <SearchContainer />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Applications ({jobs.length})</h2>
                </div>

                {jobs.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-full mb-4">
                            <FaEdit className="text-3xl text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Applications Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                            You haven’t added any job applications yet. Start tracking your job search by adding one.
                        </p>
                        <Link
                            href="/add-job"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition transform hover:scale-105"
                        >
                            + Add Job Application
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date Applied</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {jobs.map((job) => {
                                    let statusColor = "bg-gray-100 text-gray-700";
                                    let statusLabel = job.status;

                                    if (job.status === "Pending") {
                                        statusColor = "bg-blue-100 text-blue-700 border border-blue-200";
                                        statusLabel = "Applied"; // User requested "Applied" -> Blue
                                    } else if (job.status === "Interview") {
                                        statusColor = "bg-yellow-100 text-yellow-700 border border-yellow-200";
                                    } else if (job.status === "Declined") {
                                        statusColor = "bg-red-100 text-red-700 border border-red-200";
                                        statusLabel = "Rejected"; // User requested "Rejected" -> Red
                                    } else if (job.status === "Offer") {
                                        statusColor = "bg-green-100 text-green-700 border border-green-200";
                                    }

                                    return (
                                        <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">
                                                {job.company}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                                                {job.position}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColor}`}>
                                                    {statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-3">
                                                <Link
                                                    href={`/add-job?edit=${job._id}`} // Assuming edit logic exists or we link to details
                                                    className="text-gray-400 hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-full"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <button
                                                    onClick={() => deleteJob(job._id)}
                                                    className="text-gray-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllJobs;
