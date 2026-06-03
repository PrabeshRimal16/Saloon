import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const avatar_url = searchParams.get("avatar_url") || "";
    const nameParam = searchParams.get("name") || "";
    const google_id = searchParams.get("google_id") || "";

    const [form, setForm] = useState({ name: nameParam, password: "", confirmPassword: "", phone: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

    const getPasswordStrength = (pw) => {
      if (!pw) return { label: "", color: "transparent", width: '0%' };
      if (pw.length < 6) return { label: "WEAK", color: '#ef4444', width: '33%' };
      if (pw.length < 10) return { label: "MEDIUM", color: '#d97706', width: '66%' };
      return { label: "STRONG", color: '#16a34a', width: '100%' };
    };

    const strength = getPasswordStrength(form.password);

    const handleSubmit = async (e) => {
      e?.preventDefault?.();
      setError("");

      // Basic client-side validation (do not alter backend logic)
      if (!form.name || !form.name.trim()) {
        setError('Please enter your full name');
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="pb-3 text-gray-400">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.confirmPassword && (
                    <p className={`text-xs mt-1 text-right font-medium ${form.password === form.confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                      {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || form.password !== form.confirmPassword}
                  className="w-full bg-gradient-to-r from-amber-700 to-amber-500 hover:from-amber-800 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold tracking-widest uppercase text-sm py-4 rounded-none transition-all duration-300 shadow-lg shadow-amber-200"
                >
                  {loading ? 'Saving…' : 'Complete Registration'}
                </button>

                <p className="text-center text-[10px] tracking-[0.4em] text-gray-300 uppercase mt-6">© 2025 The Salon at Reston</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
