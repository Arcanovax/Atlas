import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css'

import { useEffect, useState } from "react";
import Atlas, { type AuthUser } from './Atlas';
import GoogleLoginPage from './pages/GoogleLoginPage';
import { Navigate, Routes, Route } from "react-router-dom";

function ProtectedDashboard() {
    const [sessionChecked, setSessionChecked] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [sessionError, setSessionError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let cancelled = false;

        fetch("/api/auth/session.php", {
            credentials: "include",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error(`Session validation failed (${response.status})`);
                }
                const data: unknown = await response.json();
                if (
                    !data ||
                    typeof data !== "object" ||
                    !("user" in data) ||
                    !isAuthUser(data.user)
                ) {
                    throw new Error("Session response is invalid");
                }
                if (!cancelled) {
                    setUser(data.user);
                }
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                if (cancelled) {
                    return;
                }
                console.error("Atlas session check failed:", error);
                setSessionError(
                    error instanceof Error
                        ? error.message
                        : "Impossible de vérifier la session",
                );
                setUser(null);
            })
            .finally(() => {
                if (!cancelled) {
                    setSessionChecked(true);
                }
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    if (!sessionChecked) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">
                Vérification de votre session…
            </main>
        );
    }

    if (user) {
        return <Atlas user={user} />;
    }

    if (sessionError) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-200">
                <div>
                    <h1 className="text-xl font-semibold">Session introuvable</h1>
                    <p className="mt-2 text-sm text-slate-400">{sessionError}</p>
                    <button
                        type="button"
                        onClick={() => window.location.assign("/login")}
                        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
                    >
                        Retourner au login
                    </button>
                </div>
            </main>
        );
    }

    return <Navigate to="/login" replace />;
}

function isAuthUser(value: unknown): value is AuthUser {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof value.id === "string" &&
        "email" in value &&
        typeof value.email === "string" &&
        "name" in value &&
        typeof value.name === "string"
    );
}


createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
            	<Route path="/" element={<GoogleLoginPage />} />
            	<Route path="/login" element={<GoogleLoginPage />} />
            	<Route path="/dashboard" element={<ProtectedDashboard />} />
         	</Routes>
        </BrowserRouter>
    </StrictMode>
);
