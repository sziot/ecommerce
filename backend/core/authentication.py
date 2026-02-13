"""
Custom authentication utilities.
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CookieJWTAuthentication(JWTAuthentication):
    """
    JWT authentication that also checks for tokens in cookies.
    """

    def get_header(self, request):
        # First try to get from Authorization header
        header = super().get_header(request)
        if header is not None:
            return header

        # Try to get from cookie
        access_token = request.COOKIES.get('access_token')
        if access_token:
            return f'Bearer {access_token}'

        return None
