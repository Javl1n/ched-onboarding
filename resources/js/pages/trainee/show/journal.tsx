import AppLayout from '@/layouts/app-layout';
import TraineeShowLayout from '@/layouts/trainee/show-layout';
import { TraineeJournalInterface, type BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpen, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { index } from '@/routes/trainees';
import show from '@/routes/trainees/show';

export default function TraineeShowJournal({
    trainee,
    journals,
    month,
    year,
}: {
    trainee: User;
    journals: TraineeJournalInterface[];
    month: number;
    year: number;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Trainees',
            href: index().url,
        },
        {
            title: trainee.name,
            href: show.log(trainee).url,
        },
        {
            title: 'Journal',
            href: show.journal(trainee).url,
        },
    ];

    const currentMonth = Number(month);
    const currentYear = Number(year);
    const currentDate = new Date(currentYear, currentMonth - 1);
    const monthName = format(currentDate, 'MMMM yyyy');

    const handlePreviousMonth = () => {
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        router.get(show.journal(trainee).url, { month: prevMonth, year: prevYear }, { preserveScroll: true });
    };

    const handleNextMonth = () => {
        const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
        const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
        router.get(show.journal(trainee).url, { month: nextMonth, year: nextYear }, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${trainee.name} - Journal`} />

            <TraineeShowLayout>
                <div className="flex h-full flex-1 flex-col gap-6">
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
                                <div className="mb-4 rounded-full bg-muted/50 p-6">
                                    <BookOpen className="size-12 text-muted-foreground/50" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">No journal entries for {monthName}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {trainee.name} hasn't recorded any journal entries this month.
                                </p>
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
            </TraineeShowLayout>
        </AppLayout>
    );
}
