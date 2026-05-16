"use client";

import { useState } from "react";
import { changePassword } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("access_token");

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      await changePassword(token, {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setSuccess(
        "Password updated successfully"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        router.replace("/");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.05] backdrop-blur-3xl p-8 shadow-[0_0_80px_rgba(14,165,233,0.08)]">
      {/* GLOW */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-8">
          <div
            className="w-20 h-20 rounded-[2rem]
            bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600
            flex items-center justify-center text-4xl
            shadow-[0_20px_60px_rgba(59,130,246,0.45)] mb-6"
          >
            🔒
          </div>

          <p className="uppercase tracking-[0.25em] text-cyan-300 text-xs font-bold mb-4">
            Security Settings
          </p>

          <h2 className="text-4xl font-black text-white mb-4">
            Change Password
          </h2>

          <p className="text-slate-400 leading-relaxed">
            Update your password to keep your
            account secure and protected.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="mb-6 rounded-2xl
            bg-red-500/10 border border-red-500/20
            p-4 text-red-300 text-sm backdrop-blur-xl"
          >
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div
            className="mb-6 rounded-2xl
            bg-emerald-500/10 border border-emerald-500/20
            p-4 text-emerald-300 text-sm backdrop-blur-xl"
          >
            {success}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* CURRENT PASSWORD */}
          <InputField
            label="Current Password"
            value={currentPassword}
            onChange={(e: any) =>
              setCurrentPassword(
                e.target.value
              )
            }
          />

          {/* NEW PASSWORD */}
          <InputField
            label="New Password"
            value={newPassword}
            onChange={(e: any) =>
              setNewPassword(
                e.target.value
              )
            }
          />

          {/* CONFIRM PASSWORD */}
          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e: any) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          {/* PASSWORD HINT */}
          <div className="rounded-2xl bg-cyan-500/5 border border-cyan-500/10 p-4">
            <p className="text-sm text-cyan-200 leading-relaxed">
              Use at least 8 characters with a mix
              of uppercase letters, lowercase
              letters, and numbers for better
              security.
            </p>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl
            bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600
            font-bold text-lg text-white
            shadow-[0_20px_50px_rgba(59,130,246,0.35)]
            hover:scale-[1.02]
            hover:shadow-[0_20px_70px_rgba(59,130,246,0.55)]
            transition-all duration-300
            disabled:opacity-70"
          >
            {loading
              ? "Updating Password..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* INPUT FIELD */

function InputField({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-3">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={onChange}
        required
        className="w-full px-5 py-4 rounded-2xl
        bg-white/[0.04] border border-white/10
        text-white placeholder:text-slate-500
        focus:outline-none focus:border-cyan-400
        focus:ring-4 focus:ring-cyan-400/10
        transition-all duration-300"
      />
    </div>
  );
}