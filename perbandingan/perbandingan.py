import streamlit as st
import pandas as pd
import pickle
import os
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt
import seaborn as sns

# --- PENGATURAN PATH ---
DATASET_PATH = 'data/data_clean_forrest_gump.xlsx' # Path diubah sesuai permintaan
OUTPUT_EXCEL_PATH = 'hasil_perbandingan.xlsx' # Nama file output baru

MODELS_INFO = {
    'Decision Tree': {
        'model_path': '../model/decision-tree/decision_tree_model.pkl',
        'vectorizer_path': '../model/decision-tree/tfidf_vectorizer.pkl'
    },
    'KNN': {
        'model_path': '../model/knn/knn_model.pkl',
        'vectorizer_path': '../model/knn/tfidf_vectorizer.pkl'
    },
    'Naive Bayes': {
        'model_path': '../model/naive_bayes/naive_bayes_model.pkl',
        'vectorizer_path': '../model/naive_bayes/tfidf_vectorizer.pkl'
    },
    'SVM': {
        'model_path': '../model/svm/svm_model.pkl',
        'vectorizer_path': '../model/svm/tfidf_vectorizer.pkl'
    }
}

# --- FUNGSI UTAMA (dengan caching agar cepat) ---
@st.cache_data
def run_model_comparison():
    """
    Memuat dataset baru, menguji semua model, dan mengembalikan
    hasil perbandingan serta DataFrame dengan prediksi.
    """
    results_list = []
    reports_dict = {}

    try:
        df_new = pd.read_excel(DATASET_PATH)
        if 'Komentar Bersih' not in df_new.columns or 'Label' not in df_new.columns:
            st.error("File Excel baru harus memiliki kolom 'Komentar Bersih' dan 'Label'")
            return None, None, None
        
        X_new = df_new['Komentar Bersih'].fillna('')
        y_true = df_new['Label']
        # Buat salinan DataFrame untuk menyimpan hasil prediksi
        df_predictions = df_new.copy()

    except FileNotFoundError:
        st.error(f"ERROR: File dataset baru '{DATASET_PATH}' tidak ditemukan.")
        return None, None, None

    # Loop melalui setiap model untuk pengujian
    for model_name, paths in MODELS_INFO.items():
        try:
            with open(paths['vectorizer_path'], 'rb') as f_vec:
                vectorizer = pickle.load(f_vec)
            with open(paths['model_path'], 'rb') as f_model:
                model = pickle.load(f_model)
            
            X_new_vec = vectorizer.transform(X_new)
            y_pred = model.predict(X_new_vec)
            
            accuracy = accuracy_score(y_true, y_pred)
            report = classification_report(y_true, y_pred)
            
            results_list.append({'Model': model_name, 'Akurasi': accuracy})
            reports_dict[model_name] = report
            # Tambahkan kolom prediksi ke DataFrame
            df_predictions[f'Prediksi_{model_name.replace(" ", "_")}'] = y_pred

        except FileNotFoundError:
            st.warning(f"File model atau vectorizer untuk '{model_name}' tidak ditemukan. Melewati...")
        except Exception as e:
            st.error(f"Terjadi error saat menguji model '{model_name}': {e}")
    
    if not results_list:
        return None, None, None
        
    df_results = pd.DataFrame(results_list).sort_values(by='Akurasi', ascending=False).reset_index(drop=True)
    return df_results, reports_dict, df_predictions

# --- UI APLIKASI STREAMLIT ---
st.set_page_config(page_title="Perbandingan Model", layout="wide")
st.title("📊 Perbandingan Performa Model Sentimen")
st.write(f"Menguji 4 model yang sudah dilatih pada dataset baru: `{os.path.basename(DATASET_PATH)}`")

# Jalankan perbandingan
df_results, reports_dict, df_predictions = run_model_comparison()

if df_results is not None:
    st.markdown("---")
    st.header("🏆 Hasil Akhir Perbandingan Akurasi")
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.dataframe(df_results)

    with col2:
        # Buat visualisasi grafik batang
        fig, ax = plt.subplots(figsize=(10, 5))
        barplot = sns.barplot(x='Akurasi', y='Model', data=df_results, palette='viridis', ax=ax, orient='h')
        
        # Tambahkan label angka pada setiap batang
        for index, value in enumerate(df_results['Akurasi']):
            ax.text(value + 0.01, index, f'{value:.2%}', va='center', fontsize=12)
            
        ax.set_xlabel('Akurasi', fontsize=12)
        ax.set_ylabel('Model', fontsize=12)
        ax.set_title('Perbandingan Akurasi Model pada Dataset Baru', fontsize=14)
        ax.set_xlim(0, 1.05)
        st.pyplot(fig)

    st.markdown("---")
    st.header("📝 Laporan Klasifikasi Detail")
    
    # Tampilkan laporan detail untuk setiap model dalam expander
    for model_name, report in reports_dict.items():
        with st.expander(f"Lihat Laporan untuk Model: **{model_name}**"):
            st.code(report)

    # --- Bagian Baru: Simpan dan Download Hasil Prediksi ---
    st.markdown("---")
    st.header("💾 Simpan dan Unduh Hasil Prediksi")
    
    if df_predictions is not None:
        # Simpan ke file Excel
        df_predictions.to_excel(OUTPUT_EXCEL_PATH, index=False)
        st.success(f"File perbandingan '{OUTPUT_EXCEL_PATH}' berhasil dibuat di direktori Anda.")
        
        # Buat tombol download
        with open(OUTPUT_EXCEL_PATH, "rb") as file:
            st.download_button(
                label="Unduh File Excel Hasil Perbandingan",
                data=file,
                file_name=OUTPUT_EXCEL_PATH,
                mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        
        st.write("Preview data dengan kolom prediksi:")
        st.dataframe(df_predictions.head())
else:
    st.error("Proses perbandingan gagal. Periksa pesan error di atas.")

