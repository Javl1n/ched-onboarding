import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import assessments from '@/routes/assessments';
import dashboard from '@/routes/dashboard';
import onboarding from '@/routes/onboarding';
import supervisor from '@/routes/supervisor';
import trainees from '@/routes/trainees';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ClipboardCheck, FileUser, LayoutGrid, UserRoundCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

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
        icon: Users,
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
        title: 'Trainees',
        href: trainees.index(),
        icon: Users,
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
    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const mainNavItems = (): NavItem[] => {
        switch (user.role) {
            case 'admin':
                return adminNavItems;
            case 'supervisor':
                return supervisorNavItems;
            case 'trainee':
                return traineeNavItems;
            default:
                return [];
        }
    };

    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-gradient-to-b from-sidebar to-sidebar/95">
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

            <SidebarContent className="">
                <NavMain items={mainNavItems()} />
            </SidebarContent>

            <SidebarFooter className="">
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
