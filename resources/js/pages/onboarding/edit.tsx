import { Head, useForm } from '@inertiajs/react';

import { DepartmentInterface, OnboardingPageInterface, PageBlockInterface, type BreadcrumbItem } from '@/types';

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
import AddBlock from '@/components/onboarding/create/add-block';
import { update } from '@/routes/password';
import BlockLayout from '@/components/onboarding/create/block-layout';
import SelectDepartment from '@/components/onboarding/create/select-department';

const blocks: any = {
     paragraph: ParagraphInput,
     header_one: HeaderOneInput,
     header_two: HeaderTwoInput,
     header_three: HeaderThreeInput,
     image: ImageInput,
     video: VideoInput,
     // file: FileInput,
}

interface EditFormDataInterface {
     title: string,
     blocks: Array<{
          type: 'paragraph' | 'header_one' | 'header_two' | 'header_three' | 'image' | 'video' | 'file' | string,
          content: string | undefined | File,
          isNew: boolean,
          id?: number | string
     }>,
     deleted: (string | number)[],
     department: string
}

export default function OnboardingCreate({item, departments} : {item: OnboardingPageInterface, departments: DepartmentInterface[]}) {
     const breadcrumbs: BreadcrumbItem[] = [
          {
               title: item.title,
               href: onboarding.show({page: item.slug}).url,
          },
          {
               title: 'Edit Page',
               href: onboarding.edit({page: item.slug}).url,
          },
     ];

     
     const {data, setData, post, errors} = useForm<EditFormDataInterface>({
          title: item.title,
          blocks: [
               ...item.blocks.sort((a, b) => a.order - b.order).map((block) => ({
                    type: block.type,
                    content: block.content,
                    isNew: false,
                    id: block.id,
               }))
          ],
          deleted: [],
          department: item.department.id as string,
     });

     const addBlock = (type: string) => {
          setData('blocks', [...data.blocks, { type, content: '', isNew: true }]);
     }

     const deleteBlock = (index: number) => {
          const block = data.blocks[index];

          setData('blocks', data.blocks.filter((b, i) => i !== index));

          if (!block.isNew) {
               setData("deleted", [...data.deleted, block.id as string])
          }
     }

     const submit = (e: FormEvent, publish: boolean) => {
          e.preventDefault();
          
          post(onboarding.update({page: item.slug}, {
               query: {
                    publish: publish,
               }
          }).url, {
               forceFormData: true,
          });

          
     }

     const moveBlock = (from: number, to: number) => {
          var blocks = [...data.blocks];
          var [item] = blocks.splice(from, 1);
          blocks.splice(to, 0, item);
          setData('blocks', blocks);
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
                                        <BlockLayout 
                                             key={`block-${index}`} 
                                             index={index}
                                             position={{ first: index == 0, last: data.blocks.length - 1 == index}}
                                             deleteBlock={() => deleteBlock(index)}
                                             error={errors?.[`blocks.${index}.content`]}
                                             onMove={moveBlock}
                                        >
                                             <BlockComponent
                                                  isNew={block.isNew}
                                                  value={block.content}
                                                  onChange={(event: any) => {
                                                       setData('blocks', data.blocks.map((b, i) => {
                                                            if (i === index) {
                                                                 const {value, files} = event.target;
                                                                 const newContent = block.type == 'image' || block.type == 'file' ? files[0] : value;
                                                                 return {
                                                                      ...b,
                                                                      content: newContent,
                                                                 }
                                                            }
                                                            return b;
                                                       }));
                                                  }}
                                             />
                                        </BlockLayout>
                                   );
                              })}

                              <div className='flex ms-[calc(var(--spacing)*2-1px)]'>
                                   <div className='h-12 w-5 border-l-2 border-b-2 rounded-bl-2xl mb-[calc(var(--spacing)*4-1px)]' />
                                   <div className="flex-1 flex flex-col justify-end">
                                        <div className="flex justify-between">
                                             <div className="flex gap-2">
                                                  <AddBlock addBlock={addBlock} />
                                                  <SelectDepartment value={data.department} onValueChange={(value) => setData('department', value)}  />
                                             </div>
                                             <div className="flex gap-4">
                                                  <Button onClick={(e) => submit(e, false)} variant={'outline'}>
                                                       Save as Draft
                                                  </Button>
                                                  <Button onClick={(e) => submit(e, true)}>
                                                       Publish
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <InputError message={errors.department} className='md:ms-7' />                                                   
                              
                         </div>
                    </div>
               </OnboardingLayout>
          </AppLayout>
     );
}
