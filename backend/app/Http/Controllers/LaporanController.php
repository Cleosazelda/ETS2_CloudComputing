<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LaporanController extends Controller
{
    public function index()
    {
        return Laporan::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pelapor' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'jenis_insiden' => 'required|in:Macet,Kecelakaan,Kerusakan,Lainnya',
            'deskripsi' => 'required|string',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('laporan-images', 's3');
            $validated['foto_url'] = Storage::disk('s3')->url($path);
        }

        $validated['status'] = 'Menunggu';

        $laporan = Laporan::create($validated);
        return response()->json($laporan, 201);
    }

    public function show(Laporan $laporan)
    {
        return $laporan;
    }

    public function update(Request $request, Laporan $laporan)
    {
        $validated = $request->validate([
            'status' => 'required|in:Menunggu,Diproses,Selesai'
        ]);

        $laporan->update($validated);
        return response()->json($laporan);
    }

    public function destroy(Laporan $laporan)
    {
        $laporan->delete();
        return response()->json(null, 204);
    }
}
