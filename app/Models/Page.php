<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['title', 'slug', 'published', 'department_id'];


    public function blocks()
    {
        return $this->hasMany(PageBlock::class, 'page_id');
    }
}
