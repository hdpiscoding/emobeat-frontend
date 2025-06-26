/* eslint-disable */
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/input-password";
import { listenerLogin } from "@/services/authServices.ts";
import { useAuthStore } from "@/store/useAuthStore";
import {toast} from "react-toastify";

export const Login = () => {
    const setAuth = useAuthStore((state) => state.setAuth);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const res = await listenerLogin(data.email, data.password);
            if (res?.code == 200) {
                setAuth(res.data.accessToken, res.data.id);
                toast.success("Log in successfully!");
                navigate("/");
            } else {
                toast.error("Login failed!");
            }
        } catch (error) {
            toast.error("Login failed!");
            console.log(error);
        }
    };


    return (
        <div className="bg-[#eee] h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                {/* App Icon Placeholder */}
                <div className="flex justify-center mb-4">
                    <img src="/icon/emobeat_vertical.png" className="w-[100px] h-[100px]"/>
                </div>
                <h1 className="text-4xl font-semibold text-center mb-6">LOG IN</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{
                                required: "Email is required",
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input className="focus-visible:ring-[#518EE6]" placeholder="Enter your email or username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            rules={{
                                required: "Password is required",
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput className="focus-visible:ring-[#518EE6]" placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <a href="#" className="text-sm mt-4 text-[#518EE6] hover:underline hover:text-[#3A74C5]">
                                Forgot password?
                            </a>
                        </div>
                        <Button type="submit" className="w-full hover:bg-[#3A74C5]">
                            Log In
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Don't have account?{" "}
                    <a href="/register" className="text-[#518EE6] hover:underline hover:text-[#3A74C5]">
                        Sign up here.
                    </a>
                </div>
            </div>
        </div>
    );
};