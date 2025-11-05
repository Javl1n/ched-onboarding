import { Camera } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '../../ui/alert-dialog';

import timelog from '@/routes/timelog';
import { router } from '@inertiajs/react';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

export default function AttendanceScanner() {
    const [message, setMessage] = useState<{
        class: string;
        content: string;
    } | null>(null);

    const save = (result: IDetectedBarcode) => {
        router.post(
            timelog.post(),
            {
                code: result.rawValue,
            },
            {
                onError: (error) =>
                    setMessage({
                        class: 'text-red-500',
                        content: error.code,
                    }),
                onSuccess: () =>
                    setMessage({
                        class: 'text-green-500',
                        content: 'Scan Complete',
                    }),
            },
        );
    };

    return (
        <AlertDialog
            onOpenChange={(open: boolean) => {
                // if (open) reset();
            }}
        >
            <AlertDialogTrigger asChild>
                <div className="group relative min-w-[180px] flex-1 cursor-pointer overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-background to-muted/20 p-4 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border">
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                        <Camera className="size-8 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">QR Scanner</div>
                    </div>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>QR Scanner</AlertDialogTitle>
                    <AlertDialogDescription>Please Scan your QR code here, trainee!</AlertDialogDescription>
                </AlertDialogHeader>

                <Scanner
                    onScan={(result) => {
                        console.log(result);
                        const code = result[0];

                        if (code.format !== 'qr_code') {
                            setMessage({
                                class: 'text-red-500',
                                content: 'invalid QR code',
                            });
                            return;
                        }

                        save(code);
                    }}
                />
                <div className={`text-center text-sm ${message?.class}`}>{message?.content}</div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
