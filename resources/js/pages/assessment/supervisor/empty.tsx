import AppLayout from "@/layouts/app-layout";
import SupervisorAssessmentLayout from "@/layouts/assessment/supervisor-layout";
import { Head } from "@inertiajs/react";

export default function SuperVisorAssessmentIndex() {
     return (
          <AppLayout>
               <Head title="Assessments Empty" />
               <SupervisorAssessmentLayout>
                    <h1 className="text-lg font-bold">No Supervisors</h1>
                    <div>There's no supervisors for this department.</div>
               </SupervisorAssessmentLayout>
          </AppLayout>
     );
}