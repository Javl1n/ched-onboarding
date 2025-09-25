import trainees from "@/routes/trainees";
import { Button } from "../ui/button";
import axios from 'axios';
import { usePage } from "@inertiajs/react";
import { TraineeProfileInterface, User } from "@/types";
import { useState } from "react";
import { useEventStream, useStream } from "@laravel/stream-react";
import { Skeleton } from "../ui/skeleton";



export default function ReportSummary() {
     const {trainee} = usePage<{trainee: User}>().props;
     // const [summary, setSummary] = useState("");

     const { data, isFetching, isStreaming, send } = useStream(trainees.summary(trainee).url);

     const save = () => {
          
     }

     return (
          <div className="h-[calc(100vh-16rem)] flex flex-col p-4 border rounded-lg gap-4">
               <h1 className="text-lg font-bold">Summary</h1>
               <div className="flex-1 overflow-auto rounded-lg dark:bg-neutral-900 p-4">
                    <div className="prose prose-neutral dark:prose-inverse dark:prose-strong:text-white dark:text-white dark:prose-h2:text-white prose-h2:mt-0 prose-section:mb-10" dangerouslySetInnerHTML={{ __html: data }} />
                    {isFetching && <div className="flex flex-wrap gap-2">
                         {[...Array(20)].map(() => 
                              <Skeleton className="h-4" style={{
                                   width: Math.floor((Math.random() * 200) + 100)
                              }} />
                         )}
                    </div>}
               </div>
               <div className="flex gap-4">
                    <Button onClick={() => send({})}>Generate Summary</Button>
                    <Button variant={"secondary"} onClick={save}>Save</Button>
               </div>
          </div>
     )
}