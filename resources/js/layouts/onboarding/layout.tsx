import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { appearance } from '@/routes';
import onboarding from '@/routes/onboarding';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { OnboardingPage, SharedData, type NavItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function OnboardingLayout({ children }: PropsWithChildren) {
     const { onboardingPages, auth: {user} } = usePage<SharedData & {onboardingPages: OnboardingPage[]}>().props;

     // When server-side rendering, we only render the layout on the client...
     if (typeof window === 'undefined') {
          return null;
     }

     const currentPath = window.location.pathname;

     return (
          <div className="px-4 py-6">
               <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                         <nav className="flex flex-col space-y-1 space-x-0">
                              {onboardingPages?.map((item, index) => (
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
                                             {item.title}
                                        </Link>
                                   </Button>
                              ))}
                              {user.role != 'trainee' ? <Button
                                   key={`page-create`}
                                   size="sm"
                                   variant="ghost"
                                   asChild
                                   className={cn('w-full justify-start', {
                                        'bg-muted': currentPath === onboarding.create().url,
                                   })}
                              >
                                   <Link href={`page/create`} prefetch>
                                        <PlusCircle className="h-4 w-4" />
                                        Add Page
                                   </Link>
                              </Button> : null}
                         </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1">
                         <section className="max-w-4xl space-y-12">{children}</section>
                    </div>
               </div>
          </div>
     );
}
