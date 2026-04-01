from typing import Optional

import httpx
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

if not settings.clerk_secret_key:
    print("⚠️ WARNING: CLERK_SECRET_KEY is not set in the environment.")

clerk_client = Clerk(bearer_auth=settings.clerk_secret_key)

security_strict = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)


async def get_user_id(
    request: Request, credentials: HTTPAuthorizationCredentials = Depends(security_strict)
) -> str:
    try:
        httpx_req = httpx.Request(
            method=request.method,
            url=str(request.url),
            headers=request.headers,
        )

        request_state = clerk_client.authenticate_request(
            httpx_req, AuthenticateRequestOptions()
        )

        if request_state.is_signed_in and request_state.payload:
            user_id = request_state.payload.get("sub")
            if user_id:
                return user_id

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o sesión expirada.",
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error crítico al validar token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No se pudo validar la autenticación.",
        ) from e


async def get_optional_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional),
) -> Optional[str]:
    if not credentials:
        return None

    try:
        httpx_req = httpx.Request(
            method=request.method,
            url=str(request.url),
            headers=request.headers,
        )

        request_state = clerk_client.authenticate_request(
            httpx_req, AuthenticateRequestOptions()
        )

        if request_state.is_signed_in and request_state.payload:
            return request_state.payload.get("sub")

        return None

    except Exception as e:
        print(f"Silent error while validating Clerk token: {e}")
        return None
