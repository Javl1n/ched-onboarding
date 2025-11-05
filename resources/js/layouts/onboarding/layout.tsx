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
        <div className="px-4 py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                {/* Enhanced Sidebar Navigation */}
                <aside className="w-full lg:w-72 lg:shrink-0">
                    <div className="lg:sticky lg:top-6">
                        <div className="mb-3 px-3">
                            <h2 className="text-sm font-semibold text-muted-foreground">Pages</h2>
                        </div>
                        <nav className="flex flex-col gap-1">
                            {pages?.map((item) => (
                                <Button
                                    key={item.slug}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('h-auto w-full justify-start py-2.5 text-left font-normal transition-colors', {
                                        'bg-muted font-medium': currentPath === `/page/${item.slug}`,
                                    })}
                                >
                                    <Link href={onboarding.show(item.slug)} prefetch>
                                        <div className="flex w-full items-center justify-between gap-3">
                                            <span className="flex-1 truncate">{item.title}</span>
                                            {canEdit() && (
                                                <div
                                                    className={cn('h-1.5 w-1.5 shrink-0 rounded-full', {
                                                        'bg-primary': item.published,
                                                        'bg-accent-foreground': !item.published,
                                                    })}
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </Button>
                            ))}
                            {user.role === 'admin' && (
                                <>
                                    <Separator className="my-2" />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('h-auto w-full justify-start py-2.5 font-normal transition-colors', {
                                            'bg-muted': currentPath === onboarding.create().url,
                                        })}
                                    >
                                        <Link href={onboarding.create()} prefetch>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add Page
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </aside>

                <Separator className="lg:hidden" />

                {/* Main Content Area */}
                <div className="min-w-0 flex-1">
                    <div className="max-w-4xl 2xl:max-w-5xl">{children}</div>
                </div>
            </div>
        </div>
    );
}
