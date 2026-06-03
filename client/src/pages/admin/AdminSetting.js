import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import { useAuth } from "../../context/AuthContext";

function SectionCard({ icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#EDE8DC] bg-[#FAFAF8] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FEF9ED] border border-[#E8D9A0] flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[#C9A84C] text-[18px]">{icon}</span>
        </div>
        <div>
          <h3 className="font-['Playfair_Display'] text-[17px] font-bold text-[#1A1A1A]">{title}</h3>
          {subtitle && <p className="text-[12px] text-[#6B6B6B] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#F5F5F5] last:border-b-0">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[#6B6B6B] text-[16px]">{icon}</span>
          </div>
        )}
        <div>
          <div className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest">{label}</div>
          <div className="text-[14px] text-[#1A1A1A] font-medium mt-0.5">{value || "—"}</div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ icon, title, subtitle, children, danger }) {
  return (
    <div className={`flex items-center justify-between py-4 border-b border-[#F5F5F5] last:border-b-0 ${danger ? "group" : ""}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${danger ? "bg-[#FDEDED]" : "bg-[#F5F5F5]"}`}>
          <span className={`material-symbols-outlined text-[18px] ${danger ? "text-[#C0392B]" : "text-[#6B6B6B]"}`}>{icon}</span>
        </div>
        <div>
          <div className={`text-[14px] font-bold ${danger ? "text-[#C0392B]" : "text-[#1A1A1A]"}`}>{title}</div>
          {subtitle && <div className="text-[12px] text-[#6B6B6B] mt-0.5">{subtitle}</div>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-[#C9A84C]" : "bg-[#E0E0E0]"}`} />
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
      </div>
    </label>
  );
}

export default function AdminSetting() {
  const { user, loading, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  // Notification preferences
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(true);
  const [notifAppointment, setNotifAppointment] = useState(true);

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  // Saved toast
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setName(user.name || user.displayName || "");
      setEmail(user.email || "");
      setRole(user.role || (user?.isAdmin ? "admin" : "customer"));
    }
  }, [user, loading]);

  const avatarSrc =
    user?.avatar_url || user?.photo || user?.avatar || user?.avatarUrl || user?.picture || null;

  const initials = name
    ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : (email ? email[0].toUpperCase() : "A");

  const handlePasswordSave = (e) => {
    e.preventDefault();
    setPwError("");
    if (newPw.length < 6) { setPwError("Password must be at least 6 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    // Simulate save
    setPwSuccess(true);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => { setPwSuccess(false); setShowPasswordForm(false); }, 2000);
  };

  const handleSaveNotifications = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const INPUT_CLS =
    "w-full bg-white border-[1.5px] border-[#EDE8DC] rounded-[8px] px-4 py-2.5 text-[14px] outline-none transition-all focus:border-[#C9A84C] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.15)] placeholder:text-[#AAAAAA]";

  return (
    <div className="min-h-screen bg-[#F4F4F6]">
      <AdminSidebar />
      <div className="admin-content pt-[80px]">
        <AdminHeader title="Settings" />

        <main className="p-8 animate-[fadeIn_0.3s_ease-in]">
          {/* Toast */}
          {saved && (
            <div className="fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-[8px] bg-[#2D7A4F] text-white text-[14px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-[fadeIn_0.2s_ease]">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Settings saved successfully
            </div>
          )}

          {/* Page intro */}
          <div className="mb-8">
            <div className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.35em] mb-1">Admin Panel</div>
            <p className="text-[#6B6B6B] text-[14px]">Manage your account preferences and system settings</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Profile Card */}
            <div className="xl:col-span-1 flex flex-col gap-6">
              {/* Profile hero */}
              <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
                {/* Gold banner */}
                <div className="h-20 bg-gradient-to-r from-[#1C1C1E] to-[#2d2d2f] relative">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <div className="relative">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={name}
                          className="w-20 h-20 rounded-full border-[3px] border-white object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#FEF9ED] border-[3px] border-white flex items-center justify-center text-[28px] font-bold text-[#C9A84C] shadow-lg font-['Playfair_Display']">
                          {initials}
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#2D7A4F] border-2 border-white" />
                    </div>
                  </div>
                </div>

                <div className="pt-14 pb-6 px-6 text-center">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-gray-100 rounded animate-pulse mx-auto" />
                      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mx-auto" />
                    </div>
                  ) : (
                    <>
                      <h2 className="font-['Playfair_Display'] text-[22px] font-bold text-[#1A1A1A]">{name || "Administrator"}</h2>
                      <p className="text-[13px] text-[#6B6B6B] mt-1">{email || "—"}</p>
                      <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-[#FEF9ED] border border-[#E8D9A0] rounded-full text-[11px] font-bold text-[#C9A84C] uppercase tracking-widest">
                        <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                        {role === "admin" ? "Administrator" : "Staff"}
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-[#EDE8DC] px-6 py-4 grid grid-cols-3 text-center gap-2">
                  {[
                    { label: "Access", value: "Full" },
                    { label: "Level", value: "4" },
                    { label: "Status", value: "Active" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-[14px] font-bold text-[#C9A84C]">{s.value}</div>
                      <div className="text-[10px] text-[#6B6B6B] uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-2">
                {[
                  { icon: "person", label: "Account Info", target: "#account" },
                  { icon: "lock", label: "Security", target: "#security" },
                  { icon: "notifications", label: "Notifications", target: "#notifications" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.target}
                    className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-[14px] font-medium text-[#6B6B6B] hover:bg-[#FEF9ED] hover:text-[#C9A84C] transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:text-[#C9A84C] transition-colors">{l.icon}</span>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Settings panels */}
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Account Info */}
              <div id="account">
                <SectionCard
                  icon="person"
                  title="Account Information"
                  subtitle="Your profile details from the system"
                >
                  <InfoRow label="Full Name" value={name} icon="badge" />
                  <InfoRow label="Email Address" value={email} icon="mail" />
                  <InfoRow label="Role" value={role === "admin" ? "Administrator" : "Customer"} icon="admin_panel_settings" />
                  <InfoRow
                    label="Account Created"
                    value={user?.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : "—"}
                    icon="calendar_today"
                  />
                </SectionCard>
              </div>

              {/* Security */}
              <div id="security">
                <SectionCard
                  icon="lock"
                  title="Security Settings"
                  subtitle="Manage your password and authentication"
                >
                  <SettingRow
                    icon="key"
                    title="Password"
                    subtitle={showPasswordForm ? "Enter your new password below" : "Keep your account secure with a strong password"}
                  >
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className={`px-4 py-2 rounded-[8px] text-[13px] font-bold transition-all ${
                        showPasswordForm
                          ? "bg-[#F5F5F5] text-[#6B6B6B] hover:bg-[#EBEBEB]"
                          : "border border-[#C9A84C] text-[#C9A84C] hover:bg-[#FEF9ED]"
                      }`}
                    >
                      {showPasswordForm ? "Cancel" : "Change"}
                    </button>
                  </SettingRow>

                  {showPasswordForm && (
                    <form onSubmit={handlePasswordSave} className="mt-4 bg-[#F4F4F6] rounded-[10px] p-5 flex flex-col gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Current Password</label>
                        <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className={INPUT_CLS} placeholder="Enter current password" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">New Password</label>
                        <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className={INPUT_CLS} placeholder="Min. 6 characters" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-1.5">Confirm New Password</label>
                        <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className={INPUT_CLS} placeholder="Repeat new password" required />
                      </div>
                      {pwError && (
                        <div className="flex items-center gap-2 text-[13px] text-[#C0392B] bg-[#FDEDED] px-3 py-2 rounded-[6px]">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          {pwError}
                        </div>
                      )}
                      {pwSuccess && (
                        <div className="flex items-center gap-2 text-[13px] text-[#2D7A4F] bg-[#EAF5EF] px-3 py-2 rounded-[6px]">
                          <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          Password updated successfully!
                        </div>
                      )}
                      <button type="submit" className="py-2.5 bg-[#C9A84C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#b5943b] transition-all shadow-[0_4px_12px_rgba(201,168,76,0.3)]">
                        Update Password
                      </button>
                    </form>
                  )}

                  <SettingRow
                    icon="security"
                    title="Two-Factor Authentication"
                    subtitle="Adds an extra layer of security to your account"
                  >
                    <span className="px-3 py-1 rounded-full bg-[#FDEDED] text-[#C0392B] text-[11px] font-bold uppercase tracking-wider">
                      Inactive
                    </span>
                  </SettingRow>

                  <SettingRow
                    icon="devices"
                    title="Active Sessions"
                    subtitle="Manage devices logged into your account"
                  >
                    <button className="px-4 py-2 rounded-[8px] text-[13px] font-bold border border-[#EDE8DC] text-[#6B6B6B] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all">
                      View
                    </button>
                  </SettingRow>
                </SectionCard>
              </div>

              {/* Notifications */}
              <div id="notifications">
                <SectionCard
                  icon="notifications"
                  title="Notification Preferences"
                  subtitle="Choose how you want to be notified"
                >
                  <SettingRow
                    icon="mail"
                    title="Email Notifications"
                    subtitle="Receive appointment updates via email"
                  >
                    <Toggle checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} />
                  </SettingRow>

                  <SettingRow
                    icon="notifications_active"
                    title="Browser Notifications"
                    subtitle="Show push notifications in the browser"
                  >
                    <Toggle checked={notifBrowser} onChange={() => setNotifBrowser(!notifBrowser)} />
                  </SettingRow>

                  <SettingRow
                    icon="event_available"
                    title="Appointment Reminders"
                    subtitle="Get notified before scheduled appointments"
                  >
                    <Toggle checked={notifAppointment} onChange={() => setNotifAppointment(!notifAppointment)} />
                  </SettingRow>

                  <div className="pt-4 border-t border-[#F5F5F5] mt-2">
                    <button
                      onClick={handleSaveNotifications}
                      className="px-6 py-2.5 bg-[#C9A84C] text-white rounded-[8px] text-[14px] font-bold hover:bg-[#b5943b] shadow-[0_4px_12px_rgba(201,168,76,0.25)] transition-all hover:scale-[1.02]"
                    >
                      Save Preferences
                    </button>
                  </div>
                </SectionCard>
              </div>

              {/* Danger Zone */}
              <SectionCard
                icon="warning"
                title="Danger Zone"
                subtitle="Irreversible account actions"
              >
                <SettingRow
                  icon="logout"
                  title="Sign Out"
                  subtitle="End your current admin session"
                  danger
                >
                  <button
                    onClick={() => { try { logout && logout(); } catch (e) {} }}
                    className="px-4 py-2 rounded-[8px] text-[13px] font-bold border border-[#FBBAB7] text-[#C0392B] hover:bg-[#FDEDED] transition-all"
                  >
                    Sign Out
                  </button>
                </SettingRow>
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}