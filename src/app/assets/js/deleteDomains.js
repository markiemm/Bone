const deleteBtn = document.getElementById('delete-#{domain.id}')

deleteBtn.addEventListener('click', () => {
    const domainId = deleteBtn.id.split('-')[1]

    console.log("hit")
    
    $.ajax({
        url: '/dashboard/domains/delete/' + domainId,
        type: 'DELETE',
        success: function(result) {
            window.location.reload()
        },

        error: function(err) {
            console.log(err)
        }
    })
})