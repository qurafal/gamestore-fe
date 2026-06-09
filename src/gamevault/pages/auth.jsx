import { useState } from "react";
import { EmptyState, SectionHeader } from "../components";

export const AuthPage = ({ mode, onLogin, onRegister, onSwitchMode }) => {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-white/10 bg-carbon/80 p-6">
      <SectionHeader
        label={isRegister ? "Register" : "Login"}
        title={isRegister ? "Create Account" : "Welcome Back"}
        description={
          isRegister
            ? "Buat akun baru untuk masuk ke GameVault."
            : "Masuk untuk wishlist, checkout, library, dan top up."
        }
      />

      <form
        className="mt-6 space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          if (isRegister) {
            await onRegister(form);
          } else {
            await onLogin({ email: form.email, password: form.password });
          }
        }}
      >
        {isRegister ? (
          <div>
            <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Username
            </label>
            <input
              value={form.username}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  username: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
            />
          </div>
        ) : null}

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Email
          </label>
          <input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none"
          />
        </div>

        <button className="w-full rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20">
          {isRegister ? "Create Account" : "Login"}
        </button>

        <button
          type="button"
          onClick={onSwitchMode}
          className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          {isRegister ? "Go to Login" : "Go to Register"}
        </button>
      </form>
    </div>
  );
};
