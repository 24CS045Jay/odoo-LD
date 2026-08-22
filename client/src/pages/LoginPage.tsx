import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ApiClientError, authApi, setAccessToken } from "@/api/client";
import AppImage from "@/components/shared/AppImage";
import { fullLogoUrl, heroUrl } from "@/lib/presentationData";
import BrandMark from "@/components/layout/BrandMark";
export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const authenticate = async (demo = false) => {
    setPending(true);
    setError("");
    try {
      const result = demo
        ? await authApi.demoLogin()
        : await authApi.login({ email, password });
      setAccessToken(result.token);
      navigate("/dashboard");
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Unable to sign in right now"
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="min-h-screen bg-[var(--canvas)] lg:grid lg:grid-cols-[1.15fr_.85fr]">
      <div className="relative hidden overflow-hidden bg-[var(--navy)] lg:block">
        <AppImage
          src={heroUrl}
          alt="Rajasthan fort at golden hour"
          className="h-full w-full object-cover opacity-55"
          containerClassName="absolute inset-0"
        />
        <div className="absolute inset-0 bg-[rgba(23,49,74,.45)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link
            href="/"
            className="inline-flex w-fit rounded-2xl bg-[#FAF7F2] p-2"
          >
            <AppImage
              src={fullLogoUrl}
              alt="World Trotter — Explore the World with Us"
              className="h-auto w-52 mix-blend-multiply"
              containerClassName="h-auto w-52"
            />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--gold)]">
              Explore the World with Us
            </p>
            <h1 className="mt-5 max-w-xl font-serif text-6xl font-bold leading-[.9] tracking-[-.06em]">
              Bring the next place a little closer
              <span className="text-[var(--gold)]">.</span>
            </h1>
          </div>
          <p className="text-sm text-white/60">
            All your journeys, held together.
          </p>
        </div>
      </div>
      <div className="flex items-center px-6 py-12 sm:px-12">
        <form
          onSubmit={event => {
            event.preventDefault();
            authenticate();
          }}
          className="mx-auto w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <BrandMark size={40} />
            <span className="font-serif text-2xl font-bold text-[var(--navy)]">
              World <span className="text-[var(--gold)]">Trotter</span>
            </span>
          </Link>
          <p className="mt-12 text-[10px] font-black uppercase tracking-[.2em] text-[var(--gold)]">
            Welcome back
          </p>
          <h2 className="mt-3 font-serif text-5xl font-bold leading-[.95] text-[var(--navy)]">
            Pick up where you left off.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-muted)]">
            Sign in to continue with your saved routes and real-time planning
            data.
          </p>
          <div className="mt-9 space-y-4">
            <input
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="Email address"
            />
            <input
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="Password"
            />
            {error && (
              <p className="text-sm font-semibold text-red-700">{error}</p>
            )}
            <button
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] py-3.5 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {pending ? (
                "Signing in…"
              ) : (
                <>
                  Enter the journal <ArrowRight size={16} />
                </>
              )}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => authenticate(true)}
              className="w-full text-center text-sm font-extrabold text-[var(--gold)]"
            >
              Continue as demo user
            </button>
          </div>
          <p className="mt-6 text-sm text-[var(--ink-muted)]">
            New here?{" "}
            <Link
              href="/register"
              className="font-extrabold text-[var(--navy)]"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
