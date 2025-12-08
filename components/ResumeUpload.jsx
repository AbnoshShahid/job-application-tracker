"use client";

import { useState } from "react";
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const ResumeUpload = ({ onParseComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            validateAndSetFile(droppedFile);
            e.dataTransfer.clearData();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;

        // Validate Type
        if (selectedFile.type !== "application/pdf") {
            toast.error("Please upload a PDF file");
            return;
        }

        // Validate Size (Max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file first");
            return;
        }

        setIsUploading(true);
        const form = new FormData();
        form.append("file", file);

        try {
            const res = await fetch("/api/parse-resume", {
                method: "POST",
                body: form,
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Resume parsed successfully!");
                if (onParseComplete) {
                    onParseComplete(data.data);
                }
                setFile(null); // Reset after success
            } else {
                toast.error(data.error || "Failed to parse resume");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Error uploading resume. Check console.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Auto-Fill from Resume</h3>
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("resume-upload-input").click()}
            >
                {!file ? (
                    <div className="flex flex-col items-center">
                        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                        <p className="text-gray-600 font-medium">Drag & drop your PDF resume here</p>
                        <span className="text-sm text-gray-400 mt-1">or click to browse (Max 5MB)</span>
                        <input
                            id="resume-upload-input"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <FaFilePdf className="text-4xl text-red-500 mb-2" />
                        <p className="text-gray-700 font-medium mb-1">{file.name}</p>
                        <p className="text-sm text-gray-500 mb-4">
                            {file.size ? (file.size / 1024 / 1024).toFixed(2) : "0.00"} MB
                        </p>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-red-500 transition"
                                disabled={isUploading}
                            >
                                Remove
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isUploading ? "Parsing..." : "Auto-Fill Form"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
