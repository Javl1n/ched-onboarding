<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $scales = [
            "Quality of Work" => [
                "The OJT trainee consistently completes assigned tasks in accordance with operational standards, ensuring that work is accuraate, error-free, and aligned with the office quality requirments.",

                "The OJT trainee demonstrates thoroughness and attention to detail by carefully reviewing work, addressing potential issues before submission, and ensuring that all tasks are completed without omissions.",
                
                "The OJT trainee presents work in a neat, organized, and professional manner, following proper formatting and documentation practice to ensure clairty and readability.",

                "The OJT trainee demonstrates a willingness to learn by actively seeking feedback, applying suggestions for improvement, and showing progress in skill development over time.",

                "The OJT trainee manages time effectively by prioritizing tasks, meeting deadlines and maintaining productivity without compromising the quality of work."
            ],

            "Productivity" => [
                "The OJT trainee makes effective use of time by planning work efficiently, avoiding unnecessary delays, and maintaining focus on assigned tasks throughout the workday.",

                "The OJT trainee successfully accomplishes assigned tasks by following instructions, applying learned procedures, and delivering results that.",

                "The OJT trainee completes work assignments promptly, meeting or exceeding agreed deadlines without sacrificing quality or accuracy.",

                "The OJT trainee demonstrates the useful and effective application of acquired knowledge and skills by performing tasks cometently, solving problems effectively, and adapting learned techniquest to various work situations.",

                "The OJT trainee shows a positive work attitude by demonstrating professionalism, cooperating with team members, and maintaining a willingness to contribute to group and commission's goals.",
            ],

            "Work Habits, Talents & Skills" => [
                "The OJT trainee wears appropriate attire at all times, maintaining a professional appearance that reflects the commission's standards.",

                "The OJT trainee adheres to the commission's policies and procedures by following established guidelines,complying with rules, and respecting organizational protocols.",

                "The OJT trainee maintains good attendance and punctuality, arriving on time and being present for the full duration of assigned work hours.",

                "The OJT trainee communicates effectively with guests, supervisors, and coleagues by using clear, respectful, and professional language in both verbal and written forms.",

                "The OJT trainee demonstrates the ability to think independently by making sound decisions, offering practical solutions, and taking initiative when appropriate.",

                "The OJT trainee remains calm and in control when faced with stressful situations, responding professionally and maintaining focus on resolving issues.",
                
                "The OJT trainee shows interest and willingness to learn tasks necessary to maintain operational standards by actively participating in training, asking relevant questions, and applying feedback to improve performance.",
            ],

            "Interpersonal Work Relationship" => [
                "The OJT trainee demonstarates a positive relationship with the estabnlishment's workers by showing respect, maintaining professionalism, and fostering a harmonious work environtment.",
                
                "The OJT trainee relates effectively with visitors by being firendly, approachable, and courteous at all times.",

                "The OJT trainee accepts suggestions, directions, and constructive criticism from employees and supervisors with an open mind and a willingness to improve.",

                "The OJT trainee is a cooperative team player who actively contributes to group tasks, supports colleagues, and works toward common goals.",

                "The OJT trainee shows respect for diversity by valuing differences in background, persepctives, and working styles, and by promoting inclusivity in the workplace."
            ]
        ];

        $text = [
            "What outstanding attributes, technical or personal, does the trainee possess in getting the job done?",

            "What do you think are the trainee's developmental needs, both technical and personal?",

            "Other comments / recommendations",
        ];

        foreach ($scales as $category => $questions) {
            foreach ($questions as $question) {
                \App\Models\Question::create([
                    'content' => $question,
                    'for' => 'supervisor',
                    'type' => 'scale',
                    'category' => $category,
                ]);
            }
        }

        foreach ($text as $question) {
            \App\Models\Question::create([
                'content' => $question,
                'for' => 'supervisor',
                'type' => 'text',
                'category' => 'General',
            ]);
        }

        $scales = [
            "Communication" => [
                "The supervisor clearly explained my tasks and responsibilities.",

                "The supervisor gave instructions that were easy to understand.",
                
                "The supervisor encouraged me to ask questions when I was unsure.",

                "The supervisor listened to my concerns and suggestions.",

                "The supervisor communicated in a respectful and professional manner."
            ],

            "Guidance & Support" => [
                "The supervisor provided adequate guidance to complete my tasks.",

                "The supervisor was approachable when I needed help.",

                "The supervisor was available when I needed clarification.",

                "The supervisor supported my learning and growth as a trainee.",

                "The supervisor encouraged me to improve and learn new skills.",
            ],

            "Feedback & Evaluation" => [
                "The supervisor provided timely feedback on my work.",

                "The supervisor gave constructive criticism that helped me improve.",

                "The supervisor recognized my achievements and contributions.",

                "The supervisor's feedback was fair and objective.",

                "The supervisor set clear performance expectations for me.",
            ],

            "Professionalism & Work Ethics" => [
                "The supervisor treated me and others with respect.",
                
                "The supervisor demonstrated professionalism in the workplace.",

                "The supervisor served as a good role model in terms of work ethics.",

                "The supervisor maintained fairness in dealing with trainees.",

                "The supervisor encouraged discipline and responsibility."
            ],

            "Overall Experience" => [
                "I felt motivated under the supervisor's guidance.",
                
                "I am satisfied with how the supervisor handled my training.",

                "Overall, the supervisor had a positive impact on my OJT experience.",
            ]
        ];

        $text = [
            "What did you appreciate most about the supervisor's way of handling you as a trainee?",

            "In what areas do you think your supervisor can improve?",

            "Do you have any additional comments or suggestions for your supervisor?",
        ];

        foreach ($scales as $category => $questions) {
            foreach ($questions as $question) {
                \App\Models\Question::create([
                    'content' => $question,
                    'for' => 'trainee',
                    'type' => 'scale',
                    'category' => $category,
                ]);
            }
        }

        foreach ($text as $question) {
            \App\Models\Question::create([
                'content' => $question,
                'for' => 'trainee',
                'type' => 'text',
                'category' => 'General',
            ]);
        }
    }
}
