/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_USERS,
  GET_COMPANIES,
  ALL_PRODUCTS_QUERY,
  GET_ADMIN
} from "../../graphql/queries";
import Adheader from "@/components/Adheader/page";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  const { data: adminData, loading: adminLoading } = useQuery(GET_ADMIN);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: productsData, loading: productsLoading } = useQuery(ALL_PRODUCTS_QUERY);
  const [showUserFilters, setShowUserFilters] = useState(false);
  const [userSortOrder, setUserSortOrder] = useState<"newest" | "oldest">("newest");
  const [emailFilter, setEmailFilter] = useState<"all" | "verified" | "unverified">("all");

  const formatTimestamp = (timestamp: number | string) => {
    const date = new Date(Number(timestamp));
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // useEffect(() => {
  //   // If query is done loading and no admin is returned, redirect
  //   if (!adminLoading && (!adminData || !adminData.getadmin)) {
  //     redirect("/");// or redirect to login or home
  //   }
  // }, [adminData, adminLoading]);

  // if (usersLoading || companiesLoading || productsLoading) {
  //   return <div className="p-4 text-center">Loading...</div>;
  // }

  const filteredAndSortedUsers = [...(usersData?.getUser || [])]
    .filter((user: any) => {
      if (emailFilter === "verified") return user.isEmailVerified;
      if (emailFilter === "unverified") return !user.isEmailVerified;
      return true;
    })
    .sort((a: any, b: any) => {
      const dateA = Number(a.createdAt);
      const dateB = Number(b.createdAt);
      return userSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col min-h-screen">
        <nav>
          <Link href="/auth/userprofile" className="block p-3 rounded hover:bg-gray-700">
            Profile
          </Link>
          <h2 className="block p-3 rounded mb-4">Admin Controls</h2>
          <button
            onClick={() => setShowUserFilters((prev) => !prev)}
            className="w-full text-left p-2 bg-blue-600 hover:bg-blue-700 transition rounded mb-4"
          >
            {showUserFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 space-y-10">
        <Adheader />

        {/* Products */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Products</h2>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Material</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {productsData?.allProducts?.map((product: any) => (
                  <tr key={product.slug} className="text-center border-t">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.material}</td>
                    <td className="px-4 py-2">{product.category?.name}</td>
                    <td className="px-4 py-2">₹{product.price}</td>
                    <td className="px-4 py-2">{formatTimestamp(product.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Users</h2>

          {showUserFilters && (
            <div className="flex gap-4 mb-4 items-center">
              <label>
                Sort by:
                <select
                  className="ml-2 border rounded px-2 py-1"
                  value={userSortOrder}
                  onChange={(e) => setUserSortOrder(e.target.value as "newest" | "oldest")}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </label>
              <label>
                Email Verification:
                <select
                  className="ml-2 border rounded px-2 py-1"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value as "all" | "verified" | "unverified")}
                >
                  <option value="all">All</option>
                  <option value="verified">Verified Only</option>
                  <option value="unverified">Unverified Only</option>
                </select>
              </label>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Email Verified</th>
                  <th className="px-4 py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user: any) => (
                  <tr key={user.id} className="text-center border-t">
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.contact}</td>
                    <td className="px-4 py-2">{user.isEmailVerified ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{formatTimestamp(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Companies */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Companies</h2>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Company Name</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Contact</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {companiesData?.getCompanies?.map((company: any) => (
                  <tr key={company.id} className="text-center border-t">
                    <td className="px-4 py-2">{company.cname}</td>
                    <td className="px-4 py-2">{company.username}</td>
                    <td className="px-4 py-2">{company.email}</td>
                    <td className="px-4 py-2">{company.contact}</td>
                    <td className="px-4 py-2">{company.location}</td>
                    <td className="px-4 py-2">{formatTimestamp(company.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
