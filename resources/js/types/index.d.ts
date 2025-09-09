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
    profile?: TraineeProfileInterface;
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

export interface SchoolInterface {
    id: number | string;
    name: string;
}

export interface TraineeProfileInterface {
    id: number | string;
    user: User;
    profile: string;
    school: SchoolInterface;
    birth: string;
    gender: "Male" | "Female";
    contact: string;
    address: string;
    logs: TimeLogInterface[];
}

export interface TimeLogInterface {
    trainee: TraineeProfileInterface;
    date: string;
    morning_in?: string;
    morning_out?: string;
    afternoon_in?: string;
    afternoon_out?: string;
    hours?: float;
}