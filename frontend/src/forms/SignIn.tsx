import { useState } from "react";
import { useNavigate } from "react-router";

import FormInput from "../components/FormInput";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Implement actual login logic here, such as making an API call to authenticate the user.

    setPassword("");
    setUsername("");

    navigate("/Dashboard");
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Username"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
