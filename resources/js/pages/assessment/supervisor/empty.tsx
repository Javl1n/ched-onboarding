import AppLayout from '@/layouts/app-layout';
import SupervisorAssessmentLayout from '@/layouts/assessment/supervisor-layout';
import { Head } from '@inertiajs/react';
import { UserX } from 'lucide-react';

export default function SuperVisorAssessmentIndex() {
    return (
        <AppLayout>
            <Head title="Assessments Empty" />
            <SupervisorAssessmentLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="max-w-md text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-muted p-6">
                                <UserX className="size-16 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-foreground">No Supervisors Available</h2>
                        <p className="text-muted-foreground">
                            There are currently no supervisors assigned to your department. Please contact your administrator if
                            you believe this is an error.
                        </p>
                    </div>
                </div>
            </SupervisorAssessmentLayout>
        </AppLayout>
    );
}
