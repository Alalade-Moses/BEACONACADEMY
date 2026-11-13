import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  Video,
  Globe,
  Bell
} from 'lucide-react';

export const AdminSettings = () => {
  const [settings, setSettings] = useState({
    platform_name: 'Beacon Bridge Academics',
    contact_email: 'info@beaconbridgeacademics.co.uk',
    currency: 'GBP',
    allow_public_registration: 'true',
    enable_recordings: 'true',
    enable_whiteboard: 'true',
    maintenance_mode: 'false'
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setSettings(prev => ({ ...prev, ...res.data.settings }));
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await api.put('/settings', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading platform configuration...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Configuration & Controls</h1>
        <p className="text-xs text-slate-500 mt-1">Configure global parameters, virtual classroom features, and institutional details</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Platform settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
        
        {/* Branding & Contacts */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-600" />
            <span>Institutional Identity</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => setSettings({ ...settings, platform_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Support Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Classroom Feature Flags */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Video className="w-4 h-4 text-brand-600" />
            <span>Virtual Classroom Modules</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Class Recording & Archival</span>
                <span className="text-[11px] text-slate-500">Allow tutors to record video sessions and store them in cloud storage</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enable_recordings === 'true'}
                onChange={(e) => setSettings({ ...settings, enable_recordings: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Digital Whiteboard & Slide Annotation</span>
                <span className="text-[11px] text-slate-500">Enable real-time vector drawing synchronization over slides</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enable_whiteboard === 'true'}
                onChange={(e) => setSettings({ ...settings, enable_whiteboard: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Public Self-Registration</span>
                <span className="text-[11px] text-slate-500">Allow public visitors to register as students, tutors, or parents</span>
              </div>
              <input
                type="checkbox"
                checked={settings.allow_public_registration === 'true'}
                onChange={(e) => setSettings({ ...settings, allow_public_registration: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
