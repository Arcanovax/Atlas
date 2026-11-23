import { ShieldCheck, LockKeyhole, ArrowRight } from "lucide-react";

const GOOGLE_AUTH_PATH = "/api/auth/google.php";

function getGoogleAuthUrl(): string {
  return new URL(GOOGLE_AUTH_PATH, window.location.origin).toString();
}

export default function GoogleLoginPage() {
  function handleGoogleLogin() {
    window.location.assign(getGoogleAuthUrl());
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fa] px-6 py-12 text-[#111827]">
      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center p-8 sm:p-12">

          <div className="mb-8">
            <p className="mb-3 text-xl font-medium text-blue-600">Atlas</p>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950">
              Se connecter
            </h2>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z" />
              <path fill="#34A853" d="M12 21.67c2.63 0 4.84-.87 6.46-2.36l-3.14-2.45c-.87.58-1.98.93-3.32.93-2.55 0-4.71-1.72-5.48-4.03H3.27v2.53A9.75 9.75 0 0 0 12 21.67Z" />
              <path fill="#FBBC05" d="M6.52 13.76a5.86 5.86 0 0 1 0-3.52V7.71H3.27a9.75 9.75 0 0 0 0 8.58l3.25-2.53Z" />
              <path fill="#EA4335" d="M12 6.21c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.29 14.63 2.33 12 2.33a9.75 9.75 0 0 0-8.73 5.38l3.25 2.53C7.29 7.93 9.45 6.21 12 6.21Z" />
            </svg>
            Continuer avec Google
            <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </main>
  );
}
