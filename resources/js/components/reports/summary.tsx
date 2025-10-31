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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

export default function ReportSummary() {
     const {trainee, reports} = usePage<{trainee: User, reports: {
          [key: string | number]: string
     } | null}>().props;

     const [summary, setSummary] = useState("");

     const [error, setError] = useState('');

     const [report, setReport] = useState<string | undefined>(reports ? Object.keys(reports)[0] : undefined);

     const { data: formData, setData, errors, post } = useForm<{summary: string}>({
          summary: '',
     });

     const { data: streamData, isFetching, isStreaming, send } = useStream(trainees.summary(trainee).url, {
          onData: (data: string) => {
               setSummary(prev => prev + data);
          },
          onFinish: () => {
               setData("summary", streamData);
          },
          onError: (error) => {
               setError(error.message);
          }
     });

     const { data: savedData, send: sendSaved, isFetching: isFetchingSaved } = useStream(saved(trainee).url, {
          onData: (data: string) => {
               setSummary(prev => prev + data);
          },
          onFinish: () => {
               // setData("summary", streamData);
          },
          onError: (error) => {
               setError(error.message);
          }
     });

     useEffect(() => {
          if (!reports) return;
          sendSaved({id: Object.keys(reports)[0]});
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
               <div className="flex justify-between">
                    <h1 className="text-lg font-bold my-auto">Summary</h1>
                    <div className="">
                         <Select disabled={isFetching || isFetchingSaved} value={report} onValueChange={(value) => {
                              setReport(value);
                              setSummary('');
                              setData('summary', '');
                              sendSaved({id: value});
                         }}>
                              <SelectTrigger>
                                   <SelectValue placeholder="Select Date" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectGroup>
                                        <SelectLabel className='text-xs text-neutral-600'>
                                             Saved Summaries
                                        </SelectLabel>
                                        {reports ? Object.keys(reports).map((id) => (
                                             <SelectItem key={`reports-${id}`} value={id}>
                                                  {reports[id]}
                                             </SelectItem>
                                        )): null}
                                   </SelectGroup>
                              </SelectContent>
                         </Select>
                    </div>
               </div>
               <div className="flex-1 overflow-auto rounded-lg p-4 border">
                    {!summary && !isFetching && !isFetchingSaved && (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                              <p className="text-center">No summary available. Click "Generate Summary" to create one.</p>
                         </div>
                    )}
                    {summary && <div className="prose prose-neutral dark:prose-inverse dark:prose-strong:text-white dark:text-white dark:prose-h2:text-white prose-h2:mt-0 prose-section:mb-10" dangerouslySetInnerHTML={{ __html: summary }} />}
                    {(isFetching || isFetchingSaved) && <div className="flex flex-wrap gap-2">
                         {[...Array(20)].map((_, index) =>
                              <Skeleton key={`skeleton-${index}`} className="h-4" style={{
                                   width: Math.floor((Math.random() * 200) + 100)
                              }} />
                         )}
                    </div>}
               </div>
               <div className="flex gap-4">
                    <Button disabled={isFetching || isFetchingSaved} onClick={() => {
                         setSummary("");
                         setReport(undefined);
                         setData("summary", "");
                         send({});
                    }}>Generate Summary</Button>
                    <Button disabled={formData.summary == ""} variant={"secondary"} onClick={() => save()}>Save</Button>
                    <InputError className="my-auto" message={error} />
               </div>
          </div>
     )
}