import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ success: false, error: "No URL provided" }, { status: 400 });
        }

        const res = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch URL: ${res.statusText}`);
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        // Basic Metadata Extraction
        const title = $('meta[property="og:title"]').attr('content') || $('h1').first().text().trim() || "";
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || "";
        const siteName = $('meta[property="og:site_name"]').attr('content') || "";

        // Heuristics for Company/Location (Very basic, depends on site structure)
        // Often title is "Position at Company"
        let company = siteName;
        let position = title;

        if (title.includes(" at ")) {
            const parts = title.split(" at ");
            position = parts[0].trim();
            company = parts[1].trim();
        } else if (title.includes(" | ")) {
            const parts = title.split(" | ");
            position = parts[0].trim();
            company = parts[1].trim(); // Maybe not company, but site title
        }

        return NextResponse.json({
            success: true,
            data: {
                position,
                company,
                description,
                url
            }
        });

    } catch (error) {
        console.error("Scrape Error:", error);
        return NextResponse.json({ success: false, error: "Failed to scrape job details" }, { status: 500 });
    }
}
