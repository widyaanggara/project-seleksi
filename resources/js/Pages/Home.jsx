import React, { useRef, useState } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import Navbar from '../../Components/Navbar'
import { FaCamera, FaUser } from 'react-icons/fa'
import { AiFillLike } from 'react-icons/ai'
import { MdPermMedia } from 'react-icons/md'
import { IoIosClose } from 'react-icons/io'

export default function Home() {
  // setshow modal login
  const [showLogin, setShowLogin] = useState(false)

  //collect data info admin 
  const { stories = [], isAdmin = false } = usePage().props

  // Ref untuk input file media dan avatar
  const fileInputRef = useRef(null)
  const mediaInputRef = useRef(null)
  
  // State untuk preview media dan avatar sebelum di-upload
  const [mediaPreview, setMediaPreview] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)

  // Form data untuk story (nama, story, avatar, media)
  const { data, setData, post, reset, processing, errors } = useForm({
    name: '',
    story: '',
    avatar: null,
    media: null,
  })

  // Form data untuk login admin
  const { data: loginData, setData: setLoginData, post: loginPost, processing: loginProcessing, errors: loginErrors } = useForm({
    username: '',
    password: '',
  })

  // Fungsi membuka file picker untuk avatar
  const handlePickAvatar = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  // Fungsi memilih media (gambar) untuk story
  const handleMediaChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    setData('media', file)
    setMediaPreview(URL.createObjectURL(file))
  }
}

  // Fungsi memilih avatar profil
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('avatar', file) 
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  // Fungsi submit story
  const submit = (e) => {
    e.preventDefault()
    post('/stories', {
      forceFormData: true, // ⬅️ ini wajib untuk file upload
      onSuccess: () => {
        reset('story', 'avatar', 'name')
        setAvatarPreview(null)
        setMediaPreview(null)  
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (mediaInputRef.current) mediaInputRef.current.value = ''
      },
    })
  }

  // Fungsi like story
  const like = (id) => {
    router.post(`/stories/${id}/like`)
  }

  return (
    <main className='mx-auto max-w-2xl py-28 space-y-8 px-6 '>
      <Navbar onOpenLogin={() => setShowLogin(true)} isAdmin={isAdmin} />

      {/* Modal Login admin */}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#2b2b2b] p-6 rounded-lg w-80 space-y-4 relative">
            <h2 className="text-xl font-bold text-center text-white">Admin Login</h2>
      
            {/* Form login admin */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                loginPost('/admin/login', {
                  onSuccess: () => setShowLogin(false)
                })
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData('username', e.target.value)}
                className="w-full p-2 rounded bg-[#474747] text-gray-100"
              />
              {loginErrors.username && <div className="text-red-400 text-sm">{loginErrors.username}</div>}

              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData('password', e.target.value)}
                className="w-full p-2 rounded bg-[#474747] text-gray-100"
              />
              {loginErrors.password && <div className="text-red-400 text-sm">{loginErrors.password}</div>}

              <button
                type="submit"
                disabled={loginProcessing}
                className="w-full bg-[#0891b2] py-2 rounded font-semibold hover:brightness-110 disabled:opacity-60"
              >
                {loginProcessing ? 'Logging in...' : 'Login'}
              </button>
            </form>


            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className='flex flex-col space-y-8 items-center justify-center text-gray-200'>

        <div className='bg-[#2b2b2b] border-[#393939] border w-full flex flex-col gap-1 justify-center items-center p-8 rounded-md'>
          <h1 className='text-3xl font-bold'>Post It, Share Life</h1>
          <p>Ekspresikan pikiran, cerita, dan momenmu dengan cara paling mudah.</p>

          {/* Form Upload Story */}
          <form onSubmit={submit} className='flex flex-col w-full'>
            <div className="flex my-4 gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 flex justify-center items-center bg-[#474747] rounded-full overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                      <FaUser className="text-xl" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handlePickAvatar}
                    className="absolute -right-2 -bottom-2 bg-[#0891b2] p-2 text-sm rounded-full hover:brightness-110 cursor-pointer"
                    aria-label="Upload avatar"
                  >
                    <FaCamera />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              {/* Form Story */}
              <div className="flex flex-col gap-4 flex-grow">
                <input
                  type="text"
                  className="w-full bg-[#474747] rounded-sm p-2 text-gray-100"
                  placeholder="Write your name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && <div className='text-red-400 text-sm'>{errors.name}</div>}

                <textarea
                  className="w-full bg-[#474747] rounded-sm p-2 text-gray-100"
                  placeholder="Write your story"
                  rows={4}
                  value={data.story}
                  onChange={(e) => setData('story', e.target.value)}
                />
                {errors.story && <div className='text-red-400 text-sm'>{errors.story}</div>}
                {errors.avatar && <div className='text-red-400 text-sm'>{errors.avatar}</div>}

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-200 hover:text-[#0891b2] transition-all duration-200">
                    <MdPermMedia size={20} />
                    <span className='font-semibold'>Add Photo</span>
                    <input
                      ref={mediaInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMediaChange}
                    />
                  </label>
                </div>

                {/* Media Postingan Preview */}
                {mediaPreview && (
                  <div className="mt-3 relative inline-block">
                    <div className="relative inline-block">
                      <img
                        src={mediaPreview}
                        alt="media preview"
                        className="rounded-md max-h-64 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaPreview(null)
                          setData('media', null)
                          if (mediaInputRef.current) mediaInputRef.current.value = ''
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-red-600 transition cursor-pointer"
                      >
                        <IoIosClose size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className='bg-[#0891b2] rounded-md p-3 hover:brightness-110 font-semibold cursor-pointer transition-all duration-200 disabled:opacity-60'
            >
              {processing ? 'Posting...' : 'Post a story'}
            </button>
          </form>
        </div>

        <div className='bg-[#2b2b2b] h-[1px] w-full'></div>

        {/* Stories list */}
        <div className='bg-[#2b2b2b] p-8 w-full flex-col rounded-md border-[#393939] border space-y-6'>
          {stories.map((story) => (
            <div key={story.id} className='flex gap-6 items-start border-b border-[#393939] pb-6'>

              {/* Avatar */}
              <div className='w-12 h-12 rounded-full flex-shrink-0 overflow-hidden'>
                <img src={story.avatar} className='rounded-full w-full h-full object-cover' alt="" />
              </div>

              {/* Nama */}
              <div className='flex flex-col gap-2'>
                <div className='font-semibold'>{story.name}</div>
                <div className='text-sm text-gray-300'>
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
                <div>{story.story}</div>

                {story.media && (
                  <div className="mt-2">
                    <img src={story.media} alt="story media"  className="rounded-md max-h-80 object-cover" />
                  </div>
                )}

                {/* Button Like */}
                <button
                  onClick={() => like(story.id)}
                  className='flex gap-2 items-center justify-start hover:text-[#0891b2] transition-all duration-200'
                >
                  <AiFillLike /> <span className='text-sm'>{story.likes}</span>
                </button>
              </div>
            </div>
          ))}

          {stories.length === 0 && (
            <div className='text-center text-gray-400'>Belum ada story, Ayo jadi pertama</div>
          )}
        </div>
      </div>
    </main>
  )
}
