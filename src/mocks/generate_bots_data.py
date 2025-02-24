import json
import random
from datetime import datetime, timedelta

def generate_bot_data():
    # Số lượng bot
    NUM_BOTS = 30
    # Số ngày dữ liệu
    NUM_DAYS = 30
    
    # Ngày bắt đầu
    start_date = datetime(2025, 2, 1)
    
    # Danh sách bot
    bots_data = []
    
    # Tạo danh sách xu hướng bot để đảm bảo tỷ lệ bot thắng/thua
    bot_trends = []
    num_positive_bots = 20  # Số bot muốn có xu hướng tích cực
    
    # Tạo xu hướng tích cực cho 20 bot
    for _ in range(num_positive_bots):
        bot_trends.append(random.uniform(0.5, 3))
    
    # Tạo xu hướng tiêu cực cho 10 bot còn lại
    for _ in range(NUM_BOTS - num_positive_bots):
        bot_trends.append(random.uniform(-3, -0.5))
    
    # Xáo trộn danh sách xu hướng
    random.shuffle(bot_trends)
    
    for bot_idx in range(NUM_BOTS):
        # Lấy xu hướng cho bot hiện tại
        bot_trend = bot_trends[bot_idx]
        
        # Balance ban đầu ngẫu nhiên từ 8000 đến 15000
        initial_balance = random.randint(8000, 15000)
        current_balance = initial_balance
        
        # Tạo dữ liệu hàng ngày cho bot
        daily_stats = []
        
        for day in range(NUM_DAYS):
            current_date = start_date + timedelta(days=day)
            
            # Tạo profit_percent với xu hướng của bot
            # Tăng cơ hội profit dương bằng cách điều chỉnh phạm vi
            if bot_trend > 0:
                base_profit = random.uniform(-4, 8)  # Thiên về profit dương
            else:
                base_profit = random.uniform(-8, 4)  # Thiên về profit âm
                
            profit_percent = base_profit + bot_trend
            profit_percent = round(profit_percent, 2)
            
            # Tính net_profit dựa trên profit_percent
            net_profit = round((current_balance * profit_percent) / 100)
            
            # Cập nhật balance
            current_balance += net_profit
            
            # Tạo winrate phù hợp với profit_percent
            base_winrate = 68  # Tăng tỷ lệ thắng cơ bản lên
            winrate_variation = profit_percent * 1.2  # Giảm biến động để ổn định hơn
            winrate = base_winrate + winrate_variation
            winrate = round(min(max(winrate, 58), 78), 2)  # Tăng khoảng winrate lên
            
            daily_stat = {
                "date": current_date.strftime("%Y-%m-%d"),
                "net_profit": net_profit,
                "profit_percent": profit_percent,
                "winrate": winrate,
                "balance": round(current_balance)
            }
            daily_stats.append(daily_stat)
        
        bot_data = {
            "name": f"bot_{str(bot_idx + 1).zfill(3)}",
            "daily_stats": daily_stats
        }
        bots_data.append(bot_data)
    
    return bots_data

# Tạo dữ liệu
bots_data = generate_bot_data()

# Ghi ra file
with open('randomBotsData.js', 'w') as f:
    f.write('export const botsData = ')
    json.dump(bots_data, f, indent=2)
    f.write(';')

print("Đã tạo xong file randomBotsData.js") 