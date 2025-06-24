/* eslint-disable */
import React, {useEffect, useState} from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { format } from "date-fns";
import { updateDatePart } from "@/lib/utils";
import { cn } from "@/lib/utils"
import MonthCalendar from "@/components/ui/month-calendar";

type DatePickerType = "date" | "month";

type DatePickerProps = {
    className: string;
    date: Date | undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    type: DatePickerType;
};

const DatePicker = ({ className, date, setDate, type }: DatePickerProps) => {
    const [ month, setMonth ] = useState<Date | undefined>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (date) {
            setMonth(date);
        }
    }, [date]);

    // @ts-ignore
    return (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "overflow-hidden dark:text-white pl-3 text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        <span>
                          {type === "date"
                              ?
                              format(updateDatePart(month as Date,date), "dd/MM/yyyy") :
                              format(updateDatePart(month as Date,date), "MM/yyyy")}
                        </span>
                    ) : (
                        <span className="sm:block">DD/MM/YYYY</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                {type === "date"
                    ?
                    <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={(month) => setMonth(month)}
                        selected={date}
                        onSelect={(e) => {
                            setDate(e);
                            setIsCalendarOpen(false);
                        }}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1940}
                        toYear={2025}
                    />
                    :
                    <MonthCalendar currentMonth={date ?? new Date()}
                                   onMonthChange={(newMonth) => setDate(newMonth)}
                                   onClose={() => setIsCalendarOpen(false)}/>}
            </PopoverContent>
        </Popover>
    );
};

export default DatePicker;