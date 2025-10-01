import { format } from "date-fns";
import { toast } from "sonner";

export default function useToast(url: string, post: (url: string, options?: any) => void){
     toast.promise(
          new Promise((resolve, reject) => {
               post(url, {
                    onSuccess: () => resolve("Assessment Saved!"),
                    onError: () => reject("Something went wrong."),
               });
          }),
          {
               loading: "Saving Assessment...",
               success: (msg) => msg as string,
               error: (msg) => msg as string,
               description: `${format(new Date(), "EEEE, MMMM dd, y 'at' hh:m a")}`
          }
     );
}