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
var dragStartX = 0;
var dragStartY = 0;
var dragTranslateStartX = 0;
var dragTranslateStartY = 0;
var mouseMoved = false;

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
    
    lightboxImg.style.backgroundImage = "url('" + imageSrc + "')";
    lightboxImg.setAttribute('aria-label', caption);
    lightboxImg.style.transform = 'scale(1)';
    lightboxImg.style.cursor = 'zoom-in';
    if (lightboxCaption) {
        lightboxCaption.textContent = caption;
    }
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
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

// 滚轮缩放
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

// 拖拽平移
document.getElementById('lightbox-img').addEventListener('mousedown', function(e) {
    if (lightboxScale <= 1) return;
    e.preventDefault();
    mouseMoved = false;
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
    mouseMoved = true;
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
    }
});

// 双击重置
document.getElementById('lightbox-img').addEventListener('dblclick', function(e) {
    e.preventDefault();
    lightboxScale = 1;
    lightboxTranslateX = 0;
    lightboxTranslateY = 0;
    this.style.cursor = 'zoom-in';
    this.style.transform = 'scale(1)';
});

// 点击背景关闭（拖拽过的点击不关闭）
document.getElementById('lightbox').addEventListener('mousedown', function(e) {
    mouseMoved = false;
});

document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this || e.target.classList.contains('lightbox-caption')) {
        if (!mouseMoved) {
            closeLightbox();
        }
    }
});

// 关闭按钮
document.querySelector('.lightbox-close').addEventListener('click', function(e) {
    e.stopPropagation();
    closeLightbox();
});

// ESC 关闭
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var lightbox = document.getElementById('lightbox');
        if (lightbox.classList.contains('active')) {
            closeLightbox();
        }
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

// 图片防盗与截图保护：阻止右键/拖拽另存、复制图片与页面另存/打印/查看源码
(function() {
    function isProtected(el) {
        var protectedClasses = ['lightbox', 'product-image', 'product-detail-photo', 'hero-photo', 'about-photo'];
        while (el && el !== document.body) {
            if (el.tagName === 'IMG') {
                return true;
            }
            if (el.className) {
                var name = String(el.className);
                for (var i = 0; i < protectedClasses.length; i++) {
                    if (name.indexOf(protectedClasses[i]) !== -1) {
                        return true;
                    }
                }
            }
            el = el.parentNode;
        }
        return false;
    }

    document.addEventListener('contextmenu', function(e) {
        if (isProtected(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('dragstart', function(e) {
        if (isProtected(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('selectstart', function(e) {
        if (isProtected(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('copy', function(e) {
        if (isProtected(e.target)) {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', function(e) {
        var code = e.keyCode || e.which || 0;
        var ctrlOrMeta = e.ctrlKey || e.metaKey;
        if (ctrlOrMeta && (code === 83 || code === 80 || code === 85)) {
            e.preventDefault();
        }
    });

    function protectImages() {
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].setAttribute('draggable', 'false');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectImages);
    } else {
        protectImages();
    }
})();

var mapKeyword = '%E6%A6%86%E5%9F%8E%E5%AE%B6%E5%85%B7';

function getMapUrl(type) {
    if (type === 'amap') {
        return 'https://uri.amap.com/search?keyword=' + mapKeyword;
    }
    if (type === 'tencent') {
        return 'https://apis.map.qq.com/uri/v1/search?keyword=' + mapKeyword + '&boundary=region(%E5%A4%A7%E7%90%86%E5%B8%82)&referer=yu_cheng_furniture';
    }
    if (type === 'baidu') {
        return 'https://map.baidu.com/?querytype=s&wd=' + mapKeyword + '&region=%E4%BA%91%E5%8D%97%E5%A4%A7%E7%90%86%E5%B8%82';
    }
    if (type === 'apple') {
        return 'https://maps.apple.com/?q=' + mapKeyword;
    }
    if (type === 'google') {
        return 'https://www.google.com/maps/search/?api=1&query=' + mapKeyword;
    }
    if (type === 'huawei') {
        return 'https://www.petalmaps.com/?q=' + mapKeyword;
    }
    return '#';
}

function openMap() {
    var modal = document.getElementById('map-modal');
    if (!modal) return;
    var choices = modal.querySelectorAll('[data-map]');
    for (var i = 0; i < choices.length; i++) {
        var type = choices[i].getAttribute('data-map');
        choices[i].setAttribute('href', getMapUrl(type));
    }
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeMap() {
    var modal = document.getElementById('map-modal');
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

function makeAddressClickable() {
    var items = document.querySelectorAll('.contact-item');
    for (var i = 0; i < items.length; i++) {
        var strong = items[i].querySelector('strong');
        if (!strong || strong.textContent !== '\u5730\u5740') continue;
        var copy = items[i].querySelector('.contact-copy');
        if (!copy) continue;
        var p = copy.querySelector('p');
        if (!p || p.querySelector('a')) continue;

        var address = p.textContent.trim();
        var link = document.createElement('a');
        link.href = '#';
        link.className = 'map-link';
        link.setAttribute('aria-label', '\u6253\u5f00\u5730\u56fe');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openMap();
        });
        link.textContent = address;
        p.textContent = '';
        p.appendChild(link);

        var hint = document.createElement('p');
        hint.className = 'contact-hint';
        hint.textContent = '\u70b9\u51fb\u4e0a\u65b9\u5730\u5740\uff0c\u9009\u62e9\u5730\u56fe\u6253\u5f00';
        copy.appendChild(hint);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    makeAddressClickable();

    var modal = document.getElementById('map-modal');
    if (!modal) return;

    var closeBtn = modal.querySelector('.map-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMap);

    var backdrop = modal.querySelector('.map-modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeMap);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeMap();
    });
});
