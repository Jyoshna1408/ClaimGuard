import { useEffect, useMemo, useState } from "react";
import { getAllClaims, updateClaimStatus } from "../services/api";

function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function OfficerDashboard({ user }) {
    const [claims, setClaims] = useState([]);
    const [busyId, setBusyId] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [error, setError] = useState("");

    async function loadClaims() {
        const data = await getAllClaims();
        setClaims(data);
    }

    useEffect(() => {
        loadClaims().catch(() => setError("Could not load the claims queue."));
    }, []);

    async function changeStatus(id, status) {
        setError("");
        setBusyId(id);
        try {
            await updateClaimStatus(id, status);
            await loadClaims();
        } catch {
            setError("Status update failed. Try again.");
        } finally {
            setBusyId(null);
        }
    }

    const visible = useMemo(() => {
        if (filter === "ALL") return claims;
        return claims.filter((c) => c.status === filter);
    }, [claims, filter]);

    const pending = claims.filter((c) => c.status === "PENDING").length;

    return (
        <div className="officer-page">
            <section className="hero officer-hero">
                <div className="hero-shade" />
                <div className="hero-copy">
                    <p className="hero-tag">Control room</p>
                    <h1>Decide in one beat, {user.name}.</h1>
                    <p>
                        {pending} claims waiting. Approve, reject, or send to review
                        without leaving the feed.
                    </p>
                </div>
            </section>

            <div className="filter-bar">
                {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((item) => (
                    <button
                        key={item}
                        className={filter === item ? "chip active" : "chip"}
                        onClick={() => setFilter(item)}
                    >
                        {item.replace("_", " ")}
                    </button>
                ))}
            </div>

            {error && <div className="flash error page-flash">{error}</div>}

            <div className="queue">
                {visible.length === 0 && (
                    <div className="empty-rail">
                        <h3>Nothing in this lane</h3>
                        <p>Switch filters or wait for the next customer drop.</p>
                    </div>
                )}

                {visible.map((claim) => (
                    <article className="queue-row" key={claim.id}>
                        <div>
                            <p className="queue-id">#{claim.id}</p>
                            <h3>{claim.user?.name || "Customer"}</h3>
                            <p className="muted">{claim.description}</p>
                        </div>
                        <div className="queue-meta">
                            <span>{claim.claimType}</span>
                            <strong>{formatAmount(claim.amount)}</strong>
                            <span className={`status-pill ${(claim.status || "").toLowerCase()}`}>
                                {claim.status}
                            </span>
                        </div>
                        <div className="queue-actions">
                            <button
                                className="act approve"
                                disabled={busyId === claim.id}
                                onClick={() => changeStatus(claim.id, "APPROVED")}
                            >
                                Approve
                            </button>
                            <button
                                className="act review"
                                disabled={busyId === claim.id}
                                onClick={() => changeStatus(claim.id, "UNDER_REVIEW")}
                            >
                                Review
                            </button>
                            <button
                                className="act reject"
                                disabled={busyId === claim.id}
                                onClick={() => changeStatus(claim.id, "REJECTED")}
                            >
                                Reject
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default OfficerDashboard;
