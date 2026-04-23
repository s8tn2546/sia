from typing import Any, Optional


def _format_inventory_context(inventory: dict[str, Any]) -> str:
    lines = [
        "Inventory snapshot:",
        f"- total items: {inventory.get('total', 0)}",
        f"- in stock: {inventory.get('inStock', 0)}",
        f"- low stock: {inventory.get('lowStock', 0)}",
        f"- critical: {inventory.get('critical', 0)}",
    ]

    items = inventory.get("items") or []
    if items:
        lines.append("- top items:")
        for item in items:
            lines.append(
                f"  - {item.get('productName', 'Unknown')} ({item.get('sku', 'n/a')}) "
                f"{item.get('quantity', 0)}/{item.get('reorderLevel', 0)} at {item.get('warehouse', 'n/a')}"
            )

    return "\n".join(lines)


def build_chat_context(user_message: str, metadata: Optional[dict] = None) -> str:
    details = metadata or {}
    context_lines = [f"User query: {user_message}"]

    if isinstance(details, dict):
        source = details.get("source")
        if source:
          context_lines.append(f"Context source: {source}")

        inventory = details.get("inventory")
        if isinstance(inventory, dict):
            context_lines.append(_format_inventory_context(inventory))
        elif details:
            context_lines.append(f"Context: {details}")
    else:
        context_lines.append(f"Context: {details}")

    return "\n".join(context_lines)
