import { useState } from "react";
import logo from "../static/logo.jpg";
import "../Login.css";
import { login } from "../api";

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser reloading the page
    setError("");
    setSubmitting(true);

    try {
      const user = await login({ email, password });
      // console.log(user.user);
      onSuccess?.({ ...user, remember });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signin-page">
      <main className="signin-card">
        <div className="signin-brand">
          <img src={logo} alt="" className="signin-brand-logo" />
          <span>Grant</span>
        </div>

        <p className="signin-eyebrow">Please enter your details</p>
        <h1 className="signin-title">Welcome back</h1>

        <form onSubmit={handleSubmit} noValidate={false}>
          <input
            className="signin-input"
            type="email"
            placeholder="Email address"
            aria-label="Email address"
            // autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="signin-input"
            type="password"
            placeholder="Password"
            aria-label="Password"
            // autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="signin-row">
            <label className="signin-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember for 30 days
            </label>
            <a href="#" className="signin-link">
              Forgot password
            </a>
          </div>

          {error && (
            <p className="signin-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="signin-primary"
            type="submit"
            disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          {/* Placeholder: wire up with Google Identity Services and use Google's
              official button/logo asset when you add Google sign-in */}
          <button className="signin-secondary" type="button" disabled>
            Sign in with Google
          </button>
        </form>

        <p className="signin-footer">
          Don't have an account?{" "}
          <a href="#" className="signin-link">
            Sign up
          </a>
        </p>
      </main>
    </div>
  );
}
