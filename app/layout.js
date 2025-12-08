
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Job Application Tracker",
    description: "Track and manage your job applications.",
};

export default async function RootLayout({ children }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-[#0f0f12] text-gray-200`}>
                <Providers session={session}>
                    <ClientLayout>
                        {children}
                    </ClientLayout>
                </Providers>
            </body>
        </html>
    );
}
