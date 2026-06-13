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
