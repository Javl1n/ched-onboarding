import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { SharedData } from '@/types';
import ImageInput from '@/components/onboarding/create/image-input';
import SelectSchool from '@/components/profiling/register/select-school';
import DateInput from '@/components/profiling/register/date-input';
import SelectGender from '@/components/profiling/register/select-gender';
import { Textarea } from '@/components/ui/textarea';
import { register } from 'module';
import { profiling } from '@/routes/register';
import { ChangeEvent, ChangeEventHandler, TextareaHTMLAttributes } from 'react';
import { isNumeric } from '@/lib/utils';

export interface ProfilingAttributes {
     profile: File | undefined | string;
     school: string;
     birth: Date;
     gender: "Male" | "Female";
     contact: string;
     address: string;
}

export default function Profiling() {
     const {auth: {user}} = usePage<SharedData>().props;

     const {data, setData, errors, processing, post} = useForm<ProfilingAttributes>({
          profile: undefined,
          school: "",
          birth: new Date(new Date().setFullYear(new Date().getFullYear() - 21)),
          gender: "Male",
          contact: "",
          address: "",
     });

     const submit = () => {
          post('/trainee/profiling');
     }

     return (
          <AuthLayout title={`Welcome, Trainee ${user.name.split(' ')[0]}`} description="Enter your details below to complete your registration">
               <Head title="Trainee Onboarding" />
               <div
                    className="flex flex-col gap-6"
               >
                    <div className="grid gap-6">
                         <div className="grid gap-2">
                              <Label >Profile Picture</Label>
                              <ImageInput onChange={(e: any) => setData("profile", e.target?.files[0])} />
                              <InputError message={errors.profile} className="mt-2" />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="email">School</Label>
                              <Input value={data.school} onChange={(e: ChangeEvent<HTMLInputElement>) => setData('school', e.target.value)} placeholder='Enter your school here' />
                              <InputError message={errors.school} />
                         </div>
                         <div className="grid gap-2">
                              <Label>Date of Birth</Label>
                              <DateInput date={data.birth} setDate={(date) => setData("birth", date)}  />
                              <InputError message={errors.school} className="mt-2" />
                         </div>
                         <div className="grid gap-2">
                              <Label>Gender</Label>
                              <SelectGender value={data.gender} setValue={(value) => setData("gender", value)} />
                              <InputError message={errors.gender} className="mt-2" />
                         </div>
                         <div className="grid gap-2">
                              <Label>Contact</Label>
                              <div className="flex gap-2">
                                   <div className='my-auto text-sm'>+63</div>
                                   <Input value={data.contact} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (!isNumeric(e.target.value)) return null;

                                        setData("contact", e.target.value)
                                   }} className='flex-1' placeholder='994 123 3456' />
                              </div>
                              <InputError message={errors.contact} className="mt-2" />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="email">Full address</Label>
                              <Textarea value={data.address} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)} placeholder='Enter your address here' />
                              <InputError message={errors.address} />
                         </div>

                         <Button onClick={submit} className="mt-2 w-full" tabIndex={5}>
                              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                              Submit
                         </Button>
                    </div>                    
               </div>
        </AuthLayout>
     );
}