import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    if (session && session.roles?.includes("viewer")) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Bem vindo {session.user.name}</h1>

        </main>
    );
}
    redirect("/unauthorized")
}