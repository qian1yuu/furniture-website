from flask import Flask, render_template

app = Flask(__name__)

furniture_products = [
    {
        'id': 1,
        'name': '编号1 - 古典雕花茶几',
        'price': 18800,
        'category': '茶几',
        'wood': '红椿木',
        'image': '/static/images/微信图片_20260614033122_333_2.jpg',
        'description': '精雕细琢，传统工艺，红椿木材质，花纹精美'
    },
    {
        'id': 2,
        'name': '编号2 - 雕花供桌',
        'price': 35800,
        'category': '供桌',
        'wood': '楸木',
        'image': '/static/images/微信图片_20260614033123_334_2.jpg',
        'description': '繁复雕花，庄重典雅，楸木材质，寓意吉祥'
    },
    {
        'id': 3,
        'name': '编号3 - 古典沙发组合',
        'price': 68000,
        'category': '沙发',
        'wood': '楠木',
        'image': '/static/images/微信图片_20260614033124_335_2.jpg',
        'description': '龙凤呈祥，大气磅礴，楠木材质，尊贵典雅'
    },
    {
        'id': 4,
        'name': '编号4 - 龙纹雕花长椅',
        'price': 28800,
        'category': '长椅',
        'wood': '红椿木',
        'image': '/static/images/微信图片_20260614033125_336_2.jpg',
        'description': '双龙戏珠，镶嵌云石，红椿木材质，工艺精湛'
    },
    {
        'id': 5,
        'name': '编号5 - 吉祥如意沙发',
        'price': 56800,
        'category': '沙发',
        'wood': '楸木',
        'image': '/static/images/微信图片_20260614033127_338_2.jpg',
        'description': '松鹤延年，吉祥如意，楸木材质，寓意美好'
    }
]

categories = ['全部', '茶几', '供桌', '沙发', '长椅']
wood_types = ['全部', '红椿木', '楸木', '楠木']

@app.route('/')
def index():
    return render_template('index.html', products=furniture_products, categories=categories, wood_types=wood_types)

@app.route('/product/<int:product_id>')
def product_detail(product_id):
    product = next((p for p in furniture_products if p['id'] == product_id), None)
    if product:
        return render_template('product.html', product=product)
    return "产品未找到", 404

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
