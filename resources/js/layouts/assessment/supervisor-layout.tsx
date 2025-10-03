import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import assessments from "@/routes/assessments";
import { User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";

export default function SupervisorAssessmentLayout({ children, actions }: PropsWithChildren & {actions?: ReactNode})
{
     const {supervisors} = usePage<{supervisors: User[]}>().props;

     const currentPath = window.location.pathname;

     return (
          <div className="px-4 py-6 max-h-[calc(100vh-50px)] overflow-clip">
               <Heading title="Assessment" description="Give an assessment to your supervisors." />

               <div className="flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                         <nav className="space-y-3 space-x-0">
                              <div className="space-y-1">
                                   <div className="text-sm font-bold text-muted-foreground">Supervisors</div>
                                   {supervisors.map((supervisor, index) => (
                                        <Button
                                             key={`supervisor-link-${index}`}
                                             size="sm"
                                             variant="ghost"
                                             asChild
                                             className={cn('w-full justify-start', {
                                                  'bg-muted': currentPath === assessments.supervisor.show(supervisor.id).url,
                                             })}
                                        >
                                             <Link href={assessments.supervisor.show(supervisor.id)} prefetch>
                                                  {/* {item.icon && <item.icon className="h-4 w-4" />} */}
                                                  {supervisor.name}
                                             </Link>
                                        </Button>
                                   ))}
                              </div>
                              <div className="space-y-1">
                                   <div className="text-sm font-bold text-muted-foreground">Actions</div>
                                   {actions}
                              </div>
                         </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    <div className="flex-1 h-[calc(80vh)] overflow-scroll pb-4">
                         <section className="space-y-12 mx-4">{children}</section>
                    </div>
               </div>
          </div>
     )
}