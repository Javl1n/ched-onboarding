import AppLayout from '@/layouts/app-layout';
import { TraineeJournalInterface, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Journal',
        href: '/journal',
    },
];

export default function JournalIndex({
    journals,
    month,
    year,
}: {
    journals: TraineeJournalInterface[];
    month: number;
    year: number;
}) {
    const currentDate = new Date(year, month - 1);
    const monthName = format(currentDate, 'MMMM yyyy');

    const handlePreviousMonth = () => {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        router.get('/journal', { month: prevMonth, year: prevYear });
    };

    const handleNextMonth = () => {
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        router.get('/journal', { month: nextMonth, year: nextYear });
    };

    const handleDelete = (journalId: number) => {
        router.delete(`/journal/${journalId}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Journal" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">My</div>
                            <div className="mt-1 text-3xl font-black lg:text-4xl">Journal</div>
                            <p className="mt-1 text-sm text-muted-foreground">Record your daily activities and reflections</p>
                        </div>
                        <Link href="/journal/create">
                            <Button className="gap-2 shadow-sm">
                                <Plus className="size-4" />
                                New Entry
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-4 shadow-sm">
                    <Button variant="outline" size="sm" onClick={handlePreviousMonth} className="gap-2">
                        <ChevronLeft className="size-4" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-lg font-semibold">{monthName}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNextMonth} className="gap-2">
                        Next
                        <ChevronRight className="size-4" />
                    </Button>
                </div>

                {/* Journal Entries */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 shadow-sm">
                    {journals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="rounded-full bg-muted/50 p-6 mb-4">
                                <BookOpen className="size-12 text-muted-foreground/50" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No journal entries for {monthName}</h3>
                            <p className="mb-4 text-sm text-muted-foreground">Start recording your daily activities</p>
                            <Link href="/journal/create">
                                <Button className="gap-2">
                                    <Plus className="size-4" />
                                    Create First Entry
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4 p-4">
                            {journals.map((journal) => (
                                <Card key={journal.id} className="transition-shadow hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {format(new Date(journal.date), 'EEEE, MMMM dd, yyyy')}
                                                </CardTitle>
                                                <CardDescription>
                                                    Updated {format(new Date(journal.updated_at), 'h:mm a')}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/journal/${journal.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="gap-2">
                                                        <Edit className="size-4" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                                                            <Trash2 className="size-4" />
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete your journal entry.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(journal.id)}>
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{journal.content}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
