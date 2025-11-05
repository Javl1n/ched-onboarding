import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import show from '@/routes/trainees/show';
import { TimeLogInterface } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Building2, Clock, User } from 'lucide-react';

export default function LogList() {
    const { logs, date } = usePage<{ logs: TimeLogInterface[]; date: string }>().props;
    console.log(date);

    const time = (time: string | undefined) => {
        return time ? format(time, 'hh:mm aaa') : '---';
    };

    const total = (log: TimeLogInterface) => {
        return `${Math.floor(log.hours)} hr ${(log.hours % 1) * 60} min`;
    };

    const hours = (timeIn?: string, timeOut?: string) => {
        if (!timeIn || !timeOut) return;

        const timeStart = new Date(timeIn);
        const timeEnd = new Date(timeOut);
        const diffInMinutes = (timeEnd.getTime() - timeStart.getTime()) / 60000;
        const hours = Math.floor(diffInMinutes / 60);

        return `(${hours} hr ${diffInMinutes % 60} min)`;
    };

    if (logs.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-sidebar-border/70 bg-muted/20 p-12 text-center dark:border-sidebar-border">
                <Clock className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">No Attendance Records</h3>
                <p className="text-sm text-muted-foreground">No time logs found for {format(new Date(date), 'MMMM d, yyyy')}</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold">
                            <div className="flex items-center gap-2">
                                <User className="size-4" />
                                <span>Name</span>
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold">
                            <div className="flex items-center gap-2">
                                <Building2 className="size-4" />
                                <span>Department</span>
                            </div>
                        </TableHead>
                        <TableHead className="font-semibold">Morning Session</TableHead>
                        <TableHead className="font-semibold">Afternoon Session</TableHead>
                        <TableHead className="text-right font-semibold">
                            <div className="flex items-center justify-end gap-2">
                                <Clock className="size-4" />
                                <span>Total Hours</span>
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log, index) => (
                        <TableRow
                            onClick={() => router.visit(show.log(log.trainee.user).url)}
                            key={index}
                            className="cursor-pointer transition-colors hover:bg-muted/70"
                        >
                            <TableCell className="font-semibold">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {log.trainee.user.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </div>
                                    <span className="text-foreground">{log.trainee.user.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                                    {log.trainee.user.department.name}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium text-foreground">
                                            {time(log.morning_in)} - {time(log.morning_out)}
                                        </span>
                                    </div>
                                    {log.morning_in && log.morning_out && (
                                        <div className="text-xs text-muted-foreground">{hours(log.morning_in, log.morning_out)}</div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-medium text-foreground">
                                            {time(log.afternoon_in)} - {time(log.afternoon_out)}
                                        </span>
                                    </div>
                                    {log.afternoon_in && log.afternoon_out && (
                                        <div className="text-xs text-muted-foreground">{hours(log.afternoon_in, log.afternoon_out)}</div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm font-bold text-green-700 dark:text-green-400">
                                    <Clock className="size-3.5" />
                                    <span>{total(log)}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableCaption>
                    Showing {logs.length} {logs.length === 1 ? 'record' : 'records'} for {format(new Date(date), 'MMMM d, yyyy')}
                </TableCaption>
            </Table>
        </div>
    );
}
