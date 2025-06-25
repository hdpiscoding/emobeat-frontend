/* eslint-disable */
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRegisterStore} from "@/store/useRegisterStore.ts";
import { toast } from "react-toastify";
import { activateEmail } from "@/services/authServices.ts";

export const RegisterOTP = () => {
    const form = useForm({
        defaultValues: {
            otp: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();
    const clearRegister = useRegisterStore((state) => state.clearRegister);
    const onSubmit = async (data: any) => {
        // handle next
        console.log(data);
        const { email } = useRegisterStore.getState();
        try {
            const res = await activateEmail(email, data.otp);
            if (res?.code === 200) {
                toast.success("Account activated successfully!");
                clearRegister();
                navigate("/login");
            } else {
                toast.error("Activation failed! Please check your OTP.");
            }
        }
        catch (error) {
            toast.error("Activation failed! Please check your OTP.");
            console.log(error);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="otp"
                        rules={{
                            required: "OTP is required",
                            pattern: {
                                value: /^\d{6}$/,
                                message: "OTP must be exactly 6 digits",
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input className="focus-visible:ring-[#518EE6]" placeholder="Enter OTP" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-2">

                    </div>
                    <Button type="submit" className="w-full hover:bg-[#3A74C5]">
                        Sign Up
                    </Button>
                </form>
            </Form>
        </>
    );
};