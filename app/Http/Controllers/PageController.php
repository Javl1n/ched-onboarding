<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Fluent;
use Illuminate\Support\Str;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pages = Page::all();

        
        if ($pages->count() > 0) {
            return redirect()->route('onboarding.show', ['slug' => $pages->first()->slug]);
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
            'title' => 'required|string|unique:App\Models\Page,title',
            'department' => 'required|exists:App\Models\Department,id',
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

        $slug = Str::slug($request->title);

        $page = Page::create([
            'title' => $request->title,
            'slug' => $slug,
            'published' => $request->query('publish') ? true : false,
            'department_id' => $request->department,
        ]);

        
        foreach ($request->blocks as $index => $block) {
            $type = $block['type'];

            if ($type == 'file' | $type == 'image') {

                $content = $request->file("blocks.$index.content")->store($slug);
                
            } elseif ($type == 'video') {
                
                $content = $block['content'];
                $content = Str::replace("watch?v=", "embed/", $content);
                $content = Str::replace("view?usp=drive_link", "preview", $content);

            } else {

                $content = $block['content'];
                
            }

            $page->blocks()->create([
                'type' => $type,
                'content' => $content,
                'order' => $index,
            ]);
        }

        return redirect()->route('onboarding.show', ['slug', $page->slug]);
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
