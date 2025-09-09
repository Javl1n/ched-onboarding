<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('time_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainee_id')->constrained('trainee_profiles', 'id')->cascadeOnDelete();
            $table->date("date");
            $table->unique(['date', 'trainee_id']);
            $table->time("morning_in")->nullable();
            $table->time("morning_out")->nullable();
            $table->time("afternoon_in")->nullable();
            $table->time("afternoon_out")->nullable();
            $table->float("hours")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_logs');
    }
};
