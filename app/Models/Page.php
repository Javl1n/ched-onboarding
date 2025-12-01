<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['title', 'slug', 'published'];

    public function blocks()
    {
        return $this->hasMany(PageBlock::class, 'page_id');
    }

    public static function getSidebarModels()
    {
        $pages = Page::all();
        // dd(auth()->user());

        if (auth()->user()?->roleIs('admin')) {
            return $pages;
        } else {
            return $pages->where('published', true);
        }
    }
}
