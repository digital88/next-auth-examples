import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    if (req.url.endsWith("/protected-route")) {
        if (!req.auth?.user) {
            const url = req.nextUrl.clone()
            url.pathname = "/api/auth/signin"
            return NextResponse.redirect(url)
        }
    }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}