"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm({ type }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    // demo auth logic
    localStorage.setItem("user", JSON.stringify({ email }));
    router.push("/dashboard");
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <h2>{type === "login" ? "Login" : "Signup"}</h2>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        {type === "login" ? "Login" : "Create Account"}
      </button>
    </form>
  );
}
