"""
API Root view
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    API 根路径，列出所有可用的端点
    """
    return Response({
        'message': 'E-Commerce API',
        'version': 'v1',
        'endpoints': {
            'auth': {
                'login': '/api/v1/auth/login/',
                'register': '/api/v1/auth/register/',
                'logout': '/api/v1/auth/logout/',
                'me': '/api/v1/auth/me/',
                'refresh': '/api/v1/auth/refresh/',
            },
            'products': {
                'list': '/api/v1/products/',
                'detail': '/api/v1/products/{id}/',
                'featured': '/api/v1/products/featured/',
                'categories': '/api/v1/categories/',
            },
            'cart': {
                'list': '/api/v1/cart/',
                'add_item': '/api/v1/cart/items/',
                'update_item': '/api/v1/cart/items/{id}/',
                'delete_item': '/api/v1/cart/items/{id}/',
            },
            'orders': {
                'list': '/api/v1/orders/',
                'create': '/api/v1/orders/create/',
                'detail': '/api/v1/orders/{id}/',
            },
            'admin': '/admin/',
        },
        'documentation': 'See API documentation for more details',
    })
