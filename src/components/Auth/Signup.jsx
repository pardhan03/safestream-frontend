import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, KeyRound, UserPlus } from "lucide-react"; // Consistent icons
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";

function Signup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const validatePasswordMatch = (value) => {
    return value === password || "Passwords do not match";
  };

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.post("/user/register", data);

      if (res.data.success) {
        setAuthUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate("/dashboard");
      } else {
        toast(res.data.message);
      }
    } catch (err) {
      toast(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">
              Stream<span className="text-blue-500">Guard</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">Create your account to start streaming.</p>
          </div>

          {/* Fullname */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                {...register("fullname", { required: true })}
              />
            </div>
            {errors.fullname && <span className="text-red-400 text-xs">Full name is required</span>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && <span className="text-red-400 text-xs">Email is required</span>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                {...register("password", { required: true })}
              />
            </div>
            {errors.password && <span className="text-red-400 text-xs">Password is required</span>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                {...register("confirmPassword", {
                  required: true,
                  validate: validatePasswordMatch,
                })}
              />
            </div>
            {errors.confirmPassword && (
              <span className="text-red-400 text-xs">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            {/* <button
              type="submit"
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200"
            >
            </button> */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 
                ${loading ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                 <UserPlus size={18} className="mr-2" />
                  Create Account
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;