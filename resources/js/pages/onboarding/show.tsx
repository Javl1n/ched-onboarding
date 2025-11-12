import HeaderOneBlock from '@/components/onboarding/blocks/header-one';
import HeaderThreeBlock from '@/components/onboarding/blocks/header-three';
import HeaderTwoBlock from '@/components/onboarding/blocks/header-two';
import ImageBlock from '@/components/onboarding/blocks/image';
import ParagraphBlock from '@/components/onboarding/blocks/paragraph';
import VideoBlock from '@/components/onboarding/blocks/video';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import OnboardingLayout from '@/layouts/onboarding/layout';
import onboarding from '@/routes/onboarding';
import { BreadcrumbItem, OnboardingPageInterface, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const blocks: any = {
    paragraph: ParagraphBlock,
    header_one: HeaderOneBlock,
    header_two: HeaderTwoBlock,
    header_three: HeaderThreeBlock,
    video: VideoBlock,
    image: ImageBlock,
};

export default function OnboardingShow({ item }: { item: OnboardingPageInterface }) {
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: item.title,
            href: onboarding.show({ page: item.slug }).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.title} />
            <OnboardingLayout>
                <div className="space-y-6">
                    {/* Enhanced Header Section */}
                    <div className="overflow-hidden rounded-xl border border-sidebar-border bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 shadow-md dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-3">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">{item.title}</h1>
                                {user.role === 'admin' && (
                                    <div className="flex gap-2">
                                        <div
                                            className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
                                                item.published
                                                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
                                                    : 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300'
                                            }`}
                                        >
                                            <div
                                                className={`mr-1.5 h-2 w-2 rounded-full ${item.published ? 'bg-green-500 ring-2 ring-green-500/30' : 'bg-yellow-500 ring-2 ring-yellow-500/30'}`}
                                            />
                                            {item.published ? 'Published' : 'Draft'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {user.role === 'admin' && (
                                <Button asChild size="default" className="shrink-0 shadow-sm">
                                    <Link href={onboarding.edit({ page: item.slug })}>Edit Page</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Content Blocks with Card Wrapper */}
                    <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/50 px-6 pb-6 shadow-md dark:from-card dark:via-blue-950/10 dark:to-indigo-950/10 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
                        <div className="prose prose-lg mx-auto max-w-none dark:prose-invert">
                            <div className="space-y-8">
                                {item.blocks
                                    .sort((a, b) => a.order - b.order)
                                    .map((block, index) => {
                                        const BlockComponent = blocks[block.type];
                                        return <BlockComponent key={index} block={block} />;
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </OnboardingLayout>
        </AppLayout>
    );
}
