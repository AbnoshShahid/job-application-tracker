
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        await dbConnect();
        console.log("MongoDB connected successfully");

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
    }
}
