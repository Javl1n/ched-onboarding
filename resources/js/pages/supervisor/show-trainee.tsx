import AppLayout from "@/layouts/app-layout";
import SupervisorShowLayout from "@/layouts/supervisor/show-layout";
import { index } from "@/routes/supervisor";
import { AssessmentInterface, BreadcrumbItem, QuestionInterface, User } from "@/types";
import { Head } from "@inertiajs/react";
import { GroupedQuestions } from "../trainee/show/assessment";
import ScaleQuestion from "@/components/assessments/scale-question";
import show from "@/routes/supervisor/show";
import TextQuestion from "@/components/assessments/text-question";

export default function SupervisorShow({
     supervisor, questions: questionsList, assessments, trainee
}: {
     supervisor: User,
     questions: QuestionInterface[],
     assessments: AssessmentInterface[],
     trainee: User,
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
                    trainee: trainee
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
                    <div className="space-y-4">
                         {Object.keys(questions).filter(category => category != "General").map((category) => (
                              <div key={category} className="space-y-4">
                                   <div className="text-2xl font-bold">{category}</div>
                                   <div className="space-y-5">
                                        {questions[category].map((question, index) => (
                                             <ScaleQuestion
                                             // disabled={supervisor.id !== user.id}
                                             disabled
                                             value={assessments.find(assessment => assessment.question.id == question.id)?.value as unknown as number}
                                             question={question}
                                             setData={() => null}
                                             />
                                        ))}
                                   </div>
                              </div>
                         ))}
                         <div className="space-y-4">
                              <div className="text-center text-xl font-bold">Additional Questions</div>
                              <div className="space-y-5">
                                   {questions["General"].map((question, index) => (
                                        <TextQuestion
                                        disabled
                                        value={assessments.find(assessment => assessment.question.id == question.id)?.value as unknown as string} 
                                        onChange={(e) => null} question={question} key={`question-${question.id}`} error={''} />
                                   ))}
                              </div>
                         </div>
                    </div>

               </SupervisorShowLayout>
          </AppLayout>
     )
}