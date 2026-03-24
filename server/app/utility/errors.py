from __future__ import annotations


class ResourceNotFoundError(Exception):
    """Raised when a requested domain resource does not exist."""

    def __init__(self, detail: str) -> None:
        super().__init__(detail)
        self.detail = detail
