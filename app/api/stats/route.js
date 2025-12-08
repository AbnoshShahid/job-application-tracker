import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userId = new mongoose.Types.ObjectId(session.user.id);

        const stats = await Job.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const monthlyApplications = await Job.aggregate([
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
        ]);

        return NextResponse.json({
            success: true,
            stats: stats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            monthlyApplications: monthlyApplications.map(item => ({
                date: `${item._id.month}/${item._id.year}`,
                count: item.count
            })).reverse()
        });

    } catch (error) {
        console.error("Stats Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
    }
}
