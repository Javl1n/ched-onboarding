import department from '@/routes/department';
import { useForm } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import InputError from '../input-error';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateDepartmentForm {
    name: string;
    password: string;
}

export default function CreateDepartment() {
    const { data, setData, post, errors, reset, wasSuccessful } = useForm<CreateDepartmentForm>({
        name: '',
        password: '',
    });

    const submit = () => {
        post(department.store().url, {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Add Department</CardTitle>
                    <CardDescription>
                        Add Department Here. {wasSuccessful ? <span className="text-green-500">Added Successfully</span> : null}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Label>Department Name</Label>
                    <Input placeholder="HR, Unifast, IT" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                    <InputError message={errors.name} />
                    <InputError message={errors.password} />
                </CardContent>
                <CardFooter>
                    <div className="flex w-full justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Add</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>
                                        You won't be able to update or delete the department afterwards.
                                        <br />
                                        Enter Your password to confirm.
                                    </DialogDescription>
                                </DialogHeader>
                                <div>
                                    {/* <Label>Password</Label> */}
                                    <Input
                                        autoComplete="new-password"
                                        type="password"
                                        placeholder="Password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={() => reset()} variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button onClick={submit}>Save</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
}
