"""Shared error types for LLM clients."""


class LLMClientError(Exception):
    """Raised when an LLM client request fails after all retries."""

    def __init__(self, client_name: str, message: str, cause: Exception | None = None):
        self.client_name = client_name
        super().__init__(f"[{client_name}] {message}")
        if cause:
            self.__cause__ = cause
