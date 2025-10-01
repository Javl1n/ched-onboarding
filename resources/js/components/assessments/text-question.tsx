import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea"
import { QuestionInterface } from "@/types";
import InputError from "../input-error";

export default function TextQuestion({question, error, disabled, ...props}: {question: QuestionInterface, error: string} & InputHTMLAttributes<HTMLTextAreaElement>) 
{
     return (
          <div className="border rounded-lg p-5">
               <div className="">{question.content}</div>
               {!disabled ? 
               <Textarea className="mt-4" placeholder="Enter your evaluation here" {...props}></Textarea> : 
               <div className="min-h-10 border mt-4 rounded-lg p-4">{props.value ?? <span className="font-bold text-muted">no answer</span>}</div>}
               <InputError message={error} />
          </div>
     )
}