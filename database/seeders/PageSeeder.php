<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Page;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $page = Page::create([
            "title" => "Commission on Higher Education",
            "slug" => Str::slug("Commission on Higher Education"),
            "department_id" => Department::where('name', 'Admin')->first()->id,
            "published" => true,
        ]);

        $blocks = [
            [
                "type" => "header_one",
                "content" => "Quality Policy Statement",
            ],
            [
                "type" => "paragraph",
                "content" => "<div>We, at the Commission on Higher Education (CHED), shall lead the Philippine higher education sector to:</div><div><ul><li>Cultivate an equitable and sustainable higher education landscape that produces locally responsive, innovative, globally competitive graduate, and lifelong learners;</li></ul><div><ul><li>Harmonize mandates to promote inclusive access to higher education, ensure sustainable quality assurance of programs and assert relevance of institutions;</li><li>Exemplify resilience and humility in service, integrity, excellence, and development driven mindset; and,</li><li>Demonstrate continuous improvement in our Quality Management System to achieve our vision.</li></ul></div></div>",
            ],
            [
                "type" => "header_one",
                "content" => "Mandate",
            ],
            [
                "type" => "paragraph",
                "content" => "<div>The Commission on Higher Education shall:</div><div><ul><li>Promote relevant and quality higher education, ensure that quality higher education is accessible to all who seek it particularly those who may not be able to afford it;</li><li>Guarantee and protect academic freedom for continuing intellectual growth, advancement of learning and research, development, of responsible and effective leadership, education of high-level professionals, and enrichment of historical and cultural heritages; and</li><li>Commit to moral ascendancy that eradicates corrupt practices, institutionalizes transparency and accountability and encourages participatory governance in the Commission and the sub-sector.</li></ul></div>"
            ],
            [
                "type" => "header_one",
                "content" => "Mission",
            ],
            [
                "type" => "paragraph",
                "content" => "To promote equitable access and ensure quality and relevance of higher education institution and their programs."
            ],
            [
                "type" => "header_one",
                "content" => "Vision",
            ],
            [
                "type" => "paragraph",
                "content" => "A Philippine Higher Education system that is accessible, equitable and produces locally responsive, innovative and global competitive graduates and lifelong learners."
            ],
        ];

        foreach ($blocks as $index => $block) {
            $page->blocks()->create([
                "type" => $block['type'],
                "content" => $block['content'],
                "order" => $index,
            ]);
        }
    }
}
