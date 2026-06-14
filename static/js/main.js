function openEmail() {
    var toEmail = 'yucheng_furniture@qq.com';
    var subject = '榆城家具 - 客户咨询';
    var body = '您好，我对榆城家具的产品感兴趣，请问...';
    var isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
    var mailtoLink = 'mailto:' + toEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    if (isMobile) {
        // 手机：mailto 直接打开
        window.location.href = mailtoLink;
    } else {
        // 电脑：先尝试 mailto，检测是否有邮件客户端
        var mailOpened = false;
        
        // 监听窗口失焦，如果失焦说明邮件客户端打开了
        var blurHandler = function() {
            mailOpened = true;
        };
        window.addEventListener('blur', blurHandler, { once: true });
        
        // 用隐藏 iframe 尝试打开 mailto（不会离开当前页面）
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = mailtoLink;
        document.body.appendChild(iframe);
        
        // 800ms 后检查结果
        setTimeout(function() {
            window.removeEventListener('blur', blurHandler);
            document.body.removeChild(iframe);
            
            if (mailOpened) {
                // 邮件客户端已打开，无需额外操作
            } else {
                // 没有邮件客户端，打开QQ邮箱 + 复制邮箱到剪贴板
                navigator.clipboard.writeText(toEmail).then(function() {
                    alert('未检测到邮件客户端\n\n收件人已复制: ' + toEmail + '\n\n在打开的QQ邮箱中粘贴(Ctrl+V)即可');
                }).catch(function() {
                    alert('未检测到邮件客户端\n\n收件人: ' + toEmail + '\n\n在打开的QQ邮箱中手动输入即可');
                });
                window.open('https://mail.qq.com/cgi-bin/frame_html?sid=&r=write', '_blank');
            }
        }, 800);
    }
}

var lightboxScale = 1;
var lightboxTranslateX = 0;
var lightboxTranslateY = 0;
var isDragging = false;
var hasDragged = false;
var dragStartX = 0;
var dragStartY = 0;
var dragTranslateStartX = 0;
var dragTranslateStartY = 0;

function updateLightboxTransform() {
    var lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.style.transform = 'translate(' + lightboxTranslateX + 'px, ' + lightboxTranslateY + 'px) scale(' + lightboxScale + ')';
        lightboxImg.style.transition = 'transform 0.1s ease-out';
    }
}

function openLightbox(imageSrc, caption) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxScale = 1;
    lightboxTranslateX = 0;
    lightboxTranslateY = 0;
    hasDragged = false;
    
    lightboxImg.src = imageSrc;
    lightboxImg.alt = caption;
    lightboxImg.style.transform = 'scale(1)';
    lightboxImg.style.cursor = 'zoom-in';
    if (lightboxCaption) {
        lightboxCaption.textContent = caption;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (hasDragged) return;
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    lightboxScale = 1;
    lightboxTranslateX = 0;
    lightboxTranslateY = 0;
    if (lightboxImg) {
        lightboxImg.style.transform = 'scale(1)';
        lightboxImg.style.cursor = 'zoom-in';
    }
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// 鼠标滚轮缩放
document.getElementById('lightbox-img').addEventListener('wheel', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var delta = e.deltaY > 0 ? -0.15 : 0.15;
    var newScale = lightboxScale + delta;
    newScale = Math.max(0.5, Math.min(5, newScale));
    lightboxScale = newScale;
    
    if (lightboxScale <= 1) {
        lightboxTranslateX = 0;
        lightboxTranslateY = 0;
    }
    
    var lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.style.cursor = lightboxScale > 1 ? 'grab' : 'zoom-in';
    updateLightboxTransform();
});

// 鼠标拖拽平移（仅在放大时）
document.getElementById('lightbox-img').addEventListener('mousedown', function(e) {
    if (lightboxScale <= 1) return;
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragTranslateStartX = lightboxTranslateX;
    dragTranslateStartY = lightboxTranslateY;
    this.style.cursor = 'grabbing';
    this.style.transition = 'none';
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    hasDragged = true;
    lightboxTranslateX = dragTranslateStartX + (e.clientX - dragStartX);
    lightboxTranslateY = dragTranslateStartY + (e.clientY - dragStartY);
    var lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.style.transform = 'translate(' + lightboxTranslateX + 'px, ' + lightboxTranslateY + 'px) scale(' + lightboxScale + ')';
    }
});

document.addEventListener('mouseup', function() {
    if (isDragging) {
        isDragging = false;
        var lightboxImg = document.getElementById('lightbox-img');
        if (lightboxImg) {
            lightboxImg.style.cursor = lightboxScale > 1 ? 'grab' : 'zoom-in';
        }
        setTimeout(function() {
            hasDragged = false;
        }, 100);
    }
});

// 双击重置缩放
document.getElementById('lightbox-img').addEventListener('dblclick', function(e) {
    e.preventDefault();
    lightboxScale = 1;
    lightboxTranslateX = 0;
    lightboxTranslateY = 0;
    this.style.cursor = 'zoom-in';
    this.style.transform = 'scale(1)';
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const woodTabs = document.querySelectorAll('.wood-tab');
    const productCards = document.querySelectorAll('.product-card');

    let activeCategory = '全部';
    let activeWood = '全部';

    const filterProducts = function() {
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardWood = card.dataset.wood;
            
            const categoryMatch = activeCategory === '全部' || cardCategory === activeCategory;
            const woodMatch = activeWood === '全部' || cardWood === activeWood;

            if (categoryMatch && woodMatch) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.category;
            filterProducts();
        });
    });

    woodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            woodTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeWood = this.dataset.wood;
            filterProducts();
        });
    });

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 30px rgba(93, 64, 55, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(93, 64, 55, 0.05)';
        }
    });
});
