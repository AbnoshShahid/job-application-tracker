import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userId = new mongoose.Types.ObjectId(session.user.id);

        // Parallel Aggregations
        const [statusStats, jobTypeStats, monthlyStats, generalStats] = await Promise.all([
            // 1. Status Counts
            Job.aggregate([
                { $match: { createdBy: userId } },
                { $group: { _id: "$status", count: { $sum: 1 } } }
            ]),

            // 2. Job Type Counts
            Job.aggregate([
                { $match: { createdBy: userId } },
                { $group: { _id: "$jobType", count: { $sum: 1 } } }
            ]),

            // 3. Monthly Applications (Last 6 Months)
            Job.aggregate([
                { $match: { createdBy: userId } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": -1, "_id.month": -1 } },
                { $limit: 6 },
            ]),

            // 4. General Stats (Notes & Attachments)
            Job.aggregate([
                { $match: { createdBy: userId } },
                {
                    $group: {
                        _id: null,
                        totalNotes: { $sum: { $size: { $ifNull: ["$notes", []] } } },
                        totalAttachments: { $sum: { $size: { $ifNull: ["$attachments", []] } } },
                        totalJobs: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Formatting Data
        const statusCounts = statusStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, { Pending: 0, Interview: 0, Declined: 0, Declined: 0 }); // Initialize defaults if needed, note 'Declined' might appear twice if not careful, usually standardizing keys is good.

        const jobTypeCounts = jobTypeStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const monthlyApplications = monthlyStats
            .map((item) => {
                const { _id: { year, month }, count } = item;
                const date = new Date(year, month - 1).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                });
                return { date, count };
            })
            .reverse();

        const stats = {
            totalJobs: generalStats[0]?.totalJobs || 0,
            totalInterviews: statusCounts['Interview'] || 0,
            totalDeclined: statusCounts['Declined'] || 0,
            totalPending: statusCounts['Pending'] || 0,
        };

        // Also check for 'rejected' if that's a status used, previously 'Declined' was in enum.

        const general = {
            totalNotes: generalStats[0]?.totalNotes || 0,
            totalAttachments: generalStats[0]?.totalAttachments || 0,
        };

        return NextResponse.json({
            statusCounts,
            jobTypeCounts,
            monthlyApplications,
            stats,
            generalStats: general
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error fetching analytics", error: error.message }, { status: 500 });
    }
}
