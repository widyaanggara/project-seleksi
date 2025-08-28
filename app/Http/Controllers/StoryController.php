<?php

namespace App\Http\Controllers;

use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class StoryController extends Controller
{
    public function index()
    {
        $stories = Story::latest()->get();

        return Inertia::render('Home', [
            'stories' => $stories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'story'   => 'required|string', 
            'avatar'  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'media'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $avatarUrl = '/images/user.png';
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public'); 
            $avatarUrl = Storage::url($path); 
        }

        $mediaUrl = null;
        if ($request->hasFile('media')) {
            $path = $request->file('media')->store('stories', 'public');
            $mediaUrl = Storage::url($path);
        }

        Story::create([
            'name'   => $validated['name'],
            'avatar' => $avatarUrl,
            'story'  => $validated['story'],
            'media'  => $mediaUrl,
        ]);

        return back();
    }

    public function like(Story $story)
    {
        $story->increment('likes');
        return back();
    }

    public function destroy(Story $story)
{
    if ($story->avatar && str_contains($story->avatar, '/storage/')) {
        Storage::delete(str_replace('/storage/', '', $story->avatar));
    }
    if ($story->media && str_contains($story->media, '/storage/')) {
        Storage::delete(str_replace('/storage/', '', $story->media));
    }

    $story->delete();
    return back();
}

}
