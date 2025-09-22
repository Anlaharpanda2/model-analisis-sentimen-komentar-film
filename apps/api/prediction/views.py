import json
import joblib
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

@csrf_exempt
def predict(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

    try:
        # 1. Parse data
        data = json.loads(request.body)
        comment = data.get('comment')
        model_name = data.get('model_name')

        if not comment or not model_name:
            return JsonResponse({'error': "Missing 'comment' or 'model_name'"}, status=400)

        # 2. Construct paths
        filename_prefix = model_name.replace('-', '_')
        model_path = os.path.join(settings.BASE_DIR, 'model', model_name, f'{filename_prefix}_model.pkl')
        vectorizer_path = os.path.join(settings.BASE_DIR, 'model', model_name, 'tfidf_vectorizer.pkl')

        if not os.path.exists(model_path) or not os.path.exists(vectorizer_path):
            return JsonResponse({'error': f'Model files not found for {model_name}'}, status=404)

        # 3. Load model and predict
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path)
        transformed_comment = vectorizer.transform([comment])
        prediction = model.predict(transformed_comment)

        # 4. Return result
        sentiment = prediction[0]
        return JsonResponse({'sentiment': sentiment})

    except Exception as e:
        # If anything fails, return a generic 500 error
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
