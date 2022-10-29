const addDomainBtn = document.getElementById('addDomainBtn');
const domain = document.getElementById('domain');
const active = document.getElementById('isActive');
const isDefault = document.getElementById('isDefault');
const domainError = document.getElementById('domainError');


domain.addEventListener('input', function (event) {
    if (domain.value.length > 0 && new RegExp('^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$').test(domain.value)) {
        addDomainBtn.disabled = false;
        domainError.innerHTML = '';

        
    } else {
        addDomainBtn.disabled = true;
        domainError.innerHTML = 'Please enter a valid domain name without http:// or https:// (e.g. example.com)';
    }
});

addDomainBtn.addEventListener('click', function (event) {
    addDomainBtn.disabled = true;
    addDomainBtn.innerHTML = 'Adding...';
    addDomainBtn.classList.add('loading');
    $.ajax({
        url: '/dashboard/domains/add',
        type: 'POST',
        data: {
            domain: domain.value,
            active: active.checked,
            isDefault: isDefault.checked,
            HTTPS: HTTPS.checked
        },
        success: function (result) {
            window.location.href = '/dashboard/domains';
        },

        error: function (result) {
            addDomainBtn.disabled = false;
            addDomainBtn.innerHTML = 'Add';
            addDomainBtn.classList.remove('loading');
            domainError.innerHTML = result.responseText;
        }
    });
});