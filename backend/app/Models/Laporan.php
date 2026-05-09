<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pelapor',
        'lokasi',
        'jenis_insiden',
        'deskripsi',
        'foto_url',
        'status',
    ];
}
