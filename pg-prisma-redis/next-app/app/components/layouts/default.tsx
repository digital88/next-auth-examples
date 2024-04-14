import FetchTest from "@/app/components/fetch-test"
import Link from "next/link"
import React from "react"

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
    return <>
        <main className="min-h-screen flex flex-col items-start p-24 w-full">
            <section>
                <>
                    <Link className="underline" href="/">Go back to root</Link>
                    {children}
                </>
            </section>
            <section className="w-full">
                <FetchTest></FetchTest>
            </section>
        </main>
    </>
}