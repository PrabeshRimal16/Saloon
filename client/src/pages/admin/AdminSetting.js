import React from "react";
import AdminSidebar from '../../components/AdminSidebar';
import AdminHeader from '../../components/AdminHeader';

export default function AdminSetting() {
  return (
    <div className="font-body-md text-body-md min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-grow md:ml-64 p-6 lg:p-12">
        <AdminHeader title="Profile Settings" />
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-600">Manage account preferences, personal information, and security settings.</p>
          </header>

          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-medium mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500">Full Name</label>
                <div className="mt-1 text-gray-800">Julian V.</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Email</label>
                <div className="mt-1 text-gray-800">julian.v@latelier.com</div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-medium mb-4">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border rounded">
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-gray-500">Last updated 3 months ago</div>
                </div>
                <button className="text-sm text-blue-600">Update</button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Recommended for administrative access</div>
                </div>
                <div className="text-sm text-red-600">Inactive</div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-medium mb-4">Atelier Profile</h3>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200" />
              <div className="flex-1">
                <div className="font-medium">Admin Level 4</div>
                <div className="text-sm text-gray-500">Full access to service catalogs and reporting.</div>
              </div>
              <button className="text-sm text-blue-600">Replace Image</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}