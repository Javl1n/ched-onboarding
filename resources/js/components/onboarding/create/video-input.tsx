import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { motion, useTime, useTransform } from 'motion/react';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { BlockAttributes } from './block-layout';

export default function VideoInput({ isNew, ...props }: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(props.value as string);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const time = useTime();
    const rotate = useTransform(time, [0, 1000], [0, 360], { clamp: false });

    useEffect(() => {
        const input = inputRef.current;
        let timeoutId: NodeJS.Timeout;

        if (!input) return;

        const handleInputChange = () => {
            clearTimeout(timeoutId);
            setPreviewUrl(null);
            setIsLoading(true);
            timeoutId = setTimeout(() => {
                setPreviewUrl(input.value.replace('watch?v=', 'embed/').replace('view?usp=drive_link', 'preview'));
                setIsLoading(false);
            }, 500);
        };

        input.addEventListener('input', handleInputChange);

        return () => {
            clearTimeout(timeoutId);
            input.removeEventListener('input', handleInputChange);
        };
    }, []);

    return (
        <div className="grid gap-2">
            <div className="">
                <Label>Youtube Link:</Label>
                <Input ref={inputRef} {...props} />
            </div>
            {previewUrl != null && previewUrl != '' ? <iframe className="aspect-video w-full rounded-lg" src={`${previewUrl}`}></iframe> : null}
            {isLoading ? (
                <div className="flex aspect-video w-full justify-center rounded-lg border">
                    <motion.div className="my-auto" style={{ rotate }}>
                        <LoaderCircle />
                    </motion.div>
                </div>
            ) : null}
        </div>
    );
}
