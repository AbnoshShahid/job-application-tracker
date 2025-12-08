"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import ResumeUpload from "@/components/ResumeUpload";
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMagic, FaSave } from "react-icons/fa";

const AddJobPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        position: "",
        company: "",
        jobLocation: "",
        jobType: "full-time",
        status: "Pending",
        notes: "",
    });

    // Resume Data State (hidden or processed)
    const [resumeData, setResumeData] = useState(null);

    const [url, setUrl] = useState("");
    const [scraping, setScraping] = useState(false);

    const handleScrape = async () => {
        if (!url) return;
        setScraping(true);
        try {
            const res = await fetch("/api/scrape-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await res.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    position: data.data.position || prev.position,
                    company: data.data.company || prev.company,
                    notes: prev.notes + (prev.notes ? "\n\n" : "") + "Source: " + url + "\nDescription: " + (data.data.description || ""),
                }));
                toast.success("Job details imported!");
            } else {
                toast.error("Failed to scrape. Try filling manually.");
            }
        } catch (e) {
            toast.error("Scraping error");
        } finally {
            setScraping(false);
        }
    };

    if (status === "loading") {
        return <div className="p-10 flex justify-center">Loading...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleResumeParsed = (data) => {
        // Auto-fill form from parsed resume
        setFormData((prev) => ({
            ...prev,
            position: data.position || prev.position,
            company: data.company || prev.company,
            // If contact info is found, we could add it to notes or a separate field
        }));
        setResumeData(data); // Store for saving if needed
        toast.success("Form auto-filled from Resume!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    resumeData: resumeData ? {
                        rawText: "Parsed from PDF", // Ideally we'd store more if parsing gave it
                        parsedContact: {
                            email: resumeData.email,
                            phone: resumeData.phone
                        }
                    } : null
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Job added successfully!");
                router.push("/dashboard");
            } else {
                toast.error(data.error || "Failed to add job");
            }
        } catch (error) {
            console.error("Error adding job:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Add New Application</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Parsers & Tools */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <ResumeUpload onParseComplete={handleResumeParsed} />
                        <div className="mt-4 text-xs text-gray-500 text-center">
                            Upload a resume to auto-fill details.
                        </div>
                    </div>

                    {/* Job Scraper */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-medium flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-300">
                            <FaMagic className="text-purple-500" /> Auto-Import
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">Paste a job link to extract details.</p>
                        <div className="flex gap-1">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full text-sm p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <button
                                type="button"
                                onClick={handleScrape}
                                disabled={scraping || !url}
                                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                            >
                                {scraping ? "..." : "Go"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Position */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaBriefcase className="text-blue-500" /> Position
                                </label>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="e.g. Frontend Developer"
                                    required
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>

                            {/* Company */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaBuilding className="text-blue-500" /> Company
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="e.g. Google"
                                    required
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Location & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-500" /> Location
                                </label>
                                <input
                                    type="text"
                                    name="jobLocation"
                                    value={formData.jobLocation}
                                    onChange={handleChange}
                                    placeholder="e.g. Remote / New York"
                                    required
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Type</label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                >
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="remote">Remote</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Interview">Interview</option>
                                <option value="Declined">Declined</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Initial Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Add any initial thoughts or details..."
                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md flex justify-center items-center gap-2"
                        >
                            <FaSave /> {loading ? "Saving..." : "Save Job Application"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddJobPage;
