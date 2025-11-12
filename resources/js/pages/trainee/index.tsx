import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/trainees';
import show from '@/routes/trainees/show';
import { BreadcrumbItem, PaginatedData, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { Calendar, ChevronRight, Phone, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainees',
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

interface TraineeIndexProps {
    trainees: PaginatedData<User>;
    filters: {
        search?: string;
        status: string;
    };
}

export default function TraineeIndex({ trainees, filters }: TraineeIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(index().url, { search: searchQuery || undefined, status }, { preserveState: true, preserveScroll: true, replace: true });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, status]);

    const handleToggleStatus = () => {
        const newStatus = status === 'all' ? 'active' : 'all';
        setStatus(newStatus);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainees" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Page Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Manage</div>
                            <div className="mt-1 text-3xl font-black lg:text-4xl">Trainees</div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {trainees.total} {trainees.total === 1 ? 'trainee' : 'trainees'} total
                                {status === 'active' && ' (active only)'}
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleToggleStatus} className="shadow-sm bg-white">
                            {status === 'all' ? 'Hide Inactive Trainees' : 'Show All Trainees'}
                        </Button>
                    </div>
                </div>

                {/* Trainees Card with Search, Table, and Pagination */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 shadow-sm">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-sidebar-border">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search trainees by name, department, school, contact, or gender..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Trainees Table */}
                    {trainees.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="rounded-full bg-muted/50 p-6 mb-4">
                                <Users className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No trainees found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? 'Try adjusting your search criteria.' : 'No trainees available in your department.'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableCaption>List of all trainees in your department.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Trainee</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Higher Education Institution</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>OJT Started</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trainees.data.map((trainee) => (
                                    <TableRow
                                        key={trainee.id}
                                        onClick={() => router.visit(show.log(trainee).url)}
                                        className="group cursor-pointer transition-colors hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                                        {getInitials(trainee.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{trainee.name}</span>
                                                    <span className="text-xs text-muted-foreground capitalize">{trainee.profile?.gender}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getDepartmentColor(trainee.department.name)}>
                                                {trainee.department.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">{trainee.profile?.school || 'N/A'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4" />
                                                <span className="text-sm">+63{trainee.profile?.contact}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {trainee.profile?.ojt_start_date ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium">
                                                            {format(new Date(trainee.profile.ojt_start_date), 'MMM dd, yyyy')}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(trainee.profile.ojt_start_date), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No logs yet</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={trainee.profile?.status === 'active' ? 'default' : 'secondary'}>
                                                {trainee.profile?.status === 'active' ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="w-12">
                                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {/* Pagination Controls */}
                    {trainees.last_page > 1 && (
                        <div className="p-4 border-t border-sidebar-border">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {trainees.from} to {trainees.to} of {trainees.total} trainees
                                </div>
                                <Pagination>
                                    <PaginationContent>
                                        {trainees.links[0].url && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    href="#"
                                                    size="default"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.get(
                                                            trainees.links[0].url!,
                                                            { search: searchQuery || undefined, status },
                                                            {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}

                                        {trainees.links.slice(1, -1).map((link, index) => {
                                            if (link.label === '...') {
                                                return (
                                                    <PaginationItem key={`ellipsis-${index}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href="#"
                                                        size="icon"
                                                        isActive={link.active}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (link.url) {
                                                                router.get(
                                                                    link.url,
                                                                    { search: searchQuery || undefined, status },
                                                                    {
                                                                        preserveState: true,
                                                                        preserveScroll: true,
                                                                    },
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {link.label}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        {trainees.links[trainees.links.length - 1].url && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    href="#"
                                                    size="default"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.get(
                                                            trainees.links[trainees.links.length - 1].url!,
                                                            { search: searchQuery || undefined, status },
                                                            {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }}
                                                />
                                            </PaginationItem>
                                        )}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
