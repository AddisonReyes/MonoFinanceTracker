import { useState } from "react";

import SignIn from "../forms/SignIn";
import SignUp from "../forms/SignUp";

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div>
      {isSignIn ? <SignIn /> : <SignUp />}
      <p>
        {isSignIn ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => setIsSignIn(!isSignIn)}>
          {isSignIn ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
}

export default Login;
