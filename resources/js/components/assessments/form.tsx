import { QuestionInterface, SharedData, TraineeProfileInterface } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import ScaleQuestion from "./scale-question";
import TextQuestion from "./text-question";
import { Button } from "../ui/button";
import assessments from "@/routes/assessments";

type GroupedQuestions = {
     [key: string]: QuestionInterface[]
}

type AssessmentsForm = {
     questions: {
          [key: string]: number | string | null
     };
}

export default function AssessmentForm() {
     const {questions: questionList, trainee} = usePage<SharedData & {questions: QuestionInterface[], trainee: TraineeProfileInterface}>().props;

     const questions: GroupedQuestions = questionList.reduce<GroupedQuestions>((accumulator, currentQuestion) => {
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
                    ""
               ])
          )
     });

     const save = () => {
          post(assessments.supervisor.store(trainee.id as number).url);
     }

     return (
          <div className="">
               <div className="">
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
                    <div className="my-10 flex justify-end gap-3">
                         <Button onClick={save}>Save</Button>
                    </div>
               </div>
          </div>
     )
}