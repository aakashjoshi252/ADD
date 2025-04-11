/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { WE_QUERY, LOGOUT_MUTATION } from "../../../graphql/mutations";

export default function ProfilePage() {
  const router = useRouter();
  const { data, loading, error } = useQuery(WE_QUERY);
  const [logout] = useMutation(LOGOUT_MUTATION);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-700 text-lg">Loading...</p>
      </div>
    );

// apply session here

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
  {/* Sidebar */}
  <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col shadow-md">
    <h2 className="text-2xl font-extrabold mb-8 tracking-wide">Dashboard</h2>
    <nav className="space-y-3 flex-grow">
      <a
        href="/"
        className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
      >
        Home
      </a>
      <a
        href="/auth/userprofile"
        className="block px-4 py-2 rounded-lg bg-gray-700 font-medium"
      >
        Profile
      </a>
      <a
        href="/settings"
        className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition font-medium"
      >
        Settings
      </a>
    </nav>
  </aside>

  {/* Main Content */}
  <main className="flex-1 p-10 flex justify-center items-center">
    <div className="max-w-md w-full bg-white shadow-2xl rounded-xl p-8 text-center border border-gray-100">
      {/* User Info */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Aakash Joshi</h1>
      <p className="text-gray-600 text-lg mb-6">test@gmail.com</p>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  </main>
</div>
  );
}
