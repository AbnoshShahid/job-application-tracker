"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaFileUpload } from "react-icons/fa";
import { motion } from "framer-motion";

const ProfilePage = () => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Profile State
    const [userData, setUserData] = useState({
        fullName: "",
        phone: "",
        location: "",
        preferredRole: "",
        resumeUrl: "",
        resumeText: "",
    });

    useEffect(() => {
        if (session?.user) {
            // Fetch existing profile data
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/profile");
            const data = await res.json();
            if (res.ok && data.profile) {
                setUserData((prev) => ({ ...prev, ...data.profile }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load profile");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Profile updated successfully!");
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        setIsUploading(true);
        try {
            const res = await fetch("/api/profile/resume", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Resume uploaded successfully!");
                setUserData((prev) => ({ ...prev, resumeUrl: data.resumeUrl }));
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading resume");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 w-full max-w-4xl mx-auto"
        >
            <h1 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                <FaUserCircle className="text-blue-500" /> My Profile
            </h1>

            <div className="bg-[#1a1a1e] rounded-xl shadow-lg border border-gray-800 p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-gray-800 pb-8">
                    <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                        {session?.user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-1">{session?.user?.name || "User Name"}</h2>
                        <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                            <FaEnvelope /> {session?.user?.email || "email@example.com"}
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <label className="text-gray-400 mb-2 block font-medium flex items-center gap-2">
                            <FaUserCircle /> Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={userData.fullName}
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-700 rounded-lg bg-[#0f0f11] text-white focus:outline-none focus:border-blue-500 transition duration-200'
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="text-gray-400 mb-2 block font-medium flex items-center gap-2">
                            <FaPhone /> Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone}
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-700 rounded-lg bg-[#0f0f11] text-white focus:outline-none focus:border-blue-500 transition duration-200'
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="text-gray-400 mb-2 block font-medium flex items-center gap-2">
                            <FaMapMarkerAlt /> Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={userData.location}
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-700 rounded-lg bg-[#0f0f11] text-white focus:outline-none focus:border-blue-500 transition duration-200'
                            placeholder="City, Country"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="text-gray-400 mb-2 block font-medium flex items-center gap-2">
                            <FaBriefcase /> Preferred Job Role
                        </label>
                        <input
                            type="text"
                            name="preferredRole"
                            value={userData.preferredRole}
                            onChange={handleChange}
                            className='w-full p-3 border border-gray-700 rounded-lg bg-[#0f0f11] text-white focus:outline-none focus:border-blue-500 transition duration-200'
                            placeholder="e.g. Frontend Developer"
                        />
                    </div>

                    {/* Resume Upload - Full Width */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-gray-400 mb-2 block font-medium flex items-center gap-2">
                            <FaFileUpload /> Upload Resume (PDF)
                        </label>
                        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition duration-300 bg-[#0f0f11]">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="resume-upload"
                                disabled={isUploading}
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center">
                                {isUploading ? (
                                    <span className="text-blue-400 animate-pulse">Uploading...</span>
                                ) : (
                                    <>
                                        <FaFileUpload className="text-3xl text-gray-500 mb-2" />
                                        <span className="text-gray-400">Click to upload or drag and drop</span>
                                        <span className="text-sm text-gray-600 mt-1">PDF only (Max 5MB)</span>
                                    </>
                                )}
                            </label>
                            {userData.resumeUrl && (
                                <div className="mt-4 p-2 bg-blue-900/20 text-blue-400 rounded text-sm inline-block">
                                    Resume uploaded ✓ <a href={userData.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline ml-2">View</a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </motion.section>
    );
};

export default ProfilePage;
