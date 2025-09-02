<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ['name'];

    public function pages()
    {
        return $this->hasMany(Page::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
