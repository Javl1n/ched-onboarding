import AssessmentForm from "@/components/assessments/form";
import LogCalendar from "@/components/timelog/admin/log-calendar";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import { index, show } from "@/routes/trainees";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { TabsList } from "@radix-ui/react-tabs";

export default function TraineeShow({trainee}: {trainee: User}) {
     const breadcrumbs: BreadcrumbItem[] = [
          {
               title: 'Trainees',
               href: index().url,
          },
          {
               title: trainee.name,
               href: show(trainee).url,
          }
     ];

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Trainees" />
               <div className="flex min-h-screen flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                         <div className="flex-2 flex gap-4 overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border">
                              <img className='w-30 rounded-lg md:block hidden' src={`/private/${trainee.profile?.profile}`} alt="" />
                              <div className="">
                                   <div className='text-sm text-neutral-400 font-bold'>Welcome</div>
                                   <div className='md:text-4xl font-black text-3xl'>{trainee.name}</div>
                                   <div className='mt-4 flex gap-4'>
                                   </div>
                              </div>
                         </div>
                    </div>
                    <div className="flex-1 flex gap-4">
                         <div className="flex-1 flex flex-col">
                              <Tabs defaultValue="log" className="flex-1">
                                   <TabsList className="">
                                        <TabsTrigger className="text-neutral-600" value="log">Time Log</TabsTrigger>
                                        <TabsTrigger className="text-neutral-600" value="assessment">Reports</TabsTrigger>
                                   </TabsList>
                                   <TabsContent value="assessment" className="gap-2">
                                        <AssessmentForm />
                                   </TabsContent>
                                   <TabsContent value="log" className="">
                                        <LogCalendar  />
                                   </TabsContent>
                              </Tabs>
                         </div>
                         
                    </div>
               </div>
               
          </AppLayout>
     );
} 