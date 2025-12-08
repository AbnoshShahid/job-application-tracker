import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { fullName, phone, location, preferredRole } = await req.json();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Initialize profile if it doesn't exist
        if (!user.profile) {
            user.profile = {};
        }

        user.profile = {
            ...user.profile,
            fullName,
            phone,
            location,
            preferredRole
        };

        await user.save();

        return NextResponse.json({ message: "Profile updated successfully", profile: user.profile }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Error updating profile", error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ profile: user.profile || {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching profile", error: error.message }, { status: 500 });
    }
}
