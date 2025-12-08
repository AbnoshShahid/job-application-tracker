import { NextResponse } from "next/server";
import { createRequire } from "module";

export const runtime = "nodejs";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json({ success: false, error: "Only PDF files are supported" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Use createRequire to bypass Next.js/Webpack bundling issues for CJS modules
        const require = createRequire(import.meta.url);
        let parse;

        try {
            parse = require("pdf-parse");
        } catch (e) {
            console.error("Require failed", e);
            throw new Error("Failed to load pdf-parse library");
        }

        // Handle strict CJS export
        if (typeof parse !== 'function' && parse.default) {
            parse = parse.default;
        }

        if (typeof parse !== 'function') {
            throw new Error("pdf-parse is not a function even with createRequire");
        }

        const data = await parse(buffer);
        const text = data.text;

        const position = extractPosition(text);
        const company = extractCompany(text);
        const email = extractEmail(text);
        const phone = extractPhone(text);

        return NextResponse.json({
            success: true,
            data: {
                position,
                company,
                email,
                phone
            }
        });

    } catch (error) {
        console.error("Resume parsing error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

function extractPosition(text) {
    // 1. Look for explicit patterns
    const patterns = [
        /(\d+)\s+years?\s+(?:as|of|experience\s+as)\s+([A-Za-z\s]+)/i, // "5 years as Software Engineer"
        /(?:worked|working)\s+as\s+(?:a|an)?\s*([A-Za-z\s]+)/i,        // "Worked as a Product Manager"
        /(?:experience|role|position):\s*([A-Za-z\s]+)/i              // "Role: DevOps Engineer"
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match.length >= 2) {
            // If the pattern has 2 groups (years, title), grab title (group 2), else group 1
            const title = match.length === 3 ? match[2] : match[1];
            return cleanString(title);
        }
    }

    // 2. Fallback: Look for known job titles
    const commonTitles = [
        "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
        "Web Developer", "Data Scientist", "Product Manager", "Project Manager", "Designer",
        "DevOps Engineer", "Marketing Manager", "Sales Representative", "Accountant",
        "HR Manager", "Teacher", "Tutor", "Consultant", "Analyst", "Intern", "Director", "VP"
    ];

    const lowerText = text.toLowerCase();
    for (const title of commonTitles) {
        if (lowerText.includes(title.toLowerCase())) {
            return title;
        }
    }

    return "";
}

function extractCompany(text) {
    // 1. Look for explicit company patterns
    // "at Google", "for Microsoft", "Company: Apple"
    const patterns = [
        /(?:at|for)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\s+in|\s+since|\s+from|\.|,|\n|$)/,
        /(?:Company|Organization):\s*([A-Za-z0-9\s&]+)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            // heuristic: avoid common words if they get caught
            const candidate = match[1].trim();
            if (candidate.length > 2 && candidate.split(' ').length < 6) {
                return cleanString(candidate);
            }
        }
    }

    // 2. Heuristic: Look for capitalized business names often starting lines or after "Experience"
    // This is hard without NLP, but let's try to find lines that look like specific orgs
    // Check for "Inc", "LLC", "Ltd", "Corp"
    const lines = text.split('\n');
    for (const line of lines) {
        if (line.match(/\b(Inc\.|LLC|Corp\.|Ltd\.|Pvt\.|GmbH)\b/i)) {
            return cleanString(line);
        }
        // Check for specific known big tech just in case (optional, but requested regex mostly)
        // Leaving it to the generic regex above for now.
    }

    return "";
}

function extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailRegex);
    return match ? match[0] : "";
}

function extractPhone(text) {
    // Regex for various phone formats:
    // (123) 456-7890, 123-456-7890, +1 123 456 7890, etc.
    const phoneRegex = /(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : "";
}

function cleanString(str) {
    // Remove extra spaces, newlines, and weird characters
    return str.replace(/[\n\r]+/g, " ").replace(/\s+/g, " ").trim();
}
