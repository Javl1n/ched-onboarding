import { InputHTMLAttributes } from 'react';
import { BlockAttributes } from './block-layout';

export default function HeaderTwoInput({ isNew, ...props }: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
    return <input className="w-full rounded p-3 text-2xl font-bold outline-none" placeholder="Header Here" type="text" {...props} />;
}
