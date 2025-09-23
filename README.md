# 🎬 Model Analisis Sentimen Komentar Film

Aplikasi analisis sentimen komentar film berbasis Machine Learning dengan arsitektur full-stack yang dapat mengklasifikasikan review film sebagai sentimen positif atau negatif menggunakan empat model pembelajaran mesin yang berbeda.

## 🚀 Demo Langsung

**[Coba Aplikasi → https://cek-sentimen.vercel.app/](https://cek-sentimen.vercel.app/)**

## 📋 Deskripsi

Proyek ini adalah implementasi sistem analisis sentimen yang dapat menganalisis review film dari IMDb dan mengklasifikasikannya sebagai sentimen positif atau negatif. Sistem ini dibangun dengan pendekatan supervised learning menggunakan 2000 data training (1000 review positif dan 1000 review negatif) yang di-scraping dari film "300" (2006) di IMDb.

## ✨ Fitur Utama

- **Analisis Sentimen Real-time**: Prediksi sentimen komentar film secara instan
- **4 Model Machine Learning**: Decision Tree, K-Nearest Neighbors (KNN), Naive Bayes, dan Support Vector Machine (SVM)
- **Data Training Berkualitas**: 2000 review film yang telah melalui pre-processing
- **Validasi Model**: Testing dengan data baru dari film "Forrest Gump" (1994)
- **Antarmuka Web Modern**: Frontend responsif dengan Next.js
- **RESTful API**: Backend Django yang dapat diintegrasikan dengan aplikasi lain

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Next.js** - React framework untuk production
- **React.js** - Library JavaScript untuk UI
- **TypeScript** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development toolkit
- **scikit-learn** - Machine learning library
- **Pandas** - Data manipulation dan analysis
- **Jupyter Notebook** - Interactive development environment

### Web Scraping & Data Processing
- **Selenium** - Web automation untuk scraping
- **WebDriver Manager** - Automatic webdriver management
- **BeautifulSoup** - HTML parsing library
- **Excel/XLSX** - Data storage format

### Deployment
- **Vercel** - Hosting platform untuk frontend dan backend

## 🏗️ Arsitektur

```
Frontend (Next.js) ←→ Django API ←→ ML Models (.pkl)
     ↓                    ↓              ↓
  Vercel              Vercel      scikit-learn
```

## 🔄 Alur Kerja Machine Learning

### 1. Akuisisi Data
**Data Training (Film "300" - 2006)**
- **Review Negatif (1000)**: 
  - Bintang 1: 750 review
  - Bintang 2: 100 review  
  - Bintang 3: 100 review
  - Bintang 4: 50 review
- **Review Positif (1000)**:
  - Bintang 10: 500 review
  - Bintang 9: 250 review
  - Bintang 8: 250 review

**Data Testing (Film "Forrest Gump" - 1994)**
- Bintang 10: 50 review (positif)
- Bintang 1: 50 review (negatif)

### 2. Pre-Processing Data
- Pembersihan teks dari karakter khusus
- Normalisasi dan tokenisasi
- Penggabungan dan pengacakan data
- Pelabelan otomatis berdasarkan rating

### 3. Pelatihan Model
Data dibagi dengan rasio 80:20 (training:testing)
- **Decision Tree**: Model pohon keputusan
- **KNN**: Algoritma k-nearest neighbors  
- **Naive Bayes**: Model probabilistik
- **SVM**: Support vector machine

### 4. Evaluasi dan Perbandingan
Testing dilakukan dengan 100 data baru dari film berbeda untuk memastikan generalisasi model.

## 📊 Performa Model

Berdasarkan testing dengan 100 data review baru dari "Forrest Gump":

| Model | Akurasi | Deskripsi |
|-------|---------|-----------|
| **SVM** | Tertinggi | Model dengan performa terbaik |
| **Naive Bayes** | Tinggi | Efisien untuk klasifikasi teks |
| **Decision Tree** | Sedang | Mudah diinterpretasi |
| **KNN** | Bervariasi | Sensitif terhadap parameter k |

*Detail perbandingan lengkap tersedia di: [Google Sheets](https://docs.google.com/spreadsheets/d/1hb2o_QOnR7Br0Xi4vWi42BWUWMv6HAI79ybGZJRbXZg/edit?usp=sharing)*

## 💻 Cara Menjalankan Proyek Secara Lokal

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- Geckodriver (untuk scraping)

### Backend (Django)

1. **Clone repository**
   ```bash
   git clone https://github.com/Anlaharpanda2/model-analisis-sentimen-komentar-film.git
   cd model-analisis-sentimen-komentar-film
   ```

2. **Setup virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install django
   pip install djangorestframework
   pip install scikit-learn
   pip install pandas
   pip install django-cors-headers
   pip install whitenoise
   pip install gunicorn
   ```

4. **Setup Geckodriver** (untuk scraping data)
   - Download Geckodriver untuk Windows x64
   - Extract dan tambahkan ke system PATH

5. **Jalankan server Django**
   ```bash
   cd apps  # atau direktori backend
   python manage.py migrate
   python manage.py runserver
   ```

Backend akan berjalan di `http://localhost:8000`

### Frontend (Next.js)

1. **Masuk ke direktori frontend**
   ```bash
   cd frontend  # sesuaikan dengan struktur direktori
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Buat file `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

Frontend akan berjalan di `http://localhost:3000`

### Scraping Data Baru (Opsional)

Jika ingin melakukan scraping data baru:

1. **Install dependencies untuk scraping**
   ```bash
   pip install selenium
   pip install webdriver-manager
   pip install jupyter
   ```

2. **Jalankan Jupyter Notebook**
   ```bash
   jupyter notebook
   ```

3. **Gunakan script scraping** yang tersedia di direktori `akuisisi-data/`

## 📁 Struktur Proyek

```
model-analisis-sentimen-komentar-film/
├── akuisisi-data/           # Script scraping dan pre-processing
│   ├── Pre-Processing/      # Data cleaning scripts
│   ├── negatif/            # Raw negative reviews
│   └── positif/            # Raw positive reviews
├── dataset/                # Clean dataset (2000 rows)
├── training/               # Model training scripts
│   ├── decision-tree.py
│   ├── knn.py
│   ├── naive-bayes.py
│   └── svm.py
├── model/                  # Trained models (.pkl files)
│   ├── decision-tree/
│   ├── knn/
│   ├── naive-bayes/
│   └── svm/
├── perbandingan/          # Model comparison scripts
├── apps/                  # Django backend
└── frontend/              # Next.js frontend
```

## 🌐 Deployment

Aplikasi di-deploy menggunakan **Vercel** dengan konfigurasi khusus:

### Backend Django
- Setup runtime Python untuk Vercel
- Konfigurasi `vercel.json` untuk Django
- Environment variables untuk production

### Frontend Next.js
- Automatic deployment dari Git
- Environment variables untuk API endpoint

## 📈 Metodologi Penelitian

1. **Data Collection**: Web scraping menggunakan Selenium dari IMDb
2. **Data Preprocessing**: Pembersihan dan normalisasi teks
3. **Feature Engineering**: Ekstraksi fitur dari teks review
4. **Model Training**: Supervised learning dengan 4 algoritma berbeda
5. **Model Evaluation**: Cross-validation dengan data testing terpisah
6. **Deployment**: Integration ke web application

## 🤝 Kontribusi

Kontribusi sangat diterima! Area yang bisa dikembangkan:

- **Peningkatan Dataset**: Menambah jumlah dan variasi data training
- **Model Baru**: Implementasi algoritma ML lain (Random Forest, Neural Network)
- **Feature Engineering**: Ekstraksi fitur yang lebih sophisticated
- **UI/UX**: Perbaikan antarmuka pengguna
- **Performance**: Optimisasi kecepatan prediksi
- **Multi-language**: Support untuk review dalam bahasa lain

## 👨‍💻 Pengembang

**Anla Harpanda**
- NIM: 2311083015
- Kelas: TRPL 3D
- Program Studi: Teknologi Rekayasa Perangkat Lunak
- Jurusan: Teknologi Informasi
- Politeknik Negeri Padang

---

**🔗 Links Penting:**
- [Demo Aplikasi](https://cek-sentimen.vercel.app/)
- [Repository GitHub](https://github.com/Anlaharpanda2/model-analisis-sentimen-komentar-film.git)
- [Data Perbandingan Model](https://docs.google.com/spreadsheets/d/1hb2o_QOnR7Br0Xi4vWi42BWUWMv6HAI79ybGZJRbXZg/edit?usp=sharing)
- [Laporan Lengkap](anla-harpanda-laporan1.pdf)

## 🎯 Hasil Pembelajaran

Proyek ini berhasil mendemonstrasikan:
- Implementasi end-to-end machine learning pipeline
- Perbandingan performa berbagai algoritma klasifikasi
- Web scraping untuk akuisisi data real-world
- Deployment aplikasi ML ke production environment
- Integrasi frontend-backend untuk aplikasi ML