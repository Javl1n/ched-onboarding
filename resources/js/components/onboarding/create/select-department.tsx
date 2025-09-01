import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DepartmentInterface } from "@/types";
import { usePage } from "@inertiajs/react";

export default function SelectDepartment ({
     value, onValueChange
}: {
     value: string | undefined, 
     onValueChange: (value: string) => void
}) {
     const { departments } = usePage<{departments: DepartmentInterface[]}>().props;

     return (
          <Select value={value} onValueChange={onValueChange}>
               <SelectTrigger className='min-w-50' >
                    <SelectValue placeholder="Select Department" />
               </SelectTrigger>
               <SelectContent>
                    <SelectGroup>
                         <SelectLabel className='text-xs text-neutral-600'>
                              Departments
                         </SelectLabel>
                         {departments.map((department, index) => (
                              <SelectItem key={`department-${index}`} value={department.id as string}>
                                   {department.name}
                              </SelectItem>
                         ))}
                    </SelectGroup>
               </SelectContent>
          </Select>
     )
}