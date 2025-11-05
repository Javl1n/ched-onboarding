import department from '@/routes/department';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateDepartmentForm {
    name: string;
    password: string;
}

export default function CreateDepartment() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, reset, wasSuccessful, processing } = useForm<CreateDepartmentForm>({
        name: '',
        password: '',
    });

    const submit = () => {
        post(department.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Department</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Department</DialogTitle>
                    <DialogDescription>Create a new department. You won't be able to update or delete it afterwards.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Department Name</Label>
                        <Input placeholder="HR, Unifast, IT" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label>Your Password</Label>
                        <Input
                            autoComplete="current-password"
                            type="password"
                            placeholder="Enter your password to confirm"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <p className="mt-1 text-xs text-muted-foreground">Enter your password to confirm this action</p>
                        <InputError message={errors.password} />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => reset()}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={submit} disabled={processing}>
                        {processing ? 'Adding...' : 'Add Department'}
                    </Button>
                </DialogFooter>

                {wasSuccessful && <div className="text-sm text-green-600 dark:text-green-400">Department added successfully!</div>}
            </DialogContent>
        </Dialog>
    );
}
