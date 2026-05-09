<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Armada extends Model
{
    protected $fillable = ['nama_armada', 'plat_nomor', 'rute_id', 'armada_image_url', 'status'];

    public function rute()
    {
        return $this->belongsTo(Rute::class);
    }

    public function jadwals()
    {
        return $this->hasMany(Jadwal::class);
    }
}
