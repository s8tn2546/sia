from typing import Optional

def build_chat_context(user_message: str, metadata: Optional[dict] = None) -> str:
    details = metadata or {}
    return f"User query: {user_message}\nContext: {details}"
