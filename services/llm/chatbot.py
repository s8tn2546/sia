from typing import Optional

import google.generativeai as genai
from google.api_core.exceptions import NotFound
from openai import OpenAI

from config.settings import settings
from llm.context_builder import build_chat_context
from llm.prompts import CHAT_SYSTEM_PROMPT


def _gemini_candidates() -> list[str]:
    preferred = (settings.gemini_model or "").strip()
    candidates = [preferred, "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
    return [model for model in candidates if model]


def ask_llm(message: str, metadata: Optional[dict] = None) -> str:
    context = build_chat_context(message, metadata)

    if settings.llm_provider.lower() == "gemini" and settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
        prompt = f"{CHAT_SYSTEM_PROMPT}\n\n{context}"

        for model_name in _gemini_candidates():
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                return response.text
            except NotFound:
                continue

        return "No supported Gemini model is available for this API key. Set GEMINI_MODEL to one returned by list_models()."

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
