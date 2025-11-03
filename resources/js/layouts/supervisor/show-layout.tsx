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
        <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
            <Heading title={supervisor.name} description="All assessments about this supervisor." />
            <div className="flex flex-1 flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                        <div className="mt-4">{action}</div>
                    </nav>
                </aside>
                <Separator className="my-6 lg:hidden" />
                <div className="flex-1">
                    <section className="">{children}</section>
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
