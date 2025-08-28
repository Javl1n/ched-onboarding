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
import ParagraphInput from '@/components/onboarding/create/paragraph-input';

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
          paragraph: '',
     });

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Create" />
               <OnboardingLayout>
                    <div className="space-y-6">
                         <TitleInput value={data.title} onChange={(e) => setData('title', e.target.value)} autoFocus />
                         <div className='grid'>
                              <div className="flex gap-4">
                                   <div className="">
                                        <div className='size-3 rounded-full bg-white' />
                                        <div className='h-full w-px border mx-auto' />
                                   </div>
                                   <div className="flex-1">
                                        <ParagraphInput value={data.paragraph} onChange={(e) => setData('paragraph', e.target.value)} />
                                   </div>
                              </div>
                         </div>
                    </div>
               </OnboardingLayout>
          </AppLayout>
     );
}
