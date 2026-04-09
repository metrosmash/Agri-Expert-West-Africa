# 🌿 Agri-Expert West Africa

### *Closing the "Extension Gap" for West African Smallholder Farmers*

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://agri-expert-west-africa-106632139361.us-west1.run.app/)
[![Powered by Gemini 1.5 Pro](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-blue?style=for-the-badge)](https://aistudio.google.com/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge)](https://react.dev/)

**Agri-Expert West Africa** is a specialized AI-powered agricultural extension platform designed to bridge the "Extension Gap" in rural districts. By leveraging multimodal AI, the application provides instant, localized, and multi-lingual advisory services to protect yields and improve food security.

---

## 📖 The Context & Problem
As of 2026, agriculture remains the backbone of Africa’s economy. However, smallholder farmers often lose significant yields to pests, diseases, and unpredictable weather because they cannot access timely professional advice. Human extension agents are often overstretched and unable to reach remote rural districts.

**The Goal:** Provide a low-cost, instant way to diagnose crop stress and receive climate-smart planting schedules that respect local languages and traditions.

---

## ✨ Key Features

### 📸 Multimodal Crop Diagnosis
Farmers can upload or take photos of their crops (**Maize, Cassava, Yam, Cocoa, Rice**). Using Gemini 1.5 Pro’s visual reasoning, the AI identifies:
* Specific pests (e.g., Fall Armyworm).
* Diseases (e.g., Cassava Mosaic Virus).
* Nutrient deficiencies (e.g., Nitrogen or Phosphorus lack).

### 🗣️ Multilingual Expert Advice
A conversational interface supporting local dialects and languages to ensure no farmer is left behind:
* **English & French**
* **Nigerian Pidgin**
* **Yoruba, Hausa, & Igbo**

### 📅 2026 Climate-Smart Scheduling
Provides localized planting and harvesting windows based on updated 2026 climate trends and West African rainfall patterns.

### 🛡️ Safety & Localization
* **Safety First:** Prioritizes **Integrated Pest Management (IPM)** and organic alternatives. All chemical recommendations include strict safety warnings.
* **Local Context:** Uses local measurements like **"plots"** or **"heaps"** to make advice practical and relatable.

---

## 🛠️ Technical Implementation

### Frontend Architecture
* **React 19:** Utilizing the latest concurrent rendering features for a snappy UI.
* **Tailwind CSS:** Custom "Warm Organic" aesthetic with earthy tones and soft rounded corners.
* **Framer Motion:** Smooth transitions between the Diagnosis and Advice tabs.

### AI Engine & Backend
* **Google AI Studio:** Built and published using the Gemini 1.5 Pro model.
* **@google/genai SDK:** Direct integration for high-performance inference.
* **System Instructions:** A specialized persona-driven instruction set that defines the "Agri-Expert" identity, ensuring empathetic and authoritative responses.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Local Setup

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/your-username/agri-expert-west-africa.git](https://github.com/your-username/agri-expert-west-africa.git)
   cd agri-expert-west-africa
