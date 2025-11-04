document.getElementById('menu-icon').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('main-content').classList.toggle('shifted');
});

// 確保點擊選單外部時，選單也會關閉
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const menuIcon = document.getElementById('menu-icon');

    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        document.getElementById('main-content').classList.remove('shifted');
    }
});