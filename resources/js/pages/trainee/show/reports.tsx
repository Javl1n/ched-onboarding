import AssessmentChart from '@/components/reports/assessment-chart';
import ReportSummary from '@/components/reports/summary';
import TimeChart from '@/components/reports/time-chart';
import AppLayout from '@/layouts/app-layout';
import TraineeShowLayout from '@/layouts/trainee/show-layout';
import { index } from '@/routes/trainees';
import show from '@/routes/trainees/show';
import { AssessmentInterface, BreadcrumbItem, TimeLogInterface, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Award, Calendar, Clock, TrendingUp } from 'lucide-react';

export default function TraineeShowReports({
    trainee,
    logs,
    assessments,
}: {
    trainee: User;
    logs: TimeLogInterface[];
    assessments: AssessmentInterface[];
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
            title: 'Reports',
            href: show.log(trainee).url,
        },
    ];

    const totalHours = () => {
        const hours = logs.map((log) => parseFloat(log.hours)).reduce((partialSum, a) => partialSum + a, 0);

        return hourMinute(hours);
    };

    const hourMinute = (hours: number) => `${Math.floor(hours)} hr ${Math.round((hours % 1) * 60)} min`;

    const getTotalHoursNumber = () => {
        return logs.map((log) => parseFloat(log.hours)).reduce((partialSum, a) => partialSum + a, 0);
    };

    const getAverageScore = () => {
        const scaleAssessments = assessments.filter((a) => a.question.type === 'scale');
        if (scaleAssessments.length === 0) return { value: 'N/A', isValid: false };
        const total = scaleAssessments.reduce((sum, a) => sum + parseInt(a.value), 0);
        const average = total / scaleAssessments.length;
        return { value: average.toFixed(2), isValid: true };
    };

    const averageScore = getAverageScore();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={trainee.name} />

            <TraineeShowLayout>
                <div className="flex flex-col gap-6">
                    {/* Top Row - Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Total Hours Card */}
                        <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-blue-50 via-blue-50/30 to-muted/20 p-6 shadow-sm dark:border-sidebar-border dark:from-blue-950/30 dark:via-blue-950/10 dark:to-muted/20">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <div className="mb-1 text-sm font-semibold text-muted-foreground">Total Hours Logged</div>
                                    <div className="text-4xl font-black text-foreground">{totalHours()}</div>
                                </div>
                                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-500 shadow-lg dark:bg-blue-600">
                                    <Clock className="size-7 text-white" />
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="flex gap-4 border-t border-sidebar-border/50 pt-4">
                                <div className="flex-1">
                                    <div className="mb-1 text-xs font-medium text-muted-foreground">Total Entries</div>
                                    <div className="text-xl font-bold">{logs.length}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="mb-1 text-xs font-medium text-muted-foreground">Avg per Entry</div>
                                    <div className="text-xl font-bold">
                                        {logs.length > 0 ? hourMinute(getTotalHoursNumber() / logs.length) : '0 hr 0 min'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Time Breakdown Card */}
                        <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="rounded-md bg-primary/10 p-1.5">
                                    <Calendar className="size-4 text-primary" />
                                </div>
                                <h2 className="font-semibold text-foreground">Monthly Breakdown</h2>
                            </div>
                            <TimeChart />
                        </div>

                        {/* Assessment Score Card */}
                        <div className="flex flex-col justify-center rounded-xl border border-sidebar-border bg-gradient-to-br from-purple-50 via-purple-50/30 to-muted/20 p-6 shadow-sm dark:border-sidebar-border dark:from-purple-950/30 dark:via-purple-950/10 dark:to-muted/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-purple-500 shadow-lg dark:bg-purple-600">
                                        <Award className="size-8 text-white" />
                                    </div>
                                    <div>
                                        <div className="mb-1 text-sm font-semibold text-muted-foreground">Assessment Score</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-black text-foreground">{averageScore.value}</span>
                                            {averageScore.isValid && <span className="text-2xl font-semibold text-muted-foreground">/5.00</span>}
                                        </div>
                                    </div>
                                </div>
                                {averageScore.isValid && parseFloat(averageScore.value) >= 4 && (
                                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        <TrendingUp className="size-4" />
                                        <span>Excellent</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row - Chart and Summary */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Assessment Chart Card */}
                        <div className="flex flex-col rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="rounded-md bg-primary/10 p-1.5">
                                    <Award className="size-4 text-primary" />
                                </div>
                                <h2 className="font-semibold text-foreground">Performance by Category</h2>
                            </div>
                            <div className="flex-1">
                                <AssessmentChart />
                            </div>
                        </div>

                        {/* Summary Card */}
                        <ReportSummary />
                    </div>
                </div>
            </TraineeShowLayout>
        </AppLayout>
    );
}
