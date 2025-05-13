from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, TextStreamer, DataCollatorForLanguageModeling
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
import torch


# Clear CUDA cache before loading models
torch.cuda.empty_cache()

device = torch.device("cuda")

dataset = load_dataset("koutch/stackoverflow_python")

dataset = dataset["train"]

def format_example(example):
    return {
        "text": f"### Question:\n{example['question_body'].strip()}\n\n### Answer:\n{example['answer_body'].strip()}"
    }

dataset = dataset.map(format_example)
dataset = dataset.filter(lambda x: x["text"] is not None and len(x["text"]) > 0)
dataset = dataset.shuffle(seed=42).select(range(30_000))

tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-7B")

tokenizer.add_special_tokens({'additional_special_tokens': ["<|user|>", "<|assistant|>"]})

data_collator = DataCollatorForLanguageModeling(
    tokenizer=tokenizer,
    mlm=False  # Causal LM, so no masked LM
)

model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",device_map="cuda",torch_dtype=torch.float16)

model.resize_token_embeddings(len(tokenizer))

lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.CAUSAL_LM
)

model = get_peft_model(model, lora_config)

def tokenize_function(example):
    result = tokenizer(
        example["text"],
        truncation=True,
        padding="max_length",
        max_length=1024,
    )
    result["text"] = example["text"]  # Keep original text
    return result

tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Step 3: Training arguments
training_args = TrainingArguments(
    output_dir="/home/deshpa70",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=2,
    num_train_epochs=1,
    logging_dir="./logs",
    save_total_limit=2,
    logging_steps=250,
    save_steps=500,
    learning_rate=3e-4,
    bf16=True,
    optim="paged_adamw_8bit",
    report_to="none"
)

trainer = SFTTrainer(
    peft_config=lora_config,
    model=model,
    train_dataset=tokenized_dataset,
    args=training_args,
    data_collator=data_collator
)

trainer.train()
model.eval()

while True:
        prompt = input("\n Enter your programming question (or type 'exit' to quit):\n> ")
        if prompt.lower() == 'exit':
            break

        formatted_prompt = f"<|user|>\n{prompt}\n<|assistant|>\n"
        inputs = tokenizer(formatted_prompt, return_tensors="pt").to(device)
        streamer = TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)


        output = model.generate(
            **inputs,
            max_new_tokens=50000,
            do_sample=True,
            top_p=0.9,
            temperature=0.8,
            repetition_penalty=1.1,
            streamer=streamer
        )


# Clear CUDA cache before loading models
torch.cuda.empty_cache()
