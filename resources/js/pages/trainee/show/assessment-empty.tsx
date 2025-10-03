import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import TraineeShowLayout from "@/layouts/trainee/show-layout";
import { index } from "@/routes/trainees";
import show from "@/routes/trainees/show";
import { AssessmentInterface, BreadcrumbItem, QuestionInterface, SharedData, User } from "@/types";
import { Head, usePage, useForm, } from "@inertiajs/react";
import assessments from "@/routes/assessments";
import { toast } from "sonner";
import { format } from "date-fns";
import ScaleQuestion from "@/components/assessments/scale-question";
import TextQuestion from "@/components/assessments/text-question";
import assessment from "@/routes/trainees/assessment";
import supervisor from "@/routes/supervisor";
import { router } from "@inertiajs/core";
import { cn } from "@/lib/utils";

type GroupedQuestions = {
     [key: string]: QuestionInterface[]
}

type AssessmentsForm = {
     questions: {
          [key: string]: number | string | null
     };
}

export default function TraineeAssessmentEmpty({
     trainee
}: {
     trainee: User, 
     
}) {
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
               title: "Assessments",
               href: assessment.redirect(trainee).url,
          },
     ];

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Trainees" />
               
               <TraineeShowLayout>
                    <div className="h-[calc(100vh-16rem)] overflow-auto px-4">
                         <h1 className="text-lg font-bold">No Supervisors</h1>
                         <div>There's no supervisors for this department.</div>
                    </div>
               </TraineeShowLayout>
               
          </AppLayout>
     );
} 