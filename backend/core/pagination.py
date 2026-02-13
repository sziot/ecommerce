"""
Custom pagination classes.
"""

from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination with configurable page size.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class SmallResultsSetPagination(PageNumberPagination):
    """
    Small pagination for limited results.
    """
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
