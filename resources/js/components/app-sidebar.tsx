import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardCheck, File, FileUser, Folder, LayoutGrid, UserRoundCog } from 'lucide-react';
import AppLogo from './app-logo';
import onboarding from '@/routes/onboarding';
import supervisor from '@/routes/supervisor';
import dashboard from '@/routes/dashboard';
import trainees from '@/routes/trainees';
import assessments from '@/routes/assessments';

const traineeNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.trainee(),
        icon: LayoutGrid,
    },
    {
        title: 'About CHED',
        href: onboarding.index(),
        icon: FileUser,
    },
    {
        title: 'Supervisor Assessments',
        href: assessments.supervisor.index(),
        icon: ClipboardCheck,
    },
];

const supervisorNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.supervisor(),
        icon: LayoutGrid,
    },
    {
        title: 'Onboarding',
        href: onboarding.index(),
        icon: FileUser,
    },
    // {
    //     title: 'Assessments',
    //     href: assessments.supervisor.index(),
    //     icon: ClipboardCheck,
    // },
    {
        title: 'Trainees',
        href: trainees.index(),
        icon: ClipboardCheck,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.admin(),
        icon: LayoutGrid,
    },
    {
        title: 'Onboarding',
        href: onboarding.index(),
        icon: FileUser,
    },
    {
        title: 'Supervisors',
        href: supervisor.index(),
        icon: UserRoundCog,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const {auth: { user }} = usePage<SharedData>().props;

    const mainNavItems = () : NavItem[] => {
        switch(user.role) {
            case 'admin':
                return adminNavItems;
            case 'supervisor':
                return supervisorNavItems;
            case 'trainee':
                return traineeNavItems;
            default:
                return [];
        };
    }

    return (
        <Sidebar collapsible="icon" variant="sidebar" className=''>
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.index()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className='' >
                <NavMain items={mainNavItems()} />
            </SidebarContent>

            <SidebarFooter className=''>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {/* <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        className=""
                    >
                        <a className='' href="" target="_blank" rel="noopener noreferrer">
                            <img className='size-5' src={`/private/bp-logo.PNG`} alt="" />
                            <span>Bagong Pilipinas</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
