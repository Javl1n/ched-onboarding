import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import SelectDepartment from "../onboarding/create/select-department";
import { useForm } from "@inertiajs/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import InputError from "../input-error";
import supervisor from "@/routes/supervisor";

interface CreateSupervisor {
     department: string;
     email: string;
     name: string;
     password: string;
}

export default function CreateSupervisor() {
     const { data, setData, post, errors, reset, wasSuccessful } = useForm<CreateSupervisor>({
          department: '',
          email: '',
          name: '',
          password: "ched123"
     });

     const submit = () => {
          post(supervisor.store().url);

          if (wasSuccessful) {
               reset
          }

     }

     return (
          <Card>
               <CardHeader>
                    <CardTitle>Add Supervisor</CardTitle>
                    <CardDescription>Enter Supervisor Information Here</CardDescription>
               </CardHeader>
               <CardContent>
                    <div className="space-y-2">
                         <div className="">
                              <Label>Department</Label>
                              <SelectDepartment value={data.department} onValueChange={(value) => setData("department", value)} />
                              <InputError message={errors.department} />
                         </div>
                         <div>
                              <Label>Name</Label>
                              <Input placeholder="Enter name here" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                              <InputError message={errors.name} />
                         </div>
                         <div>
                              <Label>Email</Label>
                              <Input placeholder="Enter email here" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                              <InputError message={errors.email} />
                         </div>
                         <div>
                              <Label>Password</Label>
                              <Input placeholder="Enter password here" value={data.password} onChange={(e) => setData("password", e.target.value)} />
                              <div className="text-xs dark:text-neutral-600 text-neutral-500">please change the password as soon as you log in</div>
                              <InputError message={errors.password} />
                         </div>
                    </div>
               </CardContent>
               <CardFooter>
                    <div className="w-full space-y-1">
                         <div className="w-full flex justify-end gap-2">
                              <Button onClick={() => reset()} variant="outline">
                                   Reset
                              </Button>
                              <Button onClick={submit}>
                                   Add
                              </Button>
                         </div>
                         {wasSuccessful ? <div className="text-green-500 text-sm">
                              Supervisor added successfully!
                         </div> : null}
                    </div>
               </CardFooter>
          </Card>
)
}