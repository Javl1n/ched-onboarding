import { cn } from '@/lib/utils';
import { QuestionInterface } from '@/types';
import InputError from '../input-error';

export default function ScaleQuestion({
    question,
    setData,
    value,
    error,
    disabled = false,
}: {
    value: number;
    question: QuestionInterface;
    setData: (value: string | number) => void;
    error?: string;
    disabled?: boolean;
}) {
    const scales = [
        { value: 1, size: 'size-10', color: 'border-red-500', bgColor: 'bg-red-400/70', label: 'Poor' },
        { value: 2, size: 'size-8', color: 'border-red-500', bgColor: 'bg-red-400/70', label: 'Below Average' },
        { value: 3, size: 'size-6', color: 'border-neutral-400', bgColor: 'bg-neutral-400/70', label: 'Average' },
        { value: 4, size: 'size-8', color: 'border-green-500', bgColor: 'bg-green-400/70', label: 'Good' },
        { value: 5, size: 'size-10', color: 'border-green-500', bgColor: 'bg-green-400/70', label: 'Excellent' },
    ];

    return (
        <div className="group rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-6 text-center font-medium text-foreground">{question.content}</div>

            <div className="flex items-end justify-center gap-3">
                {scales.map((scale) => (
                    <div key={`question-value-${scale.value}`} className="flex flex-col items-center gap-2">
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => !disabled && setData(scale.value)}
                            className={cn(
                                scale.size,
                                'rounded-full border-4 transition-all duration-200',
                                scale.color,
                                scale.value === value && scale.bgColor,
                                !disabled && 'cursor-pointer hover:scale-110 hover:shadow-lg',
                                disabled && 'cursor-not-allowed opacity-60',
                            )}
                            aria-label={`Rate ${scale.label}`}
                        />
                        <span
                            className={cn(
                                'text-xs font-medium transition-colors',
                                scale.value === value ? 'text-foreground' : 'text-muted-foreground',
                            )}
                        >
                            {scale.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between text-xs font-medium text-muted-foreground">
                <span>Needs Improvement</span>
                <span>Excellent</span>
            </div>

            <InputError message={error} className="mt-4 text-center" />
        </div>
    );
}
