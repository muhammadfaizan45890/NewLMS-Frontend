import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getData } from '@/context/userContext';
import Google from "../assets/googleLogo.png";
import API from '@/utils/api';

const Login = () => {
  const { setUser } = getData();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const res = await axios.post(`${API}/user/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("loginTime", Date.now().toString());
        setUser(res.data.user);
        toast.success(res.data.message || "Login successful");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open(`${API}/auth/google`, "_self");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Card */}
          <Card className="w-full border-none shadow-none bg-white">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center text-black">
                Sign in
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="agent@intelhub.com"
                      className={`pl-9 border-gray-300 focus:border-black focus:ring-black/20 ${
                        errors.email ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-black hover:text-gray-700 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      className={`pl-9 pr-10 border-gray-300 focus:border-black focus:ring-black/20 ${
                        errors.password ? "border-red-500 focus:border-red-500" : ""
                      }`}
                      aria-invalid={!!errors.password}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember me */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`relative w-4 h-4 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-black/50 ${
                      rememberMe
                        ? "bg-black border-black"
                        : "bg-white border-gray-300"
                    }`}
                    aria-checked={rememberMe}
                    role="checkbox"
                  >
                    {rememberMe && (
                      <svg
                        className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <Label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    Remember me
                  </Label>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-black transition-colors"
                >
                  <img src={Google} alt="Google" className="mr-2 h-5 w-5" />
                  Google
                </Button>

                <p className="text-center text-sm text-gray-600 mt-2">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-black hover:text-gray-700 hover:underline transition-colors"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;