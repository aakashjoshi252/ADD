"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { LOGIN_COMPANY } from "../../../graphql/mutations";
import { useState } from "react";

type SellLoginFormInputs = {
  cname: string;
  password: string;
  email: string;
};

export default function Login() {
  const [login] = useMutation(LOGIN_COMPANY);
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SellLoginFormInputs>();

  const onSubmit = async (data: SellLoginFormInputs) => {
    try {
      const response = await login({ variables: { options: data } });

      if (response.data?.loginCompany?.company) {
        window.location.href = "/dashboard"; 
      } else {
        setErrorMessage(response.data?.loginCompany?.errors?.[0]?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err); 
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Company Login</h2>

  {errorMessage && (
    <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
  )}

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Company Name */}
    <div>
      <input
        type="text"
        placeholder="Enter company name"
        {...register("cname", { required: "Company name is required" })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.cname && (
        <p className="text-red-500 text-sm mt-1">{errors.cname.message}</p>
      )}
    </div>

    {/* Email */}
    <div>
      <input
        type="text"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
    </div>

    {/* Password */}
    <div>
      <input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Logging In..." : "Login"}
    </button>
  </form>
</div>

  );
}
