"use client";
import { useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SignIn() {
const { data: session, status } = useSession();
useEffect(() => {
    
    if (
      status != "loading" &&
      session &&
      (session as any)?.error === "RefreshAccessTokenError"
    ) {
      signOut({ callbackUrl: "/" });
    }
  }, [session, status]);
  if (status == "loading") {
    return <div className="my-3">Loading...</div>;
  } else if (!session) {
    console.log(status);
    
    signIn("keycloak");
  }
  if(status == "authenticated")
    redirect("/dashboard");
};


