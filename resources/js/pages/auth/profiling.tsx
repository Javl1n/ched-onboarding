import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import ImageInput from '@/components/onboarding/create/image-input';
import SelectSchool from '@/components/profiling/register/select-school';
import DateInput from '@/components/profiling/register/date-input';

interface ProfilingAttributes {
     school: string;
     birth: Date;
     gender: boolean;
     contact: string;
     address: string;
     profile: File | undefined;
}

export default function Profiling() {
     const {auth: {user}} = usePage<SharedData>().props;

     const {data, setData, errors, processing, post} = useForm<ProfilingAttributes>({
          school: "",
          birth: new Date,
          gender: true,
          contact: "",
          address: "",
          profile: undefined
     });

     const submit = () => {
        post(RegisteredUserController.store().url, )
     }

     return (
          <AuthLayout title={`Welcome, Trainee ${user.name.split(' ')[0]}`} description="Enter your details below to complete your registration">
            <Head title="Register" />
               <div
                    className="flex flex-col gap-6"
               >
                         
                    <div className="grid gap-6">
                         <div className="grid gap-2">
                              <Label >Profile Picture</Label>
                              <ImageInput onChange={(e: any) => setData("profile", e.target?.files[0])} />
                              <InputError message={errors.school} className="mt-2" />
                         </div>
                         <div className="grid gap-2">
                              <Label >School</Label>
                              <SelectSchool value={data.school} onValueChange={(e: any) => setData("profile", e.target.value)} />
                              <InputError message={errors.school} className="mt-2" />
                         </div>
                         <div className="grid gap-2">
                              <Label>Date of Birth</Label>
                              <DateInput date={data.birth} setDate={(date) => setData("birth", date)}  />
                              <InputError message={errors.school} className="mt-2" />
                         </div>

                         {/* <div className="grid gap-2">
                              <Label htmlFor="email">Email address</Label>
                              <Input
                                   id="email"
                                   type="email"
                                   required
                                   tabIndex={2}
                                   autoComplete="email"
                                   name="email"
                                   placeholder="email@example.com"
                              />
                              <InputError message={errors.email} />
                         </div> */}

                         <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                              Create account
                         </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                         Already have an account?{' '}
                         <TextLink href={login()} tabIndex={6}>
                              Log in
                         </TextLink>
                    </div>
                    
               </div>
        </AuthLayout>
     );
}