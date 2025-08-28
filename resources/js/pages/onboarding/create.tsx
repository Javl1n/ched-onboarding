import { Head, useForm, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { SharedData, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { appearance } from '@/routes';
import OnboardingLayout from '@/layouts/onboarding/layout';
import onboarding from '@/routes/onboarding';
import { Input } from '@/components/ui/input';
import TitleInput from '@/components/onboarding/create/title-input';

const breadcrumbs: BreadcrumbItem[] = [
     {
          title: 'Onboarding Information',
          href: onboarding.index().url,
     },
     {
          title: 'Add Page',
          href: onboarding.create().url,
     },
];

export default function OnboardingCreate() {
     const {data, setData} = useForm({
          title: '',
     });

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Create" />
               <OnboardingLayout>
                    <div className="space-y-6">
                         <TitleInput value={data.title} onChange={(e) => setData('title', e.target.value)} />
                         <div className='grid'>
                              
                         </div>
                    </div>
               </OnboardingLayout>
          </AppLayout>
     );
}
