import React, { useState, useEffect } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';
import { useAuth } from '../../context/AuthContext';

const CustomerSetting = () => {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [prefs, setPrefs] = useState({ emailReminders: true, smsReminders: true, newsletterOffers: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const parts = (user.name || user.displayName || '').split(' ');
      setProfile({
        firstName: parts.slice(0, -1).join(' ') || parts[0] || '',
        lastName: parts.length > 1 ? parts.slice(-1).join(' ') : '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
      });
    }
  }, [user, loading]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const avatar = user?.avatar_url || user?.photo || user?.avatar;
  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || user?.email || 'User';
  const initials = (profile.firstName?.[0] || user?.name?.[0] || 'U').toUpperCase();

  const tabs = [
    { id: 'profile', icon: 'person', label: 'Profile' },
    { id: 'security', icon: 'lock', label: 'Security' },
    { id: 'preferences', icon: 'tune', label: 'Preferences' },
  ];

  return (
    <div className="bg-[#FBF8F2] text-[#1A1A1A] min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      <main className="flex-grow pt-[80px]">

        {/* Hero bar */}
        <div className="bg-[#1A1A1A] px-8 py-10">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#C9A84C] shrink-0 flex items-center justify-center bg-[#2A2A2A]">
              {avatar
                ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                : <span className="font-serif text-[28px] text-[#C9A84C] font-bold">{initials}</span>
              }
            </div>
            <div>
              <div className="text-[11px] text-[#C9A84C] uppercase tracking-[0.4em] mb-1 font-bold">Account Profile</div>
              <h1 className="font-serif text-[32px] text-white font-bold m-0 leading-tight">{displayName}</h1>
              <p className="text-[13px] text-white/50 mt-1">{profile.email || user?.email}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── Sidebar ── */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Nav Tabs */}
              <div className="bg-white border border-[#EDE8DC] rounded-xl overflow-hidden shadow-sm">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left text-[13px] font-semibold transition-colors border-b border-[#EDE8DC] last:border-0 ${
                      activeTab === tab.id
                        ? 'bg-[#FEF9ED] text-[#C9A84C] border-l-[3px] border-l-[#C9A84C]'
                        : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Membership Card */}
              <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#333] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A84C]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-serif text-[20px] text-[#C9A84C] leading-tight m-0">Atelier<br />Privilege</h3>
                    <span className="material-symbols-outlined text-[#C9A84C] text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                  </div>
                  <p className="text-[11px] text-white/40 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-[15px] text-white font-medium mb-4">Noir Member</p>
                  <div className="w-full h-[1px] bg-white/10 mb-4" />
                  <ul className="space-y-2.5">
                    {['Priority Booking', 'Free Styling Consult'].map(b => (
                      <li key={b} className="flex items-center gap-2 text-white/70 text-[12px]">
                        <span className="material-symbols-outlined text-[#C9A84C] text-[14px]">check</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 justify-center px-4 py-3 border border-red-200 text-red-500 rounded-xl text-[13px] font-semibold hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </div>

            {/* ── Main Panel ── */}
            <div className="lg:col-span-9">

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-[#EDE8DC] rounded-2xl shadow-sm p-8">
                  <h2 className="font-serif text-[26px] text-[#1A1A1A] mb-1 m-0">Personal Details</h2>
                  <p className="text-[13px] text-gray-400 mb-8">Update your name, contact info, and public profile.</p>

                  {saved && (
                    <div className="mb-6 p-4 bg-[#2D7A4F]/10 border border-[#2D7A4F]/30 rounded-lg flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#2D7A4F]">check_circle</span>
                      <p className="text-[#2D7A4F] text-sm font-medium">Changes saved successfully!</p>
                    </div>
                  )}

                  {/* Avatar section */}
                  <div className="flex items-center gap-6 p-5 bg-[#FAFAFA] rounded-xl border border-[#EDE8DC] mb-8">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C9A84C] shrink-0 flex items-center justify-center bg-[#FEF9ED]">
                      {avatar
                        ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        : <span className="font-serif text-[22px] text-[#C9A84C] font-bold">{initials}</span>
                      }
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1A1A1A] mb-1">Profile Photo</p>
                      <p className="text-[12px] text-gray-400 mb-3">JPG or PNG. Max 2MB.</p>
                      <button className="text-[11px] font-bold uppercase tracking-widest border border-[#1A1A1A] text-[#1A1A1A] px-5 py-2 rounded hover:bg-[#1A1A1A] hover:text-white transition-colors">
                        Update Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {[
                      { label: 'First Name', key: 'firstName', type: 'text', placeholder: 'Jane' },
                      { label: 'Last Name', key: 'lastName', type: 'text', placeholder: 'Doe' },
                      { label: 'Email Address', key: 'email', type: 'email', placeholder: 'jane@example.com', full: true },
                      { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000', full: true },
                    ].map(field => (
                      <div key={field.key} className={field.full ? 'md:col-span-2' : ''}>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{field.label}</label>
                        <input
                          type={field.type}
                          value={profile[field.key]}
                          onChange={(e) => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full bg-[#FAFAFA] border border-[#EDE8DC] rounded-lg px-4 py-3 text-[14px] text-[#1A1A1A] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15 outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A84C] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#b5943b] transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Save Changes
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="bg-white border border-[#EDE8DC] rounded-2xl shadow-sm p-8">
                  <h2 className="font-serif text-[26px] text-[#1A1A1A] mb-1 m-0">Security Settings</h2>
                  <p className="text-[13px] text-gray-400 mb-8">Keep your account safe with a strong password.</p>

                  <div className="space-y-5 mb-8">
                    {[
                      { label: 'Current Password', key: 'current', placeholder: '••••••••' },
                      { label: 'New Password', key: 'newPass', placeholder: 'Minimum 8 characters' },
                      { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{field.label}</label>
                        <input
                          type="password"
                          value={passwords[field.key]}
                          onChange={(e) => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full bg-[#FAFAFA] border border-[#EDE8DC] rounded-lg px-4 py-3 text-[14px] text-[#1A1A1A] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/15 outline-none transition-all placeholder:text-gray-300"
                        />
                      </div>
                    ))}
                  </div>

                  <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1A1A1A] text-white text-[12px] font-bold uppercase tracking-widest rounded hover:bg-[#333] transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    Update Password
                  </button>

                  <div className="mt-10 pt-8 border-t border-[#EDE8DC]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">Two-Factor Authentication</h3>
                        <p className="text-[13px] text-gray-400">Add an extra layer of security to your account.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input className="sr-only peer" type="checkbox" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bg-white border border-[#EDE8DC] rounded-2xl shadow-sm p-8">
                  <h2 className="font-serif text-[26px] text-[#1A1A1A] mb-1 m-0">Communication Preferences</h2>
                  <p className="text-[13px] text-gray-400 mb-8">Control how we reach you for updates and offers.</p>

                  <div className="space-y-4">
                    {[
                      { key: 'emailReminders', label: 'Email Reminders for Appointments', desc: 'Get notified 24h before your appointment.' },
                      { key: 'smsReminders', label: 'SMS Reminders for Appointments', desc: 'Text message reminders for upcoming bookings.' },
                      { key: 'newsletterOffers', label: 'Exclusive Offers & Atelier News', desc: 'Be the first to know about seasonal rituals and promos.' },
                    ].map(pref => (
                      <label key={pref.key} className="flex items-center justify-between p-5 bg-[#FAFAFA] rounded-xl border border-[#EDE8DC] cursor-pointer hover:border-[#C9A84C]/50 transition-colors group">
                        <div className="flex-grow mr-4">
                          <p className="text-[14px] font-semibold text-[#1A1A1A] mb-0.5">{pref.label}</p>
                          <p className="text-[12px] text-gray-400">{pref.desc}</p>
                        </div>
                        <div className="relative inline-flex items-center shrink-0">
                          <input
                            className="sr-only peer"
                            type="checkbox"
                            checked={prefs[pref.key]}
                            onChange={(e) => setPrefs(p => ({ ...p, [pref.key]: e.target.checked }))}
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]" />
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-[#EDE8DC]">
                    <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#C0392B] mb-4">Danger Zone</h3>
                    <button className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-500 rounded-lg text-[12px] font-semibold hover:bg-red-50 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </main>

      <CustomerFooter />

      <style>{`
        .peer:checked ~ div { background-color: #C9A84C; }
      `}</style>
    </div>
  );
};

export default CustomerSetting;