import trainees from '@/routes/trainees';
import { saved, store } from '@/routes/trainees/summary';
import { User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useStream } from '@laravel/stream-react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, FileText, Save, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';

export default function ReportSummary() {
    const { trainee, reports } = usePage<{
        trainee: User;
        reports: {
            [key: string | number]: string;
        } | null;
    }>().props;

    const [summary, setSummary] = useState('');

    const [error, setError] = useState('');

    const [report, setReport] = useState<string | undefined>(reports ? Object.keys(reports)[0] : undefined);

    const {
        data: formData,
        setData,
        errors,
        post,
    } = useForm<{ summary: string }>({
        summary: '',
    });

    const {
        data: streamData,
        isFetching,
        isStreaming,
        send,
    } = useStream(trainees.summary(trainee).url, {
        onData: (data: string) => {
            setSummary((prev) => prev + data);
        },
        onFinish: () => {
            setData('summary', streamData);
        },
        onError: (error) => {
            if (
                error.message.includes('419') ||
                error.message.toLowerCase().includes('csrf') ||
                error.message.toLowerCase().includes('page expired')
            ) {
                setError('Your session has expired. Please refresh the page and try again.');
                toast.error('Session Expired', {
                    description: 'Please refresh the page and try again.',
                });
            } else {
                setError(error.message);
            }
        },
    });

    const {
        data: savedData,
        send: sendSaved,
        isFetching: isFetchingSaved,
    } = useStream(saved(trainee).url, {
        onData: (data: string) => {
            setSummary((prev) => prev + data);
        },
        onFinish: () => {
            // setData("summary", streamData);
        },
        onError: (error) => {
            if (
                error.message.includes('419') ||
                error.message.toLowerCase().includes('csrf') ||
                error.message.toLowerCase().includes('page expired')
            ) {
                setError('Your session has expired. Please refresh the page and try again.');
                toast.error('Session Expired', {
                    description: 'Please refresh the page and try again.',
                });
            } else {
                setError(error.message);
            }
        },
    });

    useEffect(() => {
        if (!reports) return;
        sendSaved({ id: Object.keys(reports)[0] });
    }, []);

    const save = () => {
        toast.promise(
            new Promise((resolve, reject) => {
                post(store(trainee.id).url, {
                    onSuccess: () => resolve('Assessment Saved!'),
                    onError: (error: { summary?: string }) => {
                        if (
                            error.summary?.includes('419') ||
                            error.summary?.toLowerCase().includes('csrf') ||
                            error.summary?.toLowerCase().includes('page expired')
                        ) {
                            reject('Session expired. Please refresh the page.');
                            setError('Your session has expired. Please refresh the page and try again.');
                        } else {
                            reject('Something went wrong.');
                            setError(error.summary as string);
                        }
                    },
                });
            }),
            {
                loading: 'Saving Assessment...',
                success: (msg) => msg as string,
                error: (msg) => msg as string,
                description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:m a")}`,
            },
        );
    };

    return (
        <div className="flex h-auto flex-col rounded-xl border bg-gradient-to-br from-emerald-50 to-white p-6 lg:h-[calc(100vh-16rem)] dark:from-emerald-950/20 dark:to-background">
            {/* Header Section */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-lg dark:bg-emerald-600">
                        <FileText className="size-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">AI Summary</h2>
                        <p className="text-xs text-muted-foreground">Generated performance report</p>
                    </div>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[200px]">
                    <Select
                        disabled={isFetching || isFetchingSaved}
                        value={report}
                        onValueChange={(value) => {
                            setReport(value);
                            setSummary('');
                            setData('summary', '');
                            sendSaved({ id: value });
                        }}
                    >
                        <SelectTrigger className="bg-background">
                            <CalendarIcon className="mr-2 size-4" />
                            <SelectValue placeholder="Select saved summary" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel className="text-xs text-muted-foreground">Saved Summaries</SelectLabel>
                                {reports ? (
                                    Object.keys(reports).map((id) => (
                                        <SelectItem key={`reports-${id}`} value={id}>
                                            {reports[id]}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <div className="px-2 py-1.5 text-xs text-muted-foreground">No saved summaries</div>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content Section */}
            <div className="min-h-[20rem] flex-1 overflow-auto rounded-xl border bg-background p-5 shadow-sm">
                {!summary && !isFetching && !isFetchingSaved && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                            <Sparkles className="size-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground">No summary available</p>
                            <p className="max-w-xs text-xs text-muted-foreground">
                                Click "Generate Summary" below to create an AI-powered performance report
                            </p>
                        </div>
                    </div>
                )}
                {summary && (
                    <div
                        className="prose-section:mb-10 prose prose-sm max-w-none prose-neutral sm:prose dark:text-white dark:prose-invert prose-h2:mt-0 dark:prose-h2:text-white dark:prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: summary }}
                    />
                )}
                {(isFetching || isFetchingSaved) && (
                    <div className="space-y-3">
                        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className="size-4 animate-pulse" />
                            <span>Generating AI summary...</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[...Array(20)].map((_, index) => (
                                <Skeleton
                                    key={`skeleton-${index}`}
                                    className="h-4"
                                    style={{
                                        width: Math.floor(Math.random() * 200 + 100),
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions Section */}
            <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-6 sm:flex-row">
                <Button
                    className="w-full gap-2 sm:w-auto"
                    disabled={isFetching || isFetchingSaved}
                    onClick={() => {
                        setSummary('');
                        setReport(undefined);
                        setData('summary', '');
                        send({});
                    }}
                >
                    <Sparkles className="size-4" />
                    Generate Summary
                </Button>
                <Button className="w-full gap-2 sm:w-auto" disabled={formData.summary == ''} variant={'secondary'} onClick={() => save()}>
                    <Save className="size-4" />
                    Save Summary
                </Button>
                {error && (
                    <div className="sm:my-auto sm:ml-2">
                        <InputError message={error} />
                    </div>
                )}
            </div>
        </div>
    );
}
