"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Icons } from "./Icons";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

type Provider = "google" | "github";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (provider: Provider) => {
    setIsLoading(true);

    try {
      await signIn(provider);
    } catch (error) {
      toast({
        title: "There was a problem",
        description: `There was an error loggin in with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => login("google");
  const loginWithGithub = () => login("github");

  return (
    <div className="py-4 w-full flex flex-col gap-2">
      <Button
        size={"sm"}
        onClick={loginWithGoogle}
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Sign in with Google
      </Button>
      <Button
        size={"sm"}
        onClick={loginWithGithub}
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? null : <Icons.github className="mr-2 h-4 w-4" />}
        Sign in with Github
      </Button>
    </div>
  );
};

export default SignIn;
