import { useState } from "react";
import { registerUser } from "../services/api";

function Register({ onRegistered, onLogin }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER"
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const user = await registerUser(form);
            localStorage.setItem("user", JSON.stringify(user));
            onRegistered(user);
        } catch (err) {
            setError(err.message || "Registration failed. Try a different email.");
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
                    <p className="billboard-kicker">Join the network</p>
                    <h1>One account. Full claim control.</h1>
                    <p className="billboard-copy">
                        Customers file in seconds. Officers review with
                        one-tap decisions. High contrast. Zero clutter.
                    </p>
                </section>

                <form className="glass-card" onSubmit={handleSubmit}>
                    <h2>Create account</h2>
                    <p className="muted">Pick your role and start streaming claims.</p>

                    {error && <div className="flash error">{error}</div>}

                    <label>
                        Full name
                        <input
                            name="name"
                            placeholder="Alex Rivera"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            name="email"
                            type="email"
                            placeholder="you@claimguard.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Role
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="CUSTOMER">Customer</option>
                            <option value="OFFICER">Insurance officer</option>
                        </select>
                    </label>

                    <button className="cta" type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Start watching claims"}
                    </button>

                    <p className="switch-auth">
                        Already a member?
                        <button type="button" className="text-link" onClick={onLogin}>
                            Sign in
                        </button>
                    </p>
                </form>
            </main>
        </div>
    );
}

export default Register;
