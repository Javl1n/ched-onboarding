import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import BlockLayout, { BlockAttributes, OnboardingInputAttributes } from "./block-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VideoInput({isNew, ...props}: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
     const inputRef = useRef<HTMLInputElement | null>(null);
     const [previewUrl, setPreviewUrl] = useState<string | null>(props.value as string);

     useEffect(() => {
          const input = inputRef.current;

          if (!input) return;
     
          const handleInputChange = () => {
               setPreviewUrl(input.value.replace("watch?v=", "embed/").replace("view?usp=drive_link", "preview"));
          }
     
          input.addEventListener('input', handleInputChange);
     
          return () => {
               input.removeEventListener('input', handleInputChange);
          }
     }, []);
     
     return (
          <div className="grid gap-2">
               <div className="">
                    <Label>Youtube Link:</Label>
                    <Input ref={inputRef} {...props} />
               </div>
               {previewUrl != null && previewUrl != '' ? 
                    <iframe className="w-full aspect-video rounded-lg"
                         src={`${previewUrl}`}>
                    </iframe> 
               : null}
          </div>
     )
}