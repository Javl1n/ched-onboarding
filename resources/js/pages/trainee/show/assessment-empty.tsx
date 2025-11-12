import AppLayout from '@/layouts/app-layout';
import TraineeShowLayout from '@/layouts/trainee/show-layout';
import { index } from '@/routes/trainees';
import assessment from '@/routes/trainees/assessment';
import show from '@/routes/trainees/show';
import { BreadcrumbItem, QuestionInterface, User } from '@/types';
import { Head } from '@inertiajs/react';
import { UserX } from 'lucide-react';

type GroupedQuestions = {
    [key: string]: QuestionInterface[];
};

type AssessmentsForm = {
    questions: {
        [key: string]: number | string | null;
    };
};

export default function TraineeAssessmentEmpty({ trainee }: { trainee: User }) {
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
            title: 'Assessments',
            href: assessment.redirect(trainee).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainees" />

            <TraineeShowLayout>
                <div className="flex h-[calc(100vh-16rem)] items-center justify-center">
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-12 shadow-sm">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="flex size-20 items-center justify-center rounded-full bg-muted/50 ring-4 ring-muted/30">
                                <UserX className="size-10 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-foreground">No Supervisors</h1>
                                <p className="max-w-md text-sm text-muted-foreground">
                                    There are no supervisors assigned to this department yet. Please contact your administrator to assign supervisors.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </TraineeShowLayout>
        </AppLayout>
    );
}
