import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

export default function DateInput({ date, setDate }: { date: Date; setDate: (date: any) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="bg-white w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-0 p-0" align="start">
                <Calendar
                    className="rounded-xl text-white shadow-lg bg-gradient-to-br from-blue-100 to-blue-700"
                    classNames={{
                        today: `bg-white/20 rounded text-white`,
                        selected: `rounded-md bg text-blue-500 font-semibold`,
                        chevron: 'text-white',
                    }}
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    captionLayout="dropdown"
                />
            </PopoverContent>
        </Popover>
    );
}
