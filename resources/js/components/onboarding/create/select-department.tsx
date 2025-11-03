import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DepartmentInterface } from '@/types';
import { usePage } from '@inertiajs/react';
import { SelectProps } from '@radix-ui/react-select';

export default function SelectDepartment({ ...props }: SelectProps) {
    const { departments } = usePage<{ departments: DepartmentInterface[] }>().props;

    return (
        <Select {...props}>
            <SelectTrigger className="min-w-50">
                <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel className="text-xs text-neutral-600">Departments</SelectLabel>
                    {departments.map((department, index) => (
                        <SelectItem key={`department-${index}`} value={department.id as string}>
                            {department.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
