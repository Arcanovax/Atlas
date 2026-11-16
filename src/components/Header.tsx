import { useState } from "react";
import type { AuthUser } from "../Atlas";

interface HeaderProps {
  user: AuthUser;
}

export default function Header({ user }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      const response = await fetch("/api/auth/logout.php", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout request failed");
      }
      window.location.assign("/login");
    } catch {
      setIsLoggingOut(false);
      setLogoutError("Impossible de fermer la session. Réessayez.");
    }
  }

  return (
    <header className="h-16 shrink-0 bg-white border-b
                       border-gray-200 flex items-center
                       justify-between px-6">

      <h2 className="font-semibold text-gray-800">
        Dashboard
      </h2>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-gray-500 sm:inline">
          {user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "Déconnexion…" : "Se déconnecter"}
        </button>
        {logoutError && (
          <span role="alert" className="text-xs text-red-600">
            {logoutError}
          </span>
        )}
      </div>
    </header>
  );
}
