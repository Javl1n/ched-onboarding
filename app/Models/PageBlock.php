<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageBlock extends Model
{
    protected $fillable = ['type', 'content', 'order'];

    public function page()
    {
        return $this->belongsTo(Page::class, 'page_id');
    }
}
