import { usePage } from "@inertiajs/react";
import { 
     AlertDialog, 
     AlertDialogCancel, 
     AlertDialogContent, 
     AlertDialogDescription, 
     AlertDialogFooter, 
     AlertDialogHeader, 
     AlertDialogTitle, 
     AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SharedData } from "@/types";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { format } from "date-fns";

export default function QrAttendance() {
     const {auth: {user}} = usePage<SharedData>().props;

     const time = 60;
     const [timer, setTimer] = useState<number>(time);

     const reset = () => {
          setDate(new Date());
          setTimer(time);
     }

     const [ date, setDate ] = useState<Date>(
          new Date()
     );

     useEffect(() => {
          const countdown = setInterval(() => {
               setTimer(prev => prev - 1);
               if (timer <= 0) {
                    reset()
               }
          }, 1000);

          return () => clearInterval(countdown);

     }, [timer]);

     return (
          <AlertDialog onOpenChange={(open: boolean) => {
               if (open) reset();
          }}>
               <AlertDialogTrigger asChild>
                    <Button>
                         Attendance
                    </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                    <AlertDialogHeader>
                         <AlertDialogTitle>QR Attendance</AlertDialogTitle>
                         <AlertDialogDescription>
                              Current QR Time: {format(date, 'hh:mm aaa')}
                              <br /> 
                              This QR Code resets in {timer} second/s. 
                         </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="bg-white p-1">
                         <QRCode value={user.profile?.id + "|" + date.toISOString()} className="w-full h-full" />
                    </div>

                    <AlertDialogFooter>
                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                         {/* <Button onClick={() => reset()}>New Code</Button> */}
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}