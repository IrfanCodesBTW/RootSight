from typing import Any


def success_response(data: Any) -> dict[str, Any]:
    return {"success": True, "data": data, "error": None}


def error_response(message: str, code: int = 500) -> dict[str, Any]:
    return {"success": False, "data": None, "error": message}
