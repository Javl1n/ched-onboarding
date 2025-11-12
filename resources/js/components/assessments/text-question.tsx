import { QuestionInterface } from '@/types';
import { MessageSquare } from 'lucide-react';
import { InputHTMLAttributes } from 'react';
import InputError from '../input-error';
import { Textarea } from '../ui/textarea';

export default function TextQuestion({
    question,
    error,
    disabled,
    ...props
}: { question: QuestionInterface; error: string } & InputHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-2 flex items-start gap-2">
                <MessageSquare className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div className="font-semibold text-foreground">{question.content}</div>
            </div>
            {!disabled ? (
                <Textarea className="mt-4 min-h-32 bg-white" placeholder="Enter your evaluation here..." {...props}></Textarea>
            ) : (
                <div className="mt-4 min-h-32 rounded-lg border bg-muted/30 p-4">
                    {props.value ? (
                        <p className="text-sm whitespace-pre-wrap text-foreground">{props.value}</p>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <span className="text-sm text-muted-foreground italic">No answer provided</span>
                        </div>
                    )}
                </div>
            )}
            <InputError message={error} className="mt-2" />
        </div>
    );
}
