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
    
    for bot_idx in range(NUM_BOTS):
        # Tạo xu hướng riêng cho mỗi bot (-2 đến +2)
        bot_trend = random.uniform(-2, 2)
        
        # Balance ban đầu ngẫu nhiên từ 8000 đến 15000
        initial_balance = random.randint(8000, 15000)
        current_balance = initial_balance
        
        # Tạo dữ liệu hàng ngày cho bot
        daily_stats = []
        
        for day in range(NUM_DAYS):
            current_date = start_date + timedelta(days=day)
            
            # Tạo profit_percent với xu hướng của bot
            base_profit = random.uniform(-6, 6)
            profit_percent = base_profit + bot_trend
            profit_percent = round(profit_percent, 2)
            
            # Tính net_profit dựa trên profit_percent
            net_profit = round((current_balance * profit_percent) / 100)
            
            # Cập nhật balance
            current_balance += net_profit
            
            # Tạo winrate phù hợp với profit_percent
            base_winrate = 65  # Tỷ lệ thắng trung bình mục tiêu
            winrate_variation = profit_percent * 1.5  # Biến động dựa trên profit
            winrate = base_winrate + winrate_variation
            winrate = round(min(max(winrate, 55), 75), 2)  # Giới hạn trong khoảng 55-75%
            
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