import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import pdf from "pdf-parse";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("resume");

        if (!file) {
            return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Parse PDF
        const pdfData = await pdf(buffer);
        const resumeText = pdfData.text;

        const filename = `${session.user.id}_${Date.now()}.pdf`;
        const filePath = path.join(process.cwd(), "public/resumes", filename);

        await writeFile(filePath, buffer);

        const resumeUrl = `/resumes/${filename}`;

        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (!user.profile) {
            user.profile = {};
        }

        user.profile.resumeUrl = resumeUrl;
        user.profile.resumeText = resumeText;

        await user.save();

        return NextResponse.json({ message: "Resume uploaded successfully", resumeUrl }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error uploading resume", error: error.message }, { status: 500 });
    }
}
