<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload a photo to AWS S3.
     */
    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $path = $file->store('photos', 's3');

            // Set visibility to public if needed, or rely on bucket policy
            Storage::disk('s3')->setVisibility($path, 'public');

            // The url() method will use the AWS_URL from environment for CloudFront
            $url = Storage::disk('s3')->url($path);

            return response()->json([
                'message' => 'Photo uploaded successfully.',
                'path' => $path,
                'url' => $url
            ], 201);
        }

        return response()->json(['message' => 'No photo uploaded.'], 400);
    }
}
