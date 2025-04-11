"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../../../graphql/mutations";
import { useState } from "react";

type LoginFormInputs = {
  username: string;
  password: string;
  email: string;
};

export default function Login() {
  const [login] = useMutation(LOGIN_MUTATION);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login({ variables: { options: data } });

      if (response.data?.login?.user) {
        window.location.href = "/"; 
      } else {
        setErrorMessage(response.data?.login?.errors?.[0]?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err); 
      setErrorMessage("An error occurred");
    }
  };

  return (
<div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
  <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">Welcome Back 👋</h2>
  {errorMessage && <p className="text-red-500 text-sm text-center mb-2">{errorMessage}</p>}

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Username */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
      <input 
        type="text"
        placeholder="Enter your username"
        {...register("username", { required: "Username is required" })}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input 
        type="email"
        placeholder="you@example.com"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email"
          }
        })}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
    </div>

    {/* Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
      <input 
        type="password"
        placeholder="••••••••"
        {...register("password", { required: "Password is required" })}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
    >
      {isSubmitting ? "Logging In..." : "Login"}
    </button>

    {/* Optional: Forgot Password */}
    <div className="text-center mt-3">
      <a href="#" className="text-sm text-green-600 hover:underline">
        Forgot password?
      </a>
    </div>
  </form>
</div>

  );
}
