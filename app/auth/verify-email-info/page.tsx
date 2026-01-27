export default function VerifyEmailInfoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 px-4">
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center overflow-hidden">
        {/* Decorative gradient blur */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>

        {/* Icon */}
        <div className="relative mx-auto mb-6 w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-300">
          <i className="fas fa-envelope-open-text text-white text-3xl"></i>
        </div>

        {/* Heading */}
        <h1 className="relative text-3xl font-black text-slate-900 mb-3">
          Verify your email
        </h1>

        {/* Description */}
        <p className="relative text-slate-600 font-medium leading-relaxed mb-6">
          We’ve sent a verification link to your email address.
          <br />
          Click the link to activate your account and get started.
        </p>

        {/* Info box */}
        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm text-slate-500 mb-8">
          <p>
            Didn’t receive the email?
            <br />
            Check your <b>spam</b> or <b>promotions</b> folder.
          </p>
        </div>

        {/* Action */}
        <a
          href="/auth/login"
          className="relative inline-flex items-center justify-center w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
        >
          Go to Login
        </a>

        {/* Footer note */}
        <p className="relative text-xs text-slate-400 mt-6">
          You can log in only after verifying your email.
        </p>
      </div>
    </div>
  );
}
