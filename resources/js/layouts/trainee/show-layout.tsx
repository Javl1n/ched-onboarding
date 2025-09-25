import { Button } from "@/components/ui/button";
import {
     Tooltip,
     TooltipContent,
     TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import show from "@/routes/trainees/show";
import { NavItem, User } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { BookText, Cake, Calendar, ClipboardList, Contact, House, Mail, Mars, Phone, School, Venus } from "lucide-react";
import { ReactNode } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export default function TraineeShowLayout({children, action}: {children?: ReactNode, action?: ReactNode}) {
     const {trainee} = usePage<{trainee: User}>().props;
     const sidebar = useSidebar();

     const sidebarNavItems: NavItem[] = [
          {
               title: 'Logs',
               href: show.log(trainee),
               icon: Calendar,
          },
          {
               title: 'Assessment',
               href: show.assessment(trainee),
               icon: ClipboardList,
          },
          {
               title: 'Reports',
               href: show.report(trainee),
               icon: BookText,
          },
     ];
     
     const currentPath = window.location.pathname;


     return (
          <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
               <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-2 flex gap-4 overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border">
                         <img className='w-30 rounded-lg md:block hidden' src={`/private/${trainee.profile?.profile}`} alt="" />
                         <div className="my-auto">
                              <div className="flex gap-2">
                                   <div className={`${sidebar.open ? 'md:text-4xl' : 'md:text-5xl'} font-black text-3xl`}>{trainee.name}</div>
                                   {trainee.profile?.gender == "Male" ? <Mars className="my-auto text-blue-500 size-8" /> : <Venus className="my-auto text-pink-400 size-8" />}
                              </div>
                         </div>
                    </div>
                    <div className='overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border gap-4 grid grid-cols-2'>
                         <div className="flex gap-2">
                              <Mail className="size-5 my-auto" /> 
                              <div className="my-auto">{trainee.email}</div>
                         </div>
                         <div className="flex gap-2">
                              <Phone className="size-5 my-auto" /> 
                              <div className="my-auto">{trainee.profile?.contact}</div>
                         </div>
                         <div className="flex gap-2">
                              <Contact className="size-5 my-auto" /> 
                              <div className="my-auto">{trainee.department.name} Department</div>
                         </div>
                         <div className="flex gap-2">
                              <School className="size-5 my-auto" />
                              <div className="my-auto">
                                   <InfoTooltip content={trainee.profile?.school} />
                              </div>
                         </div>
                         <div className="flex gap-2">
                              <Cake className="size-5 my-auto" /> 
                              <div className="my-auto">
                                   {format(new Date(trainee.profile?.birth ?? ''), 'MMMM dd, y')}
                              </div>
                         </div>
                         <div className="flex gap-2">
                              <House className="size-5 my-auto" /> 
                              <div className="my-auto">
                                   <InfoTooltip content={trainee.profile?.address} />
                              </div>
                         </div>
                    </div>
               </div>
               <div className="flex-1 flex flex-col lg:flex-row lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                         <nav className="flex flex-col space-y-1 space-x-0">
                              {sidebarNavItems.map((item, index) => (
                                   <Button
                                        key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className={cn('w-full justify-start', {
                                             'bg-muted': currentPath === (typeof item.href === 'string' ? item.href : item.href.url),
                                        })}
                                   >
                                        <Link href={item.href} prefetch>
                                             {item.icon && <item.icon className="h-4 w-4" />}
                                             {item.title}
                                        </Link>
                                   </Button>
                              ))}
                              <div className="mt-4">
                                   {action}
                              </div>
                         </nav>
                    </aside>
                    <Separator className="my-6 lg:hidden" />
                    <div className="flex-1">
                         <section className="">{children}</section>
                    </div>
               </div>
          </div>
               
     );
}

function InfoTooltip({content}: {content?: string}) {
     return (
          <Tooltip>
               <TooltipTrigger asChild>
                    <div className="w-40 truncate">
                         {content}
                    </div>
               </TooltipTrigger>
               <TooltipContent>
                    {content}
               </TooltipContent>
          </Tooltip>
     )
}