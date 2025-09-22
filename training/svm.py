import streamlit as st
import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score

# --- PENGATURAN PATH ---
DATASET_PATH = '../dataset/data_clean_300.xlsx'
MODEL_DIR = '../model/svm/' # Diubah ke folder svm
MODEL_PATH = os.path.join(MODEL_DIR, 'svm_model.pkl') # Diubah ke model svm
VECTORIZER_PATH = os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl')

# --- Fungsi untuk Melatih Model (dengan caching) ---
@st.cache_data
def train_and_evaluate_model():
    """
    Fungsi ini memuat data, melatih model SVM, mengevaluasinya,
    dan menyimpan model serta vectorizer.
    """
    # 1. Buat folder 'model' jika belum ada
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    # 2. Baca dataset
    try:
        df = pd.read_excel(DATASET_PATH)
    except FileNotFoundError:
        st.error(f"Dataset tidak ditemukan di '{DATASET_PATH}'. Pastikan file ada di lokasi yang benar.")
        return None, None, None, None

    # Pastikan kolom yang dibutuhkan ada
    if 'Komentar Bersih' not in df.columns or 'Label' not in df.columns:
        st.error("Dataset harus memiliki kolom 'Komentar Bersih' dan 'Label'.")
        return None, None, None, None
        
    df['Komentar Bersih'] = df['Komentar Bersih'].fillna('')

    # 3. Tentukan fitur (X) dan label (y)
    X = df['Komentar Bersih']
    y = df['Label']

    # 4. TF-IDF Vectorization
    vectorizer = TfidfVectorizer(max_features=5000)
    X_vec = vectorizer.fit_transform(X)

    # 5. Split data 80:20
    X_train, X_test, y_train, y_test = train_test_split(
        X_vec, y, test_size=0.2, random_state=42, stratify=y
    )

    # 6. Latih model SVM (diganti dari Naive Bayes)
    # probability=True diperlukan agar kita bisa menggunakan predict_proba
    model = SVC(kernel='linear', probability=True, random_state=42)
    model.fit(X_train, y_train)

    # 7. Evaluasi model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)

    # 8. Simpan model dan vectorizer
    with open(MODEL_PATH, 'wb') as f_model:
        pickle.dump(model, f_model)
    with open(VECTORIZER_PATH, 'wb') as f_vec:
        pickle.dump(vectorizer, f_vec)
        
    return model, vectorizer, accuracy, report

# --- UI APLIKASI STREAMLIT ---

st.set_page_config(page_title="Analisis Sentimen SVM", layout="centered")
st.title("Analisis Sentimen Komentar Film dengan SVM")

# Panggil fungsi untuk melatih atau memuat model dari cache
model, vectorizer, accuracy, report = train_and_evaluate_model()

# Tampilkan hasil hanya jika model berhasil dilatih
if model and vectorizer and accuracy and report:
    st.header("Hasil Evaluasi Model")
    st.success(f"Model berhasil dilatih dan disimpan di folder '{MODEL_DIR}'")
    
    st.metric(label="Akurasi pada 20% Data Uji", value=f"{accuracy:.2%}")

    st.subheader("Laporan Klasifikasi")
    st.code(report)

    st.markdown("---")

    # --- Bagian Prediksi Teks Baru ---
    st.header("Coba Prediksi Komentar Baru")
    user_input = st.text_area("Masukkan komentar film di sini:", height=150)

    if st.button("Prediksi Sentimen"):
        if user_input.strip():
            # Ubah input teks menjadi vektor
            input_vec = vectorizer.transform([user_input])
            
            # Lakukan prediksi
            prediction = model.predict(input_vec)[0]
            prediction_proba = model.predict_proba(input_vec)[0]
            
            # Tampilkan hasil
            if prediction.lower() == 'positive':
                st.success(f"Prediksi Sentimen: **POSITIF**")
            else:
                st.error(f"Prediksi Sentimen: **NEGATIF**")

            # Tampilkan confidence score
            confidence = max(prediction_proba)
            st.info(f"Tingkat keyakinan: {confidence:.2%}")

        else:
            st.warning("Mohon masukkan teks komentar terlebih dahulu.")

