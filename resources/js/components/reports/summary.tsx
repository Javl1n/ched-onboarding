import trainees, { summary } from "@/routes/trainees";
import { Button } from "../ui/button";
import { useForm, usePage } from "@inertiajs/react";
import { User } from "@/types";
import { useEventStream, useStream } from "@laravel/stream-react";
import { Skeleton } from "../ui/skeleton";
import InputError from "../input-error";
import { useEffect, useState } from "react";
import { saved, store } from "@/routes/trainees/summary";
import { FormDataError, FormDataErrors } from "@inertiajs/core";
import { toast } from "sonner";
import { format } from "date-fns";
import useToast from "@/hooks/use-toast";

export default function ReportSummary() {
     const {trainee} = usePage<{trainee: User}>().props;

     const [summary, setSummary] = useState("");

     const [error, setError] = useState('');

     const { data: formData, setData, errors, post } = useForm<{summary: string}>({
          summary: '',
     });

     const { data: streamData, isFetching, isStreaming, send } = useStream(trainees.summary(trainee).url, {
          onData: (data: string) => {
               setSummary(prev => prev + data);
          },
          onFinish: () => {
               console.log(initialData);
               setData("summary", streamData);
          },
          onError: (error) => {
               setError(error.message);
          }
     });

     const { data: initialData, send: sendInitial } = useStream(saved(trainee).url, {
          onData: (data: string) => {
               setSummary(prev => prev + data);
          },
          onFinish: () => {
               console.log(initialData);
               // setData("summary", streamData);
          },
          onError: (error) => {
               setError(error.message);
          }
     });

     useEffect(() => {
          sendInitial({});
     }, []);

     const save = () => {
          toast.promise(
               new Promise((resolve, reject) => {
                    post(store(trainee.id).url, {
                         onSuccess: () => resolve("Assessment Saved!"),
                         onError: (error: {summary?: string}) => {
                              reject("Something went wrong.");
                              setError(error.summary as string);
                         },
                    });
               }),
               {
                    loading: "Saving Assessment...",
                    success: (msg) => msg as string,
                    error: (msg) => msg as string,
                    description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:m a")}`
               }
          );

          
     }

     return (
          <div className="h-[calc(100vh-16rem)] flex flex-col p-4 border rounded-lg gap-4">
               <h1 className="text-lg font-bold">Summary</h1>
               <div className="flex-1 overflow-auto rounded-lg dark:bg-neutral-900 p-4">
                    <div className="prose prose-neutral dark:prose-inverse dark:prose-strong:text-white dark:text-white dark:prose-h2:text-white prose-h2:mt-0 prose-section:mb-10" dangerouslySetInnerHTML={{ __html: summary }} />
                    {isFetching && <div className="flex flex-wrap gap-2">
                         {[...Array(20)].map((_, index) => 
                              <Skeleton key={index} className="h-4" style={{
                                   width: Math.floor((Math.random() * 200) + 100)
                              }} />
                         )}
                    </div>}
               </div>
               <div className="flex gap-4">
                    <Button onClick={() => {
                         setSummary("");
                         send({});
                    }}>Generate Summary</Button>
                    <Button disabled={formData.summary == ""} variant={"secondary"} onClick={() => save()}>Save</Button>
                    <InputError className="my-auto" message={error} />
               </div>
          </div>
     )
}