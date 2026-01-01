<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderQuestionsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.id' => ['required', 'exists:questions,id'],
            'questions.*.order' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'questions.required' => 'No questions provided for reordering.',
            'questions.array' => 'Invalid question data format.',
            'questions.min' => 'At least one question is required.',
            'questions.*.id.required' => 'Question ID is required.',
            'questions.*.id.exists' => 'One or more questions do not exist.',
            'questions.*.order.required' => 'Order is required for each question.',
            'questions.*.order.integer' => 'Order must be a valid number.',
            'questions.*.order.min' => 'Order must be at least 1.',
        ];
    }
}
