import backtrader as bt
import yfinance as yf
import re
import google.generativeai as genai
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from datetime import datetime


# Configure the Generative AI model
MODEL_ID = "models/gemini-2.0-flash"
API_KEY = "ENTER API_KEY HERE"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(MODEL_ID)




# ====== 1. Get Strategy Code from Gemini ======
def get_strategy_code_from_gemini(user_input: str):
   prompt = f"""
You are a financial assistant that writes Backtrader strategies.


Take this user request: "{user_input}"
Generate a complete Backtrader strategy (Python) using bt.Strategy with these requirements:
1. Initial capital is $100
2. Only whole share orders (no fractional shares)
3. Must include both buy and sell logic
4. Strategy should have at least one indicator (like SMA, RSI, etc.)
5. Include proper order management (check for pending orders)
6. Include logging of trades
7. Output only valid Python code (no explanation or markdown formatting)
"""
   response = model.generate_content(prompt)
   strategy_code = response.text.strip()
   strategy_code = strategy_code.replace("```python", "").replace("```", "")
   return strategy_code


# ====== 2. Convert Gemini Output into a Strategy Class ======
def create_strategy_from_code(code_string: str):
   local_scope = {}
   try:
       exec(code_string, globals(), local_scope)
       for obj in local_scope.values():
           if isinstance(obj, type) and issubclass(obj, bt.Strategy):
               return obj
       raise ValueError("No valid strategy class found in Gemini output.")
   except Exception as e:
       raise ValueError(f"Error creating strategy from code: {str(e)}")


# ====== 3. Remove extraneous main execution block ======
def extract_strategy_only(code_str: str) -> str:
   main_block_start = code_str.find("if __name__ == '__main__':")
   return code_str[:main_block_start].strip() if main_block_start != -1 else code_str.strip()


# ====== 4. Main Workflow ======
def full_workflow(user_input: str):
   # Extract ticker and dates
   ticker_match = re.search(r'\b([A-Z]{2,5})\b', user_input)
   ticker = ticker_match.group(1) if ticker_match else "AAPL"


   dates = re.findall(r'(\d{4}-\d{2}-\d{2})', user_input)
   start_date = dates[0] if len(dates) > 0 else '2022-01-01'
   end_date = dates[1] if len(dates) > 1 else '2023-01-01'


   print("\n🤖 Generating strategy...")
   strategy_code = get_strategy_code_from_gemini(user_input)


   print(extract_strategy_only(strategy_code))


# ====== 7. Example Execution ======
if __name__ == "__main__":
   user_input = "Create RSI strategy for MSFT, buy below 30 sell above 70, from 2021-01-01 to 2022-12-31"
   full_workflow(user_input)

generate_answer = get_strategy_code_from_gemini
