import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ApiClientError, authApi, setAccessToken } from "@/api/client";
import AppImage from "@/components/shared/AppImage";
import { fullLogoUrl, tajUrl } from "@/lib/presentationData";
import BrandMark from "@/components/layout/BrandMark";
export default function RegisterPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const update =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm(current => ({ ...current, [field]: event.target.value }));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await authApi.register(form);
      setAccessToken(result.token);
      navigate("/dashboard");
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Unable to create your account"
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <div className="min-h-screen bg-[var(--canvas)] lg:grid lg:grid-cols-[1.15fr_.85fr]">
      <div className="relative hidden overflow-hidden bg-[var(--navy)] lg:block">
        <AppImage
          src={tajUrl}
          alt="Taj Mahal in morning light"
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
              Make room for more<span className="text-[var(--gold)]">.</span>
            </h1>
          </div>
          <p className="text-sm text-white/60">
            Your next story can start here.
          </p>
        </div>
      </div>
      <div className="flex items-center px-6 py-12 sm:px-12">
        <form onSubmit={submit} className="mx-auto w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <BrandMark size={40} />
            <span className="font-serif text-2xl font-bold text-[var(--navy)]">
              World <span className="text-[var(--gold)]">Trotter</span>
            </span>
          </Link>
          <p className="mt-12 text-[10px] font-black uppercase tracking-[.2em] text-[var(--gold)]">
            Create your account
          </p>
          <h2 className="mt-3 font-serif text-5xl font-bold leading-[.95] text-[var(--navy)]">
            Make room for more.
          </h2>
          <p className="mt-4 text-sm leading-6 text-[var(--ink-muted)]">
            Start saving places, shaping days, and carrying your travel plans
            with you.
          </p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            <input
              required
              value={form.firstName}
              onChange={update("firstName")}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="First name"
            />
            <input
              required
              value={form.lastName}
              onChange={update("lastName")}
              className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="Last name"
            />
            <input
              required
              value={form.email}
              onChange={update("email")}
              type="email"
              className="sm:col-span-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="Email address"
            />
            <input
              required
              value={form.password}
              onChange={update("password")}
              type="password"
              minLength={8}
              className="sm:col-span-2 rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm outline-none focus:border-[var(--gold)]"
              placeholder="Create a password"
            />
          </div>
          {error && (
            <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>
          )}
          <button
            disabled={pending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] py-3.5 text-sm font-extrabold text-white disabled:opacity-60"
          >
            {pending ? (
              "Creating your account…"
            ) : (
              <>
                Start the journey <ArrowRight size={16} />
              </>
            )}
          </button>
          <p className="mt-6 text-center text-sm text-[var(--ink-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-[var(--navy)]">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
