<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
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
            'content' => ['required', 'string', 'min:10', 'max:1000'],
            'for' => ['required', 'in:trainee,supervisor'],
            'type' => ['required', 'in:text,scale'],
            'category' => ['required', 'string', 'max:255'],
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
            'content.required' => 'The question content is required.',
            'content.min' => 'The question must be at least 10 characters.',
            'content.max' => 'The question must not exceed 1000 characters.',
            'for.required' => 'Please specify who this question is for.',
            'for.in' => 'Question must be for either trainee or supervisor.',
            'type.required' => 'Please select a question type.',
            'type.in' => 'Question type must be either text or scale.',
            'category.required' => 'Please specify a category.',
            'category.max' => 'Category must not exceed 255 characters.',
        ];
    }
}
