import AppLayout from '@/layouts/app-layout';
import { TraineeJournalInterface, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { BookOpen, Calendar, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Journal',
        href: '/journal',
    },
    {
        title: 'Edit Entry',
        href: '#',
    },
];

export default function JournalEdit({ journal }: { journal: TraineeJournalInterface }) {
    const { data, setData, patch, processing, errors } = useForm<{
        date: string;
        content: string;
    }>({
        date: format(journal.date, 'yyyy-M-dd'),
        content: journal.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/journal/${journal.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Journal Entry" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div>
                        <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Edit</div>
                        <div className="mt-1 text-3xl font-black lg:text-4xl">Journal Entry</div>
                        <p className="mt-1 text-sm text-muted-foreground">Update your journal entry</p>
                    </div>
                </div>

                {/* Form */}
                <Card className="rounded-xl border-sidebar-border bg-gradient-to-br from-card to-muted/20 shadow-sm">
                    <CardHeader>
                        <CardTitle>Journal Entry</CardTitle>
                        <CardDescription>Update your activities, learnings, and reflections</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Date
                                </Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                <InputError message={errors.date} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">
                                    What did you do today?
                                </Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Describe your activities, tasks completed, challenges faced, and what you learned today..."
                                    className="min-h-[300px] bg-blue-100/0"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Be detailed - this will help create better AI-generated summaries of your progress
                                </p>
                                <InputError message={errors.content} />
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="size-4" />
                                    {processing ? 'Saving...' : 'Update Entry'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
