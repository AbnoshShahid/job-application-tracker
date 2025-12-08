
"use client";

import JobCard from "@/components/JobCard";
import SearchContainer from "@/components/SearchContainer";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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

    if (loading) {
        return <div className="text-center text-xl mt-12 text-gray-500">Loading jobs...</div>;
    }

    return (
        <>
            <SearchContainer />
            <h2 className="mb-4 text-xl font-medium text-gray-700">
                {jobs.length} Jobs Found
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <JobCard key={job._id} {...job} />
                ))}
            </div>
        </>
    );
};

export default AllJobs;
