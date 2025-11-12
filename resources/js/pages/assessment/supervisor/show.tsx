import ScaleQuestion from '@/components/assessments/scale-question';
import TextQuestion from '@/components/assessments/text-question';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SupervisorAssessmentLayout from '@/layouts/assessment/supervisor-layout';
import { AssessmentsForm, GroupedQuestions } from '@/pages/trainee/show/assessment';
import assessments from '@/routes/assessments';
import { AssessmentInterface, BreadcrumbItem, QuestionInterface, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Save, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SupervisorAsssessmentShow({
    supervisor,
    questions: questionList,
    assessments: assessmentList,
}: {
    supervisor: User;
    questions: QuestionInterface[];
    assessments: AssessmentInterface[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Assessments',
            href: assessments.supervisor.index().url,
        },
        {
            title: supervisor.name,
            href: assessments.supervisor.show(supervisor.id).url,
        },
    ];
    const questions: GroupedQuestions = questionList.reduce<GroupedQuestions>((accumulator, currentQuestion) => {
        const category = currentQuestion.category;

        if (!accumulator[category]) {
            accumulator[category] = [];
        }

        accumulator[category].push(currentQuestion);

        return accumulator;
    }, {});

    const { data, setData, post, processing, errors } = useForm<AssessmentsForm>({
        questions: Object.fromEntries(
            questionList.map((question) => [question.id, assessmentList.find((assessment) => assessment.question.id == question.id)?.value || '']),
        ),
    });

    const save = () => {
        toast.promise(
            new Promise((resolve, reject) => {
                post(
                    assessments.supervisor.store({
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assessments - ${supervisor.name}`} />
            <SupervisorAssessmentLayout
                actions={
                    <Button disabled={processing} onClick={save} className="w-full gap-2 shadow-sm" size="lg">
                        <Save className="size-4" />
                        Save Assessment
                    </Button>
                }
            >
                <div className="space-y-6">
                    {/* Supervisor Header Card */}
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-primary/10 p-3">
                                <UserCircle className="size-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-foreground">{supervisor.name}</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Complete the assessment below to provide feedback on this supervisor's performance
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assessment Content Card */}
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
                        <div className="h-[calc(100vh-6rem)] space-y-8 overflow-auto">
                            {Object.keys(questions)
                                .filter((category) => category != 'General')
                                .map((category, categoryIndex) => (
                                    <div key={category} className="space-y-6">
                                        <div className="border-b pb-4">
                                            <h3 className="text-2xl font-bold text-foreground">{category}</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {questions[category].length} {questions[category].length === 1 ? 'question' : 'questions'}
                                            </p>
                                        </div>
                                        <div className="space-y-5">
                                            {questions[category].map((question) => (
                                                <ScaleQuestion
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
                                <div className="space-y-6 border-t pt-8">
                                    <div className="pb-4">
                                        <h3 className="text-2xl font-bold text-foreground">Additional Feedback</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Detailed written feedback for the supervisor</p>
                                    </div>
                                    <div className="space-y-5">
                                        {questions['General'].map((question) => (
                                            <TextQuestion
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
                </div>
            </SupervisorAssessmentLayout>
        </AppLayout>
    );
}
