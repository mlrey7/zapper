import SignIn from "@/components/SignIn";
import { Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="grid grid-cols-12 h-screen">
      <div className="col-span-6 flex justify-center items-center">
        <Zap className="h-[24rem] w-[24rem]" />
      </div>
      <div className="col-span-6 flex items-center">
        <div className="flex flex-col px-24">
          <h1 className="font-extrabold text-[4rem] mb-12 tracking-tight">
            Happening now
          </h1>
          <div className="flex flex-col w-72">
            <h6 className="text-3xl mb-4 font-extrabold">Join today.</h6>
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
