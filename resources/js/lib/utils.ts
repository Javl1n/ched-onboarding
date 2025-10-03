import { TimeLogInterface } from '@/types';
import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isNumeric (value: string) {
    return /^[0-9]*$/.test(value);
}

export function totalHours (hours: number) {

    return `${Math.floor(hours)} hr ${((hours % 1) * 60)} min`;
};

export function time (time: string | undefined) {
    return time ? format(time, "hh:mm aaa") : '--:-- --';
}