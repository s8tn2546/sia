import os
import re
from typing import Optional
from dotenv import load_dotenv

load_dotenv(override=True)

import google.generativeai as genai
from google.api_core.exceptions import NotFound
from openai import OpenAI

from config.settings import settings
from llm.context_builder import build_chat_context
from llm.prompts import CHAT_SYSTEM_PROMPT


def _gemini_candidates() -> list[str]:
    preferred = (settings.gemini_model or "").strip()
    candidates = [preferred, "gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
    return [model for model in candidates if model]


def clean_response(text: str) -> str:
    return re.sub(r'[*#`]', '', text)


def ask_llm(message: str, metadata: Optional[dict] = None) -> str:
    print("User input:", message)
    context = build_chat_context(message, metadata)

    if settings.llm_provider.lower() == "gemini" and settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        prompt = f"{CHAT_SYSTEM_PROMPT}\n\n{context}"

        for model_name in _gemini_candidates():
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                reply = clean_response(response.text)
                print("LLM response:", reply)
                return reply
            except Exception as e:
                print(f"Gemini error with model {model_name}: {e}")
                continue

        return "I'm sorry, I encountered an error connecting to the AI service. Please try again later."

    if settings.openai_api_key:
        try:
            client = OpenAI(api_key=settings.openai_api_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": CHAT_SYSTEM_PROMPT},
                    {"role": "user", "content": context},
                ],
                temperature=0.2,
            )
            reply = clean_response(response.choices[0].message.content or "")
            print("LLM response:", reply)
            return reply
        except Exception as e:
            print(f"OpenAI error: {e}")
            return "I'm sorry, I encountered an error connecting to the AI service. Please try again later."

    return "No valid LLM provider configured. Please check your environment variables."
