<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UploadController;
use App\Http\Controllers\RuteController;
use App\Http\Controllers\ArmadaController;
use App\Http\Controllers\JadwalController;
use App\Http\Controllers\LaporanController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/upload-photo', [UploadController::class, 'uploadPhoto']);

Route::apiResource('rutes', RuteController::class);
Route::apiResource('armadas', ArmadaController::class);
Route::apiResource('jadwals', JadwalController::class);
Route::apiResource('laporans', LaporanController::class);
