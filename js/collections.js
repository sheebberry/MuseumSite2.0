// show/hide functions
function showSection(sectionId) {
    document.querySelectorAll('#archaeology, #anthropology, #history').forEach(function(section) {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// modal functions
function openModal(selector, trigger) {
    var content = document.querySelector(selector);
    if (!content) return;
    
    document.getElementById('modal-body').innerHTML = content.innerHTML;
    document.getElementById('modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-body').innerHTML = '';
    document.body.style.overflow = '';
}

// click time
document.addEventListener('click', function(e) {
    // opening image on click
    var trigger = e.target.closest('[data-modal-target]');
    if (trigger) {
        e.preventDefault();
        openModal(trigger.getAttribute('data-modal-target'), trigger);
        return;
    }
    
    // closing image time
    if (e.target.id === 'modal' || e.target.classList.contains('close-modal')) {
        closeModal();
    }
});

// show archeology page on first load
document.addEventListener('DOMContentLoaded', function() {
    showSection('archaeology');
});