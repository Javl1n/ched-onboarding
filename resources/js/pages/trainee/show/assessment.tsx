import AssessmentForm from "@/components/assessments/form";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import TraineeShowLayout from "@/layouts/trainee/show-layout";
import { index } from "@/routes/trainees";
import show from "@/routes/trainees/show";
import { BreadcrumbItem, QuestionInterface, SharedData, User } from "@/types";
import { Head, usePage, useForm, } from "@inertiajs/react";
import assessments from "@/routes/assessments";
import { toast } from "sonner";
import { format } from "date-fns";
import ScaleQuestion from "@/components/assessments/scale-question";
import TextQuestion from "@/components/assessments/text-question";

type GroupedQuestions = {
     [key: string]: QuestionInterface[]
}

type AssessmentsForm = {
     questions: {
          [key: string]: number | string | null
     };
}

export default function TraineeShowAssessment({trainee}: {trainee: User}) {
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
               title: "Assessment",
               href: show.assessment(trainee).url,
          },
     ];

     const {questions: questionList} = usePage<SharedData & {questions: QuestionInterface[]}>().props;

     const questions: GroupedQuestions= questionList.reduce<GroupedQuestions>((accumulator, currentQuestion) => {
          const category = currentQuestion.category;

          if (!accumulator[category]) {
               accumulator[category] = [];
          }

          accumulator[category].push(currentQuestion);

          return accumulator;
     }, {});

     const {data, setData, post, errors} = useForm<AssessmentsForm>({
          questions: Object.fromEntries(
               questionList.map((question) => [
                    question.id,
                    trainee.profile?.assessments.find(assessment => assessment.question.id == question.id)?.value ?? ""
               ])
          )
     });

     const save = () => {
          toast.promise(
               new Promise((resolve, reject) => {
                    post(assessments.supervisor.store(trainee.id as number).url, {
                         onSuccess: () => resolve("Assessment Saved!"),
                         onError: () => reject("Something went wrong."),
                    });
               }),
               {
                    loading: "Saving Assessment...",
                    success: (msg) => msg as string,
                    error: (msg) => msg as string,
                    description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:m a")}`
               }
          );
     }

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Trainees" />
               
               <TraineeShowLayout action={(
                    <Button className="w-full" onClick={save}>
                         Save Assessment
                    </Button>
               )}>
                    <div className="h-[calc(100vh-16rem)] overflow-auto px-4">
                         {Object.keys(questions).filter(category => category != "General").map((category) => (
                              <div key={category} className="mb-10">
                                   <div className="text-2xl font-bold my-4">{category}</div>
                                   <div className="space-y-5">
                                        {questions[category].map((question, index) => (
                                             <ScaleQuestion 

                                             value={data.questions[question.id] as number} 

                                             setData={(value) => setData("questions", {
                                                  ...data.questions,
                                                  [question.id]: value as number
                                             })} question={question} key={`question-${question.id}`} error={errors[`questions.${question.id}`]} />
                                        ))}
                                   </div>
                              </div>
                         ))}
                         <div className="">
                              <div className="text-center text-xl font-bold">Questions</div>
                              <div className="space-y-5">
                                   {questions["General"].map((question, index) => (
                                        <TextQuestion 

                                        value={data.questions[question.id] as string} 

                                        onChange={(e) => setData("questions", {
                                             ...data.questions,
                                             [question.id]: e.target.value as string,
                                        })} question={question} key={`question-${question.id}`} error={errors[`questions.${question.id}`]} />
                                   ))}
                              </div>
                         </div>
                         {/* <div className="my-10 flex justify-end gap-3">
                              <Button onClick={save}>Save</Button>
                         </div> */}
                    </div>
               </TraineeShowLayout>
               
          </AppLayout>
     );
} 