import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileUser, Folder, LayoutGrid, UserRoundCog } from 'lucide-react';
import AppLogo from './app-logo';
import onboarding from '@/routes/onboarding';
import supervisor from '@/routes/supervisor';
import dashboard from '@/routes/dashboard';

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
];

const supervisorNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.supervisor(),
        icon: LayoutGrid,
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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
