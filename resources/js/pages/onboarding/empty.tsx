import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { SharedData, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import OnboardingLayout from '@/layouts/onboarding/layout';
import onboarding from '@/routes/onboarding';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Onboarding Information',
        href: onboarding.index().url,
    },
];

export default function OnboardingEmpty() {
    const {
        auth: { user },
    } = usePage<SharedData>().props;

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
