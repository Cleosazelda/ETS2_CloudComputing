<?php

namespace App\Http\Controllers;

use App\Models\Armada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArmadaController extends Controller
{
    public function index()
    {
        return Armada::with('rute')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_armada' => 'required|string|max:255',
            'plat_nomor' => 'required|string|max:255',
            'rute_id' => 'required|exists:rutes,id',
            'status' => 'nullable|in:Beroperasi,Mogok,Perbaikan',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('armada-images', 's3');
            $validated['armada_image_url'] = Storage::disk('s3')->url($path);
        }

        $armada = Armada::create($validated);
        return response()->json($armada, 201);
    }

    public function show(Armada $armada)
    {
        return $armada->load('rute');
    }

    public function update(Request $request, Armada $armada)
    {
        $validated = $request->validate([
            'nama_armada' => 'sometimes|string|max:255',
            'plat_nomor' => 'sometimes|string|max:255',
            'rute_id' => 'sometimes|exists:rutes,id',
            'status' => 'sometimes|in:Beroperasi,Mogok,Perbaikan',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('armada-images', 's3');
            $validated['armada_image_url'] = Storage::disk('s3')->url($path);
        }

        $armada->update($validated);
        return response()->json($armada);
    }

    public function destroy(Armada $armada)
    {
        $armada->delete();
        return response()->json(null, 204);
    }
}
