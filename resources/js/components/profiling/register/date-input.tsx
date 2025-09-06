import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function DateInput ({date, setDate}: {date: Date, setDate: (date: any) => void}) {
     return (
          <Popover>
               <PopoverTrigger asChild>
                    <Button
                         variant="outline"
                         data-empty={!date}
                         className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                    >
                         <CalendarIcon />
                         {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto" align="start">
                    <Calendar classNames={{
                         today: ``,
                         selected: `rounded-md`,
                         chevron: ""
                    }} mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" />
               </PopoverContent>
          </Popover>
     )
}