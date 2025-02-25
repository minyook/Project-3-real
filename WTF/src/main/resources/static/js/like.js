// 하트 클릭 기능 (찜 토글)
document.querySelectorAll('.heart-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// 찜한 목록만 보기 기능
function toggleLikedItems() {
    const allItems = document.querySelectorAll('.like-item');
    const isFiltering = document.querySelector('.toggle-btn').classList.toggle('active');

    if (isFiltering) {
        allItems.forEach(item => {
            const heart = item.querySelector('.heart-icon');
            if (!heart.classList.contains('active')) {
                item.style.display = 'none';
            }
        });
    } else {
        allItems.forEach(item => item.style.display = 'flex');
    }
}