import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SchoolInterface } from '@/types';
import { usePage } from '@inertiajs/react';
import { SelectProps } from '@radix-ui/react-select';

export default function SelectSchool({ ...props }: SelectProps) {
    const { schools } = usePage<{ schools: SchoolInterface[] }>().props;

    return (
        <Select {...props}>
            <SelectTrigger className="min-w-50">
                <SelectValue placeholder="Select School" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel className="text-xs text-neutral-600">Schools</SelectLabel>
                    {schools.map((school, index) => (
                        <SelectItem key={`school-${index}`} value={school.id as string}>
                            {school.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
