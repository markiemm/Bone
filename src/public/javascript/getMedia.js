document.addEventListener('DOMContentLoaded', () => {
    //get page query parameters
    const page_param = new URLSearchParams(window.location.search).get('page') || 1;
    const client_param = new URLSearchParams(window.location.search).get('client') || '';
    const sortBy_param = new URLSearchParams(window.location.search).get('sortBy') || '';
    const sortOrder_param = new URLSearchParams(window.location.search).get('sortOrder') || '';
    const date_param = new URLSearchParams(window.location.search).get('date') || '';
    fetchMedia(page_param, client_param, sortBy_param, sortOrder_param, date_param);
});

async function fetchMedia(page, client, sortBy, sortOrder, date) {
    let url = `/dashboard/getmedia?page=${page}`;
    if (client) url += `&client=${client}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;
    if (date) url += `&date=${date}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched media data:', data);
        renderMedia(data.uploads);
    } catch (error) {
        console.error('Error fetching media:', error);
    }
}

function renderMedia(uploads) {

    console.log('Rendering media uploads:', uploads);
    const mediaContainer = document.getElementById('media-container');
    mediaContainer.innerHTML = '';





    uploads.forEach(upload => {
        const uploadCard = document.createElement('div');
        uploadCard.className = 'flex w-full flex-col gap-4 indicator';

        let filePreview = '';
        if (upload.metadata.mimetype.startsWith('image/')) {
            filePreview = `
            <figure>
                <img src="/storage/${upload.owner}/uploads/${upload.storedFilename}" alt="${upload.filename}" class="w-full">
            </figure>
            <span class="indicator-item absolute top-5 right-7 badge badge-outline badge-xl opacity-80"><i class="fas fa-image"></i></span>
            `
        } else if (upload.metadata.mimetype.startsWith('video/')) {
        const videoId = `video-player-${upload.shortId}`;
        filePreview = `
                    <div class="relative rounded-xl overflow-hidden">
                        <video id="${videoId}" class="video-js vjs-theme-sea rounded-xl vjs-fill" controls preload="auto">
                            <source src="/storage/${upload.owner}/uploads/${upload.storedFilename}" type="${upload.metadata.mimetype}" />
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

        mediaContainer.appendChild(uploadCard);

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
                wavesurfer.load(`/storage/${upload.owner}/uploads/${upload.storedFilename}`);
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

}