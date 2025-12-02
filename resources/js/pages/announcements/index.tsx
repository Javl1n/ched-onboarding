import AppLayout from '@/layouts/app-layout';
import { AnnouncementInterface, type BreadcrumbItem, PaginatedData, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Bell, Edit, Filter, Megaphone, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Announcements',
        href: '/announcements',
    },
];

const priorityColors = {
    urgent: 'bg-red-500 hover:bg-red-600',
    high: 'bg-orange-500 hover:bg-orange-600',
    normal: 'bg-blue-500 hover:bg-blue-600',
    low: 'bg-gray-500 hover:bg-gray-600',
};

const priorityLabels = {
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
};

export default function AnnouncementsIndex({
    announcements,
    filters,
}: {
    announcements: PaginatedData<AnnouncementInterface>;
    filters: {
        status?: string;
        priority?: string;
        department_id?: string;
    };
}) {
    const { auth } = usePage().props as { auth: { user: User } };
    const canManage = auth.user.role === 'admin' || auth.user.role === 'supervisor';

    const handleDelete = (announcementId: number) => {
        router.delete(`/announcements/${announcementId}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Announcements" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Organization
                            </div>
                            <div className="mt-1 text-3xl font-black lg:text-4xl">Announcements</div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Stay informed with the latest updates and news
                            </p>
                        </div>
                        {canManage && (
                            <Link href="/announcements/create">
                                <Button className="gap-2 shadow-sm">
                                    <Plus className="size-4" />
                                    New Announcement
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Announcements List */}
                {announcements.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Megaphone className="size-12 text-muted-foreground" />
                            <p className="mt-4 text-lg font-medium">No announcements yet</p>
                            <p className="text-sm text-muted-foreground">
                                {canManage ? 'Create your first announcement to get started.' : 'Check back later for updates.'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {announcements.data.map((announcement) => (
                            <Card key={announcement.id} className="overflow-hidden transition-shadow hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-xl">
                                                    <Link
                                                        href={`/announcements/${announcement.id}`}
                                                        className="hover:underline"
                                                    >
                                                        {announcement.title}
                                                    </Link>
                                                </CardTitle>
                                                {announcement.is_read === false && auth.user.role === 'trainee' && (
                                                    <Badge variant="default" className="bg-blue-500">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription>
                                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                                    <span>
                                                        By {announcement.user?.name || 'Unknown'}
                                                    </span>
                                                    {announcement.department && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{announcement.department.name}</span>
                                                        </>
                                                    )}
                                                    {announcement.published_at && (
                                                        <>
                                                            <span>•</span>
                                                            <span>
                                                                {format(new Date(announcement.published_at), 'MMM d, yyyy')}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={priorityColors[announcement.priority]}>
                                                {priorityLabels[announcement.priority]}
                                            </Badge>
                                            {announcement.status === 'draft' && (
                                                <Badge variant="outline">Draft</Badge>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {announcement.content}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/announcements/${announcement.id}`}>
                                            <Button variant="outline" size="sm">
                                                Read More
                                            </Button>
                                        </Link>
                                        {canManage && announcement.user_id === auth.user.id && (
                                            <>
                                                <Link href={`/announcements/${announcement.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <Edit className="size-3" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                            <Trash2 className="size-3" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the
                                                                announcement and remove all associated notifications.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(announcement.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        )}
                                        {canManage && auth.user.role === 'admin' && announcement.user_id !== auth.user.id && (
                                            <>
                                                <Link href={`/announcements/${announcement.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <Edit className="size-3" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                            <Trash2 className="size-3" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Announcement?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the
                                                                announcement and remove all associated notifications.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(announcement.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {announcements.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {announcements.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={link.url === null}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
