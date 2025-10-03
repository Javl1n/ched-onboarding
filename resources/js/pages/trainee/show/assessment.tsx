import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import TraineeShowLayout from "@/layouts/trainee/show-layout";
import { index } from "@/routes/trainees";
import show from "@/routes/trainees/show";
import { AssessmentInterface, BreadcrumbItem, QuestionInterface, SharedData, User } from "@/types";
import { Head, usePage, useForm, } from "@inertiajs/react";
import assessments from "@/routes/assessments";
import { toast } from "sonner";
import { format } from "date-fns";
import ScaleQuestion from "@/components/assessments/scale-question";
import TextQuestion from "@/components/assessments/text-question";
import assessment from "@/routes/trainees/assessment";
import { router } from "@inertiajs/core";
import { cn } from "@/lib/utils";

export type GroupedQuestions = {
     [key: string]: QuestionInterface[]
}

export type AssessmentsForm = {
     questions: {
          [key: string]: number | string | null
     };
}

export default function TraineeShowAssessment({
     trainee, supervisors, supervisor, assessments: assessmentList, questions: questionList, 
}: {
     trainee: User, 
     supervisors: User[], 
     supervisor: User, 
     assessments: AssessmentInterface[],
     questions: QuestionInterface[]
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
               title: "Assessments",
               href: assessment.redirect(trainee).url,
          },
          {
               title: supervisor.name,
               href: show.assessment({user: trainee, supervisor: supervisor}).url,
          },
     ];

     const {auth: {user}} = usePage<SharedData>().props;

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
                    assessmentList.find(assessment => assessment.question.id == question.id)?.value || ''
               ])
          )
     });

     const save = () => {
          toast.promise(
               new Promise((resolve, reject) => {
                    post(assessments.trainee.store({
                         trainee: trainee.id as number,
                         supervisor: supervisor.id as number,
                    }).url, {
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
                    <div className="space-y-4">
                         <div className="space-y-2">
                              <h1 className="text-sm font-bold text-neutral-400">Supervisors</h1>
                              <div className="space-y-2">
                                   {supervisors.map((supervisor) => (
                                        <Button 
                                             onClick={() => router.get(show.assessment({user: trainee, supervisor: supervisor}))} 
                                             className={cn("w-full justify-start text-wrap overflow-hidden text-ellipsis", {
                                                  'bg-muted': window.location.pathname === show.assessment({user: trainee, supervisor: supervisor}).url
                                             })} variant={`ghost`} key={`supervisor-${supervisor.id}`}
                                        >
                                             {supervisor.name}
                                        </Button>
                                   ))}
                              </div>
                         </div>
                         <div className={cn("space-y-2", {
                              "hidden": supervisor.id != user.id
                         })}>
                              <h1 className="text-sm font-bold text-neutral-400">Actions</h1>
                              <Button 
                                   disabled={supervisor.id != user.id} className="w-full" 
                                   onClick={save}
                              >
                                   Save Assessment
                              </Button>
                         </div>
                    </div>
               )}>
                    <div className="h-[calc(100vh-16rem)] overflow-auto px-4">
                         {Object.keys(questions).filter(category => category != "General").map((category) => (
                              <div key={category} className="mb-10">
                                   <div className="text-2xl font-bold my-4">{category}</div>
                                   <div className="space-y-5">
                                        {questions[category].map((question, index) => (
                                             <ScaleQuestion 
                                             disabled={supervisor.id !== user.id}
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
                                        disabled={supervisor.id !== user.id}
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