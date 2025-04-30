"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    if (error) {
      setMessage({ type: "error", text: error.message });
    } else if (data?.session) {
      setMessage({ type: "success", text: "Logged in successfully!" });
      window.location.href = "/home";
    } else {
      setMessage({type: "error", text: "Login succedded but no session"})
    }

    setLoading(false);
  }

  return (
    <>
      <style jsx>{`
        .container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-family: 'geistMono', geistSans;
        }
        form {
          background: rgba(255 255 255 / 0.15);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(8.5px);
          max-width: 360px;
          width: 100%;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          background: #5a67d8;
          color: white;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
        }
        button:disabled {
          background: gray;
          cursor: not-allowed;
        }
        .message {
          margin-top: 1rem;
          font-weight: 600;
        }
        .message.error {
          color: #ff6b6b;
        }
        .message.success {
          color: #48bb78;
        }
      `}</style>
      <div className="container">
        <form onSubmit={handleLogin}>
          <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading} name="button">
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className={`message ${message.type === "error" ? "error" : "success"}`}>
              {message.text}
            </p>
          )}
        </form>
      </div>
    </>
  );
}