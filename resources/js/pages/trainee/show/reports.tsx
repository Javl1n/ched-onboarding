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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                         <div className="flex flex-col gap-2">
                              <div className="border rounded-lg p-4 flex flex-col sm:flex-row gap-2">
                                   <div className="flex-1 flex flex-col justify-between gap-5">
                                        <h1>Total Hours:</h1>
                                        <div className="flex gap-4">
                                             <div className="size-14 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                                                  <Calendar className="size-8" />
                                             </div>
                                             <span className="text-4xl font-bold my-auto">{totalHours()}</span>
                                        </div>
                                   </div>
                                   <div className="my-auto mx-auto sm:mx-0">
                                        <TimeChart />
                                   </div>
                              </div>
                              <div className="flex-1 border rounded-lg p-4 space-y-5">
                                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <h1 className="font-bold">Assessment Score</h1>
                                        <div className="text-left sm:text-right">
                                             <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Average</div>
                                             <div className="text-2xl font-bold">{(() => {
                                                  const scaleAssessments = assessments.filter(a => a.question.type === "scale");
                                                  if (scaleAssessments.length === 0) return "N/A";
                                                  const total = scaleAssessments.reduce((sum, a) => sum + parseInt(a.value), 0);
                                                  const average = total / scaleAssessments.length;
                                                  return average.toFixed(2);
                                             })()}<span className="text-sm text-neutral-500 dark:text-neutral-400">/5</span></div>
                                        </div>
                                   </div>
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