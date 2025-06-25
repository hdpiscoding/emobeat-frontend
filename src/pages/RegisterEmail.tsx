/* eslint-disable */
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/input-password";
import { useRegisterStore} from "@/store/useRegisterStore.ts";

export const RegisterEmail = () => {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();
    const setStep1 = useRegisterStore((state) => state.setStep1);
    const onSubmit = (data: {email: string, password: string}) => {
        // handle next
        console.log(data);
        setStep1(data.email, data.password);
        navigate("/register/info");
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address",
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input className="focus-visible:ring-[#518EE6]" placeholder="Enter your email" {...field} />
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
                    <div className="h-2">

                    </div>
                    <Button type="submit" className="w-full hover:bg-[#3A74C5]">
                        Next
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-[#518EE6] hover:underline hover:text-[#3A74C5]">
                    Log in here.
                </a>
            </div>
        </>
    );
};