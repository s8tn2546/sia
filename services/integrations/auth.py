from typing import Optional

def validate_service_token(token: Optional[str]) -> bool:
    if not token:
        return False
    return token.startswith("Bearer ")
