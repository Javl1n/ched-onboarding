import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import {
     Tooltip,
     TooltipContent,
     TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import show from "@/routes/trainees/show";
import trainees from "@/routes/trainees";
import { NavItem, User } from "@/types";
import { Link, router, usePage } from "@inertiajs/react";
import { format, formatDistanceToNow } from "date-fns";
import { BookText, Cake, Calendar, ClipboardList, Clock, Contact, House, Mail, Mars, Phone, School, Venus } from "lucide-react";
import { ReactNode, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import assessment from "@/routes/trainees/assessment";
import { toast } from 'sonner';
import { format as formatDate } from 'date-fns';

export default function TraineeShowLayout({children, action}: {children?: ReactNode, action?: ReactNode}) {
    const {trainee, auth} = usePage<{trainee: User, auth: { user: User }}>().props;
    const sidebar = useSidebar();
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleToggleStatus = () => {
        const isActive = trainee.profile?.status === 'active';

        toast.promise(
            new Promise((resolve, reject) => {
                router.patch(
                    trainees.toggleStatus(trainee).url,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setDialogOpen(false);
                            resolve(isActive ? 'Trainee marked as inactive.' : 'Trainee reactivated.');
                        },
                        onError: () => {
                            reject('Something went wrong.');
                        }
                    }
                );
            }),
            {
                loading: isActive ? 'Marking trainee as inactive...' : 'Reactivating trainee...',
                success: (msg) => msg as string,
                error: (msg) => msg as string,
                description: `${formatDate(new Date(), "EEEE, MMMM dd, y 'at' hh:mm a")}`
            }
        );
    };

     const sidebarNavItems: NavItem[] = [
          {
               title: 'Logs',
               href: show.log(trainee),
               icon: Calendar,
          },
          {
               title: 'Assessments',
               href: assessment.redirect(trainee),
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
                                   <Badge
                                        variant={trainee.profile?.status === 'active' ? 'default' : 'secondary'}
                                        className="my-auto h-fit"
                                   >
                                        {trainee.profile?.status === 'active' ? 'Active' : 'Inactive'}
                                   </Badge>
                              </div>
                              {trainee.profile?.ojt_start_date && (
                                   <div className="text-sm text-muted-foreground mt-1 flex gap-1.5 items-center">
                                        <Clock className="size-4" />
                                        <span>Started on {format(new Date(trainee.profile.ojt_start_date), 'MMMM dd, yyyy')}</span>
                                        <span>({formatDistanceToNow(new Date(trainee.profile.ojt_start_date), { addSuffix: true })})</span>
                                   </div>
                              )}
                              {trainee.profile?.status === 'inactive' && trainee.profile?.deactivated_at && (
                                   <div className="text-sm text-muted-foreground mt-1">
                                        Training ended on {format(new Date(trainee.profile.deactivated_at), 'MMMM dd, yyyy')}
                                   </div>
                              )}
                         </div>
                    </div>
                    <div className='overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border gap-4 grid grid-cols-2'>
                         <div className="flex gap-2">
                              <Mail className="size-5 my-auto" />
                              <div className="my-auto">{trainee.email}</div>
                         </div>
                         <div className="flex gap-2">
                              <Phone className="size-5 my-auto" />
                              <div className="my-auto">+63{trainee.profile?.contact}</div>
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
                                             'bg-muted': currentPath.includes(typeof item.href === 'string' ? item.href : item.href.url),
                                        })}
                                   >
                                        <Link href={item.href} prefetch>
                                             {item.icon && <item.icon className="h-4 w-4" />}
                                             {item.title}
                                        </Link>
                                   </Button>
                              ))}
                              <div className="mt-4">
                                   {auth?.user?.role === 'admin' && (
                                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                             <DialogTrigger asChild>
                                                  <Button
                                                       variant={trainee.profile?.status === 'active' ? 'destructive' : 'default'}
                                                       className="w-full"
                                                  >
                                                       {trainee.profile?.status === 'active' ? 'Mark as Inactive' : 'Reactivate Trainee'}
                                                  </Button>
                                             </DialogTrigger>
                                             <DialogContent>
                                                  <DialogHeader>
                                                       <DialogTitle>
                                                            {trainee.profile?.status === 'active' ? 'Mark Trainee as Inactive?' : 'Reactivate Trainee?'}
                                                       </DialogTitle>
                                                       <DialogDescription>
                                                            {trainee.profile?.status === 'active'
                                                                 ? `This will mark ${trainee.name} as inactive. They will no longer be able to log in or record time logs. Their historical data will be preserved.`
                                                                 : `This will reactivate ${trainee.name}. They will be able to log in and record time logs again.`
                                                            }
                                                       </DialogDescription>
                                                  </DialogHeader>
                                                  <DialogFooter>
                                                       <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                            Cancel
                                                       </Button>
                                                       <Button
                                                            variant={trainee.profile?.status === 'active' ? 'destructive' : 'default'}
                                                            onClick={handleToggleStatus}
                                                       >
                                                            {trainee.profile?.status === 'active' ? 'Mark as Inactive' : 'Reactivate'}
                                                       </Button>
                                                  </DialogFooter>
                                             </DialogContent>
                                        </Dialog>
                                   )}
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