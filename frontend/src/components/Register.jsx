import React, { useEffect, useMemo, useState } from "react";
import ThemeToggleButton from "./ui/theme-toggle-button";

const Register = () => {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")
      : "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [touched, setTouched] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^[a-z0-9_]{3,20}$/i.test(form.username)) e.username = "3-20 chars, letters/numbers/_";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!/^\+?[0-9]{7,15}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match";
    if (!form.agree) e.agree = "You must accept";
    return e;
  }, [form]);

  const score = useMemo(() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 5);
  }, [form.password]);

  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ fullName: true, username: true, email: true, phone: true, password: true, confirmPassword: true, agree: true });
    if (!isValid) return;
    try {
      setLoading(true);
      // Replace with your API call
      await new Promise((r) => setTimeout(r, 800));
      console.log("Submitting: ", form);
      alert("Registered! Check console log.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Marketing/aside panel */}
          <aside className="hidden lg:flex flex-col justify-center rounded-2xl p-10 bg-white/60 dark:bg-slate-800/60 backdrop-blur shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-semibold leading-tight mb-4">Welcome to our community</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Join and unlock personalized dashboards, saved items, and more. It only takes a minute.
            </p>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3"><Dot /> Quick registration</li>
              <li className="flex items-start gap-3"><Dot /> Privacy-first account</li>
              <li className="flex items-start gap-3"><Dot /> Easy password reset</li>
            </ul>
          </aside>

          {/* Form card */}
          <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                  error={touched.fullName && errors.fullName}
                  autoComplete="name"
                  placeholder="Harsh Suthar"
                />
                <Field
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  error={touched.username && errors.username}
                  autoComplete="username"
                  placeholder="harsh_01"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  error={touched.email && errors.email}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <Field
                  label="Phone number"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                  error={touched.phone && errors.phone}
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field
                  label="Password"
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  error={touched.password && errors.password}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  rightAddon={
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="px-2 py-1 text-sm rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  }
                />
                <Field
                  label="Confirm password"
                  type={showPwd ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                  error={touched.confirmPassword && errors.confirmPassword}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </div>

              {/* Password strength */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Password strength</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{["Weak","Okay","Good","Strong","Very strong"][Math.max(0, score-1)] || ""}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      score >= 4
                        ? "bg-green-500"
                        : score === 3
                        ? "bg-yellow-400"
                        : "bg-rose-500"
                    } transition-all`}
                    style={{ width: `${(score / 5) * 100}%` }}
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  onBlur={() => setTouched((t) => ({ ...t, agree: true }))}
                  className="mt-1 size-4 rounded border-slate-300 text-slate-900 dark:text-slate-100 focus:ring-slate-400"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  I agree to the <a href="#" className="underline underline-offset-4">Terms</a> & <a href="#" className="underline underline-offset-4">Privacy Policy</a>.
                  {touched.agree && errors.agree && (
                    <span className="block text-rose-600 dark:text-rose-400 mt-1">{errors.agree}</span>
                  )}
                </span>
              </label>

              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full h-11 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-800 transition dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 font-medium shadow-sm"
              >
                {loading ? "Creating account…" : "Create account"}
              </button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account? <a href="#" className="font-medium underline underline-offset-4">Sign in</a>
              </p>
            </form>
          </section>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 pb-10 text-xs text-slate-500 dark:text-slate-400">
        <p>Tip: Dark mode respects your last choice and your system preference.</p>
      </footer>
    </div>
  );
}

function Field({ label, name, value, onChange, onBlur, error, type = "text", autoComplete, placeholder, rightAddon }) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full h-11 px-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-800"
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {rightAddon}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button>
      <ThemeToggleButton />
    </button>
  );
}

function Dot() {
  return <span className="mt-1 inline-block size-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />;
}


export default Register