import {
     Table,
     TableBody,
     TableCaption,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import AppLayout from "@/layouts/app-layout";
import {index} from "@/routes/trainees";
import show from "@/routes/trainees/show";
import { BreadcrumbItem, PaginatedData, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";

const breadcrumbs: BreadcrumbItem[] = [
     {
          title: 'Trainees',
          href: index().url,
     },
];

interface TraineeIndexProps {
    trainees: PaginatedData<User>;
    filters: {
        search?: string;
        status: string;
    };
}

export default function TraineeIndex({trainees, filters}: TraineeIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                index().url,
                { search: searchQuery || undefined, status },
                { preserveState: true, preserveScroll: true, replace: true }
            );
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
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Trainees</h2>
                    <Button
                        variant="outline"
                        onClick={handleToggleStatus}
                    >
                        {status === 'all' ? 'Hide Inactive Trainees' : 'Show All Trainees'}
                    </Button>
                </div>
                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search trainees by name, department, school, contact, or gender..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="border rounded-xl">
                    <Table>
                        <TableCaption>List of all trainees in your department.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Name</TableHead>
                                <TableHead className="text-center">Department</TableHead>
                                <TableHead>School</TableHead>
                                <TableHead className="">Contact</TableHead>
                                <TableHead className="">Gender</TableHead>
                                <TableHead className="">OJT Started</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trainees.data.map((trainee) => (
                                <TableRow
                                    key={trainee.id}
                                    onClick={() => router.visit(show.log(trainee).url)}
                                    className={trainee.profile?.status === 'inactive' ? 'opacity-50 cursor-pointer' : 'cursor-pointer'}
                                >
                                    <TableCell className="">{trainee.name}</TableCell>
                                    <TableCell className="text-center">{trainee.department.name}</TableCell>
                                    <TableCell>{trainee.profile?.school}</TableCell>
                                    <TableCell className="">+63{trainee.profile?.contact}</TableCell>
                                    <TableCell className="">{trainee.profile?.gender}</TableCell>
                                    <TableCell className="">
                                        {trainee.profile?.ojt_start_date ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    {format(new Date(trainee.profile.ojt_start_date), 'MMM dd, yyyy')}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(trainee.profile.ojt_start_date), { addSuffix: true })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">No logs yet</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={trainee.profile?.status === 'active' ? 'default' : 'secondary'}>
                                            {trainee.profile?.status === 'active' ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {trainees.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 pb-4">
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
                                                router.get(trainees.links[0].url!, { search: searchQuery || undefined, status }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
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
                                                        router.get(link.url, { search: searchQuery || undefined, status }, {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        });
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
                                                router.get(trainees.links[trainees.links.length - 1].url!, { search: searchQuery || undefined, status }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AppLayout>
    )
}