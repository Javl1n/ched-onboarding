import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
        <div className="min-h-[calc(100vh-50px)] py-6">
            <div className="px-4 lg:px-8">
                <Heading title="Supervisor Assessment" description="Evaluate and provide feedback on supervisor performance." />

                <div className="mt-8 flex flex-col gap-6 lg:flex-row">
                    <aside className="w-full lg:w-72">
                        <Card className="sticky top-6 overflow-hidden border-0 shadow-lg">
                            <nav className="space-y-1 p-2">
                                <div className="px-3 py-2">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                        <UserCircle className="size-4" />
                                        Supervisors
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    {supervisors?.map((supervisor, index) => (
                                        <Button
                                            key={`supervisor-link-${index}`}
                                            size="default"
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                'w-full justify-start gap-3 rounded-lg px-3 py-2.5 font-medium transition-all',
                                                currentPath === assessments.supervisor.show(supervisor.id).url
                                                    ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground'
                                                    : 'hover:bg-accent',
                                            )}
                                        >
                                            <Link href={assessments.supervisor.show(supervisor.id)} prefetch>
                                                <UserCircle className="size-4 shrink-0" />
                                                <span className="truncate">{supervisor.name}</span>
                                            </Link>
                                        </Button>
                                    ))}
                                </div>

                                {actions && (
                                    <>
                                        <Separator className="my-3" />
                                        <div className="space-y-2 px-1">{actions}</div>
                                    </>
                                )}
                            </nav>
                        </Card>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="h-[calc(100vh-13.5rem)] flex-1 overflow-auto">
                        <div className="space-y-8 pb-8">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
