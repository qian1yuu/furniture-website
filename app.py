from flask import Flask, render_template, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.header import Header

app = Flask(__name__)

# 邮箱配置
EMAIL_HOST = 'smtp.qq.com'
EMAIL_PORT = 465
EMAIL_USER = 'yucheng_furniture@qq.com'
EMAIL_PASSWORD = ''  # 请在QQ邮箱设置中获取授权码，不要提交到GitHub

def send_email(name, email, phone, message):
    try:
        # 邮件内容
        mail_content = f"""
尊敬的榆城家具：

您收到了一条新的留言：

姓名：{name}
邮箱：{email}
电话：{phone}
留言内容：
{message}

来自榆城家具官网
        """
        
        msg = MIMEText(mail_content, 'plain', 'utf-8')
        msg['Subject'] = Header('榆城家具 - 新留言', 'utf-8')
        msg['From'] = EMAIL_USER
        msg['To'] = EMAIL_USER
        
        # 发送邮件（添加超时）
        server = smtplib.SMTP_SSL(EMAIL_HOST, EMAIL_PORT, timeout=10)
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_USER, [EMAIL_USER], msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"发送邮件失败: {e}")
        return False

furniture_products = [
    {
        'id': 1,
        'name': '编号1 - 古典雕花茶几',
        'price': 18800,
        'category': '茶几',
        'wood': '红椿木',
        'image': '/static/images/茶几.jpg',
        'description': '精雕细琢，传统工艺，红椿木材质，花纹精美'
    },
    {
        'id': 2,
        'name': '编号2 - 雕花供桌',
        'price': 35800,
        'category': '供桌',
        'wood': '红椿木',
        'image': '/static/images/红椿供桌.jpg',
        'description': '繁复雕花，庄重典雅，红椿木材质，寓意吉祥'
    },
    {
        'id': 3,
        'name': '编号3 - 古典龙椅茶几组合',
        'price': 68000,
        'category': '长椅',
        'wood': '红椿木',
        'image': '/static/images/龙椅茶几组合.jpg',
        'description': '龙凤呈祥，大气磅礴，红椿木材质，尊贵典雅'
    },
    {
        'id': 4,
        'name': '编号4 - 吉祥如意沙发',
        'price': 28800,
        'category': '长椅',
        'wood': '红椿木',
        'image': '/static/images/椿凳茶几组合.jpeg',
        'description': '双龙戏珠，镶嵌云石，红椿木材质，工艺精湛'
    },
    {
        'id': 5,
        'name': '编号5 - 龙纹雕花长椅',
        'price': 56800,
        'category': '龙椅',
        'wood': '红椿木',
        'image': '/static/images/大龙椅.jpg',
        'description': '松鹤延年，吉祥如意，红椿木材质，寓意美好'
    },
    {
        'id': 6,
        'name': '编号6 - 红椿木三人座梅花椅',
        'price': 52800,
        'category': '龙椅',
        'wood': '红椿木',
        'image': '/static/images/梅花大椅.jpg',
        'description': '吉祥如意，镶嵌云石，红椿木材质，雕刻精美'
    },
    {
        'id': 7,
        'name': '编号7 - 楸木供桌',
        'price': 42800,
        'category': '供桌',
        'wood': '楸木',
        'image': '/static/images/楸木供桌.jpg',
        'description': '花开富贵，精雕细琢，楸木材质，典雅大气'
    },
    {
        'id': 8,
        'name': '编号8 - 红椿木花架',
        'price': 6800,
        'category': '花架',
        'wood': '红椿木',
        'image': '/static/images/花架.jpg',
        'description': '莲花雕刻，精致典雅，红椿木材质，高贵大方'
    },
    {
        'id': 9,
        'name': '编号9 - 梅花小椅（无大理石）',
        'price': 78800,
        'category': '龙椅',
        'wood': '红椿木',
        'image': '/static/images/梅花小椅无大理石.jpg',
        'description': '吉祥如意，双龙护主，红椿木材质，精雕细琢，工艺精湛'
    },
    {
        'id': 10,
        'name': '编号10 - 梅花小椅（有大理石）',
        'price': 128800,
        'category': '龙椅',
        'wood': '红椿木',
        'image': '/static/images/梅花小椅有大理石.jpg',
        'description': '吉祥如意，镶嵌云石，红椿木材质，尊贵典雅'
    }
]

categories = ['全部', '茶几', '供桌',  '龙椅', '条案', '花架']
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

@app.route('/submit_message', methods=['POST'])
def submit_message():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone', '')
        message = request.form.get('message')
        
        if not name or not email or not message:
            return jsonify({'success': False, 'message': '请填写必填字段'})
        
        # 始终返回成功，前台异步尝试发送邮件
        return jsonify({
            'success': True, 
            'message': '留言已提交！我们会尽快与您联系。',
            'email': 'yucheng_furniture@qq.com'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'提交失败: {str(e)}'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
