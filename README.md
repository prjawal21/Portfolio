<div align="center">

<!-- Animated typing header -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=28&duration=3000&pause=1000&color=F2A93B&center=true&vCenter=true&multiline=true&repeat=true&width=700&height=100&lines=Hi+I'm+Prajwal;learning+and+building+what+I+love." alt="Typing SVG" /></a>

<br/>

**Multimodal ML & Computer Vision Engineer**

B.Tech CSE, Presidency University, Bengaluru · 2026

[![Portfolio](https://img.shields.io/badge/Portfolio-calm--peony--627fcb.netlify.app-F2A93B?style=for-the-badge&logo=netlify&logoColor=white)](https://calm-peony-627fcb.netlify.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Prajwal_P-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/prajwal-p-822169257/)
[![GitHub](https://img.shields.io/badge/GitHub-prjawal21-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/prjawal21)
[![Email](https://img.shields.io/badge/Email-prajwalp2125@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:prajwalp2125@gmail.com)

</div>

---

## 🔬 About This Repository

Source code for my engineering portfolio, a static site built to showcase real projects, a live signal processing demo, and technical background. No frameworks, no build step, just vanilla HTML, CSS, and JavaScript.

### Highlights

- **Interactive Signal Lab**: a real 2nd-order Butterworth bandpass biquad filter running client-side, replicating the IMU signal processing pipeline I built at Autoliv
- **Canvas waveform animations** with `prefers-reduced-motion` support
- **Scroll-triggered reveals** via `IntersectionObserver`
- **Dark theme** with a design-system-driven token layer (colors, fonts, spacing)

---

## 🛠️ Tech Stack

<details>
<summary><b>Machine Learning & Computer Vision</b></summary>
<br/>

![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=flat-square&logo=opencv&logoColor=white)
![CLIP](https://img.shields.io/badge/CLIP-412991?style=flat-square&logo=openai&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)

</details>

<details>
<summary><b>GenAI & LLM</b></summary>
<br/>

![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=flat-square&logo=groq&logoColor=white)
![RAG](https://img.shields.io/badge/RAG-F2A93B?style=flat-square&logoColor=white)

</details>

<details>
<summary><b>Backend</b></summary>
<br/>

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)

</details>

<details>
<summary><b>Frontend</b></summary>
<br/>

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

</details>

<details>
<summary><b>Data & Cloud</b></summary>
<br/>

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)

</details>

---

## 📂 Featured Projects

### Multimodal Road Surface Classification `Research Internship`
> Autoliv, Bengaluru · Mar – May 2026

Built a system that classifies road surface quality by fusing IMU, GPS, and video data. Cleaned ~6 kHz IMU signals with Butterworth bandpass filtering, paired with a CLIP-based vision pipeline for hybrid labeling, and trained a dual-head CNN reaching ~0.80 ROC-AUC.

`PyTorch` `OpenCV` `CLIP` `Signal Processing` `CNN`

🔗 [Try the live filter demo on the portfolio →](https://calm-peony-627fcb.netlify.app/#lab)

---

### PGRKAM AI Assistant `RAG · GenAI`

Multilingual chatbot for government employment guidance, grounded with a RAG pipeline. Runs on LLaMA-3.3-70B via Groq at under 1s per query, with speech-to-text and text-to-speech for accessibility.

```
Query → Retriever → LLaMA-3.3-70B → Grounded answer
```

`React.js` `FastAPI` `MongoDB` `Groq API` `RAG`

[![Repo](https://img.shields.io/badge/Repository-PGRKAM__AI__Assistant-181717?style=flat-square&logo=github)](https://github.com/prjawal21/PGRKAM_AI_Assistant)

---

### VedaCare `SaaS · Hackathon`

Multi-tenant Ayurvedic diet management SaaS, built for Smart India Hackathon 2024 under the Ministry of Ayush. Role-based dashboards for patients, doctors, and admins with personalised diet plan generation.

`React.js` `Spring Boot` `MongoDB` `Multi-tenant`

[![Repo](https://img.shields.io/badge/Repository-ayurvedic--diet--management--system-181717?style=flat-square&logo=github)](https://github.com/prjawal21/ayurvedic-diet-management-system)

---

### NoteKeeper `Full Stack`

Full-stack notes manager with secure authentication and complete CRUD, built on a validated MVC REST API and an indexed MySQL schema for query performance.

`Spring Boot` `React.js` `MySQL` `REST`

[![Repo](https://img.shields.io/badge/Repository-NoteKeeper-181717?style=flat-square&logo=github)](https://github.com/prjawal21/NoteKeeper)

---

### DevForum `Full Stack · Community` ![Status](https://img.shields.io/badge/Status-In_Progress-F2A93B?style=flat-square)

Reddit-style developer community platform with nested comments, voting, and topic feeds. Spring Boot 3 REST API with a React frontend.

`Spring Boot 3` `React.js` `PostgreSQL` `REST`

[![Backend](https://img.shields.io/badge/Backend-devforum--backend-181717?style=flat-square&logo=github)](https://github.com/prjawal21/devforum-backend)
[![Frontend](https://img.shields.io/badge/Frontend-devforum--frontend-181717?style=flat-square&logo=github)](https://github.com/prjawal21/devforum-frontend)

---

## 🏗️ Portfolio Architecture

```
portfolio/
├── index.html              # Single-page markup (hero, signal lab, work, about, stack, contact)
├── css/
│   └── style.css           # Design tokens, component styles, responsive breakpoints
└── js/
    ├── script.js           # Signal lab Butterworth filter, hero canvas, scroll reveals
    ├── main.js             # Additional interactions and animations
    └── terminal-effect.js  # Terminal typing effect animation
```

**No build tools, no bundlers.** Open `index.html` in a browser and it works.

---

## 🚀 Run Locally

```bash
# Clone
git clone https://github.com/prjawal21/portfolio.git
cd portfolio

# Serve (any static server works)
npx serve .
# → http://localhost:3000
```

Or just open `index.html` directly in your browser.

---

## 📊 GitHub Stats

<div align="center">

<img src="https://github-readme-stats.vercel.app/api?username=prjawal21&show_icons=true&theme=github_dark&hide_border=true&bg_color=12151A&title_color=F2A93B&icon_color=4FD1C5&text_color=ECEAE4" height="165" />
<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=prjawal21&layout=compact&theme=github_dark&hide_border=true&bg_color=12151A&title_color=F2A93B&text_color=ECEAE4" height="165" />

</div>

---

## 🎓 Certifications

| Certification | Issuer | Date |
|:---|:---|:---|
| OCI AI Foundation Associate | Oracle | Sep 2025 |
| AWS Fundamentals | Scaler | Jul 2025 |
| Advanced Python | Infosys Springboard | May 2025 |

---

## 📬 Contact

Actively looking for **ML Engineer**, **Computer Vision**, or **GenAI Engineer** roles in Bengaluru.

| Channel | Link |
|:---|:---|
| 📧 Email | [prajwalp2125@gmail.com](mailto:prajwalp2125@gmail.com) |
| 💼 LinkedIn | [linkedin.com/in/prajwal-p](https://linkedin.com/in/prajwal-p-822169257/) |
| 🐙 GitHub | [github.com/prjawal21](https://github.com/prjawal21) |
| 🌐 Portfolio | [calm-peony-627fcb.netlify.app](https://calm-peony-627fcb.netlify.app/) |

---

<div align="center">

<sub>© 2026 Prajwal P. Built while cleaning up someone else's noisy sensor data.</sub>

</div>
