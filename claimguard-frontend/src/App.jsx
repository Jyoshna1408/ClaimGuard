import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import SubmitClaim from "./pages/SubmitClaim";
import TopNav from "./components/TopNav";

function App() {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch {
            return null;
        }
    });

    const [showRegister, setShowRegister] = useState(false);
    const [view, setView] = useState("browse");
    const [refreshKey, setRefreshKey] = useState(0);

    function logout() {
        localStorage.removeItem("user");
        setUser(null);
        setView("browse");
    }

    if (!user && showRegister) {
        return (
            <Register
                onRegistered={(createdUser) => {
                    if (createdUser) {
                        localStorage.setItem("user", JSON.stringify(createdUser));
                        setUser(createdUser);
                    } else {
                        setShowRegister(false);
                    }
                }}
                onLogin={() => setShowRegister(false)}
            />
        );
    }

    if (!user) {
        return (
            <Login
                onLogin={setUser}
                onRegister={() => setShowRegister(true)}
            />
        );
    }

    if (user.role === "OFFICER") {
        return (
            <div className="app-shell">
                <TopNav user={user} onLogout={logout} />
                <OfficerDashboard user={user} />
            </div>
        );
    }

    return (
        <div className="app-shell">
            <TopNav
                user={user}
                onLogout={logout}
                view={view}
                setView={setView}
            />

            {view === "submit" ? (
                <SubmitClaim
                    user={user}
                    onSubmitted={() => {
                        setRefreshKey((key) => key + 1);
                        setView("browse");
                    }}
                />
            ) : (
                <CustomerDashboard
                    user={user}
                    refreshKey={refreshKey}
                    onFileClaim={() => setView("submit")}
                />
            )}
        </div>
    );
}

export default App;
