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
                alert(data.message);
                if (data.success) {
                    this.reset();
                }
            })
            .catch(error => {
                alert('提交失败，请稍后重试');
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
