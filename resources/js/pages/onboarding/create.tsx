import { Head, useForm } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';

import InputError from '@/components/input-error';
import AddBlock from '@/components/onboarding/create/add-block';
import BlockLayout from '@/components/onboarding/create/block-layout';
import HeaderOneInput from '@/components/onboarding/create/header-one-input';
import HeaderThreeInput from '@/components/onboarding/create/header-three-input';
import HeaderTwoInput from '@/components/onboarding/create/header-two-input';
import ImageInput from '@/components/onboarding/create/image-input';
import ParagraphInput from '@/components/onboarding/create/paragraph-input';
import TitleInput from '@/components/onboarding/create/title-input';
import VideoInput from '@/components/onboarding/create/video-input';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import OnboardingLayout from '@/layouts/onboarding/layout';
import onboarding from '@/routes/onboarding';
import { FormEvent } from 'react';

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

const blocks: any = {
    paragraph: ParagraphInput,
    header_one: HeaderOneInput,
    header_two: HeaderTwoInput,
    header_three: HeaderThreeInput,
    image: ImageInput,
    video: VideoInput,
    // file: FileInput,
};

export default function OnboardingCreate() {
    const { data, setData, post, errors } = useForm<{
        title: string;
        blocks: Array<{
            type: 'paragraph' | 'header_one' | 'header_two' | 'header_three' | 'image' | 'video' | 'file' | string;
            content: string | undefined | File;
        }>;
    }>({
        title: '',
        blocks: [
            {
                type: 'paragraph',
                content: '',
            },
        ],
    });

    const addBlock = (type: string) => {
        setData('blocks', [...data.blocks, { type, content: '' }]);
    };

    const submit = (e: FormEvent, publish: boolean) => {
        e.preventDefault();

        post(
            onboarding.store({
                query: {
                    publish: publish,
                },
            }).url,
            {
                forceFormData: true,
            },
        );
    };

    const moveBlock = (from: number, to: number) => {
        var blocks = [...data.blocks];
        var [item] = blocks.splice(from, 1);
        blocks.splice(to, 0, item);
        setData('blocks', blocks);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create" />
            <OnboardingLayout>
                <div>
                    {/* Enhanced Header Section */}
                    <div className="mb-6 space-y-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1 space-y-3">
                                <div className="grid">
                                    <TitleInput value={data.title} onChange={(e) => setData('title', e.target.value)} autoFocus />
                                    <InputError message={errors.title} />
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
                    </div>

                    {/* Content Editor with Card Wrapper */}
                    <div className="rounded-lg bg-card px-6 pb-6 shadow-sm sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
                        <div className="w-4 border" />
                        {data.blocks.map((block, index) => {
                            const BlockComponent = blocks[block.type];
                            return (
                                <BlockLayout
                                    key={`block-${index}`}
                                    index={index}
                                    position={{ first: index == 0, last: data.blocks.length - 1 == index }}
                                    deleteBlock={() => {
                                        setData(
                                            'blocks',
                                            data.blocks.filter((b, i) => i !== index),
                                        );
                                    }}
                                    error={errors?.[`blocks.${index}.content`]}
                                    onMove={moveBlock}
                                >
                                    <BlockComponent
                                        value={
                                            block.type === 'image' || block.type === 'file'
                                                ? undefined
                                                : typeof block.content === 'string'
                                                  ? block.content
                                                  : ''
                                        }
                                        onChange={(event: any) => {
                                            setData(
                                                'blocks',
                                                data.blocks.map((b, i) => {
                                                    if (i === index) {
                                                        const { value, files } = event.target;
                                                        const newContent = block.type == 'image' || block.type == 'file' ? files[0] : value;
                                                        return {
                                                            ...b,
                                                            content: newContent,
                                                        };
                                                    }
                                                    return b;
                                                }),
                                            );
                                        }}
                                    />
                                </BlockLayout>
                            );
                        })}

                        <div className="ms-[calc(var(--spacing)*2-1px)] flex">
                            <div className="mb-[calc(var(--spacing)*4-1px)] h-12 w-5 rounded-bl-2xl border-b-2 border-l-2" />
                            <div className="flex flex-1 flex-col justify-end">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <AddBlock addBlock={addBlock} />
                                    <div className="flex gap-3">
                                        <Button onClick={(e) => submit(e, false)} variant="outline" className="flex-1 sm:flex-initial">
                                            Save as Draft
                                        </Button>
                                        <Button onClick={(e) => submit(e, true)} className="flex-1 sm:flex-initial">
                                            Publish
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </OnboardingLayout>
        </AppLayout>
    );
}
