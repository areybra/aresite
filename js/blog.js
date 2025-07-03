// Blog functionality
const posts = [
    {
        id: 1,
        title: "The Emergence of Areya in Valiant Roleplay",
        image: "images/profile.jpg",
        date: "2025-07-03",
        category: "Story"
    }
];

function renderPosts() {
    const container = document.getElementById('blog-posts-container');
    container.innerHTML = '';
    
    // Add typing animation to title
    const title = document.querySelector('.typing-text');
    const texts = ["Our Latest Posts", "Blog & Articles", "Media Center"];
    let currentTextIndex = 0;
    
    function typeText(element, text, speed) {
        let i = 0;
        element.textContent = '';
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }
    
    typeText(title, texts[currentTextIndex], 100);
    
    setInterval(() => {
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        typeText(title, texts[currentTextIndex], 100);
    }, 3000);
    
    // Add loading animation temporarily
    container.innerHTML = `
        <div class="loading-animation">
            <div class="cube"></div>
            <div class="cube"></div>
            <div class="cube"></div>
        </div>
    `;
    
    // Simulate loading delay
    setTimeout(() => {
        container.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post newspaper-fold';
            postElement.style.animationDelay = `${posts.indexOf(post) * 0.1}s`;
            postElement.innerHTML = `
                <div class="blog-post-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-post-content">
                    <h3 class="blog-post-title">${post.title}</h3>
                    <div class="blog-post-meta">
                        <span class="blog-post-date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span class="blog-post-category">${post.category}</span>
                    </div>
                    <a href="blog-detail.html?id=${post.id}" class="read-more-btn">Read More →</a>
                </div>
            `;
            container.appendChild(postElement);
        });
    }, 1000);
}

document.addEventListener('DOMContentLoaded', renderPosts);