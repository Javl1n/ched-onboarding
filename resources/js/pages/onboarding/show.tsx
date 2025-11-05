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
                <div>
                    {/* Enhanced Header Section */}
                    <div className="space-y-3 mb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-3">
                                <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
                                    {item.title}
                                </h1>
                                {user.role === 'admin' && (
                                    <div className="flex gap-2">
                                        <div
                                            className={`inline-flex items-center rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
                                                item.published
                                                    ? 'border-primary/20 bg-primary/10 text-primary'
                                                    : 'border-accent/50 bg-accent text-accent-foreground'
                                            }`}
                                        >
                                            <div
                                                className={`mr-1.5 h-1.5 w-1.5 rounded-full ${item.published ? 'bg-primary' : 'bg-accent-foreground'}`}
                                            />
                                            {item.published ? 'Published' : 'Draft'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {user.role === 'admin' && (
                                <Button asChild size="default" className="shrink-0">
                                    <Link href={onboarding.edit({ page: item.slug })}>Edit Page</Link>
                                </Button>
                            )}
                        </div>
                        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
                    </div>

                    {/* Content Blocks with Card Wrapper */}
                    <div className="rounded-lg bg-card px-6 pb-6 shadow-sm sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
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
