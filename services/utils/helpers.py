from pathlib import Path


def resolve_path(base_dir: Path, relative_path: str) -> Path:
    return (base_dir / relative_path).resolve()
