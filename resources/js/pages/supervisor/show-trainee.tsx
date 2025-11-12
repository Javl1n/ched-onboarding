import ScaleQuestion from '@/components/assessments/scale-question';
import TextQuestion from '@/components/assessments/text-question';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import SupervisorShowLayout from '@/layouts/supervisor/show-layout';
import { cn } from '@/lib/utils';
import { index } from '@/routes/supervisor';
import show from '@/routes/supervisor/show';
import { AssessmentInterface, BreadcrumbItem, QuestionInterface, User } from '@/types';
import { Head } from '@inertiajs/react';
import { User as UserIcon } from 'lucide-react';
import { GroupedQuestions } from '../trainee/show/assessment';

export default function SupervisorShow({
    supervisor,
    questions: questionsList,
    assessments,
    trainee,
}: {
    supervisor: User;
    questions: QuestionInterface[];
    assessments: AssessmentInterface[];
    trainee: User;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Supervisors',
            href: index().url,
        },
        {
            title: supervisor.name,
            href: show.all(supervisor).url,
        },
        {
            title: trainee.name,
            href: show.trainee({
                supervisor: supervisor,
                trainee: trainee,
            }).url,
        },
    ];

    const questions: GroupedQuestions = questionsList.reduce<GroupedQuestions>((accumulator, currentQuestion) => {
        const category = currentQuestion.category;

        if (!accumulator[category]) {
            accumulator[category] = [];
        }

        accumulator[category].push(currentQuestion);

        return accumulator;
    }, {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Supervisors" />
            <SupervisorShowLayout>
                <div className="space-y-6">
                    {/* Trainee Header Card */}
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 shadow-sm">
                                <UserIcon className="size-7 text-primary" />
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-bold text-foreground">{trainee.name}</h2>
                                    {trainee.profile?.status && (
                                        <Badge
                                            variant={trainee.profile.status === 'active' ? 'default' : 'secondary'}
                                            className={cn(
                                                'h-fit px-2.5 py-0.5 text-xs font-medium',
                                                trainee.profile.status === 'active' &&
                                                    'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
                                            )}
                                        >
                                            {trainee.profile.status === 'active' ? 'Active' : 'Inactive'}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">Assessment from {trainee.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Assessment Content Card */}
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                        <div className="h-[calc(100vh-6rem)] space-y-8 overflow-auto">
                            {Object.keys(questions)
                                .filter((category) => category !== 'General')
                                .map((category) => (
                                    <div key={category} className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {questions[category].length} {questions[category].length === 1 ? 'question' : 'questions'}
                                            </p>
                                        </div>
                                        <div className="space-y-5">
                                            {questions[category].map((question) => (
                                                <ScaleQuestion
                                                    key={`question-${question.id}`}
                                                    disabled
                                                    value={
                                                        assessments.find((assessment) => assessment.question.id === question.id)
                                                            ?.value as unknown as number
                                                    }
                                                    question={question}
                                                    setData={() => null}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}

                            {questions['General'] && (
                                <div className="space-y-6 border-t pt-8">
                                    <div className="pb-4">
                                        <h2 className="text-2xl font-bold text-foreground">Additional Feedback</h2>
                                        <p className="mt-1 text-sm text-muted-foreground">Detailed written feedback for the trainee</p>
                                    </div>
                                    <div className="space-y-5">
                                        {questions['General'].map((question) => (
                                            <TextQuestion
                                                key={`question-${question.id}`}
                                                disabled
                                                value={
                                                    assessments.find((assessment) => assessment.question.id === question.id)?.value as unknown as string
                                                }
                                                onChange={() => null}
                                                question={question}
                                                error=""
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SupervisorShowLayout>
        </AppLayout>
    );
}
