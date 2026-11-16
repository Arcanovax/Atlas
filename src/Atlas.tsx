
import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface DashboardLayoutProps {
  user: AuthUser;
}

export default function DashboardLayout({
  user,
}: DashboardLayoutProps) {
	
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-blue-600">Atlas</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                Hello, {user.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Users</p>
                <p className="mt-2 text-3xl font-bold">1 250</p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Projects</p>
                <p className="mt-2 text-3xl font-bold">32</p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-gray-500">Revenue</p>
                <p className="mt-2 text-3xl font-bold">4 500 €</p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
