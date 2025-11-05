import { Input } from '@/components/ui/input';
import { CloudUpload } from 'lucide-react';
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { BlockAttributes } from './block-layout';

export default function ImageInput({ isNew = true, value, ...props }: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(!isNew ? `/private/${value as string}` : null);

    useEffect(() => {
        const input = fileInputRef.current;

        if (!input) return;

        const handleFileChange = () => {
            const file = input.files?.[0];
            console.log(file);
            if (file) {
                const image = URL.createObjectURL(file);
                setPreviewUrl(image);
            }
        };

        input.addEventListener('change', handleFileChange);

        return () => {
            input.removeEventListener('change', handleFileChange);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            {previewUrl === null ? (
                <div className="flex items-center justify-center">
                    <label
                        onClick={handleClick}
                        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card transition-colors hover:bg-muted"
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <CloudUpload className="mb-4 h-8 w-8 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PNG or JPG(MAX. 800x400px)</p>
                        </div>
                    </label>
                </div>
            ) : (
                <div className="flex">
                    <label onClick={handleClick} className="cursor-pointer">
                        <img src={previewUrl} className="max-h-120 rounded" alt="" />
                    </label>
                </div>
            )}

            <Input type="file" ref={fileInputRef} className="hidden" {...props} />
        </>
    );
}
