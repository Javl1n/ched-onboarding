import AppLayout from '@/layouts/app-layout';
import { AnnouncementInterface, type BreadcrumbItem, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, Edit, Megaphone, Trash2, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Announcements',
        href: '/announcements',
    },
    {
        title: 'View Announcement',
        href: '#',
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

export default function AnnouncementShow({ announcement }: { announcement: AnnouncementInterface }) {
    const { auth } = usePage().props as { auth: { user: User } };
    const canManage =
        (auth.user.role === 'admin') ||
        (auth.user.role === 'supervisor' && announcement.user_id === auth.user.id);

    const handleDelete = () => {
        router.delete(`/announcements/${announcement.id}`, {
            onSuccess: () => {
                router.visit('/announcements');
            },
        });
    };

    const isExpired = announcement.expires_at && new Date(announcement.expires_at) < new Date();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={announcement.title} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <Badge className={priorityColors[announcement.priority]}>
                                    {priorityLabels[announcement.priority]}
                                </Badge>
                                {announcement.status === 'draft' && (
                                    <Badge variant="outline">Draft</Badge>
                                )}
                                {isExpired && (
                                    <Badge variant="destructive" className="gap-1">
                                        <AlertTriangle className="size-3" />
                                        Expired
                                    </Badge>
                                )}
                            </div>
                            <div className="mt-3 text-3xl font-black lg:text-4xl">{announcement.title}</div>
                        </div>
                        {canManage && (
                            <div className="flex gap-2">
                                <Link href={`/announcements/${announcement.id}/edit`}>
                                    <Button variant="outline" className="gap-2">
                                        <Edit className="size-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                                            <Trash2 className="size-4" />
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
                                                onClick={handleDelete}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Announcement Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <UserIcon className="size-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Posted by</p>
                                <p className="text-sm text-muted-foreground">
                                    {announcement.user?.name || 'Unknown'}
                                </p>
                            </div>
                        </div>

                        {announcement.department && (
                            <div className="flex items-center gap-2">
                                <Megaphone className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Department</p>
                                    <p className="text-sm text-muted-foreground">
                                        {announcement.department.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {!announcement.department && (
                            <div className="flex items-center gap-2">
                                <Megaphone className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Visibility</p>
                                    <p className="text-sm text-muted-foreground">
                                        Global (All departments)
                                    </p>
                                </div>
                            </div>
                        )}

                        {announcement.published_at && (
                            <div className="flex items-center gap-2">
                                <Calendar className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Published on</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(announcement.published_at), 'MMMM d, yyyy')} at{' '}
                                        {format(new Date(announcement.published_at), 'h:mm a')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {announcement.expires_at && (
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Expires on</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(announcement.expires_at), 'MMMM d, yyyy')} at{' '}
                                        {format(new Date(announcement.expires_at), 'h:mm a')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                            {announcement.content}
                        </div>
                    </CardContent>
                </Card>

                {/* Back Button */}
                <div>
                    <Link href="/announcements">
                        <Button variant="outline">Back to Announcements</Button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
