import { InputHTMLAttributes } from 'react';

export default function TitleInput(props: InputHTMLAttributes<HTMLInputElement>) {
    return <input type="text" placeholder="Insert Title Here" className="w-full text-4xl font-bold outline-none" required {...props} />;
}
