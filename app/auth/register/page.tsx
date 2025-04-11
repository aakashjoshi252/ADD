"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterFormInputs = {
  username: string;
  email: string;
  password: string;
  contact: string;
};

export default function Register() {
  const [registerUser] = useMutation(REGISTER_MUTATION);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>();
  
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const variables = {
        options: {
          ...data,
          contact: Number(data.contact), // Ensure contact is a number
        },
      };

      const response = await registerUser({ variables });

      if (response?.data?.register?.user) {
        router.push("/auth/verify"); // Redirect to verify page
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an account</h2>
      {errorMessage && <p className="text-2xl font-bold text-center text-gray-800 mb-6">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input 
          type="text" 
          placeholder="Username" 
          {...register("username", { required: "Username is required", minLength: { value: 4, message: "Username must be at least 4 characters" } })} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}

        <input 
          type="email" 
          placeholder="Email" 
          {...register("email", { required: "Email is required" })} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

        <input 
          type="text" 
          placeholder="Contact Number" 
          {...register("contact", { required: "Contact is required", pattern: { value: /^[0-9]+$/, message: "Contact must be a valid number" } })} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}

        <input 
          type="password" 
          placeholder="Password" 
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Login here</Link> or 
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        <Link href="/auth/sellregister" className="text-blue-600 hover:underline">Create a business account</Link>
      </p>
    </div> 
  );
}
