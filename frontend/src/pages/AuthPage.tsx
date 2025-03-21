import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";

type FormData = {
    username: string;
    email?: string;
    password: string;
};

const AuthPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useUserContext();

    const isSignup = location.pathname === "/signup";
    const [authError, setAuthError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>();

    // API HANDLERS DIRECTLY IN FILE
    const signupUser = async (username: string, email: string, password: string) => {
        const res = await axios.post("/api/users", { username, email, password });
        return { user: res.data };
    };

    const signinUser = async (username: string, password: string) => {
        const res = await axios.get("/api/users");
        const user = res.data.find(
            (u: any) => u.username === username && u.password === password
        );
        if (!user) throw new Error("Invalid username or password");
        return { user };
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setAuthError(null);

        try {
            let response;

            if (isSignup) {
                if (!data.email) throw new Error("Email is required");
                response = await signupUser(data.username, data.email, data.password);
            } else {
                response = await signinUser(data.username, data.password);
            }

            if (response?.user) {
                setUser(response.user);
                reset();
                navigate("/api/todos");
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || "Something went wrong.";
            setAuthError(message);
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        navigate(isSignup ? "/signin" : "/signup");
        reset();
        setAuthError(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-100 p-4">
            <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white">
                <CardContent className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        {isSignup ? "Create an Account" : "Welcome Back"}
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Input
                                placeholder="Username"
                                {...register("username", { required: "Username is required" })}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                            )}
                        </div>

                        {isSignup && (
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        )}

                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {authError && <p className="text-sm text-red-500">{authError}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600">
                        {isSignup ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:underline"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-blue-600 hover:underline"
                                >
                                    Create one
                                </button>
                            </>
                        )}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthPage;
