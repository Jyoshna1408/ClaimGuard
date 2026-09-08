const API_BASES = [
    "http://127.0.0.1:8080/api",
    "http://localhost:8080/api",
    "/api"
];

async function request(path, options = {}) {
    let lastError = "Cannot reach ClaimGuard API. Start the backend on port 8080.";

    for (const base of API_BASES) {
        let response;

        try {
            response = await fetch(`${base}${path}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                },
                ...options
            });
        } catch {
            lastError = "Cannot reach ClaimGuard API. Start the Spring Boot backend on port 8080.";
            continue;
        }

        if (response.status === 502 || response.status === 503 || response.status === 504) {
            lastError = "Backend is not running. Start ClaimGuard on port 8080 and try again.";
            continue;
        }

        if (!response.ok) {
            let message = "Request failed";

            try {
                const body = await response.json();
                message = body.message || body.error || message;
            } catch {
                message = `Request failed (${response.status})`;
            }

            throw new Error(message);
        }

        return response.json();
    }

    throw new Error(lastError);
}

export function registerUser(user) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify(user)
    });
}

export function loginUser(credentials) {
    return request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    });
}

export function createClaim(claim) {
    return request("/claims", {
        method: "POST",
        body: JSON.stringify(claim)
    });
}

export function getUserClaims(userId) {
    return request(`/claims/user/${userId}`);
}

export function getAllClaims() {
    return request("/claims");
}

export function updateClaimStatus(id, status) {
    return request(`/claims/${id}/status?status=${encodeURIComponent(status)}`, {
        method: "PUT"
    });
}
