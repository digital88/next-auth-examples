import { auth } from "@/auth"
import MyPageLayout from "../components/layouts/default"

export default async function ProtectedRoute() {
    const session = await auth()
    return (
        <MyPageLayout>
            <p>This is protected route page. You <b>can't</b> view this route when you are not authenticated.</p>
            <p>You are logged in as: {session?.user?.name}</p>
        </MyPageLayout>
    )
}
