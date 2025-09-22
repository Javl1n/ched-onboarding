import AssessmentForm from "@/components/assessments/form";
import LogCalendar from "@/components/timelog/admin/log-calendar";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/layouts/app-layout";
import TraineeShowLayout from "@/layouts/trainee/show-layout";
import { index } from "@/routes/trainees";
import show from "@/routes/trainees/show";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { TabsList } from "@radix-ui/react-tabs";

export default function TraineeShowLog({trainee}: {trainee: User}) {
     const breadcrumbs: BreadcrumbItem[] = [
          {
               title: 'Trainees',
               href: index().url,
          },
          {
               title: trainee.name,
               href: show.log(trainee).url,
          },
          {
               title: "Logs",
               href: show.log(trainee).url,
          },
     ];

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Trainees" />
               
               <TraineeShowLayout>
                    <LogCalendar />
               </TraineeShowLayout>
               
          </AppLayout>
     );
} 