# 🌲 Tree Species Classifier

A full-stack machine learning web application that classifies tree species from 3D LiDAR point cloud files (`.laz` format) using a custom-trained ResNet model.

## 🌐 Live Demo
**Frontend:** [species-classifier-frontend.vercel.app](https://species-classifier-frontend.vercel.app)  
**Backend API:** [Agamjot2003-species-classifier-api.hf.space](https://Agamjot2003-species-classifier-api.hf.space/docs)

---

## 🧠 How It Works

1. User uploads a `.laz` point cloud file (LiDAR scan of a tree)
2. Backend preprocesses the 3D point cloud into 4 grayscale projection images:
   - **Nadir** — top-down view (X-Y plane)
   - **Facade** — front half side view (X-Z plane)
   - **Rear** — back half side view (X-Z plane)
   - **Zoomed** — central 60% side view (Y-Z plane)
3. The 4 images are assembled into a 2×2 grid tensor `[1, 1, 256, 256]`
4. A custom ResNet model predicts one of **33 tree species**
5. Frontend displays the 4 views + top-5 species predictions with confidence scores

---

## 🏗️ Architecture

```
User Browser (Vercel)
      ↓ uploads .laz file
FastAPI Backend (Hugging Face Space)
      ↓ preprocesses point cloud → 4 images → tensor
Custom ResNet Model (Hugging Face Model Repo)
      ↓ predicts species
JSON response → Frontend displays results
```

---

## 🔬 Model Details

- **Architecture:** Custom identity-mapped ResNet built from scratch
  - Input: `[1, 1, 256, 256]` — 1 channel grayscale, 256×256 grid
  - Layers: `nfs=(16, 32, 64, 128, 256, 512)`, `nbks=(2, 2, 2, 2, 2)`
  - Activation: `GeneralRelu(leak=0.1, sub=0.4)`
  - Regularization: `BatchNorm2d`, `Dropout(0.1)`
  - Output: 33 species classes
- **Training:** 80 epochs, OneCycleLR + AdamW, `lr=2e-2`
- **Normalization:** `mean=0.10, std=0.21`
- **Dataset:** FORspecies 20K — 17,707 tree LiDAR scans across 33 species

### 33 Species
`Abies_alba` · `Acer_campestre` · `Acer_pseudoplatanus` · `Acer_saccharum` · `Betula_pendula` · `Carpinus_betulus` · `Corylus_avellana` · `Crataegus_monogyna` · `Eucalyptus_miniata` · `Euonymus_europaeus` · `Fagus_sylvatica` · `Fraxinus_angustifolia` · `Fraxinus_excelsior` · `Larix_decidua` · `Picea_abies` · `Picea_glauca` · `Pinus_contorta` · `Pinus_nigra` · `Pinus_pinaster` · `Pinus_radiata` · `Pinus_resinosa` · `Pinus_sylvestris` · `Populus_deltoides` · `Populus_tremuloides` · `Prunus_avium` · `Pseudotsuga_menziesii` · `Quercus_faginea` · `Quercus_ilex` · `Quercus_petraea` · `Quercus_robur` · `Quercus_rubra` · `Tilia_cordata` · `Ulmus_laevis`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Uvicorn, Python 3.11 |
| ML Framework | PyTorch, torchvision |
| Point Cloud | laspy, lazrs, NumPy |
| Model Hosting | Hugging Face Model Repository |
| API Hosting | Hugging Face Spaces (Docker) |
| Frontend Hosting | Vercel |

---

## 📁 Project Structure

```
species-classifier/
├── backend/
│   ├── main.py                  # FastAPI app, startup model loading
│   ├── download_model.py        # Downloads weights from HF at startup
│   ├── Dockerfile               # HF Space container config
│   ├── requirements.txt
│   ├── routes/
│   │   └── predict.py           # /preprocess and /predict endpoints
│   ├── model/
│   │   ├── preprocess.py        # LAZ → 4 views → tensor pipeline
│   │   ├── inference.py         # ResNet architecture + prediction
│   │   ├── labels.py            # Index → species name mapping
│   │   └── species_labels.json  # 33 species labels
│   └── schemas/
│       └── response.py          # Pydantic response models
└── frontend/
    ├── src/
    │   ├── App.jsx              # Root component, state management
    │   ├── api/predict.js       # API call wrapper
    │   └── components/
    │       ├── LazUploader.jsx  # Drag & drop .laz file upload
    │       ├── ViewGrid.jsx     # 4 image grid + species results
    │       └── LoadingSpinner.jsx
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Running Locally

### Backend
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
API available at `http://localhost:8000/docs`

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
App available at `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/predict` | Upload `.laz` → returns 4 images + species prediction |
| `POST` | `/preprocess` | Upload `.laz` → returns 4 images only |
| `GET` | `/health` | Server health check |
| `GET` | `/docs` | Interactive Swagger UI |

---

## 👤 Author
**Agamjot Kaur** — [github.com/agamjot2003](https://github.com/agamjot2003)
