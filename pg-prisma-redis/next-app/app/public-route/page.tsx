import { auth } from "@/auth"
import MyPageLayout from "../components/layouts/default"

export default async function PublicRoute() {
    const session = await auth()
    return (
        <MyPageLayout>
            <p>This is public route page. You can view this route when you are not authenticated.</p>
            <p>You are logged in as: {session?.user?.name || "anonymous user"}</p>
        </MyPageLayout>
    )
}
