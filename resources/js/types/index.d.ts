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
    onboarding: OnboardingPageInterface[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'trainee' | 'supervisor';
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
    blocks: PageBlockInterface[];
    published: boolean;
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

export interface TraineeProfileInterface {
    id: number | string;
    user: User;
    profile: string;
    school: school;
    birth: string;
    gender: 'Male' | 'Female';
    contact: string;
    address: string;
    status: 'active' | 'inactive';
    deactivated_at?: string | null;
    ojt_start_date?: string | null;
    ojt_duration_in_days?: number | null;
    logs: TimeLogInterface[];
    assessments: AssessmentInterface[];
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

export interface QuestionInterface {
    id: string | number;
    for: 'supervisor' | 'trainee';
    content: string;
    type: 'text' | 'scale';
    category: string;
}

export interface AssessmentInterface {
    id: string | number;
    question: QuestionInterface;
    // question_id: string | number;
    supervisor: User;
    trainee: TraineeProfileInterface;
    value: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
