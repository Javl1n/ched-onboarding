import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'trainee' | 'supervisor';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    department: DepartmentInterface;
    [key: string]: unknown; // This allows for additional properties...
}

export interface OnboardingPageInterface {
    id: number;
    title: string;
    slug: string;
    department: DepartmentInterface,
    blocks: PageBlockInterface[],
    published: boolean,
}

export interface PageBlockInterface {
    id: number;
    order: number;
    type: 'paragraph' | 'header_one' | 'header_two' | 'header_three' | 'image' | 'video' | 'file' | string;
    content: string;
}

export interface DepartmentInterface {
    id: number | string;
    name: string;
}