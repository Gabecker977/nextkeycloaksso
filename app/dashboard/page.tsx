import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession(authOptions) as any;
    if (session && session.roles.includes("default-roles-santafetec")) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <h1>Bem vindo {session.user.name}</h1>
                <h2>Voce pertence a {session.groups} </h2>
                <h3>Sua Sessao expira em {session.expires_at}</h3>
            </main>
        );
    }
    redirect("/unauthorized")
}