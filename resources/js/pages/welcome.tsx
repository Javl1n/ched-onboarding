import AppLogoIcon from '@/components/app-logo-icon';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { login, register } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock, FileText, Users } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-svh flex-col bg-background">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                <AppLogoIcon className="h-6 w-6 fill-current" />
                            </div>
                            <span className="text-lg">OJT Onboarding System</span>
                        </Link>
                        <nav className="flex items-center gap-4">
                            <TextLink href={login()}>Log in</TextLink>
                            <Button asChild>
                                <Link href={register()}>Sign up</Link>
                            </Button>
                        </nav>
                    </div>
                </header>

                <main className="flex flex-1 items-center justify-center">
                    <div className="container flex flex-col items-center justify-center gap-12 py-12 text-center">
                        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
                            <div className="mb-4 flex items-center gap-8">
                                <img
                                    src="/private/logo.png"
                                    alt="CHED Logo"
                                    className="h-24 w-24 object-contain"
                                />
                                <img
                                    src="/private/bp-logo.PNG"
                                    alt="BP Logo"
                                    className="h-24 w-24 object-contain"
                                />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                Welcome to CHED OJT Onboarding System
                            </h1>
                            <p className="max-w-2xl text-lg text-muted-foreground">
                                Streamline your on-the-job training experience with our comprehensive management platform. Track
                                attendance, manage assessments, and monitor trainee progress all in one place.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button asChild size="lg">
                                    <Link href={register()}>Get Started</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href={login()}>Log in</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="w-full max-w-6xl">
                            <h2 className="mb-12 text-3xl font-bold">Key Features</h2>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Time Tracking</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Automated attendance monitoring with QR code scanning for seamless check-ins
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Trainee Management</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Comprehensive trainee profiles with department organization and supervisor assignments
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Assessments</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Structured evaluation system for tracking trainee performance and supervisor feedback
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold">Onboarding Resources</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Centralized documentation and guides to help trainees get up to speed quickly
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="border-t py-6">
                    <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
                        <p>CHED OJT Onboarding System - Empowering trainees and supervisors</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
