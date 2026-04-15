def build_chat_context(user_message: str, metadata: dict | None = None) -> str:
    details = metadata or {}
    return f"User query: {user_message}\nContext: {details}"
