"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { REGISTER_COMPANY } from "../../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BusinessRegisterForm = {
  username: string;
  cname: string;
  email: string;
  contact: number;
  password: string;
  location: string;
}

export default function BusinessRegister() {
  const [registerUser] = useMutation(REGISTER_COMPANY);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessRegisterForm>();

  const onSubmit = async (data: BusinessRegisterForm) => {
    try {
      const variables = {
        options: {
          ...data,
          contact: Number(data.contact), // Convert to string for GraphQL
        },
      };
  
      const response = await registerUser({ variables });
  
      console.log("GraphQL Response:", response); // 🔍 Debugging
  
      if (response?.data?.registerCompany?.company) {
        router.push("/auth");
      } else {
        setErrorMessage("Registration failed: " + JSON.stringify(response?.data?.registerCompany?.errors));
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
  <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Business Account Registration</h2>
  
  {errorMessage && <p className="text-red-600 text-sm text-center mb-4">{errorMessage}</p>}

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Username */}
    <div>
      <input
        type="text"
        placeholder="Username"
        {...register("username", {
          required: "Username is required",
          minLength: { value: 4, message: "Must be at least 4 characters" },
        })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
    </div>

    {/* Company Name */}
    <div>
      <input
        type="text"
        placeholder="Company Name"
        {...register("cname", {
          required: "Company name is required",
          minLength: { value: 4, message: "Must be at least 4 characters" },
        })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.cname && <p className="text-red-500 text-sm mt-1">{errors.cname.message}</p>}
    </div>

    {/* Business Email */}
    <div>
      <input
        type="email"
        placeholder="Business Email"
        {...register("email", { required: "Email is required" })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
    </div>

    {/* Location */}
    <div>
      <input
        type="text"
        placeholder="Business Location"
        {...register("location", { required: "Location is required" })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
    </div>

    {/* Contact Number */}
    <div>
      <input
        type="text"
        placeholder="Contact Number"
        {...register("contact", {
          required: "Contact number is required",
          pattern: {
            value: /^[0-9]+$/,
            message: "Must be a valid number",
          },
        })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
    </div>

    {/* Password */}
    <div>
      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Must be at least 6 characters" },
        })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isSubmitting ? "Registering..." : "Register"}
    </button>
  </form>

  {/* Login Link */}
  <p className="mt-6 text-center text-sm text-gray-700">
    Already have an account?{" "}
    <Link href="/auth/selllogin" className="text-green-600 font-medium hover:underline">
      Login here
    </Link>
  </p>
</div>

  );
}
