import supervisor from '@/routes/supervisor';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '../input-error';
import SelectDepartment from '../onboarding/create/select-department';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateSupervisor {
    department: string;
    email: string;
    name: string;
    password: string;
}

export default function CreateSupervisor() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, errors, reset, wasSuccessful, processing } = useForm<CreateSupervisor>({
        department: '',
        email: '',
        name: '',
        password: 'ched123',
    });

    const submit = () => {
        post(supervisor.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Supervisor</Button>
            </DialogTrigger>
            <DialogContent className='bg-white'>
                <DialogHeader>
                    <DialogTitle>Add Supervisor</DialogTitle>
                    <DialogDescription>Enter supervisor information to create a new account.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Department</Label>
                        <SelectDepartment value={data.department} onValueChange={(value) => setData('department', value)} />
                        <InputError message={errors.department} />
                    </div>
                    <div>
                        <Label>Name</Label>
                        <Input placeholder="Enter name here" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="hidden" name="email" />
                        <Input
                            type="email"
                            autoComplete="new-email"
                            placeholder="Enter email here"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} />
                    </div>
                    <div>
                        <Label>Password</Label>
                        <Input placeholder="Enter password here" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <p className="mt-1 text-xs text-muted-foreground">Please change the password as soon as you log in</p>
                        <InputError message={errors.password} />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button className='bg-white' variant="secondary" onClick={() => reset()}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={submit} disabled={processing}>
                        {processing ? 'Adding...' : 'Add Supervisor'}
                    </Button>
                </DialogFooter>

                {wasSuccessful && <div className="text-sm text-green-600 dark:text-green-400">Supervisor added successfully!</div>}
            </DialogContent>
        </Dialog>
    );
}
