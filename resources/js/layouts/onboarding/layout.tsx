import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import onboarding from '@/routes/onboarding';
import { OnboardingPageInterface, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function OnboardingLayout({ children }: PropsWithChildren) {
    const {
        pages,
        auth: { user },
    } = usePage<SharedData & { pages: OnboardingPageInterface[] }>().props;

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    const canEdit = () => {
        if (user.role === 'admin') {
            return true;
        }

        return false;
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Enhanced Sidebar Navigation */}
                {/* <aside className="w-full lg:w-80 lg:shrink-0">
                    <div className="lg:sticky lg:top-6">
                        <div className="overflow-hidden rounded-xl border border-sidebar-border bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-md dark:from-blue-950/30 dark:to-blue-900/30">
                            <div className="mb-4 flex items-center gap-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 p-3 dark:from-blue-900/40 dark:to-blue-950/40">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                                    <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-bold tracking-tight text-foreground">Onboarding Pages</h2>
                            </div>
                            <nav className="space-y-1.5">
                                {pages?.map((item) => (
                                    <Button
                                        key={item.slug}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('h-auto w-full justify-start rounded-lg px-3 py-3 text-left font-normal transition-all hover:bg-muted/50', {
                                            'bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90': currentPath === `/page/${item.slug}`,
                                        })}
                                    >
                                        <Link href={onboarding.show(item.slug)} prefetch>
                                            <div className="flex w-full items-center justify-between gap-3">
                                                <span className="flex-1 truncate text-sm">{item.title}</span>
                                                {canEdit() && (
                                                    <div className="flex items-center gap-1.5">
                                                        <div
                                                            className={cn('h-2 w-2 shrink-0 rounded-full', {
                                                                'bg-green-400 ring-2 ring-green-400/30': item.published,
                                                                'bg-yellow-400 ring-2 ring-yellow-400/30': !item.published,
                                                            })}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </Button>
                                ))}
                                {user.role === 'admin' && (
                                    <>
                                        <Separator className="my-3" />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn('h-auto w-full justify-start rounded-lg px-3 py-3 font-normal transition-all hover:bg-muted/50', {
                                                'bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90': currentPath === onboarding.create().url,
                                            })}
                                        >
                                            <Link href={onboarding.create()} prefetch>
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                <span className="text-sm">Add New Page</span>
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </aside> */}

                <Separator className="lg:hidden" />

                {/* Main Content Area */}
                <div className="flex-1">
                    <div className="">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
