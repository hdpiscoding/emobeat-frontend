/* eslint-disable */
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useGeneralStore} from "@/store/useGeneralStore.ts";
import {toast} from "react-toastify";

type SettingsFormValues = {
    allowRecommending: boolean;
    emotionInterval: number;
    recommendInterval: number;
};

export const Settings = () => {
    const allowRecommend = useGeneralStore(state => state.allowRecommend);
    const setAllowRecommend = useGeneralStore(state => state.setAllowRecommend);
    const emotionInterval = useGeneralStore(state => state.detectInterval);
    const setEmotionInterval = useGeneralStore(state => state.setDetectInterval);
    const recommendInterval = useGeneralStore(state => state.recommendInterval);
    const setRecommendInterval = useGeneralStore(state => state.setRecommendInterval);

    const form = useForm<SettingsFormValues>({
        defaultValues: {
            allowRecommending: allowRecommend,
            emotionInterval: emotionInterval,
            recommendInterval: recommendInterval,
        },
        mode: "onChange",
    });

    const { handleSubmit, control, formState: { errors } } = form;

    const onSubmit = (data: SettingsFormValues) => {
        // Handle save logic here
        setAllowRecommend(data.allowRecommending);
        setEmotionInterval(data.emotionInterval);
        setRecommendInterval(data.recommendInterval);
        console.log(data);
        console.log("Allow Recommending:", allowRecommend);
        toast.success("Settings saved successfully!");
    };

    return (
        <div className="flex flex-col gap-10 w-full px-4 mt-1 mb-10">
            <h1 className="text-4xl font-bold mb-4">Settings</h1>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-md">
                    <FormField
                        control={control}
                        name="allowRecommending"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                                <FormLabel>Allow Recommending Song</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            setAllowRecommend(checked);
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="emotionInterval"
                        rules={{
                            required: "Required",
                            min: { value: 500, message: "Min is 500" },
                            max: { value: 10000, message: "Max is 10000" },
                            valueAsNumber: true,
                            validate: v => Number.isInteger(Number(v)) || "Must be integer"
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emotion Detection Interval (ms)</FormLabel>
                                <FormControl>
                                    <Input
                                        min={500}
                                        max={10000}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="recommendInterval"
                        rules={{
                            required: "Required",
                            min: { value: 10, message: "Min is 10" },
                            max: { value: 120, message: "Max is 120" },
                            valueAsNumber: true,
                            validate: v => (Number.isInteger(Number(v)) && Number(v) > 0) || "Must be positive integer"
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recommend Song Interval (s)</FormLabel>
                                <FormControl>
                                    <Input
                                        min={10}
                                        max={120}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Save</Button>
                </form>
            </Form>
        </div>
    );
};