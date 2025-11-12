import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import assessments from '@/routes/assessments';
import { User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { UserCircle } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

export default function SupervisorAssessmentLayout({ children, actions }: PropsWithChildren & { actions?: ReactNode }) {
    const { supervisors } = usePage<{ supervisors: User[] }>().props;

    const currentPath = window.location.pathname;

    return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl p-4 lg:p-6">
            {/* Page Header */}
            <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Evaluate</div>
                <div className="mt-1 text-3xl font-black lg:text-4xl">Supervisor Assessment</div>
                <p className="mt-1 text-sm text-muted-foreground">Evaluate and provide feedback on supervisor performance</p>
            </div>

            <div className="flex flex-1 flex-col gap-6 lg:flex-row">
                {/* Sidebar */}
                <aside className="w-full lg:w-64">
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold text-foreground">Supervisors</h2>
                        <nav className="flex flex-col space-y-1">
                            {supervisors?.map((supervisor, index) => (
                                <Button
                                    key={`supervisor-link-${index}`}
                                    variant="ghost"
                                    asChild
                                    className={cn('h-auto min-h-9 w-full justify-start whitespace-normal text-left', {
                                        'bg-muted font-medium': currentPath === assessments.supervisor.show(supervisor.id).url,
                                    })}
                                >
                                    <Link href={assessments.supervisor.show(supervisor.id)} prefetch>
                                        <span className="truncate">{supervisor.name}</span>
                                    </Link>
                                </Button>
                            ))}
                        </nav>

                        {actions && (
                            <div className="mt-6 border-t border-sidebar-border/50 pt-4">
                                {actions}
                            </div>
                        )}
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
