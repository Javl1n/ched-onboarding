import { Head, useForm } from '@inertiajs/react';

import { DepartmentInterface, type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import OnboardingLayout from '@/layouts/onboarding/layout';
import onboarding from '@/routes/onboarding';
import TitleInput from '@/components/onboarding/create/title-input';
import ParagraphInput from '@/components/onboarding/create/paragraph-input';
import { Heading1, Heading2, Heading3, Image, LetterText, Paperclip, SquarePlay } from 'lucide-react';
import HeaderOneInput from '@/components/onboarding/create/header-one-input';
import HeaderTwoInput from '@/components/onboarding/create/header-two-input';
import HeaderThreeInput from '@/components/onboarding/create/header-three-input';
import ImageInput from '@/components/onboarding/create/image-input';
import VideoInput from '@/components/onboarding/create/video-input';
import FileInput from '@/components/onboarding/create/file-input';
import { Button } from '@/components/ui/button';
import { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

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
     file: FileInput,
}

const addButtons: {[key: string]: any} = {
     paragraph: LetterText,
     header_one: Heading1,
     header_two: Heading2,
     header_three: Heading3,
     image: Image,
     video: SquarePlay,
     file: Paperclip,
}

export default function OnboardingCreate({departments} : {departments: DepartmentInterface[]}) {
     const {data, setData, post, errors} = useForm<{
          title: string,
          blocks: Array<{
               type: 'paragraph' | 'header_one' | 'header_two' | 'header_three' | 'image' | 'video' | 'file' | string,
               content: string | undefined | File
          }>,
          department: string
     }>({
          title: '',
          blocks: [
               {
                    type: 'paragraph',
                    content: '',
               },
          ],
          department: '',
     });

     const addBlock = (type: string) => {
          setData('blocks', [...data.blocks, { type, content: '' }]);
     }

     const submit = (e: FormEvent) => {
          e.preventDefault();
          
          post(onboarding.store({
               query: {
                    publish: false,
               }
          }).url, {
               forceFormData: true,
          })
     }

     const draft = (e: FormEvent) => {
          e.preventDefault();
          
          post(onboarding.store({
               query: {
                    publish: true
               }
          }).url, {
               forceFormData: true,
          })
     }

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Create" />
               <OnboardingLayout>
                    <div className="space-y-4">
                         <div className="grid">
                              <TitleInput value={data.title} onChange={(e) => setData('title', e.target.value)} autoFocus />
                              <InputError message={errors.title} />
                         </div>
                         <div className=''>
                              <div className='w-4 border' />
                              {data.blocks.map((block, index) => {
                                   const BlockComponent = blocks[block.type];
                                   return (
                                        <BlockComponent
                                             key={`block-${index}`}

                                             deleteBlock={() => {
                                                  setData('blocks', data.blocks.filter((b, i) => i !== index));
                                             }}

                                             value={block.type === 'image' || block.type === 'file'
                                                  ? undefined
                                                  : (typeof block.content === 'string' ? block.content : '')}
                                             
                                             onChange={(event: any) => {
                                                  setData('blocks', data.blocks.map((b, i) => {
                                                       if (i === index) {
                                                            const {value, files} = event.target;
                                                            const newContent = block.type == 'image' || block.type == 'file' ? files[0] : value;

                                                            console.log(newContent)

                                                            return {
                                                                 ...b,
                                                                 content: newContent
                                                            }
                                                       }
                                                       return b;
                                                  }));

                                                  console.log(data.blocks);
                                             }}

                                             error={errors?.[`blocks.${index}.content`]}
                                        />
                                   );
                              })}

                              <div className='flex ms-[calc(var(--spacing)*2-1px)]'>
                                   <div className='h-12 w-5 border-l-2 border-b-2 rounded-bl-2xl mb-[calc(var(--spacing)*4-1px)]' />
                                   <div className="flex-1 flex flex-col justify-end">
                                        <div className="flex justify-between">
                                             <div className="flex gap-2">
                                                  <div className="dark:bg-neutral-950 p-1 rounded-lg border-2 flex gap-1">
                                                       {Object.keys(addButtons).map((Button: string, idx: number) => {
                                                            const ButtonComponent = addButtons[Button];
                                                            return (
                                                                 <div onClick={() => addBlock(Button)} className="rounded p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-500/50 cursor-pointer transition" key={`button-${idx}`}>
                                                                      <ButtonComponent className="size-4" />
                                                                 </div>
                                                            )
                                                       })}
                                                  </div>
                                                  <Select value={data.department} onValueChange={(value) => setData('department', value)}>
                                                       <SelectTrigger >
                                                            <SelectValue placeholder="Select Department" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            <SelectGroup>
                                                                 <SelectLabel className='text-xs text-neutral-600'>
                                                                      Departments
                                                                 </SelectLabel>
                                                                 {departments.map((department, index) => (
                                                                      <SelectItem key={`department-${index}`} value={department.id as string}>
                                                                           {department.name}
                                                                      </SelectItem>
                                                                 ))}
                                                            </SelectGroup>
                                                       </SelectContent>
                                                  </Select>                                                       
                                             </div>
                                             <div className="flex gap-4">
                                                  <Button onClick={draft} variant={'outline'}>
                                                       Save as Draft
                                                  </Button>
                                                  <Button onClick={submit}>
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
