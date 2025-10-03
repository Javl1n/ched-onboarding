import { QuestionInterface } from "@/types";
import InputError from "../input-error";

export default function ScaleQuestion({
     question, setData, value, error, disabled = false
}: {
     value: number, 
     question: QuestionInterface, 
     setData: (value: string | number) => void, 
     error?: string,
     disabled?: boolean
}) 
{
     return (
          <div className="border rounded-lg p-5">
               <div className="text-center">{question.content}</div>
               <div className="flex justify-center gap-4 mt-4">

                    {Array.from({length: 2}, (_, i) => i + 1).map((index) => (
                         <div 
                         key={`question-value-${index}`} 
                         onClick={() => !disabled && setData(index)} 
                         className={`${index == value ? 'bg-red-400/70' : ''} ${index % 2 ? "size-10" : "size-8"} my-auto border-4 border-red-500 rounded-full transition`}>
                              
                         </div>
                    ))}

               <div 
                    onClick={() => !disabled && setData(3)} 
                    className={`${value == 3 ? 'bg-neutral-400/70' : ''} size-6 my-auto border-4 border-neutral-400 rounded-full transition`} />

                    {Array.from({length: 2}, (_, index) => index + 4).map((index) => (

                         <div 
                         onClick={() => !disabled && setData(index)} 
                         key={`question-index-${index}`} 
                         className={`${index == value ? 'bg-green-400/70' : ''} ${index % 2 ? "size-10" : "size-8"} my-auto border-4 border-green-500 rounded-full transition`} />

                    ))}
               </div>
               <InputError message={error} className="text-center mt-4" />
          </div>
     )
}