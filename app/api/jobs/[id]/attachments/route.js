import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${session.user.id}_${Date.now()}_${file.name}`;
        const filePath = path.join(process.cwd(), "public/attachments", filename);

        await writeFile(filePath, buffer);

        const fileUrl = `/attachments/${filename}`;

        await dbConnect();

        const job = await Job.findOne({ _id: id, createdBy: session.user.id });

        if (!job) {
            return NextResponse.json({ message: "Job not found" }, { status: 404 });
        }

        job.attachments.push({
            filename: file.name,
            fileUrl
        });

        await job.save();

        return NextResponse.json({ message: "Attachment uploaded successfully", attachments: job.attachments }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error uploading attachment", error: error.message }, { status: 500 });
    }
}
