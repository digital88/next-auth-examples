import { auth } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth()
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p>This is root route.</p>
      <div>
        <div>
          <Link className="underline text-blue-500" href="/public-route">See public route.</Link>
        </div>
        <div>
          <Link className="underline text-blue-500" href="/protected-route">See protected route.</Link>
        </div>
        <div>
          {session?.user?.name ?
            <div>
              <p>
                Logged in as: {session?.user?.name}
              </p>
              <p><Link className="underline" href="/api/auth/signout">Logout</Link></p>
            </div>
            : <p><Link className="underline" href="/api/auth/signin">Login</Link></p>}
        </div>
      </div>
    </main>
  );
}
