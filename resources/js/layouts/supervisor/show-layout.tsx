import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import show from '@/routes/supervisor/show';
import { NavItem, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function SupervisorShowLayout({ children, action }: { children?: ReactNode; action?: ReactNode }) {
    const { supervisor, trainees } = usePage<{ supervisor: User; trainees: User[] }>().props;

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Overall Assessment',
            href: show.all(supervisor),
        },
        ...trainees.map((trainee) => ({
            title: trainee.name,
            href: show.trainee({
                supervisor: supervisor,
                trainee: trainee,
            }),
        })),
    ];

    const currentPath = window.location.pathname;

    return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl p-4 lg:p-6">
            {/* Page Header */}
            <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Supervisor</div>
                <div className="mt-1 text-3xl font-black lg:text-4xl">{supervisor.name}</div>
                <p className="mt-1 text-sm text-muted-foreground">All assessments about this supervisor</p>
            </div>

            <div className="flex flex-1 flex-col gap-6 lg:flex-row">
                {/* Sidebar */}
                <aside className="w-full lg:w-64">
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold text-foreground">Trainees</h2>
                        <nav className="flex flex-col space-y-1">
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                    variant="ghost"
                                    asChild
                                    className={cn('h-auto min-h-9 w-full justify-start whitespace-normal text-left', {
                                        'bg-muted font-medium': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                    })}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        <span className="truncate">{item.title}</span>
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                        {action && <div className="mt-4">{action}</div>}
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <section>{children}</section>
                </div>
            </div>
        </div>
    );
}

// function InfoTooltip({content}: {content?: string}) {
//      return (
//           <Tooltip>
//                <TooltipTrigger asChild>
//                     <div className="w-40 truncate">
//                          {content}
//                     </div>
//                </TooltipTrigger>
//                <TooltipContent>
//                     {content}
//                </TooltipContent>
//           </Tooltip>
//      )
// }
