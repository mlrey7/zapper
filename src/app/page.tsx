import SignIn from "@/components/SignIn";
import { getAuthSession } from "@/lib/auth";
import { Zap } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getAuthSession();

  if (session) redirect("/home");

  return (
    <main className="grid h-screen grid-cols-12">
      <div className="col-span-6 flex items-center justify-center">
        <Zap className="h-[24rem] w-[24rem]" />
      </div>
      <div className="col-span-6 flex items-center">
        <div className="flex flex-col px-24">
          <h1 className="mb-12 text-[4rem] font-extrabold tracking-tight">
            Happening now
          </h1>
          <div className="flex w-72 flex-col">
            <h6 className="mb-4 text-3xl font-extrabold">Join today.</h6>
            <SignIn />
            <p className="text-xs text-slate-500">
              By signing up, you agree to the Terms of Service and Privacy
              Policy, including Cookie Use.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
