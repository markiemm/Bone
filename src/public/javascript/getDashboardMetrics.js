document.addEventListener('DOMContentLoaded', () => {
    fetch('/dashboard/metrics')
        .then(response => response.json())
        .then(data => {
            const totalStorageUsedElem = document.getElementById('quota_used');
            const totalUploadsElem = document.getElementById('total_uploads');
            const totalImagesElem = document.getElementById('total_images');
            const totalVideosElem = document.getElementById('total_videos');
            const totalLinksElem = document.getElementById('total_links');
            const totalFilesElem = document.getElementById('total_files');

            totalImagesElem.textContent = data.metrics.totalImages;
            totalVideosElem.textContent = data.metrics.totalVideos;
            totalLinksElem.textContent = data.metrics.totalLinks;
            totalFilesElem.textContent = data.metrics.totalFiles;

            totalStorageUsedElem.textContent = `${data.metrics.totalStorageUsedFormatted} / 100GB`;
            totalUploadsElem.textContent = data.metrics.totalUploads;
        })
        .catch(error => {
            console.error('Error fetching dashboard metrics:', error);
        });
});