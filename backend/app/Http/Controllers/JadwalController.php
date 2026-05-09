<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Illuminate\Http\Request;

class JadwalController extends Controller
{
    public function index()
    {
        return Jadwal::with(['armada', 'rute'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'armada_id' => 'required|exists:armadas,id',
            'rute_id' => 'required|exists:rutes,id',
            'waktu_berangkat' => 'required',
            'waktu_tiba' => 'required'
        ]);

        $jadwal = Jadwal::create($validated);
        return response()->json($jadwal, 201);
    }

    public function show(Jadwal $jadwal)
    {
        return $jadwal->load(['armada', 'rute']);
    }

    public function update(Request $request, Jadwal $jadwal)
    {
        $validated = $request->validate([
            'armada_id' => 'sometimes|exists:armadas,id',
            'rute_id' => 'sometimes|exists:rutes,id',
            'waktu_berangkat' => 'sometimes',
            'waktu_tiba' => 'sometimes'
        ]);

        $jadwal->update($validated);
        return response()->json($jadwal);
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();
        return response()->json(null, 204);
    }
}
