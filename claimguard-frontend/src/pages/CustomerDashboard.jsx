import { useEffect, useMemo, useState } from "react";
import { getUserClaims } from "../services/api";
import ClaimCard from "../components/ClaimCard";

function CustomerDashboard({ user, refreshKey, onFileClaim }) {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                setLoading(true);
                const data = await getUserClaims(user.id);
                if (active) setClaims(data);
            } catch {
                if (active) setClaims([]);
            } finally {
                if (active) setLoading(false);
            }
        }

        load();
        return () => {
            active = false;
        };
    }, [user.id, refreshKey]);

    const stats = useMemo(() => {
        const pending = claims.filter((c) => c.status === "PENDING").length;
        const approved = claims.filter((c) => c.status === "APPROVED").length;
        const rejected = claims.filter((c) => c.status === "REJECTED").length;
        return { pending, approved, rejected, total: claims.length };
    }, [claims]);

    const featured = claims[0];

    return (
        <div className="browse-page">
            <section className="hero">
                <div className="hero-shade" />
                <div className="hero-copy">
                    <p className="hero-tag">Now streaming</p>
                    <h1>
                        {featured
                            ? `Claim #${featured.id} is ${featured.status.replace("_", " ").toLowerCase()}`
                            : `Welcome back, ${user.name}`}
                    </h1>
                    <p>
                        {featured
                            ? featured.description || "Your latest claim is live in the feed."
                            : "No claims yet. File one and watch it land on your personal claims billboard."}
                    </p>
                    <div className="hero-actions">
                        <button className="cta" onClick={onFileClaim}>
                            File a claim
                        </button>
                        <span className="hero-stat">
                            {stats.total} titles in your queue
                        </span>
                    </div>
                </div>
            </section>

            <section className="stat-row">
                <div className="stat neon">
                    <span>Total</span>
                    <strong>{stats.total}</strong>
                </div>
                <div className="stat gold">
                    <span>Pending</span>
                    <strong>{stats.pending}</strong>
                </div>
                <div className="stat lime">
                    <span>Approved</span>
                    <strong>{stats.approved}</strong>
                </div>
                <div className="stat cyan">
                    <span>Rejected</span>
                    <strong>{stats.rejected}</strong>
                </div>
            </section>

            <section className="rail">
                <div className="rail-head">
                    <h2>My claims</h2>
                    <p>Hover a title. Click nothing — just feel the motion.</p>
                </div>

                {loading ? (
                    <div className="rail-track">
                        {[1, 2, 3, 4].map((n) => (
                            <div className="poster skeleton" key={n} />
                        ))}
                    </div>
                ) : claims.length === 0 ? (
                    <div className="empty-rail">
                        <h3>Your feed is empty</h3>
                        <p>Drop a health, vehicle, home, or travel claim to start the show.</p>
                        <button className="cta" onClick={onFileClaim}>
                            File first claim
                        </button>
                    </div>
                ) : (
                    <div className="rail-track">
                        {claims.map((claim) => (
                            <ClaimCard key={claim.id} claim={claim} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default CustomerDashboard;
