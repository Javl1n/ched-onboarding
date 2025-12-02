import AppLayout from '@/layouts/app-layout';
import { AnnouncementInterface, DepartmentInterface, type BreadcrumbItem, User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import InputError from '@/components/input-error';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Announcements',
        href: '/announcements',
    },
    {
        title: 'Edit Announcement',
        href: '#',
    },
];

export default function AnnouncementEdit({
    announcement,
    departments,
    userDepartmentId,
}: {
    announcement: AnnouncementInterface;
    departments: DepartmentInterface[] | null;
    userDepartmentId: number | null;
}) {
    const { auth } = usePage().props as { auth: { user: User } };
    const isAdmin = auth.user.role === 'admin';

    const { data, setData, patch, processing, errors } = useForm({
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        status: announcement.status,
        department_id: announcement.department_id?.toString() || '',
        expires_at: announcement.expires_at
            ? new Date(announcement.expires_at).toISOString().slice(0, 16)
            : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/announcements/${announcement.id}`, {
            onSuccess: () => {
                toast.success('Announcement updated successfully');
            },
            onError: () => {
                toast.error('Failed to update announcement');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Announcement" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Header */}
                <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm lg:p-8">
                    <div>
                        <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Edit</div>
                        <div className="mt-1 text-3xl font-black lg:text-4xl">Announcement</div>
                        <p className="mt-1 text-sm text-muted-foreground">Update announcement details</p>
                    </div>
                </div>

                {/* Form */}
                <Card className="rounded-xl border-sidebar-border bg-gradient-to-br from-card to-muted/20 shadow-sm">
                    <CardHeader>
                        <CardTitle>Announcement Details</CardTitle>
                        <CardDescription>Update the information below to modify the announcement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter announcement title"
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">
                                    Content <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Write your announcement message here..."
                                    className="min-h-[200px]"
                                    required
                                />
                                <InputError message={errors.content} />
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="priority">
                                        Priority <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                        <SelectTrigger id="priority">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.priority} />
                                </div>

                                {isAdmin && departments && (
                                    <div className="space-y-2">
                                        <Label htmlFor="department_id">Department (Optional)</Label>
                                        <Select
                                            value={data.department_id}
                                            onValueChange={(value) => setData('department_id', value)}
                                        >
                                            <SelectTrigger id="department_id">
                                                <SelectValue placeholder="Global (All departments)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">Global (All departments)</SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.department_id} />
                                        <p className="text-xs text-muted-foreground">
                                            Leave empty for global announcement visible to all departments
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expires_at">Expiration Date (Optional)</Label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                />
                                <InputError message={errors.expires_at} />
                                <p className="text-xs text-muted-foreground">
                                    Announcement will be hidden after this date
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Status <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="draft" id="draft" />
                                        <Label htmlFor="draft" className="font-normal cursor-pointer">
                                            Draft (Not visible to trainees)
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="published" id="published" />
                                        <Label htmlFor="published" className="font-normal cursor-pointer">
                                            Published (Visible to trainees)
                                        </Label>
                                    </div>
                                </RadioGroup>
                                <InputError message={errors.status} />
                                {announcement.status === 'draft' && data.status === 'published' && (
                                    <p className="text-sm text-orange-600">
                                        Changing to published will notify all trainees
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing} className="gap-2">
                                    <Save className="size-4" />
                                    {processing ? 'Updating...' : 'Update Announcement'}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
