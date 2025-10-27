import HeadingSmall from "@/components/heading-small";
import HeaderOneBlock from "@/components/onboarding/blocks/header-one";
import HeaderThreeBlock from "@/components/onboarding/blocks/header-three";
import HeaderTwoBlock from "@/components/onboarding/blocks/header-two";
import ImageBlock from "@/components/onboarding/blocks/image";
import ParagraphBlock from "@/components/onboarding/blocks/paragraph";
import VideoBlock from "@/components/onboarding/blocks/video";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import OnboardingLayout from "@/layouts/onboarding/layout";
import onboarding from "@/routes/onboarding";
import { BreadcrumbItem, OnboardingPageInterface, SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";


const blocks: any = {
     paragraph: ParagraphBlock,
     header_one: HeaderOneBlock,
     header_two: HeaderTwoBlock,
     header_three: HeaderThreeBlock,
     video: VideoBlock,
     image: ImageBlock,
}

export default function OnboardingShow({item}: {item: OnboardingPageInterface}) {
     const {auth: {user}} = usePage<SharedData>().props;
     
     const breadcrumbs: BreadcrumbItem[] = [
          {
               title: item.title,
               href: onboarding.show({page: item.slug}).url,
          },
     ];     

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title={item.title} />
               <OnboardingLayout>
                    <div className="space-y-6">
                         <div className="space-y-2">
                              <div className="flex justify-between">
                                   <div className="text-4xl font-black">
                                        {item.title}
                                   </div>
                                   {user.role === "admin" && 
                                        <Button asChild className="my-auto">
                                             <Link href={onboarding.edit({page: item.slug})}>
                                                  Edit
                                             </Link>
                                        </Button>
                                   }
                              </div>
                              <div className="flex gap-1">
                                   
                                   {/* <div className="text-xs border px-2 py-1 rounded dark:text-neutral-300 dark:border-neutral-600/70 text-neutral-500">{item.department.name} Department</div> */}
                                   
                                   {user.role == 'admin' ? 
                                        <div className={`text-xs border px-2 py-1 rounded ${item.published ? 'text-green-500 border-green-700' : 'text-yellow-500/80 border-yellow-500/60'}`}>{item.published ? 'Published' : 'Drafted'}</div>
                                   : null}
                                   
                              </div>
                         </div>
                         
                         {item.blocks.sort((a, b) => a.order - b.order).map((block, index) => {
                              const BlockComponent = blocks[block.type];
                              return (
                                   <BlockComponent key={index} block={block} />
                              )
                         })}
                    </div>
               </OnboardingLayout>
          </AppLayout>
     );
}