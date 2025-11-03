import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import trainees from '@/routes/trainees';
import { SharedData, User } from '@/types';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';

export function MonthPagination() {
    const { month: monthString, year: yearString, trainee } = usePage<SharedData & { month: string; year: string; trainee: User }>().props;
    const month = parseInt(monthString);
    const year = parseInt(yearString);

    const prev = {
        query: {
            month: month - 1 <= 0 ? 12 : month - 1,
            year: month - 1 <= 0 ? year - 1 : year,
        },
    };

    const next = {
        query: {
            month: month + 1 > 12 ? 1 : month + 1,
            year: month + 1 > 12 ? year + 1 : year,
        },
    };

    return (
        <div className="">
            <Pagination className="md:justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious size="sm" href={trainees.show.log(trainee, prev).url} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" size="sm">
                            {format(new Date(year, month - 1, 1), 'MMMM y')}
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext size="sm" href={trainees.show.log(trainee, next).url} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
