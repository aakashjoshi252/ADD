"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { VERIFY_EMAIL_MUTATION } from "../../../graphql/mutations";
import { useState } from "react";
import { useRouter } from "next/navigation";

type VerifyFormInputs = {
  email: string;
  code: string;
};

export default function Verify() {
  const [verifyCode] = useMutation(VERIFY_EMAIL_MUTATION);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<VerifyFormInputs>();

  const onSubmit = async (data: VerifyFormInputs) => {
    try {
      const { data: response } = await verifyCode({
        variables: {
          email: data.email,
          code: data.code,
        },
      });

      if (response?.verifyCode?.user) {
        router.push("/auth/login"); // Redirect to login after verification
      } else {
        setErrorMessage(response?.verifyCode?.errors?.[0]?.message || "Invalid code");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
  <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
    Verify Your Email
  </h2>

  {errorMessage && (
    <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
  )}

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Email */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email Address
      </label>
      <input
        type="email"
        placeholder="you@example.com"
        {...register("email", { required: "Email is required" })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      {errors.email && (
        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
      )}
    </div>

    {/* Verification Code */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Verification Code
      </label>
      <input
        type="text"
        placeholder="Enter 6-digit code"
        {...register("code", {
          required: "Code is required",
          minLength: { value: 6, message: "Code must be 6 digits" },
        })}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      {errors.code && (
        <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
    >
      Verify
    </button>
  </form>
</div>


  );
}
