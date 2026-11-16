//get recent uploads and populate the dashboard
document.addEventListener('DOMContentLoaded', () => {
    fetch('/dashboard/recentuploads')
        .then(response => response.json())
        .then(data => {
            const recentUploadsGrid = document.getElementById('recent_uploads_grid');
            recentUploadsGrid.innerHTML = ''; // Clear existing content

            console.log('Recent uploads data received:', data);

            data.uploads.forEach(upload => {
                const uploadCard = document.createElement('div');
                uploadCard.className = 'flex w-full flex-col gap-4 indicator';

                let filePreview = '';
                if (upload.metadata.mimetype.startsWith('image/')) {
                    filePreview = `
                    <figure>
                        <img src="/storage/${data.user}/uploads/${upload.storedFilename}" alt="${upload.filename}" class="w-full">
                    </figure>
                    <span class="indicator-item absolute top-5 right-7 badge badge-outline badge-xl opacity-80"><i class="fas fa-image"></i></span>
                    `
                } else if (upload.metadata.mimetype.startsWith('video/')) {
                const videoId = `video-player-${upload.shortId}`;
                filePreview = `
                            <div class="relative rounded-xl overflow-hidden">
                                <video id="${videoId}" class="video-js vjs-theme-sea rounded-xl vjs-fill" controls preload="auto">
                                    <source src="/storage/${data.user}/uploads/${upload.storedFilename}" type="${upload.metadata.mimetype}" />
                                    Your browser does not support the video tag.
                                </video>
                                
                            </div>
                            <span class="indicator-item absolute top-5 right-7 badge badge-outline badge-xl opacity-80"><i class="fas fa-video"></i></span>
                            `;
                } else if (upload.metadata.mimetype.startsWith('audio/')) {
                    const audioId = `audio-player-${upload.shortId}`;
                    //use wavesurfer.js for audio preview
                    filePreview = `
                            <div id="${audioId}" class="w-full h-24 rounded-xl"></div>
                            <span class="indicator-item absolute top-5 right-7 badge badge-outline badge-xl opacity-80"><i class="fas fa-music"></i></span>
                            <button id="${audioId}-play" class="btn btn-circle btn-sm">
                                <i class="fas fa-play"></i>
                            </button>
                            `;
                } else {
                    filePreview = `<div class="h-32 w-full flex items-center justify-center bg-gray-200">
                                       <i class="fas fa-file-alt text-4xl text-gray-500"></i>
                                   </div>
                                   <span class="indicator-item absolute top-5 right-7 badge badge-outline badge-xl opacity-80"><i class="fas fa-file-alt"></i></span>
                                   `;
                }

                uploadCard.innerHTML = `
                    
                    ${filePreview}
                    
                    <div>
                        <a class="card-title link link-hover" href="/upload/${upload.shortId}">${upload.filename}</a>
                        <p>Uploaded on: ${new Date(upload.createdAt).toLocaleDateString()}</p>
                        <p>${upload.metadata.formattedSize}</p>
                    </div>
                `;

                recentUploadsGrid.appendChild(uploadCard);

                // Initialize video.js for video elements after they're added to the DOM
                if (upload.metadata.mimetype.startsWith('video/')) {
                    const videoId = `video-player-${upload.shortId}`;
                    // Wait for video.js to be available
                    if (typeof videojs !== 'undefined') {
                        videojs(videoId, {
                            fluid: true,
                            responsive: true
                        });
                    }
                }

                // Initialize WaveSurfer for audio elements after they're added to the DOM
                if (upload.metadata.mimetype.startsWith('audio/')) {
                    const audioId = `audio-player-${upload.shortId}`;
                    // Wait for WaveSurfer to be available
                    if (typeof WaveSurfer !== 'undefined') {
                        const wavesurfer = WaveSurfer.create({
                            container: `#${audioId}`,
                            waveColor: '#A8DBA8',
                            progressColor: '#3B8686',
                            height: 96,
                            responsive: true,
                            barWidth: 2,
                            barGap: 1,
                            barRadius: 2
                        });
                        wavesurfer.load(`/storage/${data.user}/uploads/${upload.storedFilename}`);
                        const playButton = document.getElementById(`${audioId}-play`);
                        playButton.addEventListener('click', () => {
                            wavesurfer.playPause();
                            if (wavesurfer.isPlaying()) {
                                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                            } else {
                                playButton.innerHTML = '<i class="fas fa-play"></i>';
                            }
                        });
                        //if audio ends, reset play button
                        wavesurfer.on('finish', () => {
                            playButton.innerHTML = '<i class="fas fa-play"></i>';
                        });
                    }

                }
            });
        })
        .catch(error => {
            console.error('Error fetching recent uploads:', error);
        });
});