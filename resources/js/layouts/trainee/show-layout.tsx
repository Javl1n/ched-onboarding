import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import trainees from '@/routes/trainees';
import assessment from '@/routes/trainees/assessment';
import show from '@/routes/trainees/show';
import type { NavItem, User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { format, formatDistanceToNow } from 'date-fns';
import { BookText, Cake, Calendar, ClipboardList, Clock, Contact, House, Mail, Mars, Phone, School, Venus } from 'lucide-react';
import React, { type ReactNode, useState } from 'react';
import { toast } from 'sonner';

export default function TraineeShowLayout({ children, action }: { children?: ReactNode; action?: ReactNode }) {
    const { trainee, auth } = usePage<{ trainee: User; auth: { user: User } }>().props;
    const sidebar = useSidebar();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleToggleStatus = (): void => {
        const isActive = trainee.profile?.status === 'active';

        toast.promise(
            new Promise((resolve, reject) => {
                router.patch(
                    trainees.toggleStatus(trainee).url,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setDialogOpen(false);
                            resolve(isActive ? 'Trainee marked as inactive.' : 'Trainee reactivated.');
                        },
                        onError: () => {
                            reject('Something went wrong.');
                        },
                    },
                );
            }),
            {
                loading: isActive ? 'Marking trainee as inactive...' : 'Reactivating trainee...',
                success: (msg) => msg as string,
                error: (msg) => msg as string,
                description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:mm a")}`,
            },
        );
    };

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Logs',
            href: show.log(trainee),
            icon: Calendar,
        },
        {
            title: 'Assessments',
            href: assessment.redirect(trainee),
            icon: ClipboardList,
        },
        {
            title: 'Reports',
            href: show.report(trainee),
            icon: BookText,
        },
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
            {/* Header Section */}
            <div className="group relative overflow-hidden rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    {/* Profile Section */}
                    <div className="flex gap-4">
                        <div className="relative">
                            <img
                                className="hidden size-20 rounded-xl border-2 border-primary/20 object-cover shadow-md md:block lg:size-24"
                                src={`/private/${trainee.profile?.profile}`}
                                alt={`${trainee.name}'s profile`}
                            />
                            <div className="absolute -right-1 -bottom-1 hidden rounded-full bg-background p-1.5 shadow-md md:block">
                                {trainee.profile?.gender === 'Male' ? (
                                    <Mars className="size-4 text-blue-500" aria-label="Male" />
                                ) : (
                                    <Venus className="size-4 text-pink-400" aria-label="Female" />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className={cn('text-2xl font-black tracking-tight lg:text-3xl', sidebar.open ? 'md:text-2xl' : 'md:text-3xl')}>
                                    {trainee.name}
                                </h1>
                                <div className="md:hidden">
                                    {trainee.profile?.gender === 'Male' ? (
                                        <Mars className="size-5 text-blue-500" aria-label="Male" />
                                    ) : (
                                        <Venus className="size-5 text-pink-400" aria-label="Female" />
                                    )}
                                </div>
                                <Badge
                                    variant={trainee.profile?.status === 'active' ? 'default' : 'secondary'}
                                    className={cn(
                                        'h-fit px-3 py-1 text-xs font-medium',
                                        trainee.profile?.status === 'active' &&
                                            'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
                                    )}
                                >
                                    {trainee.profile?.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            <div className="flex flex-col gap-1">
                                {trainee.profile?.ojt_start_date && (
                                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="size-3.5 shrink-0" />
                                        <span className="font-medium">
                                            Started {format(new Date(trainee.profile.ojt_start_date), 'MMM dd, yyyy')}
                                        </span>
                                        <span className="hidden text-muted-foreground/70 sm:inline">
                                            · {formatDistanceToNow(new Date(trainee.profile.ojt_start_date), { addSuffix: true })}
                                        </span>
                                    </div>
                                )}

                                {trainee.profile?.status === 'inactive' && trainee.profile?.deactivated_at && (
                                    <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400">
                                        <Calendar className="size-3.5 shrink-0" />
                                        <span className="font-medium">Ended {format(new Date(trainee.profile.deactivated_at), 'MMM dd, yyyy')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <Separator className="lg:hidden" />
                    <Separator orientation="vertical" className="hidden h-16 lg:block" />

                    {/* Contact Info Section */}
                    <div className="grid flex-1 grid-cols-2 gap-2 lg:grid-cols-3">
                        <InfoItem icon={Mail} label={trainee.email} />
                        <InfoItem icon={Phone} label={`+63${trainee.profile?.contact}`} />
                        <InfoItem icon={Contact} label={`${trainee.department.name} Department`} />
                        <InfoItem icon={School} label={<InfoTooltip content={trainee.profile?.school} />} />
                        <InfoItem icon={Cake} label={format(new Date(trainee.profile?.birth ?? ''), 'MMM dd, y')} />
                        <InfoItem icon={House} label={<InfoTooltip content={trainee.profile?.address} />} />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-1 flex-col gap-6 lg:flex-row">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-56">
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-3 shadow-sm">
                        <nav className="flex flex-col gap-1.5">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = currentPath.includes(typeof item.href === 'string' ? item.href : item.href.url);
                            return (
                                <Button
                                    key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn(
                                        'w-full justify-start gap-3 rounded-lg px-3 py-2 transition-all',
                                        isActive
                                            ? 'bg-primary/10 text-primary shadow-sm hover:bg-primary/15 hover:text-primary'
                                            : 'hover:bg-muted/50',
                                    )}
                                >
                                    <Link href={item.href} prefetch>
                                        <div
                                            className={cn(
                                                'rounded-md p-1.5 transition-colors',
                                                isActive ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground',
                                            )}
                                        >
                                            {item.icon && <item.icon className="h-4 w-4" />}
                                        </div>
                                        <span className={cn('font-medium', isActive && 'font-semibold')}>{item.title}</span>
                                    </Link>
                                </Button>
                            );
                        })}

                        {(auth?.user?.role === 'admin' || action) && (
                            <div className="mt-4 flex flex-col gap-2">
                                {auth?.user?.role === 'admin' && (
                                    <StatusToggleDialog
                                        trainee={trainee}
                                        isOpen={dialogOpen}
                                        onOpenChange={setDialogOpen}
                                        onToggle={handleToggleStatus}
                                    />
                                )}
                                {action}
                            </div>
                        )}
                    </nav>
                    </div>
                </aside>

                <Separator className="my-2 lg:hidden" />

                {/* Main Content */}
                <div className="min-w-0 flex-1">{children}</div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label }: { icon: React.ElementType; label: React.ReactNode }) {
    return (
        <div className="group flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted/30">
            <div className="rounded-md bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0 text-sm font-medium">{label}</div>
        </div>
    );
}

function InfoTooltip({ content }: { content?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="max-w-[200px] cursor-help truncate underline decoration-dotted underline-offset-2">{content}</div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    );
}

function StatusToggleDialog({
    trainee,
    isOpen,
    onOpenChange,
    onToggle,
}: {
    trainee: User;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onToggle: () => void;
}) {
    const isActive = trainee.profile?.status === 'active';

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={isActive ? 'destructive' : 'default'} size="sm" className="w-full shadow-sm transition-all hover:shadow">
                    {isActive ? 'Mark as Inactive' : 'Reactivate Trainee'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isActive ? (
                            <>
                                <div className="rounded-full bg-destructive/10 p-2">
                                    <Calendar className="size-4 text-destructive" />
                                </div>
                                Mark Trainee as Inactive?
                            </>
                        ) : (
                            <>
                                <div className="rounded-full bg-primary/10 p-2">
                                    <Clock className="size-4 text-primary" />
                                </div>
                                Reactivate Trainee?
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {isActive ? (
                            <>
                                This will mark <span className="font-semibold text-foreground">{trainee.name}</span> as inactive. They will no longer
                                be able to log in or record time logs. Their historical data will be preserved.
                            </>
                        ) : (
                            <>
                                This will reactivate <span className="font-semibold text-foreground">{trainee.name}</span>. They will be able to log
                                in and record time logs again.
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="shadow-sm">
                        Cancel
                    </Button>
                    <Button variant={isActive ? 'destructive' : 'default'} onClick={onToggle} className="shadow-sm">
                        {isActive ? 'Mark as Inactive' : 'Reactivate'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
