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

    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('.btn-submit');
            const originalText = btn.textContent;
            btn.textContent = '发送中...';
            btn.disabled = true;
            
            const formData = new FormData(this);
            
            fetch('/submit_message', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('留言已提交成功！我们会尽快与您联系。\n\n如需紧急联系，请发送邮件至：yucheng_furniture@qq.com');
                    this.reset();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                // 如果网络错误，提供mailto备选方案
                const name = formData.get('name');
                const email = formData.get('email');
                const phone = formData.get('phone');
                const message = formData.get('message');
                
                const mailtoLink = `mailto:yucheng_furniture@qq.com?subject=榆城家具留言&body=姓名：${encodeURIComponent(name)}%0A邮箱：${encodeURIComponent(email)}%0A电话：${encodeURIComponent(phone)}%0A留言：${encodeURIComponent(message)}`;
                
                alert('网络错误，请点击确定使用邮箱联系我们。');
                window.location.href = mailtoLink;
            })
            .finally(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    }

    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 5px 30px rgba(93, 64, 55, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(93, 64, 55, 0.05)';
        }
    });
});
