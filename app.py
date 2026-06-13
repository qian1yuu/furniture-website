from flask import Flask, render_template

app = Flask(__name__)

furniture_products = [
    {
        'id': 1,
        'name': '现代真皮沙发',
        'price': 12800,
        'category': '沙发',
        'image': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        'description': '简约现代设计，优质真皮材质，舒适坐感'
    },
    {
        'id': 2,
        'name': '实木餐桌',
        'price': 6800,
        'category': '餐桌',
        'image': 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400',
        'description': '北美胡桃木，环保涂装，适合6人用餐'
    },
    {
        'id': 3,
        'name': '人体工学办公椅',
        'price': 3200,
        'category': '椅子',
        'image': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
        'description': '可调节腰靠，透气网布，长时间办公首选'
    },
    {
        'id': 4,
        'name': '北欧风格床',
        'price': 15800,
        'category': '床',
        'image': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
        'description': '白蜡木框架，软包床头，高箱储物设计'
    },
    {
        'id': 5,
        'name': '智能书柜',
        'price': 4500,
        'category': '柜子',
        'image': 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
        'description': '多层收纳，隐藏式把手，LED感应灯'
    },
    {
        'id': 6,
        'name': '创意茶几',
        'price': 2800,
        'category': '茶几',
        'image': 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400',
        'description': '岩板台面，金属框架，现代轻奢风格'
    },
    {
        'id': 7,
        'name': '布艺餐椅',
        'price': 890,
        'category': '椅子',
        'image': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
        'description': '高回弹海绵，亚麻布料，可叠放设计'
    },
    {
        'id': 8,
        'name': '衣柜',
        'price': 9800,
        'category': '柜子',
        'image': 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400',
        'description': '推拉门设计，分区合理，内置穿衣镜'
    }
]

categories = ['全部', '沙发', '床', '餐桌', '椅子', '柜子', '茶几']

@app.route('/')
def index():
    return render_template('index.html', products=furniture_products, categories=categories)

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
