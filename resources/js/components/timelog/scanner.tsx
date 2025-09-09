import { Camera } from "lucide-react";
import { 
     AlertDialog, 
     AlertDialogCancel, 
     AlertDialogContent, 
     AlertDialogDescription, 
     AlertDialogFooter, 
     AlertDialogHeader, 
     AlertDialogTitle, 
     AlertDialogTrigger 
} from "../ui/alert-dialog";

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState } from "react";
import { router } from "@inertiajs/react";
import timelog from "@/routes/timelog";

export default function AttendanceScanner() {
     const [message, setMessage] = useState<{
          class: string,
          content: string,
     } | null>(null);

     const save = (result: IDetectedBarcode) => {
          router.post(timelog.post(), 
               {
                    code: result.rawValue
               },
               {
                    onError: (error) => setMessage({
                         class: "text-red-500",
                         content: error.code,
                    }),
                    onSuccess: () => setMessage({
                         class: "text-green-500",
                         content: "Scan Complete",
                    })
               }
          );
     }

     return (
          <AlertDialog onOpenChange={(open: boolean) => {
               // if (open) reset();
          }}>
               <AlertDialogTrigger asChild>
                    <div className="aspect-square overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                         <div className="h-full flex flex-col justify-center cursor-pointer">
                              <Camera className='mx-auto size-20'/>
                              <div className='text-neutral-300 font-bold text-center text-sm'>QR Scanner</div>
                         </div>
                    </div>
               </AlertDialogTrigger>
               <AlertDialogContent>
                    <AlertDialogHeader>
                         <AlertDialogTitle>QR Scanner</AlertDialogTitle>
                         <AlertDialogDescription>
                              Please Scan your QR code here, trainee!
                         </AlertDialogDescription>
                    </AlertDialogHeader>

                    <Scanner onScan={(result) => {
                         console.log(result);
                         const code = result[0]
                         
                         if (code.format !== "qr_code") {
                              setMessage({
                                   class: 'text-red-500',
                                   content: 'invalid QR code',
                              });
                              return
                         }

                         save(code)
                    }} />
                    <div className={`text-center text-sm ${message?.class}`}>
                         {message?.content}
                    </div>

                    <AlertDialogFooter>
                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}