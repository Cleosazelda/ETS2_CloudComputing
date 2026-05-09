<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rute extends Model
{
    protected $fillable = ['nama_rute', 'asal', 'tujuan', 'map_image_url'];

    public function armadas()
    {
        return $this->hasMany(Armada::class);
    }

    public function jadwals()
    {
        return $this->hasMany(Jadwal::class);
    }
}
