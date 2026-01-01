import { SharedData } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, useSidebar } from "./ui/sidebar";
import onboarding from "@/routes/onboarding";
import { FileUser, Plus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

export function OnboardingNavGroup() {
    const page = usePage<SharedData>();
    const {
        auth: { user },
        onboarding: pages,
    } = page.props;

    const { setOpen } = useSidebar();

    return (
        <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem className="">
                {/* <SidebarGroupLabel>
                    Pages
                </SidebarGroupLabel> */}
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        asChild
                        isActive={page.url.startsWith(onboarding.index().url)}
                        onClick={() => setOpen(true)}
                    // tooltip={{ children: item.title }}
                    >
                        {/* <Link href={onboarding.index()} prefetch> */}
                        <div>
                            <FileUser />
                            <span>About Us</span>
                        </div>
                        {/* </Link> */}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="">
                        {pages.map((item) => (
                            <SidebarMenuSubItem className="" key={item.slug}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={page.url.startsWith(onboarding.show(item.slug).url)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={onboarding.show(item.slug)} prefetch>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuSubItem>
                        ))}
                        {user.role === 'admin' && <SidebarMenuSubItem className="">
                            <SidebarMenuButton
                                asChild
                                isActive={page.url.startsWith(onboarding.create().url)}
                                tooltip={{ children: 'create new page' }}
                            >
                                <Link href={onboarding.create()} prefetch>
                                    <Plus />
                                    <span>Add Page</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuSubItem>}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
