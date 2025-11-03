import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputHTMLAttributes } from 'react';
import { BlockAttributes } from './block-layout';

export default function FileInput({ isNew, ...props }: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
    return (
        <div className="grid gap-2">
            <Label>File Attachment:</Label>
            <Input type="file" {...props} />
        </div>
    );
}
