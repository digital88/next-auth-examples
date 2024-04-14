import { auth } from "@/auth"

export async function GET(request: Request) {
    const session = await auth()
    if (!session?.user?.name) return new Response(null, { status: 401, statusText: "Authorization required to access this api route." })
    return Response.json({ message: "This is private api route, accessible by logged users only. This response is never cached." })
}