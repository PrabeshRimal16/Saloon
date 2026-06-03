import React, { useState, useEffect } from "react";
import CustomerNavbar from '../../components/CustomerNavbar';
import CustomerFooter from '../../components/CustomerFooter';
import { useAuth } from '../../context/AuthContext';

const CSS = `
  .profile-page { background: #F8F7F5; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

  /* Hero banner */
  .profile-hero { background: #1C1C1E; position: relative; overflow: hidden; padding: 56px 80px; }
  @media (max-width: 768px) { .profile-hero { padding: 48px 32px; } }
  .profile-hero-bokeh { position: absolute; inset: 0; pointer-events: none; }
  .profile-hero-bokeh::before { content: ''; position: absolute; top: -80px; right: -80px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(184,150,12,0.18) 0%, transparent 65%); border-radius: 50%; }
  .profile-hero-bokeh::after { content: ''; position: absolute; bottom: -60px; left: 20%; width: 260px; height: 260px; background: radial-gradient(circle, rgba(184,150,12,0.1) 0%, transparent 65%); border-radius: 50%; }
  .profile-hero-inner { position: relative; z-index: 2; display: flex; align-items: center; gap: 28px; max-width: 1200px; margin: 0 auto; }
  @media (max-width: 600px) { .profile-hero-inner { flex-direction: column; align-items: flex-start; gap: 20px; } }

  .hero-avatar { width: 96px; height: 96px; border-radius: 50%; border: 3px solid #B8960C; box-shadow: 0 0 0 6px rgba(184,150,12,0.2); overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); }
  .hero-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .hero-avatar-initials { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 600; color: #B8960C; }
  .hero-info { flex-grow: 1; }
  .hero-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 8px; }
  .hero-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 40px; font-weight: 400; color: white; margin: 0 0 6px; line-height: 1; }
  .hero-email { font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 12px; }
  .hero-member-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(184,150,12,0.15); border: 1px solid rgba(184,150,12,0.3); color: #D4AF37; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 14px; border-radius: 50px; }

  /* Layout */
  .profile-body { max-width: 1200px; margin: 0 auto; padding: 40px 40px 80px; display: grid; grid-template-columns: 260px 1fr; gap: 28px; }
  @media (max-width: 900px) { .profile-body { grid-template-columns: 1fr; padding: 32px 24px 60px; } }

  /* Sidebar */
  .profile-sidebar { display: flex; flex-direction: column; gap: 16px; }
  .sidebar-nav { background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); overflow: hidden; }
  .sidebar-nav-btn { width: 100%; display: flex; align-items: center; gap: 12px; padding: 16px 20px; text-align: left; background: none; border: none; border-left: 3px solid transparent; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #6B6B6B; border-bottom: 1px solid #F0EBE0; transition: all 0.2s; }
  .sidebar-nav-btn:last-child { border-bottom: none; }
  .sidebar-nav-btn:hover { color: #1C1C1E; background: #FDFCFA; }
  .sidebar-nav-btn.active { border-left-color: #B8960C; color: #B8960C; background: rgba(184,150,12,0.05); font-weight: 600; }
  .sidebar-nav-icon { font-size: 18px; }

  /* Privilege card */
  .privilege-card { background: #1C1C1E; border-radius: 16px; padding: 28px; position: relative; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
  .privilege-glow { position: absolute; top: -40px; right: -40px; width: 180px; height: 180px; background: radial-gradient(circle, rgba(184,150,12,0.25) 0%, transparent 65%); pointer-events: none; }
  .privilege-shimmer { position: absolute; inset: 0; background: linear-gradient(135deg, transparent 40%, rgba(184,150,12,0.06) 50%, transparent 60%); pointer-events: none; }
  .privilege-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; position: relative; z-index: 1; }
  .privilege-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; color: #B8960C; line-height: 1.15; }
  .privilege-body { position: relative; z-index: 1; }
  .privilege-status-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
  .privilege-status { font-size: 16px; color: white; font-weight: 500; margin-bottom: 20px; }
  .privilege-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 16px; }
  .privilege-benefit { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: rgba(255,255,255,0.75); }
  .privilege-check { font-size: 16px; color: #B8960C; }

  /* Logout */
  .sidebar-logout { width: 100%; display: flex; align-items: center; gap: 10px; justify-content: center; padding: 12px 20px; border-radius: 12px; background: transparent; border: 1.5px solid rgba(192,57,43,0.3); color: #C0392B; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  .sidebar-logout:hover { background: rgba(192,57,43,0.07); border-color: #C0392B; }

  /* Main panels */
  .panel { background: white; border-radius: 20px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 40px; }
  @media (max-width: 600px) { .panel { padding: 28px 20px; } }
  .panel-eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 4px; text-transform: uppercase; color: #B8960C; margin-bottom: 8px; }
  .panel-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 36px; font-weight: 400; color: #1C1C1E; margin: 0 0 6px; }
  .panel-sub { font-size: 14px; color: #AAAAAA; margin: 0 0 32px; }

  /* Avatar row in panel */
  .avatar-row { display: flex; align-items: center; gap: 20px; background: #F8F7F5; border-radius: 14px; padding: 20px 24px; margin-bottom: 32px; border: 1px solid #E8E0D5; }
  .panel-avatar { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #B8960C; overflow: hidden; display: flex; align-items: center; justify-content: center; background: rgba(184,150,12,0.08); flex-shrink: 0; }
  .panel-avatar-initials { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #B8960C; }
  .btn-update-photo { padding: 8px 20px; border-radius: 50px; background: transparent; border: 1.5px solid #1C1C1E; color: #1C1C1E; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s; }
  .btn-update-photo:hover { background: #1C1C1E; color: white; }

  /* Underline inputs */
  .ul-field-wrap { position: relative; margin-bottom: 32px; }
  .ul-input, .ul-select {
    width: 100%; background: transparent; border: none;
    border-bottom: 1.5px solid #E8E0D5; padding: 12px 0 10px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1C1C1E;
    outline: none; transition: border-color 0.25s; box-sizing: border-box; display: block;
  }
  .ul-input:focus, .ul-select:focus { border-bottom-color: #B8960C; }
  .ul-label { display: block; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #AAAAAA; margin-bottom: 8px; }

  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }

  .btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 14px 0; border-radius: 50px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: white; background: linear-gradient(90deg, #B8960C 0%, #D4AF37 50%, #B8960C 100%); background-size: 200% auto; animation: shimmer 3s linear infinite; box-shadow: 0 4px 20px rgba(184,150,12,0.3); transition: transform 0.2s, box-shadow 0.2s; width: 100%; justify-content: center; margin-top: 8px; }
  .btn-save:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,150,12,0.4); }

  /* Toggle switch */
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; background: #F8F7F5; border-radius: 12px; margin-bottom: 12px; border: 1px solid #E8E0D5; cursor: pointer; transition: border-color 0.2s; }
  .toggle-row:hover { border-color: rgba(184,150,12,0.4); }
  .toggle-info-title { font-size: 14px; font-weight: 600; color: #1C1C1E; margin: 0 0 3px; }
  .toggle-info-sub { font-size: 12px; color: #AAAAAA; }
  .toggle-switch { position: relative; display: inline-flex; }
  .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
  .toggle-track { width: 44px; height: 24px; border-radius: 12px; background: #E8E0D5; transition: background 0.3s; cursor: pointer; display: block; }
  .toggle-input:checked + .toggle-track { background: #B8960C; }
  .toggle-track::after { content: ''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: transform 0.25s; }
  .toggle-input:checked + .toggle-track::after { transform: translateX(20px); }

  /* Success */
  .success-bar { background: rgba(45,122,79,0.1); border: 1px solid rgba(45,122,79,0.25); border-radius: 10px; padding: 12px 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .success-bar-text { font-size: 13px; color: #1E6B40; font-weight: 500; }

  /* Danger zone */
  .danger-section { margin-top: 32px; padding-top: 32px; border-top: 1px solid #E8E0D5; }
  .danger-title { font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #C0392B; margin-bottom: 16px; }
  .btn-danger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; border-radius: 50px; background: transparent; border: 1.5px solid rgba(192,57,43,0.35); color: #C0392B; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: all 0.2s; }
  .btn-danger:hover { background: rgba(192,57,43,0.08); border-color: #C0392B; }
`;

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
  const displayName = `${profile.firstName} ${profile.lastName}`.trim() || user?.name || 'User';
  const initials = (profile.firstName?.[0] || user?.name?.[0] || 'U').toUpperCase();

  const tabs = [
    { id: 'profile', icon: 'person', label: 'Profile' },
    { id: 'security', icon: 'lock', label: 'Security' },
    { id: 'preferences', icon: 'tune', label: 'Preferences' },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="profile-page">
        <CustomerNavbar />

        <main style={{ paddingTop: 72 }}>

          {/* Hero */}
          <div className="profile-hero">
            <div className="profile-hero-bokeh" />
            <div className="profile-hero-inner">
              <div className="hero-avatar">
                {avatar
                  ? <img src={avatar} alt="Avatar" />
                  : <span className="hero-avatar-initials">{initials}</span>
                }
              </div>
              <div className="hero-info">
                <p className="hero-eyebrow">Account Profile</p>
                <h1 className="hero-name">{displayName}</h1>
                <p className="hero-email">{profile.email || user?.email}</p>
                <span className="hero-member-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>diamond</span>
                  Noir Member
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="profile-body">

            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="sidebar-nav">
                {tabs.map(tab => (
                  <button key={tab.id} className={`sidebar-nav-btn${activeTab === tab.id ? ' active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                    <span className="material-symbols-outlined sidebar-nav-icon" style={{ color: activeTab === tab.id ? '#B8960C' : '#AAAAAA' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Privilege card */}
              <div className="privilege-card">
                <div className="privilege-glow" />
                <div className="privilege-shimmer" />
                <div className="privilege-header">
                  <h3 className="privilege-title">Atelier<br />Privilege</h3>
                  <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#B8960C', fontVariationSettings: "'FILL' 1" }}>diamond</span>
                </div>
                <div className="privilege-body">
                  <p className="privilege-status-label">Current Status</p>
                  <p className="privilege-status">Noir Membership</p>
                  <div className="privilege-divider" />
                  {['Priority Booking Access', 'Complimentary Styling Consult', 'Exclusive Seasonal Offers'].map(b => (
                    <div key={b} className="privilege-benefit">
                      <span className="material-symbols-outlined privilege-check">check</span>
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <button className="sidebar-logout" onClick={logout}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                Sign Out
              </button>
            </div>

            {/* Main panel */}
            <div>

              {/* Profile tab */}
              {activeTab === 'profile' && (
                <div className="panel">
                  <p className="panel-eyebrow">Personal Info</p>
                  <h2 className="panel-title">Personal Details</h2>
                  <p className="panel-sub">Update your name, contact info, and profile photo.</p>

                  {saved && (
                    <div className="success-bar">
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#2D7A4F' }}>check_circle</span>
                      <p className="success-bar-text">Changes saved successfully!</p>
                    </div>
                  )}

                  {/* Avatar row */}
                  <div className="avatar-row">
                    <div className="panel-avatar">
                      {avatar ? <img src={avatar} alt="Avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <span className="panel-avatar-initials">{initials}</span>}
                    </div>
                    <div>
                      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, fontWeight:600, color:'#1C1C1E', margin:'0 0 4px' }}>Profile Photo</p>
                      <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, color:'#AAAAAA', margin:'0 0 12px' }}>JPG or PNG. Max 2MB.</p>
                      <button className="btn-update-photo">Update Photo</button>
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ marginBottom: 0 }}>
                    {[
                      { key:'firstName', label:'First Name', placeholder:'Jane' },
                      { key:'lastName', label:'Last Name', placeholder:'Doe' },
                    ].map(f => (
                      <div key={f.key} className="ul-field-wrap" style={{ marginBottom: 0 }}>
                        <label className="ul-label">{f.label}</label>
                        <input className="ul-input" type="text" value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 28 }}>
                    {[
                      { key:'email', label:'Email Address', type:'email', placeholder:'jane@example.com' },
                      { key:'phone', label:'Phone Number', type:'tel', placeholder:'+1 (555) 000-0000' },
                    ].map(f => (
                      <div key={f.key} className="ul-field-wrap">
                        <label className="ul-label">{f.label}</label>
                        <input className="ul-input" type={f.type} value={profile[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                      </div>
                    ))}
                  </div>
                  <button className="btn-save" onClick={handleSave}>Save Changes</button>
                </div>
              )}

              {/* Security tab */}
              {activeTab === 'security' && (
                <div className="panel">
                  <p className="panel-eyebrow">Account Security</p>
                  <h2 className="panel-title">Security Settings</h2>
                  <p className="panel-sub">Keep your account secure with a strong password.</p>

                  {[
                    { key:'current', label:'Current Password', placeholder:'Enter current password' },
                    { key:'newPass', label:'New Password', placeholder:'Minimum 8 characters' },
                    { key:'confirm', label:'Confirm New Password', placeholder:'Repeat new password' },
                  ].map(f => (
                    <div key={f.key} className="ul-field-wrap">
                      <label className="ul-label">{f.label}</label>
                      <input className="ul-input" type="password" value={passwords[f.key]} onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} />
                    </div>
                  ))}
                  <button className="btn-save" style={{ marginBottom: 32 }}>Update Password</button>

                  <div style={{ paddingTop:28, borderTop:'1px solid #E8E0D5' }}>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#1C1C1E', marginBottom:8 }}>Two-Factor Authentication</p>
                    <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:14, color:'#AAAAAA', marginBottom:16 }}>Add an extra layer of security to your account.</p>
                    <label className="toggle-row" style={{ cursor:'pointer' }}>
                      <div>
                        <p className="toggle-info-title">Enable 2FA</p>
                        <p className="toggle-info-sub">Secure your login with a second step</p>
                      </div>
                      <div className="toggle-switch" style={{ position:'relative', width:44, height:24 }}>
                        <input type="checkbox" className="toggle-input" defaultChecked style={{ position:'absolute', opacity:0, width:0, height:0 }} />
                        <span className="toggle-track" style={{ width:44, height:24, borderRadius:12, background:'#B8960C', display:'block', position:'relative', transition:'background 0.3s' }}>
                          <span style={{ content:'', position:'absolute', top:3, left:3, width:18, height:18, borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'transform 0.25s', transform:'translateX(20px)', display:'block' }} />
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Preferences tab */}
              {activeTab === 'preferences' && (
                <div className="panel">
                  <p className="panel-eyebrow">Notifications</p>
                  <h2 className="panel-title">Preferences</h2>
                  <p className="panel-sub">Control how we keep you in the loop.</p>

                  {[
                    { key:'emailReminders', label:'Email Appointment Reminders', desc:'Get notified 24 hours before your booking.' },
                    { key:'smsReminders', label:'SMS Appointment Reminders', desc:'Text message alerts for upcoming bookings.' },
                    { key:'newsletterOffers', label:'Exclusive Offers &amp; News', desc:'Be first to know about seasonal rituals and promotions.' },
                  ].map(pref => (
                    <label key={pref.key} className="toggle-row">
                      <div>
                        <p className="toggle-info-title" dangerouslySetInnerHTML={{ __html: pref.label }} />
                        <p className="toggle-info-sub">{pref.desc}</p>
                      </div>
                      <div style={{ position:'relative', width:44, height:24, flexShrink:0 }}>
                        <input
                          type="checkbox"
                          style={{ position:'absolute', opacity:0, width:0, height:0 }}
                          checked={prefs[pref.key]}
                          onChange={e => setPrefs(p => ({ ...p, [pref.key]: e.target.checked }))}
                        />
                        <span style={{ width:44, height:24, borderRadius:12, background: prefs[pref.key] ? '#B8960C' : '#E8E0D5', display:'block', position:'relative', transition:'background 0.3s', cursor:'pointer' }}>
                          <span style={{ position:'absolute', top:3, left: prefs[pref.key] ? 23 : 3, width:18, height:18, borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.25s', display:'block' }} />
                        </span>
                      </div>
                    </label>
                  ))}

                  <div className="danger-section">
                    <p className="danger-title">Danger Zone</p>
                    <button className="btn-danger">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_forever</span>
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>

        <CustomerFooter />
      </div>
    </>
  );
};

export default CustomerSetting;