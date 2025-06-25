/* eslint-disable */
import React from "react";
import { useForm } from "react-hook-form";
import {Outlet, useNavigate} from "react-router-dom";

export const Register = () => {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();

    const onSubmit = (data: any) => {
        // handle next
        console.log(data);
    };

    return (
        <div className="bg-[#eee] h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex justify-center mb-4">
                    <img src="/icon/emobeat_vertical.png" alt="icon" className="w-[100px] h-[100px]" />
                </div>
                <h1 className="text-4xl font-semibold text-center mb-6">SIGN UP</h1>

                <Outlet/>
            </div>
        </div>
    );
};