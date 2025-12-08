
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children, session }) => {
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
                <Toaster position="top-center" />
            </ThemeProvider>
        </SessionProvider>
    );
};
