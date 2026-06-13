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
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = formData.get('name') || '未填写';
            const email = formData.get('email') || '未填写';
            const phone = formData.get('phone') || '未填写';
            const message = formData.get('message') || '未填写';
            
            // 构建 mailto 链接
            const subject = '榆城家具 - 客户留言';
            const body = `姓名：${name}\n邮箱：${email}\n电话：${phone}\n留言内容：\n${message}`;
            
            // 跳转到邮箱写信页面
            const mailtoLink = `mailto:yucheng_furniture@qq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            
            // 显示成功提示
            alert('已打开邮箱发送邮件，请将内容发送给我们，感谢您的留言！');
            
            // 清空表单
            this.reset();
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
