import { AssessmentInterface } from '@/types';
import { usePage } from '@inertiajs/react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

export default function AssessmentChart() {
    const { assessments } = usePage<{
        assessments: AssessmentInterface[];
    }>().props;

    const assessmentScores = assessments.reduce<{
        [key: string]: { value: number; count: number };
    }>((accumulator, currentAssessment) => {
        const category = currentAssessment.question.category;

        if (currentAssessment.question.type !== 'scale') {
            return accumulator;
        }

        if (!accumulator[category]) {
            accumulator[category] = { value: 0, count: 0 };
        }

        accumulator[category] = { value: accumulator[category].value + parseInt(currentAssessment.value), count: accumulator[category].count + 1 };

        return accumulator;
    }, {});

    const chartConfig = {
        score: {
            label: 'Score',
            color: '#0ccb1fff',
        },
    } satisfies ChartConfig;

    const data = [
        ...Object.keys(assessmentScores).map((category) => ({
            category: category,
            score: assessmentScores[category].value / assessmentScores[category].count,
            fullMark: 5,
        })),
    ];


    if (data.length > 0)
    {
        return (
            <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={data}>
                    <XAxis dataKey="category" />
                    <YAxis dataKey={'fullMark'} />
                    <ChartTooltip content={<ChartTooltipContent className='bg-background' />} />
                    <Bar
                        dataKey="score"
                        fill="var(--color-score)"
                        // fillOpacity={0.6}
                    />
                </BarChart>
            </ChartContainer>
        );
    } else {
        return (
            <div className='h-full'>
                <div className='text-sm font-bold text-center'>
                    No Assessments Yet
                </div>
            </div>
        )
    }
}
