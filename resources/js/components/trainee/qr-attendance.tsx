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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { SharedData } from "@/types";
import { useState } from "react";
import QRCode from "react-qr-code";
import { format } from "date-fns";

export default function QrAttendance() {
     const {auth: {user}} = usePage<SharedData>().props;

     const [ code, setCode ] = useState<string>(
          user.id + "|" + new Date().toISOString()
     );

     return (
          <AlertDialog onOpenChange={() => {
               setCode(user.id + "|" + new Date().toISOString());
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
                              This QR Code is only valid for 1 minute.
                         </AlertDialogDescription>
                    </AlertDialogHeader>

                    <QRCode value={code} className="w-full h-full" />

                    <AlertDialogFooter>
                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                         <Button onClick={() => setCode(user.id + "|" + new Date().toISOString())}>New Code</Button>
                    </AlertDialogFooter>
               </AlertDialogContent>
          </AlertDialog>
     )
}