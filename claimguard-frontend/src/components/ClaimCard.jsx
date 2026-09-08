const TYPE_COPY = {
    HEALTH: { label: "Health", kicker: "Medical cover" },
    VEHICLE: { label: "Vehicle", kicker: "Motor cover" },
    HOME: { label: "Home", kicker: "Property cover" },
    TRAVEL: { label: "Travel", kicker: "Trip cover" }
};

function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount || 0);
}

function ClaimCard({ claim }) {
    const type = TYPE_COPY[claim.claimType] || {
        label: claim.claimType,
        kicker: "Insurance"
    };

    const status = (claim.status || "PENDING").toLowerCase();

    return (
        <article className={`poster poster-${(claim.claimType || "HEALTH").toLowerCase()}`}>
            <div className="poster-overlay">
                <span className={`status-pill ${status}`}>{claim.status}</span>
                <div className="poster-meta">
                    <p className="poster-kicker">{type.kicker}</p>
                    <h3>Claim #{claim.id}</h3>
                    <p className="poster-amount">{formatAmount(claim.amount)}</p>
                    <p className="poster-type">{type.label}</p>
                </div>
            </div>
        </article>
    );
}

export default ClaimCard;
