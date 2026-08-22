import { ArrowRight, Compass } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ApiClientError, authApi, setAccessToken } from "@/api/client";
import { heroUrl } from "@/lib/presentationData";
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
        cause instanceof ApiClientError ? cause.message : "Unable to sign in right now"
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] lg:grid lg:grid-cols-2">

      {/* ── LEFT — image panel ── */}
      <div className="relative hidden lg:flex lg:flex-col lg:overflow-hidden">
        {/* Image fills the exact height of the screen */}
        <img
          src={heroUrl}
          alt="Sunlit coastline"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(23,49,74,.85)] via-[rgba(23,49,74,.55)] to-[rgba(23,49,74,.9)]" />

        {/* Content over image */}
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          {/* Top — brand */}
          <Link href="/" className="flex items-center gap-3">
            <BrandMark size={42} />
            <span className="font-serif text-[22px] font-bold text-white">
              World <span className="text-[var(--gold)]">Trotter</span>
            </span>
          </Link>

          {/* Middle — headline */}
          <div>
            <p className="text-[12px] font-extrabold uppercase tracking-[.22em] text-[var(--gold)]">
              Explore the World with Us
            </p>
            <h1 className="mt-5 max-w-md font-serif text-[clamp(2.4rem,3.5vw,3.8rem)] font-bold leading-[.92] tracking-[-.055em] text-white">
              Bring the next place a little closer<span className="text-[var(--gold)]">.</span>
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.75] text-white/65">
              Plan your itinerary, track your budget, and carry every trip in one beautiful place.
            </p>
          </div>

          {/* Bottom — tagline */}
          <p className="flex items-center gap-2 text-[13px] font-semibold text-white/50">
            <Compass size={14} className="text-[var(--gold)]" />
            All your journeys, held together.
          </p>
        </div>
      </div>

      {/* ── RIGHT — form panel ── */}
      <div className="flex min-h-screen items-center justify-center px-6 py-14 sm:px-10 lg:min-h-0 lg:py-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile brand (hidden on desktop) */}
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <BrandMark size={38} />
            <span className="font-serif text-[22px] font-bold text-[var(--navy)]">
              World <span className="text-[var(--gold)]">Trotter</span>
            </span>
          </Link>

          {/* Heading */}
          <p className="text-[12px] font-extrabold uppercase tracking-[.2em] text-[var(--gold)]">
            Welcome back
          </p>
          <h2 className="mt-3 font-serif text-[2.6rem] font-bold leading-[.95] tracking-[-.04em] text-[var(--navy)]">
            Pick up where<br />you left off.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[var(--ink-muted)]">
            Sign in to continue with your saved routes and planning data.
          </p>

          {/* Form */}
          <form
            onSubmit={e => { e.preventDefault(); authenticate(); }}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold uppercase tracking-[.12em] text-[var(--ink-muted)]">
                Email address
              </label>
              <input
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-[15px] font-medium text-[var(--navy)] outline-none transition focus:border-[var(--gold)] focus:shadow-[0_0_0_3px_rgba(183,149,74,.15)]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-extrabold uppercase tracking-[.12em] text-[var(--ink-muted)]">
                Password
              </label>
              <input
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-[15px] font-medium text-[var(--navy)] outline-none transition focus:border-[var(--gold)] focus:shadow-[0_0_0_3px_rgba(183,149,74,.15)]"
                placeholder="Your password"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] py-3.5 text-[15px] font-bold text-white transition hover:bg-[var(--navy-soft)] disabled:opacity-60"
            >
              {pending ? "Signing in…" : <>Enter the journal <ArrowRight size={16} /></>}
            </button>

            <div className="relative flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-[var(--line)]" />
              <span className="text-[12px] font-bold text-[var(--ink-muted)]">or</span>
              <span className="h-px flex-1 bg-[var(--line)]" />
            </div>

            <button
              type="button"
              disabled={pending}
              onClick={() => authenticate(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[var(--gold)] py-3.5 text-[15px] font-bold text-[var(--gold)] transition hover:bg-[var(--gold)] hover:text-[var(--navy)] disabled:opacity-60"
            >
              Continue as demo user
            </button>
          </form>

          <p className="mt-7 text-center text-[14px] text-[var(--ink-muted)]">
            New here?{" "}
            <Link href="/register" className="font-bold text-[var(--navy)] hover:text-[var(--gold)]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
