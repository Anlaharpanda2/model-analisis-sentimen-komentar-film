from django.contrib.auth.models import AnonymousUser
from django.contrib.sessions.backends.db import SessionStore # Use a concrete session store

class SkipAuthForOptionsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'OPTIONS':
            # Bypass authentication for OPTIONS requests
            request.user = AnonymousUser()
            # Provide a concrete, empty session object
            request.session = SessionStore(session_key=None)
        
        response = self.get_response(request)
        return response
