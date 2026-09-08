import { useState } from "react";
import { loginUser } from "../services/api";

function Login({ onLogin, onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Enter your email and password to continue.");
            return;
        }

        try {
            setLoading(true);
            const user = await loginUser({ email, password });
            localStorage.setItem("user", JSON.stringify(user));
            onLogin(user);
        } catch (err) {
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="cinema-auth">
            <div className="cinema-bg" />
            <div className="cinema-vignette" />

            <header className="auth-top">
                <div className="logo-mark">CG</div>
                <span className="logo-word">CLAIMGUARD</span>
            </header>

            <main className="auth-stage">
                <section className="billboard">
                    <p className="billboard-kicker">Insurance, recut</p>
                    <h1>Claims that move as fast as you do.</h1>
                    <p className="billboard-copy">
                        File, track, and approve insurance claims in a
                        cinematic workspace built for speed and clarity.
                    </p>
                    <div className="billboard-pills">
                        <span>Health</span>
                        <span>Vehicle</span>
                        <span>Home</span>
                        <span>Travel</span>
                    </div>
                </section>

                <form className="glass-card" onSubmit={handleSubmit}>
                    <h2>Sign in</h2>
                    <p className="muted">Welcome back to your claims feed.</p>

                    {error && <div className="flash error">{error}</div>}

                    <label>
                        Email
                        <input
                            type="email"
                            placeholder="you@claimguard.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label>
                        <span className="label-row">
                            Password
                            <button
                                type="button"
                                className="text-link"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button className="cta" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Get started"}
                    </button>

                    <p className="switch-auth">
                        New here?
                        <button type="button" className="text-link" onClick={onRegister}>
                            Create an account
                        </button>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default Login;
