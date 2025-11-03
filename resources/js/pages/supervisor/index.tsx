import CreateDepartment from '@/components/department/create';
import CreateSupervisor from '@/components/supervisor/create';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/supervisor';
import show from '@/routes/supervisor/show';
import { BreadcrumbItem, User } from '@/types';
import { router } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Supervisors',
        href: index().url,
    },
];

export default function SuperVisorIndex({ supervisors }: { supervisors: User[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisors" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid flex-1 gap-4 md:grid-cols-3">
                    <div className="col-span-1 space-y-2">
                        <CreateSupervisor />
                        <CreateDepartment />
                    </div>
                    <div className="col-span-2 space-y-2">
                        {/* <div className="font-bold text-neutral-400">Supervisors</div> */}
                        <Table>
                            <TableCaption>A list of all supervisors.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Name</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-4"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {supervisors.map((supervisor, index) => (
                                    <TableRow onClick={() => router.visit(show.all(supervisor.id))} key={`supervisor-${index}`}>
                                        <TableCell className="font-medium">{supervisor.name}</TableCell>
                                        <TableCell>{supervisor.department.name}</TableCell>
                                        <TableCell>{supervisor.email}</TableCell>
                                        <TableCell className="w-4">
                                            <ChevronRight className="size-4" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
