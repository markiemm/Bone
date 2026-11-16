//grab user notifications
document.addEventListener('DOMContentLoaded', async () => {
    const notificationDropdown = document.querySelector('#notification-dropdown');
    const notificationContent = notificationDropdown.querySelector('#notification-dropdown-content');
    const notificationIndicator = notificationDropdown.querySelector('#notification-count');

    async function fetchNotifications() {
        try {
            const response = await fetch('/notifications/get?limit=6&unreadonly=true');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            return {
                notifications: result.data.notifications,
                notificationsCount: result.data.notificationsCount,
                unreadCount: result.data.unreadCount
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    function updateNotificationUI(notifications) {
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = '';

        notifications.notifications.forEach(notification => {
            const notificationItem = document.createElement('a');
            notificationItem.href = notification.link || '';
            notificationItem.dataset.id = notification.notificationId;
            notificationItem.className = 'flex items-center gap-3 p-2 hover:bg-base-300';
            notificationItem.innerHTML = `
                ${notification.type === 'system' ? '<i class="fas fa-cog text-xl"></i>' : ''}
                ${notification.type === 'upload' ? '<i class="fas fa-upload text-xl"></i>' : ''}
                ${notification.type === 'account' ? '<i class="fas fa-user text-xl"></i>' : ''}
                ${notification.type === 'security' ? '<i class="fas fa-shield-alt text-xl"></i>' : ''}
                <div class="flex flex-col w-full">
                    <p class="font-medium">${notification.title}</p>
                    <p class="text-sm opacity-60">${notification.message}</p>
                    <p class="text-xs opacity-50">${new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                ${!notification.read ? '<span class="badge badge-primary badge-sm">New</span>' : ''}
            `;
            notificationList.appendChild(notificationItem);
        });

        const unreadCount = notifications.unreadCount;
        if (unreadCount > 0) {
            notificationIndicator.textContent = unreadCount;
            notificationIndicator.style.display = 'inline-block';
        } else {
            notificationIndicator.style.display = 'none';
        }
    }

    function markNotificationAsRead(notificationId) {
        return fetch('/notifications/markRead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notificationId })
        });
    }

    function markAllNotificationsAsRead() {
        return fetch('/notifications/markAllRead', {
            method: 'POST'
        });
    }

    // Event listener for "Mark all as read" button
    document.getElementById('mark-all-read').addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const response = await markAllNotificationsAsRead();
            if (response.ok) {
                const notifications = await fetchNotifications();
                updateNotificationUI(notifications);
            } else {
                console.error('Failed to mark all notifications as read');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    });

    // Event delegation for marking notifications as read
    document.getElementById('notification-list').addEventListener('click', async (event) => {
        const notificationItem = event.target.closest('a[data-id]');
        if (notificationItem) {
            event.preventDefault();
            const notificationId = notificationItem.dataset.id;
            try {
                const response = await markNotificationAsRead(notificationId);
                if (response.ok) {
                    notificationItem.querySelector('.badge').remove(); // Remove "New" badge
                    const notifications = await fetchNotifications();
                    updateNotificationUI(notifications);
                } else {
                    console.error('Failed to mark notification as read');
                }
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    });

    // Fetch and update notifications when the dropdown is opened and on page load
    notificationDropdown.addEventListener('click', async () => {
        const notifications = await fetchNotifications();
        updateNotificationUI(notifications);
    });

    // Also fetch and update notifications on page load
    const notifications = await fetchNotifications();
    updateNotificationUI(notifications);
});