import { QuestionInterface, SharedData } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import ScaleQuestion from "./scale-question";

type GroupedQuestions = {
     [key: string]: QuestionInterface[]
}

type AssessmentsForm = {
     questions: {id: string, value: number}[]
}

export default function AssessmentForm() {
     const {questions: questionList} = usePage<SharedData & {questions: QuestionInterface[]}>().props;

     const questions: GroupedQuestions = questionList.reduce<GroupedQuestions>((accumulator, currentQuestion) => {
          const category = currentQuestion.category;

          if (!accumulator[category]) {
               accumulator[category] = [];
          }

          accumulator[category].push(currentQuestion);

          return accumulator;
     }, {});

     const {data, setData} = useForm<AssessmentsForm>({
          questions: [
               ...questionList.map((question) => ({
                    id: question.id as string,
                    value: 0,
               }))
          ]
     });

     return (
          <div className="flex-1 mx-40">
               <div className="">
                    {Object.keys(questions).map((category) => (
                         <div key={category} className="mb-2">
                              <div className="text-center font-bold text-neutral-400">{category}</div>
                              <div className="space-y-5">
                                   {questions[category].map((question, index) => (
                                        <ScaleQuestion 

                                        value={data.questions.find(questionItem => questionItem.id == question.id)!.value} 

                                        setData={(value) => setData("questions", [
                                             ...data.questions.map((questionItem) => {
                                                  if (questionItem.id != question.id) return questionItem;

                                                  return {
                                                       id: question.id as string, 
                                                       value: value as number
                                                  }
                                             })
                                        ])} question={question} key={`question-${index}`} />
                                   ))}
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     )
}