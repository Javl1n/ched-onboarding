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
            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-64">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {pages?.map((item, index) => (
                            <Button
                                key={item.slug}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === `/page/${item.slug}`,
                                })}
                            >
                                <Link href={onboarding.show(item.slug)} prefetch>
                                    <div className="flex w-full justify-between gap-2">
                                        <div className="flex-1 truncate">{item.title}</div>
                                        {canEdit() ? (
                                            <div className={`my-auto h-1 w-1 rounded-full ${item.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        ) : null}
                                    </div>
                                </Link>
                            </Button>
                        ))}
                        {user.role === 'admin' ? (
                            <Button
                                key={`page-create`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === onboarding.create().url,
                                })}
                            >
                                <Link href={onboarding.create()} prefetch>
                                    <PlusCircle className="h-4 w-4" />
                                    Add Page
                                </Link>
                            </Button>
                        ) : null}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1">
                    <section className="max-w-4xl space-y-12 2xl:max-w-7xl">{children}</section>
                </div>
            </div>
        </div>
    );
}
