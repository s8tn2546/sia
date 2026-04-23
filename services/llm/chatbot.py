from typing import Optional
from openai import OpenAI
import google.generativeai as genai

from config.settings import settings
from llm.context_builder import build_chat_context
from llm.prompts import CHAT_SYSTEM_PROMPT


def ask_llm(message: str, metadata: Optional[dict] = None) -> str:
    context = build_chat_context(message, metadata)

    if settings.llm_provider.lower() == "gemini" and settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"{CHAT_SYSTEM_PROMPT}\n\n{context}")
        return response.text

    if settings.openai_api_key:
        client = OpenAI(api_key=settings.openai_api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": CHAT_SYSTEM_PROMPT},
                {"role": "user", "content": context},
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content or ""

    return "LLM provider key not configured."
