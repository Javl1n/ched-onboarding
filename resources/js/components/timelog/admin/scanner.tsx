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
        bgClass: string;
        textClass: string;
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
                        bgClass: 'bg-red-500/10',
                        textClass: 'text-red-600 dark:text-red-400',
                        content: error.code,
                    }),
                onSuccess: () =>
                    setMessage({
                        bgClass: 'bg-green-500/10',
                        textClass: 'text-green-600 dark:text-green-400',
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
                <div className="group relative min-w-[180px] flex-1 cursor-pointer overflow-hidden rounded-xl border border-sidebar-border bg-linear-to-br from-purple-50 to-purple-100 p-4 shadow-sm transition-all hover:shadow-md dark:from-purple-950/50 dark:to-purple-900/50">
                    <div className="flex h-full flex-col items-center justify-center gap-2">
                        <Camera className="size-8 text-purple-700 transition-colors group-hover:text-purple-800 dark:text-purple-300 dark:group-hover:text-purple-200" />
                        <div className="text-xs font-semibold tracking-wide text-purple-800 uppercase dark:text-purple-200">QR Scanner</div>
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
                                bgClass: 'bg-red-500/10',
                                textClass: 'text-red-600 dark:text-red-400',
                                content: 'invalid QR code',
                            });
                            return;
                        }

                        save(code);
                    }}
                />
                {message && (
                    <div className={`rounded-lg border p-4 text-center text-sm font-medium ${message.bgClass} ${message.textClass}`}>
                        {message.content}
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
