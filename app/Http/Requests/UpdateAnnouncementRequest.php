<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAnnouncementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        $announcement = $this->route('announcement');

        // Admins can update any announcement
        if ($user->role === 'admin') {
            return true;
        }

        // Supervisors can only update their own announcements
        if ($user->role === 'supervisor' && $announcement->user_id === $user->id) {
            // Check if trying to change department
            $departmentId = $this->input('department_id');
            if ($departmentId !== null && $departmentId !== $user->department_id) {
                return false;
            }

            return true;
        }

        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'min:10'],
            'priority' => ['required', 'in:low,normal,high,urgent'],
            'status' => ['required', 'in:draft,published'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'expires_at' => ['nullable', 'date', 'after:now'],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The announcement title is required.',
            'title.max' => 'The announcement title must not exceed 255 characters.',
            'content.required' => 'The announcement content is required.',
            'content.min' => 'The announcement content must be at least 10 characters.',
            'priority.required' => 'Please select a priority level.',
            'priority.in' => 'The selected priority is invalid.',
            'status.required' => 'Please select a status.',
            'status.in' => 'The selected status is invalid.',
            'department_id.exists' => 'The selected department does not exist.',
            'expires_at.date' => 'The expiration date must be a valid date.',
            'expires_at.after' => 'The expiration date must be in the future.',
        ];
    }
}
