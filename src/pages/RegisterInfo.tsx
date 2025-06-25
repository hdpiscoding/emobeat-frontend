/* eslint-disable */
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NATIONALITY_CODES } from "@/types/NationalityCode";
import { useNavigate } from "react-router-dom";
import { useRegisterStore } from "@/store/useRegisterStore.ts";
import { register} from "@/services/authServices.ts";
import { toast } from "react-toastify";

const convertDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // +1 vì tháng bắt đầu từ 0
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}

export const RegisterInfo = () => {
    const [birthday, setBirthday] = React.useState<Date | undefined>();
    const [username, setUsername] = React.useState<string>("");
    const [fullname, setFullname] = React.useState<string>("");
    const [gender, setGender] = React.useState<string>("");
    const [nationality, setNationality] = React.useState<string>("");

    const form = useForm({
        defaultValues: {
            username: username,
            fullname: fullname,
            birthday: birthday,
            gender: gender,
            nationality: nationality,
        },
        mode: "onChange",
    });

    const navigate = useNavigate();
    const setStep2 = useRegisterStore((state) => state.setStep2);

    const onSubmit = async (data: any) => {
        const {
            email,
            password,
            username,
            fullName,
            gender,
            nationality,
            birthday,
        } = useRegisterStore.getState();
        setStep2(data.username, data.fullname, data.gender, data.nationality, convertDateToString(data.birthday));
        try {
            const res = await register(
                email,
                password,
                username,
                fullName,
                gender,
                nationality,
                birthday,
            );
            if (res?.code === 200) {
                toast.success("The otp have been sent to your email");
                navigate("/register/otp");
            } else {
                toast.error("Register failed!");
            }
        } catch (error) {
            toast.error("Register failed!");
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input className="focus-visible:ring-[#518EE6]" placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fullname"
                    rules={{ required: "Full name is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input className="focus-visible:ring-[#518EE6]" placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="birthday"
                    rules={{ required: "Birthday is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Birthday</FormLabel>
                            <FormControl>
                                <DatePicker
                                    className="w-full lg:w-[300px] flex items-center justify-start"
                                    date={field.value}
                                    setDate={(date) => {
                                        field.onChange(date);
                                        setBirthday(date);
                                    }}
                                    type="date"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="hover:bg-[#f7f7f7] hover:text-[#333] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#518EE6]">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MALE">Male</SelectItem>
                                        <SelectItem value="FEMALE">Female</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nationality"
                    rules={{ required: "Nationality is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="hover:bg-[#f7f7f7] hover:text-[#333] outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#518EE6]">
                                        <SelectValue placeholder="Select nationality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NATIONALITY_CODES.map((item) => (
                                            <SelectItem key={item.code} value={item.code}>
                                                {item.en_short_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full hover:bg-[#3A74C5]">
                    Next
                </Button>
            </form>
        </Form>
    );
};