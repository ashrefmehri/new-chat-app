"use client"

import { useState } from "react";
import { SignInForm } from "./sign-in/ui/sign-in-form";
import { SignUpForm } from "./sign-up/ui/sign-up-form";




export const AuthView = () => {
  
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");


  return (
    <>
      { authView === "signin" ? (
        <SignInForm onSwitchToSignUp={() => setAuthView("signup")} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setAuthView("signin")}/>
      )}
    </>
  );
};
