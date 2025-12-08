"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaStickyNote, FaPaperclip, FaHistory, FaDownload, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const JobDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteText, setNoteText] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSavingNote, setIsSavingNote] = useState(false);

    const fetchJob = async () => {
        try {
            const res = await fetch(`/api/jobs/${id}`);
            if (res.ok) {
                const data = await res.json();
                setJob(data);
            } else {
                toast.error("Failed to load job details");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading job");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchJob();
    }, [id]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!noteText.trim()) return;

        setIsSavingNote(true);
        try {
            const res = await fetch(`/api/jobs/${id}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: noteText }),
            });
            if (res.ok) {
                toast.success("Note added!");
                setNoteText("");
                fetchJob(); // Refresh to show new note
            } else {
                toast.error("Failed to add note");
            }
        } catch (error) {
            toast.error("Error adding note");
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            const res = await fetch(`/api/jobs/${id}/attachments`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                toast.success("File uploaded!");
                fetchJob();
            } else {
                toast.error("Upload failed");
            }
        } catch (error) {
            toast.error("Error uploading file");
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="text-center mt-10 text-gray-500">Loading details...</div>;
    if (!job) return <div className="text-center mt-10 text-gray-500">Job not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto p-6"
        >
            <Link href="/all-jobs" className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-6 transition">
                <FaArrowLeft /> Back to Jobs
            </Link>

            {/* Job Overview Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.position}</h1>
                        <div className="flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                <FaBuilding className="text-blue-500" /> {job.company}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                <FaMapMarkerAlt className="text-red-500" /> {job.jobLocation}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                <FaBriefcase className="text-green-500" /> {job.jobType}
                            </div>
                        </div>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-medium capitalize text-lg ${job.status === 'interview' ? 'bg-blue-100 text-blue-700' :
                            job.status === 'declined' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                        }`}>
                        {job.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline & Attachments */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaHistory className="text-purple-500" /> Timeline
                        </h3>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 pb-2">
                            {(job.timeline || [{ status: 'Applied', date: job.createdAt }]).map((event, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute -left-[31px] bg-blue-500 h-4 w-4 rounded-full border-2 border-white shadow-sm"></div>
                                    <p className="font-semibold text-gray-800 capitalize">{event.status || 'Updated'}</p>
                                    <span className="text-sm text-gray-400">{moment(event.date).format("MMM Do, YYYY")}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attachments */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaPaperclip className="text-orange-500" /> Attachments
                        </h3>

                        <div className="mb-4">
                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                {isUploading ? <span className="text-blue-500">Uploading...</span> : <span className="text-gray-500">Click to upload file</span>}
                            </label>
                        </div>

                        <ul className="space-y-3">
                            {job.attachments && job.attachments.length > 0 ? (
                                job.attachments.map((file, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FaPaperclip className="text-gray-400 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 truncate">{file.filename}</span>
                                        </div>
                                        <a href={file.fileUrl} download className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition">
                                            <FaDownload />
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm text-center italic">No attachments yet</div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Notes */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 h-full flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaStickyNote className="text-yellow-500" /> Notes
                        </h3>

                        <div className="flex-1 overflow-y-auto mb-6 max-h-[500px] space-y-4 pr-2 custom-scrollbar">
                            {job.notes && job.notes.length > 0 ? (
                                job.notes.slice().reverse().map((note, index) => (
                                    <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 relative group">
                                        <p className="text-gray-700 whitespace-pre-wrap">{note.text}</p>
                                        <div className="text-xs text-gray-400 mt-2 text-right">
                                            {moment(note.createdAt).format("MMM Do, h:mm a")}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-10">No notes added yet. Start writing below!</div>
                            )}
                        </div>

                        <form onSubmit={handleAddNote} className="mt-auto">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Add a note about this job..."
                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
                                rows="3"
                            ></textarea>
                            <button
                                type="submit"
                                disabled={isSavingNote || !noteText.trim()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed float-right"
                            >
                                {isSavingNote ? "Saving..." : "Save Note"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default JobDetails;
