import ScaleQuestion from '@/components/assessments/scale-question';
import TextQuestion from '@/components/assessments/text-question';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import TraineeShowLayout from '@/layouts/trainee/show-layout';
import { cn } from '@/lib/utils';
import assessments from '@/routes/assessments';
import { index } from '@/routes/trainees';
import assessment from '@/routes/trainees/assessment';
import show from '@/routes/trainees/show';
import { AssessmentInterface, BreadcrumbItem, QuestionInterface, SharedData, User } from '@/types';
import { router } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CheckCircle2, ClipboardList } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

export type GroupedQuestions = {
    [key: string]: QuestionInterface[];
};

export type AssessmentsForm = {
    questions: {
        [key: string]: number | string | null;
    };
};

export default function TraineeShowAssessment({
    trainee,
    supervisors,
    supervisor,
    assessments: assessmentList,
    questions: questionList,
}: {
    trainee: User;
    supervisors: User[];
    supervisor: User;
    assessments: AssessmentInterface[];
    questions: QuestionInterface[];
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
            title: 'Assessments',
            href: assessment.redirect(trainee).url,
        },
        {
            title: supervisor.name,
            href: show.assessment({ user: trainee, supervisor: supervisor }).url,
        },
    ];

    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const questions: GroupedQuestions = questionList.reduce<GroupedQuestions>((accumulator, currentQuestion) => {
        const category = currentQuestion.category;

        if (!accumulator[category]) {
            accumulator[category] = [];
        }

        accumulator[category].push(currentQuestion);

        return accumulator;
    }, {});

    const { data, setData, post, errors } = useForm<AssessmentsForm>({
        questions: Object.fromEntries(
            questionList.map((question) => {
                const existingValue = assessmentList.find((assessment) => assessment.question.id == question.id)?.value;
                return [question.id, existingValue ? (isNaN(Number(existingValue)) ? existingValue : Number(existingValue)) : ''];
            }),
        ),
    });

    const save = () => {
        toast.promise(
            new Promise((resolve, reject) => {
                post(
                    assessments.trainee.store({
                        trainee: trainee.id as number,
                        supervisor: supervisor.id as number,
                    }).url,
                    {
                        onSuccess: () => resolve('Assessment Saved!'),
                        onError: () => reject('Something went wrong.'),
                    },
                );
            }),
            {
                loading: 'Saving Assessment...',
                success: (msg) => msg as string,
                error: (msg) => msg as string,
                description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:m a")}`,
            },
        );
    };

    const progress = useMemo(() => {
        const answeredCount = Object.values(data.questions).filter((value) => value !== '' && value !== null).length;
        const totalCount = questionList.length;
        return {
            answered: answeredCount,
            total: totalCount,
            percentage: Math.round((answeredCount / totalCount) * 100),
        };
    }, [data.questions, questionList.length]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainees" />

            <TraineeShowLayout
                action={
                    <div className="space-y-6">
                        {supervisor.id === user.id && (
                            <div className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <ClipboardList className="size-4" />
                                        Progress
                                    </h2>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {progress.answered}/{progress.total}
                                    </span>
                                </div>
                                <Progress value={progress.percentage} className="h-2" />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {progress.percentage === 100 ? (
                                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="size-3" />
                                            All questions answered
                                        </span>
                                    ) : (
                                        `${progress.percentage}% complete`
                                    )}
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            <h2 className="text-sm font-semibold text-foreground">Supervisors</h2>
                            <div className="space-y-1">
                                {supervisors.map((sup) => (
                                    <Button
                                        onClick={() => router.get(show.assessment({ user: trainee, supervisor: sup }))}
                                        className={cn('w-full justify-start overflow-hidden text-wrap text-ellipsis', {
                                            'bg-muted font-medium':
                                                window.location.pathname === show.assessment({ user: trainee, supervisor: sup }).url,
                                        })}
                                        variant="ghost"
                                        key={`supervisor-${sup.id}`}
                                    >
                                        {sup.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {supervisor.id === user.id && (
                            <div className="space-y-3">
                                <h2 className="text-sm font-semibold text-foreground">Actions</h2>
                                <Button disabled={supervisor.id !== user.id} className="w-full" onClick={save}>
                                    Save Assessment
                                </Button>
                            </div>
                        )}
                    </div>
                }
            >
                <div className="h-[calc(100vh-13.5rem)] overflow-auto px-4">
                    <div className="mx-auto max-w-4xl space-y-12 py-6">
                        {Object.keys(questions)
                            .filter((category) => category !== 'General')
                            .map((category) => (
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
                                                disabled={supervisor.id !== user.id}
                                                value={data.questions[question.id] as number}
                                                setData={(value) =>
                                                    setData('questions', {
                                                        ...data.questions,
                                                        [question.id]: value as number,
                                                    })
                                                }
                                                question={question}
                                                key={`question-${question.id}`}
                                                error={errors[`questions.${question.id}`]}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                        {questions['General'] && (
                            <div className="space-y-6 border-t pt-12">
                                <div className="sticky top-0 z-10 border-b bg-background/95 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                    <h2 className="text-2xl font-bold text-foreground">Additional Feedback</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">Provide detailed written feedback for the trainee</p>
                                </div>
                                <div className="space-y-5">
                                    {questions['General'].map((question) => (
                                        <TextQuestion
                                            disabled={supervisor.id !== user.id}
                                            value={data.questions[question.id] as string}
                                            onChange={(e) =>
                                                setData('questions', {
                                                    ...data.questions,
                                                    [question.id]: e.target.value as string,
                                                })
                                            }
                                            question={question}
                                            key={`question-${question.id}`}
                                            error={errors[`questions.${question.id}`]}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </TraineeShowLayout>
        </AppLayout>
    );
}
