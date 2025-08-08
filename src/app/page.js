'use client';

import { useState } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { MdLibraryMusic, MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";

export default function Home() {
	const [mood, setMood] = useState('');
	const [loading, setLoading] = useState(false);
	const [songs, setSongs] = useState([]);
	const [currentSongIndex, setCurrentSongIndex] = useState(0);

	const handleSubmit = async () => {
		if (!mood.trim()) return;

		setLoading(true);
		setSongs([]);

		const res = await fetch('/api/mood', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ mood }),
		});

		const data = await res.json();
		if (data?.songs) {
			setSongs(data.songs);
			setCurrentSongIndex(0);
		}

		setLoading(false);
	};

	return (
		<div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center px-4 lg:px-16 py-20">
			{/* Glow Effects */}
			<div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-purple-600 rounded-full blur-3xl opacity-30 z-0"></div>
			<div className="absolute top-20 -right-40 w-[300px] h-[300px] bg-pink-500 rounded-full blur-2xl opacity-20 z-0"></div>
			<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[160px] opacity-10 z-0"></div>

			{/* Header */}
			<div className='flex gap-6 items-center'>
				<MdLibraryMusic className='text-4xl md:text-5xl lg:text-8xl'/>
				<h1 className="text-4xl md:text-5xl lg:text-8xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">
					Mood Music AI
				</h1>
			</div>

			{/* Prompt Box */}
			<div className="w-full max-w-2xl mt-10">
				<div className="flex items-center backdrop-blur-sm bg-white/5 border border-white/10 rounded-full px-4 py-2 shadow-xl focus-within:ring-2 focus-within:ring-purple-500 transition">
					<input
						type="text"
						value={mood}
						onChange={(e) => setMood(e.target.value)}
						placeholder="Describe your mood (e.g., feeling nostalgic but peaceful)..."
						className="flex-grow bg-transparent text-white placeholder:text-gray-400 text-lg focus:outline-none px-6 py-4"
					/>
					<button
						onClick={handleSubmit}
						disabled={loading}
						className="bg-white text-black size-12 flex items-center justify-center rounded-full group hover:bg-purple-300 backdrop-blur-lg transition cursor-pointer"
						aria-label="Generate Playlist"
					>
						<FaArrowRight className='group-hover:-rotate-45 transition'/>
					</button>
				</div>

				{loading && (
					<div className="text-xl text-center text-purple-300 mt-10 animate-pulse">
						🎶 Generating mood-based playlist ...
					</div>
				)}
			</div>
			
			{/* Songs List and Player UI */}
			{songs.length > 0 && (
				<div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-10 backdrop-blur-lg bg-white/5 border border-white/10 mt-12 rounded-2xl p-4 md:p-8 shadow-xl'>
					{/* Sticky Player */}
					<div className="">
						<div className="lg:mt-8 flex flex-col gap-6">
							<iframe
								
								src={`https://www.youtube.com/embed/${getYouTubeId(songs[currentSongIndex].link)}?autoplay=1`}
								title="YouTube video player"
								allow="autoplay; encrypted-media"
								allowFullScreen
								className='w-full h-full aspect-video rounded-lg shadow-lg'
							></iframe>
							<div className="flex gap-10 justify-center">
								<button
									onClick={() =>
										setCurrentSongIndex((prev) => (prev > 0 ? prev - 1 : songs.length - 1))
									}
									className='bg-white p-3 rounded-full flex items-center justify-center hover:bg-purple-300 transition cursor-pointer text-3xl text-black'
								>
									<MdKeyboardDoubleArrowLeft />
								</button>
								<button
									onClick={() =>
										setCurrentSongIndex((prev) => (prev + 1) % songs.length)
									}
									className='bg-white p-3 rounded-full flex items-center justify-center hover:bg-purple-300 transition cursor-pointer text-3xl text-black'
								>
									<MdKeyboardDoubleArrowRight />
								</button>
							</div>
						</div>
					</div>

					{	/* Songs List */}
					<div className="w-full space-y-6 transition-all duration-500">
						<h2 className="text-2xl font-semibold text-center lg:text-left text-purple-300">Your Songs</h2>
						<ul className="space-y-4">
							{songs.map((song, index) => (
								<li
									key={index}
									className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 py-2 pl-2 pr-4 rounded-xl hover:bg-white/20 transition"
								>
									{/* Thumbnail */}
									<img
										src={song.thumbnail}
										alt={song.title}
										className="aspect-square md:aspect-video h-full md:h-20 rounded-md object-cover"
									/>

									<div className='flex flex-col gap-2 md:justify-between md:flex-row w-full'>
										{/* Song Info */}
										<div className="flex-1">
											<p className="text-sm md:text-base text-white font-semibold font-poppins">{song.title}</p>
											<p className="text-xs md:text-sm text-gray-300 font-poppins">{song.artist}</p>
										</div>

										{/* Play Button */}
										<a
											href={song.link}
											target="_blank"
											rel="noopener noreferrer"
											className="group flex items-center justify-center bg-white hover:bg-purple-300 text-black rounded-full px-3 py-2 hover:pr-5 transition-all duration-300 overflow-hidden shadow-md
													md:pl-3 md:pr-3 md:hover:pr-5"
											title="Play on YouTube"
										>
											<FaArrowRight className="text-black text-xs md:text-base -rotate-45 transition-transform duration-500 md:group-hover:-rotate-45" />

											{/* Always show text on small screens, only show on hover in md+ */}
											<span className="text-xs md:text-base font-poppins font-medium ml-2 transition-all duration-300 whitespace-nowrap
															max-w-xs opacity-100 
															md:max-w-0 md:overflow-hidden md:group-hover:max-w-xs md:opacity-0 md:group-hover:opacity-100">
												Open in YouTube
											</span>
										</a>
									</div>
									
								</li>
							))}
						</ul>
					</div>

					
				</div>
			)}
		</div>
	);
}

function getYouTubeId(url) {
	const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
	return match ? match[1] : '';
}
