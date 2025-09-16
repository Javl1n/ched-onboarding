import {
     Table,
     TableBody,
     TableCaption,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout";
import {index, show} from "@/routes/trainees";
import { BreadcrumbItem, User } from "@/types";
import { Head, Link, router } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
     {
          title: 'Trainees',
          href: index().url,
     },
];

export default function TraineeIndex({trainees}: {trainees: User[]}) {                    
     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Trainees" />
               <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                         <TableRow>
                              <TableHead className="">Name</TableHead>
                              <TableHead className="text-center">Department</TableHead>
                              <TableHead>School</TableHead>
                              <TableHead className="">Contact</TableHead>
                              <TableHead className="text-right">Gender</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {trainees.map(trainee => (
                              <TableRow key={trainee.id} onClick={() => router.visit(show(trainee).url)}>
                                   <TableCell className="">{trainee.name}</TableCell>
                                   <TableCell className="text-center">{trainee.department.name}</TableCell>
                                   <TableCell>{trainee.profile?.school}</TableCell>
                                   <TableCell className="">{trainee.profile?.contact}</TableCell>
                                   <TableCell className="text-right">{trainee.profile?.gender}</TableCell>
                              </TableRow>
                         ))}
                    </TableBody> 
               </Table>
          </AppLayout>
     )
}