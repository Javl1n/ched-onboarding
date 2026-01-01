import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, GroupedQuestions, QuestionInterface } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ClipboardList, Edit, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import CreateQuestionDialog from '@/components/question/create-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Questions',
        href: '/questions',
    },
];

const typeColors = {
    scale: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    text: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function QuestionsIndex({
    supervisorQuestions,
    traineeQuestions,
    categories,
}: {
    supervisorQuestions: GroupedQuestions;
    traineeQuestions: GroupedQuestions;
    categories: string[];
}) {
    const handleReorder = (questions: QuestionInterface[], direction: 'up' | 'down', questionId: number | string) => {
        const currentIndex = questions.findIndex((q) => q.id === questionId);

        if (direction === 'up' && currentIndex === 0) return;
        if (direction === 'down' && currentIndex === questions.length - 1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const updatedQuestions = [...questions];

        // Swap order values
        const temp = updatedQuestions[currentIndex].order;
        updatedQuestions[currentIndex].order = updatedQuestions[newIndex].order;
        updatedQuestions[newIndex].order = temp;

        // Send reorder request
        router.post(
            '/questions/reorder',
            {
                questions: updatedQuestions.map((q) => ({
                    id: q.id,
                    order: q.order,
                })),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Question reordered successfully');
                },
                onError: () => {
                    toast.error('Failed to reorder question');
                },
            }
        );
    };

    const renderQuestionTable = (groupedQuestions: GroupedQuestions) => {
        // Flatten all questions from all categories and sort by order
        const allQuestions = Object.values(groupedQuestions).flat().sort((a, b) => a.order - b.order);

        if (allQuestions.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted/50 p-6 mb-4">
                        <ClipboardList className="size-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">No questions found</h3>
                    <p className="text-sm text-muted-foreground">Create your first question to get started.</p>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {Object.entries(groupedQuestions).map(([category, questions]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="text-lg font-semibold">{category}</h3>
                        <div className="rounded-lg border border-sidebar-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">#</TableHead>
                                        <TableHead>Content</TableHead>
                                        <TableHead className="w-24">Type</TableHead>
                                        <TableHead className="w-32 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {questions.map((question) => {
                                        const questionIndex = allQuestions.findIndex((q) => q.id === question.id);
                                        const isFirst = questionIndex === 0;
                                        const isLast = questionIndex === allQuestions.length - 1;

                                        return (
                                            <TableRow key={question.id}>
                                                <TableCell className="font-medium">{question.order}</TableCell>
                                                <TableCell className="max-w-xl">{question.content}</TableCell>
                                                <TableCell>
                                                    <Badge className={typeColors[question.type]}>
                                                        {question.type === 'scale' ? 'Scale (1-5)' : 'Text'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleReorder(allQuestions, 'up', question.id)}
                                                            disabled={isFirst}
                                                            title="Move up"
                                                        >
                                                            <ArrowUp className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleReorder(allQuestions, 'down', question.id)}
                                                            disabled={isLast}
                                                            title="Move down"
                                                        >
                                                            <ArrowDown className="size-4" />
                                                        </Button>
                                                        <Link href={`/questions/${question.id}/edit`}>
                                                            <Button variant="ghost" size="icon" title="Edit">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Question Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                Administration
                            </div>
                            <div className="mt-1 text-3xl font-black lg:text-4xl">Question Management</div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage assessment questions for supervisors and trainees
                            </p>
                        </div>
                        <CreateQuestionDialog categories={categories} />
                    </div>
                </div>

                {/* Tabs */}
                <Card className="rounded-xl border-sidebar-border bg-gradient-to-br from-card to-muted/20 shadow-sm">
                    <CardHeader>
                        <CardTitle>Assessment Questions</CardTitle>
                        <CardDescription>Create, edit, and reorder questions for assessments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="supervisor" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="supervisor">Supervisor Questions</TabsTrigger>
                                <TabsTrigger value="trainee">Trainee Questions</TabsTrigger>
                            </TabsList>
                            <TabsContent value="supervisor" className="mt-0">
                                {renderQuestionTable(supervisorQuestions)}
                            </TabsContent>
                            <TabsContent value="trainee" className="mt-0">
                                {renderQuestionTable(traineeQuestions)}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
