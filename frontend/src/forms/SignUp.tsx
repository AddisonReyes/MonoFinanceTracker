import { useState } from "react";
import { useNavigate } from "react-router";

import FormInput from "../components/FormInput";
import { signIn, signUp } from "../services/api";

function SignUp() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await signUp(email, password);
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Could not create account.");
      console.log(`Error: ${err}`);
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <div className="space-y-4">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <FormInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <FormInput
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
