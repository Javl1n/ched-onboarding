import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea"
import { QuestionInterface } from "@/types";
import InputError from "../input-error";

export default function TextQuestion({question, error,  ...props}: {question: QuestionInterface, error: string} & InputHTMLAttributes<HTMLTextAreaElement>) 
{
     return (
          <div className="border rounded-lg p-5">
               <div className="">{question.content}</div>
               <Textarea className="mt-4" placeholder="Enter your evaluation here" {...props}></Textarea>
               <InputError message={error} />
          </div>
     )
}