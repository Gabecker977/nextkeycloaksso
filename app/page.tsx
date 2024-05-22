import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Ola mundo</h1>
    </main>
  );
}
  return (
    redirect("/signIn")
  )
}
