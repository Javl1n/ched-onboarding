import ScaleQuestion from '@/components/assessments/scale-question';
import AppLayout from '@/layouts/app-layout';
import SupervisorShowLayout from '@/layouts/supervisor/show-layout';
import { index } from '@/routes/supervisor';
import show from '@/routes/supervisor/show';
import { BreadcrumbItem, QuestionInterface, User } from '@/types';
import { Head } from '@inertiajs/react';
import { GroupedQuestions } from '../trainee/show/assessment';

export default function SupervisorShow({
    supervisor,
    questions: questionsList,
    assessments,
}: {
    supervisor: User;
    questions: QuestionInterface[];
    assessments: {
        [key: string | number]: number;
    };
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
            title: 'Overall Assessment',
            href: show.all(supervisor).url,
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
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                        <div className="h-[calc(100vh-6rem)] space-y-8 overflow-auto">
                            {Object.keys(questions).map((category) => (
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
                                                value={assessments[question.id] as number}
                                                question={question}
                                                setData={() => null}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SupervisorShowLayout>
        </AppLayout>
    );
}
