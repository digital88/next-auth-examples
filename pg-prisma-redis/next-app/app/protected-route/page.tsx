import { auth } from "@/auth";
import Link from "next/link";

export default async function ProtectedRoute() {
    const session = await auth()
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <Link className="underline" href="/">Go back to root</Link>
            <p>This is protected route page.</p>
            <p>You are logged in as: {session?.user?.name}</p>
        </main>
    );
}
