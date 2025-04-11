"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { ADMIN_LOGIN } from "../../../graphql/mutations";
import { useState } from "react";

type AdminLoginInputs = {
  username: string;
  email: string;
  password: string;
};

export default function AdminLogin() {
  const [adminLogin] = useMutation(ADMIN_LOGIN);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInputs>();

  const onSubmit = async (data: AdminLoginInputs) => {
    try {
      const response = await adminLogin({ variables: { options: data } });

      console.log("adminLogin response:", response.data);

      // Fix this condition based on your actual response structure
      const success =
        response.data?.adminLogin?.admin || // if admin object exists
        response.data?.adminLogin?.success || // if success is returned
        response.data?.adminLogin; // fallback if something truthy is returned

      if (success) {
        window.location.href = "/admindashboard";
      } else {
        const error =
          response.data?.adminLogin?.errors?.[0]?.message || "Login failed";
        setErrorMessage(error);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Admin Login</h2>
      {errorMessage && <p className="text-red-500 mb-4 text-sm text-center">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Enter username"
          {...register("username", { required: "Username is required" })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        {errors.username && (
          <p className="text-red-500 mb-4 text-sm mt-1">{errors.username.message}</p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          {...register("email", { required: "Email is required" })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
}
