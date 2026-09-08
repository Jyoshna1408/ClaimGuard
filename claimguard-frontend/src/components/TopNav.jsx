function TopNav({ user, onLogout, view, setView }) {
    const isOfficer = user.role === "OFFICER";

    return (
        <header className="topnav">
            <div className="topnav-left">
                <div className="logo-mark">CG</div>
                <span className="logo-word">CLAIMGUARD</span>

                {!isOfficer && (
                    <nav className="topnav-links">
                        <button
                            className={view === "browse" ? "nav-link active" : "nav-link"}
                            onClick={() => setView("browse")}
                        >
                            Browse
                        </button>
                        <button
                            className={view === "submit" ? "nav-link active" : "nav-link"}
                            onClick={() => setView("submit")}
                        >
                            File a Claim
                        </button>
                    </nav>
                )}
            </div>

            <div className="topnav-right">
                <div className="avatar-chip">
                    <span className="avatar-dot">{user.name?.[0]?.toUpperCase()}</span>
                    <div>
                        <strong>{user.name}</strong>
                        <small>{isOfficer ? "Officer" : "Member"}</small>
                    </div>
                </div>
                <button className="ghost-btn" onClick={onLogout}>
                    Sign out
                </button>
            </div>
        </header>
    );
}

export default TopNav;
