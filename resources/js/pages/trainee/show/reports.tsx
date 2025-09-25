import AssessmentChart from "@/components/reports/assessment-chart";
import ReportSummary from "@/components/reports/summary";
import TimeChart from "@/components/reports/time-chart";
import LogCalendar from "@/components/timelog/admin/log-calendar";
import AppLayout from "@/layouts/app-layout";
import TraineeShowLayout from "@/layouts/trainee/show-layout";
import { index } from "@/routes/trainees";
import show from "@/routes/trainees/show";
import { AssessmentInterface, BreadcrumbItem, TimeLogInterface, User } from "@/types";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

export default function TraineeShowReports({
     trainee, logs, assessments
}: {
     trainee: User,
     logs: TimeLogInterface[],
     assessments: AssessmentInterface[],
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
               title: "Reports",
               href: show.log(trainee).url,
          },
     ];

     const totalHours = () => {
          const hours = logs.map(log => parseFloat(log.hours)).reduce((partialSum, a) => partialSum + a, 0)

          return hourMinute(hours);
     };

     const hourMinute = (hours: number) => `${Math.floor(hours)} hr ${((hours % 1) * 60)} min`;

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title={trainee.name} />

               <TraineeShowLayout>
                    <div className="grid grid-cols-2 gap-2">
                         <div className="flex flex-col gap-2">
                              <div className="border rounded-lg p-4 flex gap-2">
                                   <div className="flex-1 flex flex-col justify-between gap-5">
                                        <h1>Total Hours:</h1>
                                        <div className="flex gap-4">
                                             <div className="p-3 rounded-full bg-blue-500">
                                                  <Calendar className="size-8" />
                                             </div>
                                             <span className="text-4xl font-bold my-auto">{totalHours()}</span>
                                        </div>
                                   </div>
                                   <div className="">
                                        <TimeChart />
                                   </div>
                              </div>
                              <div className="flex-1 border rounded-lg p-4 space-y-5">
                                   <h1 className="font-bold">Assessment Score</h1>
                                   <div>
                                        <AssessmentChart />
                                   </div>
                              </div>
                         </div>
                         <ReportSummary />
                    </div>
               </TraineeShowLayout>
               
          </AppLayout>
     );
} 