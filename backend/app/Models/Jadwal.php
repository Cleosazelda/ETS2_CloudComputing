<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jadwal extends Model
{
    protected $fillable = ['armada_id', 'rute_id', 'waktu_berangkat', 'waktu_tiba'];

    public function armada()
    {
        return $this->belongsTo(Armada::class);
    }

    public function rute()
    {
        return $this->belongsTo(Rute::class);
    }
}
