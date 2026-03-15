import { useState } from "react";

import MainLayout from "../layout/MainLayout";
import SignIn from "../forms/SignIn";
import SignUp from "../forms/SignUp";

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-black">
          <div className="mb-5">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-black/70 dark:text-white/70">
              {isSignIn
                ? "Sign in to access your dashboard."
                : "Start tracking with a clean slate."}
            </p>
          </div>

          {isSignIn ? <SignIn /> : <SignUp />}

          <div className="mt-5 flex items-center justify-between text-sm">
            <p className="text-black/70 dark:text-white/70">
              {isSignIn
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <button
              type="button"
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-brand-600 hover:underline"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;
