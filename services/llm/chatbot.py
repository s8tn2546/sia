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


def _inventory_section(metadata: Optional[dict] = None) -> dict:
    if not isinstance(metadata, dict):
        return {}

    inventory = metadata.get("inventory")
    if isinstance(inventory, dict):
        return inventory

    return {}


def _fallback_answer(message: str, metadata: Optional[dict] = None) -> str:
    inventory = _inventory_section(metadata)
    critical_items = inventory.get("items") or []

    if inventory.get("critical", 0):
        top_item = critical_items[0] if critical_items else {}
        product_name = top_item.get("productName", "an item")
        sku = top_item.get("sku", "unknown SKU")
        warehouse = top_item.get("warehouse", "your warehouse")
        quantity = top_item.get("quantity", 0)
        reorder_level = top_item.get("reorderLevel", 0)

        return (
            f"You have critical stock risk. Prioritize {product_name} ({sku}) in {warehouse}, "
            f"which is at {quantity} units against a reorder point of {reorder_level}. "
            f"Reorder that SKU first and review similar items for the same warehouse."
        )

    if inventory.get("lowStock", 0):
        return (
            f"Your inventory looks mostly stable, but {inventory.get('lowStock', 0)} item(s) are below reorder levels. "
            f"Review the lowest-stock SKUs first and schedule replenishment before demand increases."
        )

    if inventory.get("total", 0):
        return (
            f"Your inventory is in a healthy state right now with {inventory.get('total', 0)} item(s). "
            f"Keep monitoring demand spikes and maintain reorder thresholds on your highest-volume SKUs."
        )

    message_lower = (message or "").lower()
    if "route" in message_lower:
        return "I do not have route context yet. Share an origin and destination, and I can suggest the best delivery option."

    if "inventory" in message_lower or "stock" in message_lower:
        return "I do not see any inventory records for this account yet. Add products or a supply entry and I will summarize the risk level."

    return (
        "I can help with demand, inventory, routes, and shipment delays. "
        "Share a specific question and I will give a focused recommendation."
    )


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

        return _fallback_answer(message, metadata)

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

    return _fallback_answer(message, metadata)
