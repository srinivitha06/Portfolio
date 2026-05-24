import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Standard high-convenience passcode: "1234" or "admin"
    if (password === "1234" || password.toLowerCase() === "admin") {
      onLoginSuccess();
    } else {
      setError("❌ Incorrect passcode. Try using 'admin' or '1234'!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 text-coffee">
      
      {/* Icon Capsule */}
      <div className="w-16 h-16 rounded-2xl bg-latte/50 flex items-center justify-center shadow-inner mb-6">
        <Lock size={28} className="text-coffee" />
      </div>

      <h3 className="font-serif font-bold text-2xl text-coffee mb-2">
        Admin Portal Login
      </h3>
      <p className="font-sans font-light text-coffee-light text-sm max-w-sm text-center mb-8 leading-relaxed">
        Access the database visual editor. Input the developer credentials to customize sections, upload credentials, and review messages.
      </p>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5 text-left">
        
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-coffee-light tracking-wider">
            Enter Admin Passcode
          </label>
          <div className="relative rounded-2xl overflow-hidden border border-coffee/15 shadow-inner">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="e.g. admin or 1234"
              required
              className="w-full px-4 py-2.5 bg-cream-light/40 focus:bg-cream-light focus:outline-none text-sm text-coffee font-medium tracking-wide pr-10"
            />
            
            {/* Toggle show/hide password */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-coffee-light hover:text-coffee cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Incorrect input warning */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-coffee text-cream-light font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg hover:bg-coffee-dark transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-sm sm:text-base"
        >
          Verify Passcode
          <ShieldCheck size={16} />
        </button>

        {/* Tip Badge */}
        <div className="text-center pt-2">
          <span className="text-[10px] text-coffee-light/75 italic">
            💡 Default developer bypass: <strong className="font-semibold text-coffee-light">admin</strong> or <strong className="font-semibold text-coffee-light">1234</strong>
          </span>
        </div>

      </form>

    </div>
  );
}
