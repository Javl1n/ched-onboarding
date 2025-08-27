import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { SharedData, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { appearance } from '@/routes';
import OnboardingLayout from '@/layouts/onboarding/layout';

const breadcrumbs: BreadcrumbItem[] = [
     {
          title: 'Onboarding Information',
          href: appearance().url,
     },
];

export default function OnboardingEmpty() {
     const {auth: {user}} = usePage<SharedData>().props;

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Empty" />
               <OnboardingLayout>
                    <div className="space-y-6">
                         <HeadingSmall title="No Pages found" description={user.role != 'trainee' ? `Add a page to get started` : undefined} />
                    </div>
               </OnboardingLayout>
          </AppLayout>
     );
}
