import { NextResponse } from "next/server";
// Import pdf-parse using default import, but handle potential CommonJS structure if needed
import pdfParse from "pdf-parse";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert Blob to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF
        let text = "";
        try {
            const data = await pdfParse(buffer);
            text = data.text;
        } catch (parseError) {
            console.error("PDF Parse Library Error:", parseError);
            return NextResponse.json({ error: "Failed to read PDF content", details: parseError.message }, { status: 500 });
        }

        // --- Extraction Logic ---

        // 1. Email
        const emailRegex = /[\w.-]+@[\w-]+\.[\w.-]+/g;
        const emails = text.match(emailRegex);
        const email = emails ? emails[0] : "";

        // 2. Phone
        const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/g;
        const phones = text.match(phoneRegex);
        const phone = phones ? phones[0] : "";

        // 3. Skills
        let skills = [];
        const skillsMatch = text.match(/Skills:?\s*([\s\S]*?)(?:\n\n|\r\n\r\n|Experience|Work History|Education)/i);
        if (skillsMatch && skillsMatch[1]) {
            skills = skillsMatch[1]
                .replace(/[\r\n]+/g, " ")
                .split(/,|•|\|/)
                .map(s => s.trim())
                .filter(s => s.length > 1 && s.length < 30)
                .slice(0, 10);
        }

        // 4. Position & Company
        let position = "";
        let company = "";

        const expSectionMatch = text.match(/(?:Experience|Work History|Emloyment)([\s\S]*?)(?:\n\n\n|Education|Projects)/i);
        if (expSectionMatch && expSectionMatch[1]) {
            const expLines = expSectionMatch[1].split("\n").map(l => l.trim()).filter(l => l.length > 0);
            if (expLines.length > 0) {
                const firstLine = expLines[0];
                const atIndex = firstLine.toLowerCase().indexOf(' at ');
                if (atIndex > -1) {
                    position = firstLine.substring(0, atIndex).trim();
                    company = firstLine.substring(atIndex + 4).trim();
                } else {
                    position = expLines[0];
                    if (expLines.length > 1) {
                        company = expLines[1];
                    }
                }
            }
        }

        // Return JSON Success
        return NextResponse.json({
            success: true,
            text: text.substring(0, 500),
            name: "",
            email,
            phone,
            skills,
            position,
            company
        }, { status: 200 });

    } catch (error) {
        console.error("General Parse Error:", error);
        // CRITICAL: Always return JSON, never throw HTML
        return NextResponse.json({
            success: false,
            error: "Failed to parse resume",
            details: error.message
        }, { status: 500 });
    }
}
