import React, { useState, useEffect } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';
import { useAuth } from '../../context/AuthContext';

const CSS = `
  .profile-page { background: #F8F7F5; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* Layout */
  .profile-header-text { max-width: 1200px; margin: 0 auto; padding: 48px 40px 0; }
  @media (max-width: 768px) { .profile-header-text { padding: 32px 24px 0; } }
  .profile-layout { max-width: 1200px; margin: 0 auto; padding: 32px 40px 80px; display: grid; grid-template-columns: 300px 1fr; gap: 32px; align-items: start; }
  @media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr; padding: 24px 24px 60px; } }

  /* Left Column: Profile Card */
  .profile-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 24px; }
  .pc-banner { height: 100px; background: linear-gradient(135deg, #1C1C1E 0%, #2A2A2A 100%); position: relative; }
  .pc-avatar-wrap { position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 50%); width: 88px; height: 88px; border-radius: 50%; border: 4px solid white; background: #FEF9ED; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
  .pc-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .pc-initials { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; color: #B8960C; }
  .pc-body { padding: 60px 24px 24px; text-align: center; }
  .pc-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; font-weight: 600; color: #1C1C1E; margin: 0 0 4px; }
  .pc-email { font-size: 13px; color: #6B6B6B; margin: 0 0 12px; }
  .pc-badge { display: inline-flex; align-items: center; gap: 4px; background: #FEF9ED; border: 1px solid #E8D9A0; color: #B8960C; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; }

  /* Left Column: Nav */
  .nav-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); padding: 8px; margin-bottom: 24px; }
  .nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; color: #6B6B6B; font-size: 14px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
  .nav-link:hover { background: #FEF9ED; color: #B8960C; }
  .nav-icon { font-size: 18px; transition: color 0.2s; }

  /* Right Column: Section Cards */
  .section-card { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 32px; }
  .section-header { padding: 24px; border-bottom: 1px solid #F0EBE0; background: #FAFAF8; display: flex; align-items: center; gap: 16px; }
  .section-icon-wrap { width: 40px; height: 40px; border-radius: 50%; background: #FEF9ED; border: 1px solid #E8D9A0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .section-icon { color: #B8960C; font-size: 20px; }
  .section-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 600; color: #1C1C1E; margin: 0; }
  .section-sub { font-size: 13px; color: #6B6B6B; margin: 2px 0 0; }
  .section-body { padding: 24px; }

  /* Rows */
  .info-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #F8F7F5; }
  .info-row:last-child { border-bottom: none; padding-bottom: 0; }
  .info-row:first-child { padding-top: 0; }
  .info-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #AAAAAA; margin-bottom: 4px; }
  .info-value { font-size: 14px; font-weight: 500; color: #1C1C1E; }
  
  .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #F8F7F5; }
  .setting-row:last-child { border-bottom: none; padding-bottom: 0; }
  .setting-row:first-child { padding-top: 0; }
  .setting-info { display: flex; gap: 16px; align-items: center; }
  .setting-icon { width: 40px; height: 40px; border-radius: 50%; background: #F8F7F5; display: flex; align-items: center; justify-content: center; color: #6B6B6B; flex-shrink: 0; }
  .setting-title { font-size: 14px; font-weight: 600; color: #1C1C1E; margin: 0 0 2px; }
  .setting-desc { font-size: 13px; color: #AAAAAA; margin: 0; }

  /* Inputs & Forms */
  .ul-field-wrap { position: relative; margin-bottom: 24px; }
  .ul-input { width: 100%; background: transparent; border: none; border-bottom: 1.5px solid #E8E0D5; padding: 12px 0 10px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1C1C1E; outline: none; transition: border-color 0.25s; box-sizing: border-box; display: block; }
  .ul-input:focus { border-bottom-color: #B8960C; }
  .ul-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #AAAAAA; margin-bottom: 4px; }

  /* Buttons */
  .btn-outline { padding: 10px 20px; border-radius: 8px; border: 1.5px solid #E8E0D5; background: transparent; color: #6B6B6B; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { border-color: #B8960C; color: #B8960C; background: #FEF9ED; }
  .btn-gold { padding: 12px 28px; border-radius: 8px; background: #B8960C; border: none; color: white; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; box-shadow: 0 4px 12px rgba(184,150,12,0.25); }
  .btn-gold:hover { background: #8B7209; }
  .btn-danger-outline { padding: 10px 20px; border-radius: 8px; border: 1.5px solid rgba(192,57,43,0.3); background: transparent; color: #C0392B; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-danger-outline:hover { background: rgba(192,57,43,0.05); border-color: #C0392B; }

  /* Toggle switch */
  .toggle-switch { position: relative; display: inline-flex; cursor: pointer; }
  .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
  .toggle-track { width: 44px; height: 24px; border-radius: 12px; background: #E8E0D5; transition: background 0.3s; display: block; }
  .toggle-input:checked + .toggle-track { background: #B8960C; }
  .toggle-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s; }
  .toggle-input:checked + .toggle-track::after { transform: translateX(20px); }

  /* Success Toast */
  .success-toast { position: fixed; top: 24px; right: 24px; z-index: 9999; display: flex; items-center; gap: 12px; padding: 14px 20px; border-radius: 10px; background: #2D7A4F; color: white; font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.15); animation: slideIn 0.3s ease-out; }
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

function SectionCard({ id, icon, title, subtitle, children }) {
  return (
    <div id={id} className="section-card">
      <div className="section-header">
        <div className="section-icon-wrap">
          <span className="material-symbols-outlined section-icon">{icon}</span>
        </div>
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-sub">{subtitle}</p>
        </div>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" className="toggle-input" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
    </label>
  );
}

const CustomerSetting = () => {
  const { user, loading, logout } = useAuth();
  
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
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
  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || user?.name || 'User';
  const initials = (profile.firstName?.[0] || user?.name?.[0] || 'U').toUpperCase();

  return (
    <>
      <style>{CSS}</style>
      <div className="profile-page">
        <CustomerNavbar />

        {saved && (
          <div className="success-toast">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
            Settings saved successfully!
          </div>
        )}

        <main style={{ paddingTop: 72 }}>
          
          <div className="profile-header-text">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: '#B8960C', margin: '0 0 4px' }}>Customer Portal</p>
            <p style={{ fontSize: 14, color: '#6B6B6B', margin: 0 }}>Manage your personal details and salon preferences</p>
          </div>

          <div className="profile-layout">
            
            {/* Left Column */}
            <div>
              {/* Profile Card */}
              <div className="profile-card">
                <div className="pc-banner">
                  <div className="pc-avatar-wrap">
                    {avatar ? <img src={avatar} alt="Avatar" /> : <span className="pc-initials">{initials}</span>}
                  </div>
                </div>
                <div className="pc-body">
                  <h2 className="pc-name">{displayName}</h2>
                  <p className="pc-email">{profile.email || user?.email || '—'}</p>
                  <div className="pc-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>diamond</span>
                    Noir Member
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="nav-card">
                {[
                  { icon: 'person', label: 'Account Info', href: '#account' },
                  { icon: 'lock', label: 'Security', href: '#security' },
                  { icon: 'notifications', label: 'Notifications', href: '#notifications' },
                ].map(link => (
                  <a key={link.label} href={link.href} className="nav-link">
                    <span className="material-symbols-outlined nav-icon">{link.icon}</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div>
              
              <SectionCard id="account" icon="person" title="Account Information" subtitle="Your profile details on file">
                <div className="info-row">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div className="setting-icon"><span className="material-symbols-outlined">badge</span></div>
                    <div>
                      <div className="info-label">Full Name</div>
                      <div className="info-value">{displayName}</div>
                    </div>
                  </div>
                </div>
                <div className="info-row">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div className="setting-icon"><span className="material-symbols-outlined">mail</span></div>
                    <div>
                      <div className="info-label">Email Address</div>
                      <div className="info-value">{profile.email}</div>
                    </div>
                  </div>
                </div>
                <div className="info-row">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div className="setting-icon"><span className="material-symbols-outlined">call</span></div>
                    <div>
                      <div className="info-label">Phone Number</div>
                      <div className="info-value">{profile.phone || '—'}</div>
                    </div>
                  </div>
                </div>
                <div style={{ paddingTop: 24, marginTop: 16, borderTop: '1px solid #F0EBE0' }}>
                  <button className="btn-outline">Edit Details</button>
                </div>
              </SectionCard>

              <SectionCard id="security" icon="lock" title="Security Settings" subtitle="Manage your password and authentication">
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-icon"><span className="material-symbols-outlined">key</span></div>
                    <div>
                      <p className="setting-title">Password</p>
                      <p className="setting-desc">Keep your account secure with a strong password</p>
                    </div>
                  </div>
                  <button className="btn-outline" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                    {showPasswordForm ? 'Cancel' : 'Change'}
                  </button>
                </div>

                {showPasswordForm && (
                  <div style={{ background: '#F8F7F5', borderRadius: 12, padding: 24, marginTop: 16, marginBottom: 16 }}>
                    <div className="ul-field-wrap">
                      <label className="ul-label">Current Password</label>
                      <input className="ul-input" type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} placeholder="Enter current password" />
                    </div>
                    <div className="ul-field-wrap">
                      <label className="ul-label">New Password</label>
                      <input className="ul-input" type="password" value={passwords.newPass} onChange={e => setPasswords({...passwords, newPass: e.target.value})} placeholder="Min. 6 characters" />
                    </div>
                    <div className="ul-field-wrap">
                      <label className="ul-label">Confirm New Password</label>
                      <input className="ul-input" type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} placeholder="Repeat new password" />
                    </div>
                    <button className="btn-gold" onClick={() => { handleSave(); setShowPasswordForm(false); }}>Update Password</button>
                  </div>
                )}

                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-icon"><span className="material-symbols-outlined">security</span></div>
                    <div>
                      <p className="setting-title">Two-Factor Authentication</p>
                      <p className="setting-desc">Adds an extra layer of security to your account</p>
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: 50, background: '#FDEDED', color: '#C0392B', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Inactive</span>
                </div>
              </SectionCard>

              <SectionCard id="notifications" icon="notifications" title="Notification Preferences" subtitle="Choose how you want to be notified">
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-icon"><span className="material-symbols-outlined">mail</span></div>
                    <div>
                      <p className="setting-title">Email Reminders</p>
                      <p className="setting-desc">Receive appointment updates via email</p>
                    </div>
                  </div>
                  <Toggle checked={prefs.emailReminders} onChange={e => setPrefs({...prefs, emailReminders: e.target.checked})} />
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-icon"><span className="material-symbols-outlined">sms</span></div>
                    <div>
                      <p className="setting-title">SMS Reminders</p>
                      <p className="setting-desc">Text message alerts for upcoming bookings</p>
                    </div>
                  </div>
                  <Toggle checked={prefs.smsReminders} onChange={e => setPrefs({...prefs, smsReminders: e.target.checked})} />
                </div>
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-icon"><span className="material-symbols-outlined">star</span></div>
                    <div>
                      <p className="setting-title">Exclusive Offers</p>
                      <p className="setting-desc">Be first to know about seasonal rituals and promotions</p>
                    </div>
                  </div>
                  <Toggle checked={prefs.newsletterOffers} onChange={e => setPrefs({...prefs, newsletterOffers: e.target.checked})} />
                </div>
                <div style={{ paddingTop: 24, marginTop: 16, borderTop: '1px solid #F0EBE0' }}>
                  <button className="btn-gold" onClick={handleSave}>Save Preferences</button>
                </div>
              </SectionCard>

              <SectionCard id="danger" icon="warning" title="Danger Zone" subtitle="Irreversible account actions">
                <div className="setting-row">
                  <div className="setting-info">
                    <div className="setting-icon" style={{ background: '#FDEDED', color: '#C0392B' }}><span className="material-symbols-outlined">logout</span></div>
                    <div>
                      <p className="setting-title" style={{ color: '#C0392B' }}>Sign Out</p>
                      <p className="setting-desc">End your current session</p>
                    </div>
                  </div>
                  <button className="btn-danger-outline" onClick={logout}>Sign Out</button>
                </div>
              </SectionCard>

            </div>
          </div>
        </main>

        <CustomerFooter />
      </div>
    </>
  );
};

export default CustomerSetting;