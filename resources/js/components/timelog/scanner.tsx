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

export default function AttendanceScanner() {
     return (
          <AlertDialog onOpenChange={(open: boolean) => {
               // if (open) reset();
          }}>
               <AlertDialogTrigger asChild>
                    <div className="relative aspect-square p-10 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                         <div className="my-auto">
                              <Camera className='mx-auto size-30'/>
                              <div className='text-neutral-300 font-bold text-center'>QR Scanner</div>
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

                    

                    <AlertDialogFooter>
                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}

