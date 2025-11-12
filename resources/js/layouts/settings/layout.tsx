import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { appearance } from '@/routes';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Password',
        href: editPassword(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: appearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="flex flex-1 flex-col gap-6 rounded-xl p-4 lg:p-6">
            {/* Page Header */}
            <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Account</div>
                <div className="mt-1 text-3xl font-black lg:text-4xl">Settings</div>
                <p className="mt-1 text-sm text-muted-foreground">Manage your profile and account settings</p>
            </div>

            <div className="flex flex-1 flex-col gap-6 lg:flex-row">
                {/* Sidebar */}
                <aside className="w-full lg:w-64">
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold text-foreground">Navigation</h2>
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
