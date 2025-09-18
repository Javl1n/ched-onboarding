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
     questions: {id: string, value: number | string | null}[]
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
          questions: [
               ...questionList.map((question) => ({
                    id: question.id as string,
                    value: null,
               }))
          ]
     });

     const save = () => {
          post(assessments.supervisor.store(trainee.id as number).url);
          console.log(errors);
     }

     return (
          <div className="flex-1 mx-40">
               <div className="">
                    {Object.keys(questions).filter(category => category != "General").map((category) => (
                         <div key={category} className="mb-10">
                              <div className="text-center text-xl font-bold">{category}</div>
                              <div className="space-y-5">
                                   {questions[category].map((question, index) => (
                                        <ScaleQuestion 

                                        value={data.questions.find(questionItem => questionItem.id == question.id)!.value as number} 

                                        setData={(value) => setData("questions", [
                                             ...data.questions.map((questionItem) => {
                                                  if (questionItem.id != question.id) return questionItem;

                                                  return {
                                                       id: question.id as string, 
                                                       value: value as number
                                                  }
                                             })
                                        ])} question={question} key={`question-${index}`} error={errors[`questions.${index}.value`]} />
                                   ))}
                              </div>
                         </div>
                    ))}
                    <div className="">
                         <div className="text-center text-xl font-bold">Questions</div>
                         <div className="space-y-5">
                              {questions["General"].map((question, index) => (
                                   <TextQuestion 

                                   value={data.questions.find(questionItem => questionItem.id == question.id)?.value ?? ''} 

                                   onChange={(e) => setData("questions", [
                                        ...data.questions.map((questionItem) => {
                                             if (questionItem.id != question.id) return questionItem;

                                             return {
                                                  id: question.id as string, 
                                                  value: e.target.value as string
                                             }
                                        })
                                   ])} question={question} key={`question-${index}`} error={errors[`questions.${index + parseInt(question.id as string)}.value`]} />
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