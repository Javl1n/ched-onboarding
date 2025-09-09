<?php

namespace App\Http\Controllers;

use App\Models\TraineeProfile;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class TimeLogController extends Controller
{
    public function store(Request $request)
    {
        $code = str($request->code)->explode('|');
        
        $trainee = TraineeProfile::find($code[0]);
        $qrTime = $this->createDateObjectISO($code[1])->setTimezone("Asia/Manila");
        $now = now('Asia/Manila');

        // validate qr code
        if ($trainee == null || !$qrTime) {
            return back()->withErrors([
                "code" => "Invalid QR Code"
            ]);
        }

        // validate time
        if ($qrTime->diffInSeconds($now) > 60) {
            return back()->withErrors([
                "code" => "QR Code Expired",
            ]);
        }

        $log = $trainee->logToday();

        // dd($now->day(1)->hour(8)->minute(01)->format("Y-m-d H:i:s"));
        
        // too early
        if ($now->hour < 7)
        {
            return back()->withErrors([
                "code" => "You're too early!"
            ]);
        }

        // m
        if ($now->hour < 12) {
            // mi
            if ($log->morning_in !== null) {
                return back()->withErrors([
                    "code" => "You've  already timed in for this morning, wait for 12:01 pm to time out."
                ]);
            }

            // !mi
            $log->update([
                "morning_in" => $qrTime
            ]);

            return response(status: 200);
        }

        // !mi && !m
        if ($log->morning_in === null) {
            return back()->withErrors([
                "code" => "You've been recorded as absent today, your hours will not be counted."
            ]);
        }

        // n
        if ($now->hour == 12 && $now->minute < 46) {
            // mo
            if ($log->morning_out !== null) {
                return back()->withErrors([
                    "code" => "You've already timed out this morning, wait for 12:46 pm to time in."
                ]);
            }
            // !mo
            $log->update([
                "morning_out" => $qrTime
            ]);

            return response(status: 200);
        }


        // !mo && !n
        if ($log->morning_out === null) {
            $log->update([
                "morning_out" => $qrTime
            ]);
        }
        

        // a
        if ($now->hour < 17) {
            // ai
            if ($log->afternoon_in !== null) {
                return back()->withErrors([
                    "code" => "You've already timed in this afternoon, wait for 5:00 pm to time out."
                ]);
            }

            // !ai
            $log->update([
                "afternoon_in" => $qrTime,
            ]);

            return response(status: 200);
        }
        
        // !a && !ai
        if ($log->afternoon_in === null) {
            return back()->withErrors([
                "code" => "You've been recorded as absent this afternoon.",
            ]);
        }

        // e
        // !ao
        if ($log->afternoon_out === null) {
            $log->update([
                "afternoon_out" => $qrTime,
            ]);


            // total time:
            $mi = $this->createDateObjectSQL($log->morning_in);
            $mo = $this->createDateObjectSQL($log->morning_out);
            $ai = $this->createDateObjectSQL($log->afternoon_in);
            $ao = $this->createDateObjectSQL($log->afternoon_out);
            $total = 0;

            if ($mi && $mo) {
                $total += $mo->diffInHours($mi); // morning hours
            }

            if ($ai && $ao) {
                $total += $ao->diffInHours($ai); // afternoon hours
            }

            $log->update([
                "total" => round($total, 2)
            ]);

            
            return response(status: 200);
        }

        return back()->withErrors([
            "code" => "You've already timed out for today, enjoy your evening",
        ]);
    }

    protected function createDateObjectSQL($date)
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $date);
    }

    protected function createDateObjectISO($date)
    {
        return Carbon::createFromFormat('Y-m-d\TH:i:s.u\Z', $date);
    }
}
