<?php

namespace Database\Seeders;

use App\Models\TraineeProfile;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimeLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profiles = TraineeProfile::all();

        $now = now('Asia/Manila');

        // $lastMonth = $now->copy()->month($now->month - 2);

        // for ($i = 1; $i <= $lastMonth->daysInMonth; $i++) {
        //     $day = $lastMonth->copy()->day($i);

        //     if ($day->isWeekday()) {
        //         $profiles->map(function ($profile) use ($day) {
        //             return $profile->logs()->create([
        //                 "date" => $day->format("Y-m-d"),
        //                 "morning_in" => $day->copy()->hour(8)->minute(0),
        //                 "morning_out" => $day->copy()->hour(12)->minute(1),
        //                 "afternoon_in" => $day->copy()->hour(12)->minute(46),
        //                 "afternoon_out" => $day->copy()->hour(17)->minute(0),
        //                 "hours" => round(495 / 60, 2)
        //             ]);
        //         });
        //     }
        // }

        $lastMonth = $now->copy()->month($now->month - 1);

        for ($i = 1; $i <= $lastMonth->daysInMonth; $i++) {
            $day = $lastMonth->copy()->day($i);

            if ($day->isWeekday()) {
                $profiles->map(function ($profile) use ($day) {
                    return $profile->logs()->create([
                        "date" => $day->format("Y-m-d"),
                        "morning_in" => $day->copy()->hour(8)->minute(0),
                        "morning_out" => $day->copy()->hour(12)->minute(1),
                        "afternoon_in" => $day->copy()->hour(12)->minute(46),
                        "afternoon_out" => $day->copy()->hour(17)->minute(0),
                        "hours" => round(495 / 60, 2)
                    ]);
                });
            }
        }


        for ($i = 1; $i <= $now->day; $i++) {
            $day = $now->copy()->day($i);

            if ($day->isWeekday()) {
                $profiles->map(function ($profile) use ($day) {
                    return $profile->logs()->create([
                        "date" => $day->format("Y-m-d"),
                        "morning_in" => $day->copy()->hour(8)->minute(0),
                        "morning_out" => $day->copy()->hour(12)->minute(1),
                        "afternoon_in" => $day->copy()->hour(12)->minute(46),
                        "afternoon_out" => $day->copy()->hour(17)->minute(0),
                        "hours" => round(495 / 60, 2)
                    ]);
                });
            }
        }
    }
}
