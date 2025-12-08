import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        await dbConnect();
        const job = await Job.findOne({ _id: id, createdBy: session.user.id });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching job", error: error.message }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const data = await req.json();

        await dbConnect();
        const job = await Job.findOne({ _id: id, createdBy: session.user.id });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        if (data.status && data.status !== job.status) {
            data.timeline = job.timeline || [];
            data.timeline.push({ status: data.status });
        }

        const updatedJob = await Job.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        return NextResponse.json(updatedJob, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating job", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;

        await dbConnect();
        const job = await Job.findOne({ _id: id, createdBy: session.user.id });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        await Job.findByIdAndDelete(id);

        return NextResponse.json({ message: "Job deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting job", error: error.message }, { status: 500 });
    }
}
