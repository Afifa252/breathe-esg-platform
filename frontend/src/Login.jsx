import { useState } from "react";
import axios from "axios";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://breathe-esg-platform-2.onrender.com/api/token/",
        {
          username,
          password,
        }
      );

      localStorage.setItem(
        "access",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      setIsAuthenticated(true);

    } catch (error) {
      console.log(error);

      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>ESG Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;