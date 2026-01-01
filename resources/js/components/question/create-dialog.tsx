import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import InputError from '../input-error';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

interface CreateQuestionForm {
    content: string;
    for: 'supervisor' | 'trainee';
    type: 'scale' | 'text';
    category: string;
}

export default function CreateQuestionDialog({
    categories,
    defaultFor,
}: {
    categories: string[];
    defaultFor?: 'supervisor' | 'trainee';
}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, reset, processing } = useForm<CreateQuestionForm>({
        content: '',
        for: defaultFor || 'supervisor',
        type: 'scale',
        category: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/questions', {
            onSuccess: () => {
                reset();
                setOpen(false);
                toast.success('Question created successfully');
            },
            onError: () => {
                toast.error('Failed to create question');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-sm">
                    <Plus className="size-4" />
                    New Question
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Question</DialogTitle>
                    <DialogDescription>Add a new assessment question for supervisors or trainees</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
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
                            <Select value={data.for} onValueChange={(value: 'supervisor' | 'trainee') => setData('for', value)}>
                                <SelectTrigger id="for">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="supervisor">Supervisor</SelectItem>
                                    <SelectItem value="trainee">Trainee</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Who will answer this question?</p>
                            <InputError message={errors.for} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">
                                Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.type} onValueChange={(value: 'scale' | 'text') => setData('type', value)}>
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
                        <Select
                            value={data.category}
                            onValueChange={(value) => setData('category', value)}
                        >
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

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => reset()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Question'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
