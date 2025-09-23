from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.backends.base import SessionBase

class SkipAuthForOptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'OPTIONS':
            # Bypass authentication for OPTIONS requests
            request.user = AnonymousUser()
            request.session = SessionBase() # Provide a dummy session object
        
        response = self.get_response(request)
        return response
