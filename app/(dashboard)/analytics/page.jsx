"use client";

import { useState, useEffect } from "react";
import { FaChartPie, FaChartBar, FaCalendarCheck, FaClipboardList, FaThumbsDown, FaCheckCircle, FaStickyNote, FaPaperclip } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import toast from "react-hot-toast";

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/analytics");
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    toast.error("Failed to fetch analytics");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error loading data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-12 text-gray-500">Loading analytics...</div>;
    if (!data) return <div className="text-center mt-12 text-gray-500">No data available</div>;

    // Prepare chart data
    const statusData = [
        { name: 'Pending', value: data.statusCounts.Pending || 0, color: '#f59e0b' },
        { name: 'Interview', value: data.statusCounts.Interview || 0, color: '#3b82f6' },
        { name: 'Declined', value: data.statusCounts.Declined || 0, color: '#ef4444' },
    ].filter(item => item.value > 0);

    const jobTypeData = Object.entries(data.jobTypeCounts).map(([key, value]) => ({
        name: key,
        count: value
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <FaChartPie className="text-blue-600" /> Analytics Dashboard
            </h1>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Jobs"
                    count={data.stats.totalJobs}
                    icon={<FaClipboardList />}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard
                    title="Interviews"
                    count={data.stats.totalInterviews}
                    icon={<FaCalendarCheck />}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    title="Declined"
                    count={data.stats.totalDeclined}
                    icon={<FaThumbsDown />}
                    color="bg-red-100 text-red-600"
                />
                <StatCard
                    title="Pending"
                    count={data.stats.totalPending}
                    icon={<FaCheckCircle />}
                    color="bg-yellow-100 text-yellow-600"
                />
            </div>

            {/* General Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Total Notes Added</p>
                        <h3 className="text-3xl font-bold text-gray-800">{data.generalStats.totalNotes}</h3>
                    </div>
                    <div className="p-4 bg-purple-100 text-purple-600 rounded-lg text-2xl">
                        <FaStickyNote />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-gray-500">Attachments Uploaded</p>
                        <h3 className="text-3xl font-bold text-gray-800">{data.generalStats.totalAttachments}</h3>
                    </div>
                    <div className="p-4 bg-orange-100 text-orange-600 rounded-lg text-2xl">
                        <FaPaperclip />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Monthly Applications */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-700 mb-6">Monthly Applications</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.monthlyApplications}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Status Pie Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-700 mb-6">Job Status</h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Job Type Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-700 mb-6">Job Types</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobTypeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" capitalize="true" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8" barSize={50} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

const StatCard = ({ title, count, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-b-4 ${color.replace('text', 'border').split(' ')[0].replace('bg', 'border-b')}`}>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-gray-500 font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{count}</h3>
            </div>
            <div className={`p-3 rounded-lg text-2xl ${color}`}>
                {icon}
            </div>
        </div>
    </div>
);

export default AnalyticsPage;
