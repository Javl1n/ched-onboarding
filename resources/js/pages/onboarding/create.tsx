import { Head, useForm } from '@inertiajs/react';

import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import OnboardingLayout from '@/layouts/onboarding/layout';
import onboarding from '@/routes/onboarding';
import TitleInput from '@/components/onboarding/create/title-input';
import ParagraphInput from '@/components/onboarding/create/paragraph-input';
import { Heading1, Heading2, Heading3, LetterText, PlusCircle } from 'lucide-react';
import HeaderOneInput from '@/components/onboarding/create/header-one-input';
import HeaderTwoInput from '@/components/onboarding/create/header-two-input';
import HeaderThreeInput from '@/components/onboarding/create/header-three-input';

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
}

const addButtons: {[key: string]: any} = {
     paragraph: LetterText,
     header_one: Heading1,
     header_two: Heading2,
     header_three: Heading3,
}

export default function OnboardingCreate() {
     const {data, setData} = useForm({
          title: '',
          blocks: [
               {
                    type: 'paragraph',
                    content: '',
               },
          ]
     });

     const addBlock = (type: string) => {
          setData('blocks', [...data.blocks, { type, content: '' }]);
     }

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Create" />
               <OnboardingLayout>
                    <div className="space-y-6">
                         <TitleInput value={data.title} onChange={(e) => setData('title', e.target.value)} autoFocus />
                         <div className='grid'>
                              <div className='w-4 border' />

                              {data.blocks.map((block, index) => {
                                   const BlockComponent = blocks[block.type];
                                   return (
                                        <BlockComponent
                                             key={index}
                                             deleteBlock={() => {
                                                  setData('blocks', data.blocks.filter((b, i) => i !== index));
                                             }}
                                             value={block.content}
                                             onChange={(event: any) => {
                                                  setData('blocks', data.blocks.map((b, i) => {
                                                       if (i === index) {
                                                            return {
                                                                 ...b,
                                                                 content: event.target.value,
                                                            }
                                                       }
                                                       return b;
                                                  }));
                                             }}
                                        />
                                   );
                              })}

                              <div className='flex'>
                                   <div className='flex ms-[calc(var(--spacing)*2-1px)]'>
                                        <div className='h-12 w-5 border-l-2 border-b-2 rounded-bl-2xl mb-[calc(var(--spacing)*4-1px)]' />
                                        <div className="flex flex-col justify-end">
                                             <div className="dark:bg-neutral-950 p-1 rounded-lg border-2 flex gap-1">
                                                  {Object.keys(addButtons).map((Button: string, idx: number) => {
                                                       const ButtonComponent = addButtons[Button];
                                                       return (
                                                            <div className="rounded p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-500/50 cursor-pointer transition" key={idx}>
                                                                 <ButtonComponent onClick={() => addBlock(Button)} key={idx} className="size-4" />
                                                            </div>
                                                       )
                                                  })}
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
