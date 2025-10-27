<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pages = Page::all();

        if ($pages->count() > 0) {
            return redirect()->route('onboarding.show', ['page' => $pages->first()->slug]);
        }

        return inertia('onboarding/empty');
    }

    protected function pageLinks()
    {
        if (auth()->user()->roleIs('admin')) {
            return Page::all();
        }

        return Page::where('published', true)->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('onboarding/create', [
            'pages' => $this->pageLinks(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|string|unique:App\Models\Page,title',
            'blocks' => 'array',
            'blocks.*.type' => 'required|string',
        ];

        foreach ($request->blocks as $index => $block) {
            if ($block['type'] === 'file') {
                $rules["blocks.$index.content"] = 'required|file|mimes:pdf,ppt,docx|max:2048';
            } elseif ($block['type'] === 'image') {
                $rules["blocks.$index.content"] = 'required|file|mimes:png,jpg,jpeg|max:2048';
            } else {
                $rules["blocks.$index.content"] = 'required|string';
            }
        }

        $validator = Validator::make($request->all(), $rules, [], [
            'blocks.*.content' => 'current',
        ]);

        $validator->validate();

        $slug = Str::slug($request->title);

        $page = Page::create([
            'title' => $request->title,
            'slug' => $slug,
            'published' => $request->query('publish') ? true : false,
        ]);

        foreach ($request->blocks as $index => $block) {
            $type = $block['type'];

            if ($type == 'file' | $type == 'image') {

                $content = $request->file("blocks.$index.content")->store('onboarding/'.$page->id);

            } elseif ($type == 'video') {

                $content = $block['content'];
                $content = Str::replace('watch?v=', 'embed/', $content);
                $content = Str::replace('view?usp=drive_link', 'preview', $content);

            } else {

                $content = $block['content'];

            }

            $page->blocks()->create([
                'type' => $type,
                'content' => $content,
                'order' => $index,
            ]);
        }

        return redirect()->route('onboarding.show', ['page' => $page->slug]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Page $page)
    {
        return inertia('onboarding/show', [
            'item' => $page->with(['blocks'])->where('slug', $page->slug)->first(),
            'pages' => $this->pageLinks(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Page $page)
    {
        return inertia('onboarding/edit', [
            'item' => $page->load(['blocks']),
            'pages' => $this->pageLinks(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Page $page)
    {

        $rules = [
            'title' => ['required', Rule::unique('pages', 'title')->ignore($page->id)],
            'blocks' => 'array',
            'blocks.*.type' => 'required|string',
            'blocks.*.isNew' => 'boolean',
            'deleted' => 'array',
            'deleted.*' => 'string',
        ];

        foreach ($request->blocks as $index => $block) {
            if ($request->hasFile("blocks.$index.content")) {
                $rules["blocks.$index.content"] = 'required|file|mimes:png,jpg,jpeg|max:2048';
            } else {
                $rules["blocks.$index.content"] = 'required|string';
            }
        }

        $validator = Validator::make($request->all(), $rules, [], [
            'blocks.*.content' => 'current',
        ]);

        $validator->validate();

        $slug = Str::slug($request->title);

        $page->update([
            'title' => $request->title,
            'slug' => $slug,
            'published' => $request->publish ? true : false,
        ]);

        // update or add new blocks
        foreach ($request->blocks as $index => $block) {
            $type = $block['type'];

            $requestIndex = "blocks.$index.content";

            $content = $block['content'];

            if ($type == 'image') {
                // new input with image
                if ($block['isNew']) {
                    $content = $request->file($requestIndex)->store('onboarding/'.$page->id);
                } else {

                    // old input with new image
                    if ($request->hasFile($requestIndex)) {

                        // delete old file
                        $oldBlock = $page->blocks->find($block['id']);
                        Storage::delete($oldBlock->content);

                        // add new file
                        $content = $request->file($requestIndex)->store('onboarding/'.$page->id);

                    }
                    // old input with no new image no logic
                }
            }

            if ($type == 'video') {
                $content = Str::replace('watch?v=', 'embed/', $content);
                $content = Str::replace('view?usp=drive_link', 'preview', $content);
            }

            // add block
            if ($block['isNew']) {
                $page->blocks()->create([
                    'type' => $type,
                    'content' => $content,
                    'order' => $index,
                ]);
            } else {
                $page->blocks->find($block['id'])->update([
                    'type' => $type,
                    'content' => $content,
                    'order' => $index,
                ]);
            }
        }

        // delete blocks
        foreach ($request->deleted ?? [] as $delete) {
            $deleted = $page->blocks->find($delete);

            // delete old file
            if ($deleted->type == 'image') {
                Storage::delete($deleted->content);
            }

            // delete model
            $deleted->delete();
        }

        return redirect()->route('onboarding.show', ['page' => $page->slug]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Page $page)
    {
        //
    }
}
