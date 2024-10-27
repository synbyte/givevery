import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Quicksand } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import "@/app/globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-inter",
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,params
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={quicksand.className} lang="en">
      <body className="bg-background text-foreground">
        <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange>
    <section className="h-full flex flex-col">
    <nav className="w-full flex justify-center">
                <div className="w-full flex justify-end items-center p-3 px-5 text-sm">
                  
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
      <Sidebar id={params.nonprofitId}/>
      <div className="flex justify-center ml-64 p-10 h-full">
      {children}
      </div>
    </section>
      <footer className="text-center"><ThemeSwitcher /></footer>
    </ThemeProvider>
    </body>
    </html>
  );
}
