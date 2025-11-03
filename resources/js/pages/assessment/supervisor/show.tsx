import ScaleQuestion from '@/components/assessments/scale-question';
import TextQuestion from '@/components/assessments/text-question';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import SupervisorAssessmentLayout from '@/layouts/assessment/supervisor-layout';
import { AssessmentsForm, GroupedQuestions } from '@/pages/trainee/show/assessment';
import assessments from '@/routes/assessments';
import { AssessmentInterface, QuestionInterface, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
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
        <AppLayout>
            <Head title={`Assessments - ${supervisor.name}`} />
            <SupervisorAssessmentLayout
                actions={
                    <>
                        <Button disabled={processing} onClick={save} className="w-full">
                            Save Assessment
                        </Button>
                    </>
                }
            >
                <>
                    {Object.keys(questions)
                        .filter((category) => category != 'General')
                        .map((category) => (
                            <div key={category} className="space-y-4">
                                <div className="text-2xl font-bold">{category}</div>
                                <div className="space-y-5">
                                    {questions[category].map((question, index) => (
                                        <ScaleQuestion
                                            // disabled={supervisor.id !== user.id}
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
                    <div className="space-y-4">
                        <div className="text-center text-xl font-bold">Additional Questions</div>
                        <div className="space-y-5">
                            {questions['General'].map((question, index) => (
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
                </>
            </SupervisorAssessmentLayout>
        </AppLayout>
    );
}
