import React, { useState } from 'react'
import { usePage, router } from '@inertiajs/react'

export default function Admin() {
    const { stories = [] } = usePage().props

    // State filter all | full | media
    const [filter, setFilter] = useState('all') 

    // Filter stories
    const fullStories = stories.filter(s => s.story) 
    const storiesWithMedia = stories.filter(s => s.media) 

    // Untuk filter All / Full Story / Media Only
    const filteredStories =
        filter === 'full' ? fullStories :
        filter === 'media' ? storiesWithMedia : stories

    const totalLikes = stories.reduce((acc, s) => acc + (s.likes || 0), 0)

    const deleteStory = (id) => {
        if (confirm('Yakin mau hapus story ini?')) {
            router.delete(`/admin/stories/${id}`)
        }
    }

    // Fungsi logout
    const handleLogout = () => {
        if (confirm('Yakin ingin logout?')) {
            router.post('/logout')
        }
    }

    return (
        <main className="max-w-5xl mx-auto py-12 px-6 text-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                {/* Tombol Logout */}
                <button
                    onClick={handleLogout}
                    className="bg-[#0891b2] px-4 py-2 rounded hover:brightness-110 cursor-pointer"
                >
                    Logout
                </button>
            </div>

            {/* Statistik */}
            <div className="flex gap-6 mb-8">
                <div className="bg-[#2b2b2b] p-4 rounded-lg flex-1 text-center">
                    <div className="text-2xl font-bold">{stories.length}</div>
                    <div className="text-gray-400">Total Postingan</div>
                </div>
                <div className="bg-[#2b2b2b] p-4 rounded-lg flex-1 text-center">
                    <div className="text-2xl font-bold">{storiesWithMedia.length}</div>
                    <div className="text-gray-400">Total Media</div>
                </div>
                <div className="bg-[#2b2b2b] p-4 rounded-lg flex-1 text-center">
                    <div className="text-2xl font-bold">{totalLikes}</div>
                    <div className="text-gray-400">Total Likes</div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-4 mb-6">
                {['all', 'full', 'media'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded ${
                            filter === f ? 'bg-[#0891b2] text-white' : 'bg-[#393939] text-gray-200'
                        }`}
                    >
                        {f === 'all' ? 'All' : f === 'full' ? 'Full Story' : 'Media'}
                    </button>
                ))}
            </div>

            {/* Content */}
            {filter !== 'media' ? (
                <div className="space-y-6">
                    {filteredStories.map(story => (
                        <div key={story.id} className="bg-[#2b2b2b] p-4 rounded-lg border border-[#393939]">
                            <div className="flex items-start gap-4">
                                <img
                                    src={story.avatar}
                                    alt=""
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="font-semibold">{story.name}</div>
                                    {story.story && <div className="text-sm text-gray-400">{story.story}</div>}
                                    {story.media && (
                                        <img
                                            src={story.media}
                                            className="mt-2 rounded-lg max-h-64 object-cover"
                                            alt="story media"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between mt-3 items-center">
                                <div className="text-gray-400 text-sm">Likes: {story.likes || 0}</div>
                                <button
                                    onClick={() => deleteStory(story.id)}
                                    className="bg-[#0891b2] px-4 py-2 rounded hover:brightness-110"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
            <div className="grid grid-cols-3 gap-4">
                {storiesWithMedia.map(story => (
                    <img
                        key={story.id}
                        src={story.media}
                        className="rounded-lg object-cover h-64 w-full"
                        alt="media"
                    />
                ))}
            </div>
        )}
    </main>
  )
}
