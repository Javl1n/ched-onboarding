import CreateDepartment from '@/components/department/create';
import CreateSupervisor from '@/components/supervisor/create';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/supervisor';
import show from '@/routes/supervisor/show';
import { BreadcrumbItem, User } from '@/types';
import { router } from '@inertiajs/core';
import { Head } from '@inertiajs/react';
import { ChevronRight, Mail, Search, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Supervisors',
        href: index().url,
    },
];

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const getDepartmentColor = (departmentName: string) => {
    const colors = {
        HR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        IT: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        Unifast: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[departmentName as keyof typeof colors] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
};

export default function SuperVisorIndex({ supervisors }: { supervisors: User[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSupervisors, setFilteredSupervisors] = useState(supervisors);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredSupervisors(supervisors);
        } else {
            const filtered = supervisors.filter(
                (supervisor) =>
                    supervisor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    supervisor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    supervisor.department.name.toLowerCase().includes(searchQuery.toLowerCase()),
            );
            setFilteredSupervisors(filtered);
        }
    }, [searchQuery, supervisors]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisors" />
            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Supervisors</h2>
                        <p className="text-sm text-muted-foreground">
                            {supervisors.length} {supervisors.length === 1 ? 'supervisor' : 'supervisors'} total
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <CreateDepartment />
                        <CreateSupervisor />
                    </div>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search supervisors by name, email, or department..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {filteredSupervisors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                        <UserCog className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mb-2 text-lg font-semibold">No supervisors found</h3>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by adding your first supervisor.'}
                        </p>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <Table>
                            <TableCaption>A list of all supervisors in the system.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Supervisor</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSupervisors.map((supervisor, index) => (
                                    <TableRow
                                        onClick={() => router.visit(show.all(supervisor.id))}
                                        key={`supervisor-${index}`}
                                        className="group cursor-pointer transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                                        {getInitials(supervisor.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{supervisor.name}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getDepartmentColor(supervisor.department.name)}>
                                                {supervisor.department.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <span className="text-sm">{supervisor.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-12">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
