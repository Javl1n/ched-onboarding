import AppLayout from '@/layouts/app-layout';
import { QuestionInterface, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InputError from '@/components/input-error';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Questions',
        href: '/questions',
    },
    {
        title: 'Edit Question',
        href: '#',
    },
];

export default function QuestionEdit({
    question,
    categories,
}: {
    question: QuestionInterface;
    categories: string[];
}) {
    const { data, setData, processing, errors, setError } = useForm({
        content: question.content,
        for: question.for,
        type: question.type,
        category: question.category,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.patch(`/questions/${question.id}`, data, {
            onSuccess: () => {
                toast.success('Question updated successfully');
            },
            onError: (errors) => {
                toast.error('Failed to update question');
                // Set errors from response
                Object.keys(errors).forEach((key) => {
                    setError(key as any, errors[key] as string);
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Question" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div>
                        <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Edit</div>
                        <div className="mt-1 text-3xl font-black lg:text-4xl">Question</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update the question content, type, or category
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card className="rounded-xl border-sidebar-border bg-gradient-to-br from-card to-muted/20 shadow-sm">
                    <CardHeader>
                        <CardTitle>Question Details</CardTitle>
                        <CardDescription>Modify the question information below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="content">
                                    Question Content <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Enter the question content"
                                    className="min-h-32"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Write a clear and concise question (10-1000 characters)
                                </p>
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="for">
                                        For <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.for}
                                        onValueChange={(value: 'supervisor' | 'trainee') => setData('for', value)}
                                    >
                                        <SelectTrigger id="for">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="supervisor">Supervisor</SelectItem>
                                            <SelectItem value="trainee">Trainee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Who answers this question? (Cannot be changed after creation)
                                    </p>
                                    <InputError message={errors.for} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">
                                        Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(value: 'scale' | 'text') => setData('type', value)}
                                    >
                                        <SelectTrigger id="type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="scale">Scale (1-5)</SelectItem>
                                            <SelectItem value="text">Text</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">How should this be answered?</p>
                                    <InputError message={errors.type} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Or enter a new category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Select existing or type a new category</p>
                                <InputError message={errors.category} />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="size-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
