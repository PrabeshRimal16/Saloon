// RegisterPage.jsx
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      setOffset({
        x: (e.clientX / window.innerWidth) * 30,
        y: (e.clientY / window.innerHeight) * 30,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      style={{
        background: "#f9f9f9",
        color: "#1a1c1c",
        fontFamily: "Montserrat, sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowX: "hidden",
        position: "relative",
        padding: "40px 20px",
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "40%",
            height: "60%",
            opacity: 0.1,
            transform: "rotate(12deg)",
          }}
        >
          <img
            alt="decor"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFsMxJFfGtelEGYij_FpR0KXk5LbHfp-aYk9wE-ruBDk0unXfm4lwoCKKQhryZVsbJnL5f-NIEneTF3QkmHbeac1dsPA2fKCGBhav-TFaiCL578DmSBoHItDYJaqOPgRXaFbXNiSjq1gZj4FEFB4qmp_keHwNgMihYlB_aTKgxZlWFfaLTffyqCytaFMil7reVjfPrrM3WveXpdL_PtFNicp_k-BKCoo7KtHkzkMgMEcehvxW-uxGxyDhlknaURwPBuG4YiVJkVp_A"
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 500,
            height: 500,
            borderRadius: "50%",
            filter: "blur(120px)",
            backgroundColor: "rgba(254, 214, 91, 0.1)",
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        />
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 980,
          padding: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Brand header */}
        <header className="mb-12 text-center">
          <h1
            className="font-bold uppercase"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, letterSpacing: "0.2em", color: "#000" }}
          >
            L'Atelier
          </h1>
          <p className="text-[12px] font-medium mt-2 uppercase tracking-widest" style={{ color: "#7e7576" }}>
            Modern Professional precision
          </p>
        </header>

        {/* Card */}
        <div
          style={{
            width: "100%",
            maxWidth: 480,
            padding: 24,
            transition: "all 0.25s ease",
            background: "#fff",
            border: "1px solid rgba(207,196,197,0.3)",
            boxSizing: "border-box",
          }}
        >
          <div className="mb-10">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 500, lineHeight: 1.3 }}>
              Create Account
            </h2>
            <p className="text-[16px] leading-relaxed mt-2" style={{ color: "#4c4546" }}>
              Enter your details to join our exclusive inner circle.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <Field id="full_name" label="Full Name" placeholder="Evelyn Harper" type="text" />
            <Field id="phone" label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />

            <div className="group">
              <label
                htmlFor="password"
                className="text-[12px] font-medium tracking-wider uppercase mb-1 block"
                style={{ color: "#4c4546" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="form-input-atelier"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 bottom-3"
                  style={{ color: "#7e7576" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 text-[14px] font-semibold uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
              style={{ background: "#000", color: "#fff" }}
            >
              Register Account
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(207,196,197,0.3)" }} />
            <span style={{ padding: "0 12px", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7e7576" }}>
              OR
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: "rgba(207,196,197,0.3)" }} />
          </div>

          <button
            type="button"
            className="w-full py-4 flex items-center justify-center gap-3 text-[14px] font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-gray-50"
            style={{ border: "1px solid rgba(207,196,197,0.6)" }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <footer className="mt-10 text-center">
            <p className="text-[16px]" style={{ color: "#4c4546" }}>
              Already a member?
              <a href="#" className="font-bold ml-1 hover:underline" style={{ color: "#735c00" }}>
                Login here
              </a>
            </p>
          </footer>
        </div>

        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          <a href="#" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7e7576", textDecoration: "none" }}>
            Privacy Policy
          </a>
          <a href="#" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7e7576", textDecoration: "none" }}>
            Terms of Service
          </a>
        </div>
      </main>

      <style>{`
        .form-input-atelier {
          border: none;
          border-bottom: 1px solid #cfc4c5;
          background: transparent;
          padding: 12px 0;
          width: 100%;
          transition: border-color 0.3s ease;
          font-family: Montserrat, sans-serif;
          font-size: 16px;
          color: #1a1c1c;
        }
        .form-input-atelier:focus {
          outline: none;
          border-bottom: 1px solid #735c00;
        }
        .form-input-atelier::placeholder { color: #7e7576; }

        /* Small responsive tweaks */
        @media (max-width: 640px) {
          h1, h2 { font-size: 22px !important; }
          .form-input-atelier { font-size: 15px; }
        }
      `}</style>
    </div>
  );
}

function Field({ id, label, placeholder, type }) {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="text-[12px] font-medium tracking-wider uppercase mb-1 block"
        style={{ color: "#4c4546" }}
      >
        {label}
      </label>
      <input id={id} name={id} type={type} required placeholder={placeholder} className="form-input-atelier" />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M23.49 12.275c0-.845-.075-1.66-.215-2.445h-11.275v4.625h6.435c-.275 1.485-1.115 2.74-2.375 3.585v2.98h3.845c2.25-2.07 3.54-5.12 3.54-8.745z" fill="#4285F4" />
      <path d="M12 24c3.24 0 5.955-1.075 7.945-2.915l-3.845-2.98c-1.075.715-2.435 1.14-4.1 1.14-3.155 0-5.83-2.13-6.79-4.99H1.32v3.09c1.995 3.96 6.075 6.745 10.68 6.745z" fill="#34A853" />
      <path d="M5.21 14.255c-.24-.715-.38-1.485-.38-2.255s.14-1.54.38-2.255v-3.09h-3.89c-.81 1.615-1.275 3.42-1.275 5.345s.465 3.73 1.275 5.345l3.89-3.09z" fill="#FBBC05" />
      <path d="M12 4.75c1.765 0 3.35.61 4.595 1.795l3.445-3.445c-2.095-1.955-4.84-3.1-8.04-3.1-4.605 0-8.685 2.785-10.68 6.745l3.89 3.09c.96-2.86 3.635-4.99 6.79-4.99z" fill="#EA4335" />
    </svg>
  );
}
