# 🚗 CarnetAuto - Car Maintenance Tracker

**CarnetAuto** este o aplicație web completă care te ajută să gestionezi mașinile tale, alimentările cu combustibil, reparațiile, alertele (ITP, RCA etc.) și abonamentele. Include suport pentru autentificare clasică și cu Google, integrare Stripe pentru planuri plătite și suport multi-utilizator.

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **ORM:** Prisma + PostgreSQL
- **Autentificare:** JWT + Google OAuth
- **Plăți:** Stripe Checkout + Webhooks
- **Altele:** Passport.js, CORS, dotenv, morgan, express-session

---

## Autentificare
- Autentificare cu email și parolă (bcrypt)
- Autentificare cu Google (OAuth 2.0)
- JWT pentru protejarea rutelor private

## 💳 Abonamente
- Integrare completă cu Stripe:

- Checkout

- Webhooks pentru actualizare automată plan

- Planuri posibile:

- Free: max 1 mașină

- Pro: nelimitat

- Fleet: pentru companii

## 🛠 Funcționalități
- ✅ Autentificare și înregistrare

- ✅ Mașini (adăugare, ștergere, listare)

- ✅ Alimentări (combustibil, preț, litri, kilometri)

- ✅ Reparații (descriere, cost, dată, service)

- ✅ Remindere (ITP, RCA, ulei etc.)

- ✅ Alerte automate (email/SMS opțional)

- ✅ Stripe Checkout + webhook

- ✅ Planuri personalizate per utilizator
---

## 🔧 Setup local

### 1. Clonează proiectul

```bash
git clone https://github.com/numele-tau/carnetauto-backend.git
cd carnetauto-backend
```