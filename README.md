# Mystery Messager 💌

**Mystery Messager** is a full-stack web application built with **Next.js** that lets users send **anonymous messages** to others. It uses **Gemini API** for smart message suggestions, **NextAuth.js** for secure authentication, **MongoDB** for storing messages, and **Nodemailer** for OTP-based verification.

---

## 🎯 Purpose

Mystery Messager was developed to offer a playful and secure platform for **sending anonymous messages**, whether for fun, feedback, or confessions — all while maintaining privacy.

---

## 🚀 Features

* 💬 Send messages anonymously  
* 🤖 Get smart AI-generated message suggestions using **Gemini API**  
* 🔐 Secure user authentication with **NextAuth.js**  
* ✉️ OTP verification using **Nodemailer**  
* 🧠 Store messages in **MongoDB**  
* 🌐 Built using **Next.js (Full Stack)**  

---

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/)  
* **AI Integration**: [Gemini API](https://ai.google.dev/)  
* **Authentication**: [NextAuth.js](https://next-auth.js.org/)  
* **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)  
* **Email Service**: [Nodemailer](https://nodemailer.com/about/)  
* **Styling**: Tailwind CSS  
* **Deployment**: Vercel  

---

## 📁 Project Structure

```

src/
├── app/             # Application routing and core pages
│   ├── (app)/       # Main public routes
│   ├── (auth)/      # Auth-specific routes (login/signup)
│   ├── api/         # API route handlers
│   └── u/           # User-specific pages or features
├── components/      # Reusable React components
├── context/         # Global state providers (e.g., auth, UI)
├── helpers/         # Utility/helper functions
├── lib/             # DB, auth, and config utilities
├── model/           # MongoDB Mongoose models
├── schemas/         # Zod schemas and validations
├── types/           # TypeScript type definitions
├── globals.css      # Global styles
├── layout.tsx       # Root layout for Next.js app
└── page.tsx         # Root page component

public/
└── favicon.ico      # Site favicon

emails/              # Custom email templates
middleware.ts        # Next.js middleware (e.g., auth guards)
messages.json        # Gemini API prompt suggestions
.env                 # Environment variables
.eslintrc.json       # ESLint configuration
.gitignore           # Git ignore file

````

---

## 🚧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+  
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)  
- Google OAuth client credentials  
- Gemini API Key  

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Karthik1772/Mystery_Messager.git
   cd Mystery_Messager


2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file and add the following:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_SERVER=smtp.ethereal.email
   EMAIL_USER=your_email_username
   EMAIL_PASSWORD=your_email_password
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Demo

> You can try out the hosted version of Mystery Messager here:

👉 [https://mystery-messager.vercel.app](https://mystery-messager.vercel.app)

---

## ✉️ OTP via Email

Mystery Messager uses **Nodemailer** to send OTPs to users' email addresses during signup/login for enhanced security.
Be sure to configure a valid SMTP provider in your environment settings.

---

## 🤝 Contributing

Open to collaborations and feedback!
Fork this repo, make your changes, and raise a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🧑‍💻 Author

**Karthik S Kashyap**
[GitHub](https://github.com/Karthik1772) • [LinkedIn](https://www.linkedin.com/in/karthik-s-kashyap/) • [Portfolio](https://karthik-s-kashyap.vercel.app/)

