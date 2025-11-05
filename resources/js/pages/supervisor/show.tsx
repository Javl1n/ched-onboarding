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
                <div className="h-[calc(100vh-13.5rem)] overflow-auto px-4">
                    <div className="mx-auto max-w-4xl space-y-12 py-6">
                        {Object.keys(questions).map((category) => (
                            <div key={category} className="space-y-6">
                                <div className="sticky top-0 z-10 border-b bg-background/95 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            </SupervisorShowLayout>
        </AppLayout>
    );
}
