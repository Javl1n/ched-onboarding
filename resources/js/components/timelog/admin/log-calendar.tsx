import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { SharedData, TimeLogInterface } from '@/types';
import { usePage } from '@inertiajs/react';
import { format, isToday, isWeekend } from 'date-fns';
import { CalendarCheck2, Clock } from 'lucide-react';
import { MonthPagination } from './month-pagination';

export default function LogCalendar() {
    const { year, month, logs } = usePage<
        SharedData & {
            logs: TimeLogInterface[];
            month: number;
            year: number;
            profile: string;
        }
    >().props;

    const date = new Date(year, month - 1);

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{format(date, 'MMMM yyyy')}</h2>
                    <p className="text-sm text-muted-foreground">View and track time logs for the month</p>
                </div>
                <MonthPagination />
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-lg border border-sidebar-border/50 bg-muted/20 p-3 dark:border-sidebar-border/30">
                <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">Has logs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-muted" />
                    <span className="text-muted-foreground">No logs</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Today</span>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                <div className="flex h-full flex-col">
                    <div className="grid grid-cols-7 border-b border-sidebar-border/70 bg-muted/30 dark:border-sidebar-border">
                        {weekDays.map((day, index) => (
                            <div
                                key={`day-${day}`}
                                className={cn(
                                    'col-span-1 py-3 text-center text-xs font-semibold uppercase tracking-wide',
                                    index === 0 || index === 6 ? 'text-muted-foreground/70' : 'text-muted-foreground',
                                )}
                            >
                                <span className="hidden sm:inline">{day}</span>
                                <span className="sm:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid flex-1 grid-cols-7">
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() }).map((_, index) => (
                            <div key={`day-before-${index}`} className="border border-sidebar-border/50 bg-muted/20 p-1 dark:border-sidebar-border/30" />
                        ))}
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, index) => index + 1).map(
                            (day) => (
                                <LogDialog key={`day-${day}`} day={day} />
                            ),
                        )}

                        {Array.from({ length: Math.abs(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay() - 7) % 7 }).map((_, index) => (
                            <div key={`day-after-${index}`} className="h-15 border border-sidebar-border/50 bg-muted/20 p-1 dark:border-sidebar-border/30 md:h-30" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function LogDialog({ day }: { day: number }) {
    const { year, month, logs } = usePage<
        SharedData & {
            logs: TimeLogInterface[];
            month: number;
            year: number;
            profile: string;
        }
    >().props;

    const log = logs.find((log) => new Date(log.date).getDate() === day);
    const currentDate = new Date(year, month - 1, day);
    const today = isToday(currentDate);
    const weekend = isWeekend(currentDate);
    const hasLog = !!log;

    const total = (log: TimeLogInterface) => {
        return `${Math.floor(log.hours)} hr ${(log.hours % 1) * 60} min`;
    };

    const time = (time: string | undefined) => {
        return time ? format(time, 'hh:mm aaa') : '--:-- --';
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        'group relative flex h-15 flex-col justify-between border border-sidebar-border/50 p-2 text-left transition-all hover:z-10 hover:scale-105 hover:shadow-md dark:border-sidebar-border/30 md:h-30 md:p-3',
                        today && 'border-primary/50 bg-primary/5 dark:border-primary/30',
                        hasLog && !today && 'bg-green-50/50 hover:bg-green-50 dark:bg-green-950/20 dark:hover:bg-green-950/30',
                        !hasLog && !today && 'hover:bg-muted/50',
                        weekend && 'bg-muted/10',
                    )}
                >
                    <div className="flex items-start justify-between">
                        <div
                            className={cn(
                                'flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold transition-colors md:h-7 md:w-7',
                                today && 'bg-primary text-primary-foreground',
                                !today && hasLog && 'text-foreground',
                                !today && !hasLog && 'text-muted-foreground',
                            )}
                        >
                            {day}
                        </div>
                        {hasLog && !today && (
                            <div className="rounded-full bg-green-500 p-1 opacity-80 transition-opacity group-hover:opacity-100">
                                <CalendarCheck2 className="size-3 text-white md:size-3.5" />
                            </div>
                        )}
                        {today && hasLog && (
                            <div className="rounded-full bg-primary p-1">
                                <CalendarCheck2 className="size-3 text-primary-foreground md:size-3.5" />
                            </div>
                        )}
                    </div>

                    {log && (
                        <div className="mt-auto">
                            <div className="hidden flex-col gap-0.5 md:flex">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="size-3" />
                                    <span className="font-medium">{total(log)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <CalendarCheck2 className="size-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span>{format(currentDate, 'EEEE, MMMM d, yyyy')}</span>
                            {today && <Badge className="mt-1 w-fit">Today</Badge>}
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        {hasLog ? 'Time log details for this day' : 'No time log recorded for this day'}
                    </DialogDescription>
                </DialogHeader>

                {hasLog ? (
                    <div className="space-y-4">
                        <div className="grid gap-3">
                            <div className="flex items-start gap-3 rounded-lg border border-sidebar-border/50 bg-muted/20 p-4 dark:border-sidebar-border/30">
                                <div className="rounded-md bg-amber-500/10 p-2">
                                    <Clock className="size-4 text-amber-600 dark:text-amber-500" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Morning Shift</div>
                                    <div className="text-base font-semibold">
                                        {time(log.morning_in)} - {time(log.morning_out)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border border-sidebar-border/50 bg-muted/20 p-4 dark:border-sidebar-border/30">
                                <div className="rounded-md bg-blue-500/10 p-2">
                                    <Clock className="size-4 text-blue-600 dark:text-blue-500" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground">Afternoon Shift</div>
                                    <div className="text-base font-semibold">
                                        {time(log.afternoon_in)} - {time(log.afternoon_out)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-md bg-primary/10 p-2">
                                    <Clock className="size-5 text-primary" />
                                </div>
                                <span className="font-semibold">Total Hours</span>
                            </div>
                            <div className="text-xl font-bold text-primary">{total(log)}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                        <div className="rounded-full bg-muted p-4">
                            <Clock className="size-8 text-muted-foreground" />
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                            No time log was recorded for this day.
                            <br />
                            Check back once the trainee logs their time.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
