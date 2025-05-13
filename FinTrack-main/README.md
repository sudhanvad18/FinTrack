# 🧠 LLM-Powered Stock Strategy Code Generator

This project enables users to describe what they want to do with a stock in natural language, and a fine-tuned DeepSeek LLM will translate that into Python code for backtesting. The model is trained to understand trading logic and output Python scripts that are ready for use in popular backtesting libraries.

Users receive both the code and instructions on how to run the strategy themselves.

---

## 🚀 Features

- 🗣️ **Natural Language Input**: Describe your stock trading strategy in your own words.
- 🤖 **LLM Code Generation**: Our fine-tuned DeepSeek model on Hugging Face converts your text to Python code.
- 📉 **Backtest-Ready**: Output is structured for easy use in backtesting environments (like Backtrader).
- 🌐 **Modern Web Interface**: Built with React.js for a clean and intuitive user experience.

---

## 🛠️ Getting Started

### 1. Set Up the Backend

Make sure Python 3.8+ is installed. Then install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the backend service, which runs the fine-tuned DeepSeek model:

```bash
python3 TextToCodeModel.py
```

This will launch a local API server that handles natural language input and returns Python code for strategy logic.

### 2. Run the Frontend

Make sure you have Node.js installed. In the project root or frontend directory:

```bash
npm install
npm run dev
```

This will start the React development server at [http://localhost:5173](http://localhost:5173).

---

## 🧪 How It Works

1. You describe your stock strategy in natural language.
2. The frontend sends this input to the backend API.
3. The fine-tuned DeepSeek model processes your input and returns a Python script.
4. You receive:
   - 🐍 Generated Python code
   - 📘 Instructions on how to run a backtest
---

## 💡 Example

**Input:**

> “Short Tesla when RSI goes above 70 and exit when it drops below 50.”

**Output:**

```python
from backtrader import Strategy, SignalStrategy, signals

class RSIStrategy(Strategy):
    params = dict(
        rsi_period=14,
        upper=70,
        lower=50
    )

    def __init__(self):
        self.rsi = bt.ind.RSI(period=self.p.rsi_period)

    def next(self):
        if not self.position:
            if self.rsi[0] > self.p.upper:
                self.sell()
        elif self.rsi[0] < self.p.lower:
            self.close()
```

**Instructions:**

1. Save the above code in a file called `rsi_strategy.py`.
2. Install [Backtrader](https://www.backtrader.com/) via:

    ```bash
    pip install backtrader
    ```

3. Prepare a historical dataset or connect to a data source.
4. Run your backtest using:

    ```bash
    python3 rsi_strategy.py
    ```

> The model can generate different strategies including moving average crossovers, RSI triggers, Bollinger Band-based entries, and more!

---

## 📚 Requirements

- Python 3.8+
- Transformers (Hugging Face)
- Flask or FastAPI
- React.js (Frontend)
- Node.js and npm

---

## 🤝 Contributing

Pull requests and feedback are welcome! Help us make this tool better for traders, developers, and anyone experimenting with algorithmic trading.

---

## 📄 License

This project is licensed under the MIT License.

---
