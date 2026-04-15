def validate_service_token(token: str | None) -> bool:
    if not token:
        return False
    return token.startswith("Bearer ")
