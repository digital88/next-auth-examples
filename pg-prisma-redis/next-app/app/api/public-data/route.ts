export async function GET() {
    return Response.json({ message: "This is public api route, accessible by anyone. This response may also be cached." })
}