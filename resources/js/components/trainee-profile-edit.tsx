import { isNumeric } from '@/lib/utils';
import { ProfilingAttributes } from '@/pages/auth/profiling';
import { trainee } from '@/routes/profile/update';
import { TraineeProfileInterface } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { format, formatDate } from 'date-fns';
import { RotateCcw } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';
import HeadingSmall from './heading-small';
import InputError from './input-error';
import ImageInput from './onboarding/create/image-input';
import DateInput from './profiling/register/date-input';
import SelectGender from './profiling/register/select-gender';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export default function EditTraineeProfile() {
    const { profile } = usePage<{ profile: TraineeProfileInterface }>().props;

    const [showResetImage, setShowResetImage] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    const { data, setData, errors, processing, post } = useForm<ProfilingAttributes>({
        profile: profile.profile,
        school: profile.school,
        birth: new Date(profile.birth),
        gender: profile.gender,
        contact: profile.contact,
        address: profile.address,
    });

    const save = () => {
        toast.promise(
            new Promise((resolve, reject) => {
                post(trainee().url, {
                    onSuccess: () => resolve('Profile Saved!'),
                    onError: (error: { summary?: string }) => {
                        reject('Something went wrong.');
                        // setError(error.summary as string);
                    },
                });
            }),
            {
                loading: 'Saving Assessment...',
                success: (msg) => msg as string,
                error: (msg) => msg as string,
                description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:m a")}`,
            },
        );
    };

    return (
        <div className="rounded-xl border border-sidebar-border bg-gradient-to-br from-card to-muted/20 p-6 shadow-sm">
            <HeadingSmall title="Trainee Information" description="Update your trainee information" />

            <div className="mt-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label className="my-auto">Profile Picture</Label>
                        {showResetImage && (
                            <Button
                                variant={'ghost'}
                                onClick={() => {
                                    setData('profile', profile.profile);
                                    setShowResetImage(false);
                                    setResetCounter((prev) => prev + 1);
                                }}
                            >
                                <RotateCcw className="size-5" />
                            </Button>
                        )}
                    </div>
                    <ImageInput
                        key={resetCounter}
                        isNew={false}
                        value={data.profile as string}
                        onChange={(e: any) => {
                            setData('profile', e.target?.files[0]);
                            setShowResetImage(true);
                        }}
                    />
                    <InputError message={errors.profile} className="mt-2" />
                </div>
                <div className="space-y-2">
                    <Label className="my-auto">School</Label>
                    <Input value={data.school} onChange={(e) => setData('school', e.target.value)} />
                    <InputError message={errors.profile} className="mt-2" />
                </div>
                <div className="space-y-2">
                    <Label className="my-auto">Birthdate</Label>
                    {/* <DateInput date={data.birth} setDate={() => null} /> */}
                    <Input value={format(data.birth, 'MMMM dd, yyyy')} onChange={(e) => null} disabled />
                    <InputError message={errors.profile} className="mt-2" />
                </div>
                <div className="space-y-2">
                    <Label>Gender</Label>
                    <SelectGender disabled value={data.gender} setValue={(value) => setData('gender', value)} />
                    <InputError message={errors.gender} className="mt-2" />
                </div>
                <div className="space-y-2">
                    <Label>Contact</Label>
                    <div className="flex gap-2">
                        <div className="my-auto text-sm">+63</div>
                        <Input
                            value={data.contact}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (!isNumeric(e.target.value)) return null;

                                setData('contact', e.target.value);
                            }}
                            className="flex-1"
                            placeholder="994 123 3456"
                        />
                    </div>
                    <InputError message={errors.contact} className="mt-2" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Full address</Label>
                    <Textarea
                        value={data.address}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                        placeholder="Enter your address here"
                    />
                    <InputError message={errors.address} />
                </div>

                <div>
                    <Button onClick={save} disabled={processing}>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
