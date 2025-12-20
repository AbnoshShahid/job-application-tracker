import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Fetch all jobs for the logged-in user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Optional: Add filtering/sorting here later based on search params
        const jobs = await Job.find({ createdBy: session.user.id }).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, count: jobs.length, jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create a new job
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();

        // Destructure to separate special fields
        const { position, company, jobLocation, jobType, status, notes, resumeData } = body;

        // Basic validation handled by Mongoose, but good to check presence
        if (!position || !company || !jobLocation) {
            return NextResponse.json({ success: false, error: "Please provide all required fields" }, { status: 400 });
        }

        // Create job object
        const jobData = {
            position,
            company,
            jobLocation,
            jobType,
            status,
            createdBy: session.user.id,
        };

        // Handle initial note if present
        if (notes) {
            jobData.notes = [{ text: notes }];
        }

        // Handle resume data if present
        if (resumeData) {
            jobData.resumeData = resumeData;
            jobData.source = { method: 'resume' };
        } else {
            jobData.source = { method: 'manual' };
        }

        const job = await Job.create(jobData);

        return NextResponse.json({ success: true, job }, { status: 201 });

    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
