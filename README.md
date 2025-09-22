# Model Analisis Sentimen Komentar Film

Proyek ini menghadirkan solusi analisis sentimen untuk komentar film menggunakan empat model Machine Learning yang berbeda: **Support Vector Machine (SVM), Naive Bayes, K-Nearest Neighbors (KNN), dan Decision Tree**. Model-model ini dilatih untuk mengklasifikasikan ulasan film sebagai positif atau negatif.

## Fitur Utama:
- **Empat Model ML**: Bandingkan performa SVM, Naive Bayes, KNN, dan Decision Tree.
- **Klasifikasi Sentimen**: Deteksi sentimen positif atau negatif dari komentar film.
- **Aplikasi Demo Interaktif**: Sebuah aplikasi web yang memungkinkan pengguna memilih model, memasukkan komentar, dan melihat hasil analisis sentimen secara real-time.

## Demo Aplikasi
Anda dapat mencoba aplikasi demo interaktif kami di:
[sentimen.vercel.app](https://sentimen.vercel.app)

## Struktur Proyek
- `akuisisi-data/`: Skrip untuk akuisisi data dan pra-pemrosesan.
- `dataset/`: Kumpulan data yang digunakan untuk pelatihan model.
- `model/`: Direktori yang berisi model Machine Learning yang telah dilatih (`.pkl`) dan vectorizer TF-IDF yang sesuai.
- `training/`: Skrip Python untuk melatih setiap model ML.
- `apps/`: Berisi aplikasi web (frontend Next.js) dan API backend (Django).