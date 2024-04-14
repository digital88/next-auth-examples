// import { auth } from "@/auth"
// import { NextResponse } from "next/server"

// This middlware code will fail because we use redis.
// Either remove redis and use some edge-friendly key-value store
// or move auth check inside pages or inside layout/template.
//
// export default auth((req) => {
//     if (req.url.endsWith("/protected-route")) {
//         if (!req.auth?.user) {
//             const url = req.nextUrl.clone()
//             url.pathname = "/api/auth/signin"
//             return NextResponse.redirect(url)
//         }
//     }
// })

export default function () {

}

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
