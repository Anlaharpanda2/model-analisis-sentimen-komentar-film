import streamlit as st
import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score


DATASET_PATH = '../dataset/data_clean_300.xlsx'
MODEL_DIR = '../model/naive_bayes/' 
MODEL_PATH = os.path.join(MODEL_DIR, 'naive_bayes_model.pkl') 
VECTORIZER_PATH = os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl')


@st.cache_data
def train_and_evaluate_model():
    """
    Fungsi ini memuat data, melatih model Naive Bayes, mengevaluasinya,
    dan menyimpan model serta vectorizer.
    """
    
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    
    try:
        df = pd.read_excel(DATASET_PATH)
    except FileNotFoundError:
        st.error(f"Dataset tidak ditemukan di '{DATASET_PATH}'. Pastikan file ada di lokasi yang benar.")
        return None, None, None, None

    
    if 'Komentar Bersih' not in df.columns or 'Label' not in df.columns:
        st.error("Dataset harus memiliki kolom 'Komentar Bersih' dan 'Label'.")
        return None, None, None, None
        
    df['Komentar Bersih'] = df['Komentar Bersih'].fillna('')

    
    X = df['Komentar Bersih']
    y = df['Label']

    
    vectorizer = TfidfVectorizer(max_features=5000)
    X_vec = vectorizer.fit_transform(X)

    
    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y, test_size=0.2, random_state=42, stratify=y
    )

    
    model = MultinomialNB()
    model.fit(X_train, y_train)

    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)

    
    with open(MODEL_PATH, 'wb') as f_model:
        pickle.dump(model, f_model)
    with open(VECTORIZER_PATH, 'wb') as f_vec:
        pickle.dump(vectorizer, f_vec)
        
    return model, vectorizer, accuracy, report



st.set_page_config(page_title="Analisis Sentimen Naive Bayes", layout="centered")
st.title("Analisis Sentimen Komentar Film dengan Naive Bayes")


model, vectorizer, accuracy, report = train_and_evaluate_model()


if model and vectorizer and accuracy and report:
    st.header("Hasil Evaluasi Model")
    st.success(f"Model berhasil dilatih dan disimpan di folder '{MODEL_DIR}'")
    
    st.metric(label="Akurasi pada 20% Data Uji", value=f"{accuracy:.2%}")

    st.subheader("Laporan Klasifikasi")
    st.code(report)

    st.markdown("---")

    
    st.header("Coba Prediksi Komentar Baru")
    user_input = st.text_area("Masukkan komentar film di sini:", height=150)

    if st.button("Prediksi Sentimen"):
        if user_input.strip():
            
            input_vec = vectorizer.transform([user_input])
            
            
            prediction = model.predict(input_vec)[0]
            prediction_proba = model.predict_proba(input_vec)[0]
            
            
            if prediction.lower() == 'positive':
                st.success(f"Prediksi Sentimen: **POSITIF**")
            else:
                st.error(f"Prediksi Sentimen: **NEGATIF**")

            
            confidence = max(prediction_proba)
            st.info(f"Tingkat keyakinan: {confidence:.2%}")

        else:
            st.warning("Mohon masukkan teks komentar terlebih dahulu.")

