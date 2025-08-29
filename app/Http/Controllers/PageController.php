<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Fluent;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pages = Page::all();

        if ($pages->count() > 0) {
            return redirect()->route('pages.show', ['slug' => $pages->first()->slug]);
        }

        return inertia('onboarding/empty');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('onboarding/create', [
            'departments' => Department::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|string',
            'blocks' => 'array',
            'blocks.*.type' => 'required|string',
        ];
        
        foreach ($request->blocks as $index => $block) {
            if ($block['type'] === 'file') {
                $rules["blocks.$index.content"] = 'required|file|mimes:pdf,ppt,docx|max:2048';
            } elseif ($block['type'] === 'image') {
                $rules["blocks.$index.content"] = 'required|file|mimes:png,jpg,jpeg|max:2048';
            } else  {
                $rules["blocks.$index.content"] = 'required|string';
                
            }
        }
        
        $validator = Validator::make($request->all(), $rules, [], [
            'blocks.*.content' => "current"
        ]);
        
        $validator->validate();
        


    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        //
    }
}
