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
                <div className="space-y-4">
                    {Object.keys(questions).map((category) => (
                        <div key={category} className="space-y-4">
                            <div className="text-2xl font-bold">{category}</div>
                            <div className="space-y-5">
                                {questions[category].map((question, index) => (
                                    <ScaleQuestion
                                        // disabled={supervisor.id !== user.id}
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
            </SupervisorShowLayout>
        </AppLayout>
    );
}
