import json
import joblib
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path

from django.conf import settings

PROJECT_ROOT = settings.BASE_DIR

@csrf_exempt
def predict(request):
    if request.method == 'POST':
        try:
            body_unicode = request.body.decode('utf-8')
            data = json.loads(body_unicode)

            comment = data.get('comment')
            model_name = data.get('model_name')

            if not comment or not model_name:
                return JsonResponse({
                    'error': "Missing 'comment' or 'model_name' in request body.",
                    'received_data': data
                }, status=400)

            filename_prefix = model_name.replace('-', '_')
            model_path = os.path.join(PROJECT_ROOT, 'model', model_name, f'{filename_prefix}_model.pkl')
            vectorizer_path = os.path.join(PROJECT_ROOT, 'model', model_name, 'tfidf_vectorizer.pkl')

            if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
                error_message = f'Model files not found for {model_name}. Searched at: {model_path}'
                return JsonResponse({'error': error_message}, status=404)

            model = joblib.load(model_path)
            vectorizer = joblib.load(vectorizer_path)

            transformed_comment = vectorizer.transform([comment])
            prediction = model.predict(transformed_comment)

            sentiment = prediction[0]
            return JsonResponse({'sentiment': sentiment})

        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON received.',
                'request_body': request.body.decode('utf-8', errors='ignore')
            }, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Only POST method is allowed'}, status=405)