import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ message: "Note text is required" }, { status: 400 });
        }

        await dbConnect();

        const job = await Job.findOne({ _id: id, createdBy: session.user.id });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        job.notes.push({ text });
        await job.save();

        return NextResponse.json({ message: "Note added successfully", notes: job.notes }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error adding note", error: error.message }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await dbConnect();

        const job = await Job.findOne({ _id: id, createdBy: session.user.id });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({ notes: job.notes }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error fetching notes", error: error.message }, { status: 500 });
    }
}
