import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { AssessmentInterface } from "@/types";
import { usePage } from "@inertiajs/react";

export default function AssessmentChart() {
     const {assessments} = usePage<{
          assessments: AssessmentInterface[]
     }>().props;

     const assessmentScores = assessments.reduce<{
          [key: string]: {value: number, count: number}
     }>((accumulator, currentAssessment) => {
          const category = currentAssessment.question.category;

          if (currentAssessment.question.type !== "scale") {
               return accumulator;
          }

          if (!accumulator[category]) {
               accumulator[category] = {value: 0, count: 0};
          }

          accumulator[category] = { value: accumulator[category].value + parseInt(currentAssessment.value), count: accumulator[category].count + 1 };

          return accumulator;
     }, {});

     const chartConfig = {
          score: {
               label: "Score",
               color: "#2563eb",
          },
     } satisfies ChartConfig;

     const data = [
          ...Object.keys(assessmentScores).map((category) => ({
               category: category,
               score: assessmentScores[category].value / assessmentScores[category].count,
               fullMark: 5
          }))
     ]

     return (
          <ChartContainer config={chartConfig}>
               <RadarChart data={data}>
                    <PolarAngleAxis dataKey="category" tickFormatter={(value) => value.split(" ")[0]} />
                    <PolarGrid />
                    <PolarRadiusAxis type="number" angle={90} axisLine={false} hide={true} domain={[0, 5]}/>
                    <ChartTooltip content={<ChartTooltipContent/>} />
                    <Radar
                         dot
                         dataKey="score"
                         fill="var(--color-score)"
                         fillOpacity={0.6}
                    />
               </RadarChart>
          </ChartContainer>
     )
}