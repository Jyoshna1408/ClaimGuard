import { useState } from "react";
import { createClaim } from "../services/api";

const TYPES = [
    { value: "HEALTH", label: "Health", note: "Hospital, pharmacy, treatment" },
    { value: "VEHICLE", label: "Vehicle", note: "Collision, theft, damage" },
    { value: "HOME", label: "Home", note: "Fire, flood, contents" },
    { value: "TRAVEL", label: "Travel", note: "Delay, loss, emergency" }
];

function SubmitClaim({ user, onSubmitted }) {
    const [form, setForm] = useState({
        claimType: "HEALTH",
        amount: "",
        description: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const amount = Number(form.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            setError("Enter an amount greater than zero.");
            return;
        }
        if (form.description.trim().length < 10) {
            setError("Please describe the incident in at least 10 characters.");
            return;
        }

        try {
            setLoading(true);
            await createClaim({
                ...form,
                amount,
                userId: user.id
            });
            setForm({ claimType: "HEALTH", amount: "", description: "" });
            onSubmitted();
        } catch {
            setError("Could not submit the claim. Check the backend and try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="submit-page">
            <section className="hero submit-hero">
                <div className="hero-shade" />
                <div className="hero-copy">
                    <p className="hero-tag">Originals</p>
                    <h1>Drop a new claim into the feed.</h1>
                    <p>Bold type. Fast submit. Instant queue appearance.</p>
                </div>
            </section>

            <form className="glass-card submit-card" onSubmit={handleSubmit}>
                {error && <div className="flash error">{error}</div>}

                <p className="type-label">Pick a title</p>
                <div className="type-grid">
                    {TYPES.map((type) => (
                        <button
                            type="button"
                            key={type.value}
                            className={`type-tile ${form.claimType === type.value ? "active" : ""} ${type.value.toLowerCase()}`}
                            onClick={() => setForm({ ...form, claimType: type.value })}
                        >
                            <strong>{type.label}</strong>
                            <span>{type.note}</span>
                        </button>
                    ))}
                </div>

                <label>
                    Amount (INR)
                    <input
                        name="amount"
                        type="number"
                        min="1"
                        placeholder="50000"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Storyline
                    <textarea
                        name="description"
                        placeholder="What happened, when, and what you need covered."
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button className="cta" type="submit" disabled={loading}>
                    {loading ? "Publishing..." : "Publish claim"}
                </button>
            </form>
        </div>
    );
}

export default SubmitClaim;
