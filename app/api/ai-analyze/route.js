import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { text, jobDescription } = await req.json();

        if (!text) {
            return NextResponse.json({ success: false, error: "No resume text provided" }, { status: 400 });
        }

        // Mock AI implementation (Replace with OpenAI/Groq call if keys available)
        // In a real app, you'd do:
        // const completion = await openai.chat.completions.create({ ... })

        // Simulating processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const analysis = {
            matchScore: Math.floor(Math.random() * (95 - 70) + 70), // Random 70-95
            feedback: [
                "Strong experience in frontend technologies.",
                "Consider highlighting more leadership or soft skills.",
                "Good use of action verbs in project descriptions."
            ],
            missingSkills: jobDescription ? ["Docker", "Kubernetes", "AWS"] : [], // Mock missing skills if JD provided
            summary: "Overall a very strong candidate profile.",
        };

        return NextResponse.json({ success: true, analysis });

    } catch (error) {
        console.error("AI Analyze Error:", error);
        return NextResponse.json({ success: false, error: "Failed to analyze resume" }, { status: 500 });
    }
}
