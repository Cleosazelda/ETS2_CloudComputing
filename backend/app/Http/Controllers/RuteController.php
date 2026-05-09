<?php

namespace App\Http\Controllers;

use App\Models\Rute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RuteController extends Controller
{
    public function index()
    {
        return Rute::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_rute' => 'required|string|max:255',
            'asal' => 'required|string|max:255',
            'tujuan' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('rute-images', 's3');
            $validated['map_image_url'] = Storage::disk('s3')->url($path);
        }

        $rute = Rute::create($validated);
        return response()->json($rute, 201);
    }

    public function show(Rute $rute)
    {
        return $rute;
    }

    public function update(Request $request, Rute $rute)
    {
        $validated = $request->validate([
            'nama_rute' => 'sometimes|string|max:255',
            'asal' => 'sometimes|string|max:255',
            'tujuan' => 'sometimes|string|max:255',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('rute-images', 's3');
            $validated['map_image_url'] = Storage::disk('s3')->url($path);
        }

        $rute->update($validated);
        return response()->json($rute);
    }

    public function destroy(Rute $rute)
    {
        $rute->delete();
        return response()->json(null, 204);
    }
}
