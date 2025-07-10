# Project Iron Ingot

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vercel Deploy](https://img.shields.io/badge/demo-vercel-blue?logo=vercel)](https://uccingo.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/computerscience-ucc/project-iron-ingot)

## Overview
Project Iron Ingot is a full-stack web application designed for the Computer Science Council. It features a modern frontend built with Next.js and Tailwind CSS, and a backend powered by Sanity.io for content management. The project is organized into two main folders: `frontend` and `backend`.

---

## Features
- **Council Members Page:** Displays a list of council members and class presidents with their roles.
- **Blog, Bulletin, and Thesis Sections:** Dynamic content managed via Sanity backend.
- **Modern UI:** Responsive design using Tailwind CSS.
- **Content Management:** Easily update content through Sanity Studio.

---

## Folder Structure
```
project-iron-ingot/
├── backend/                  # Sanity.io CMS backend
│   ├── LICENSE               # Backend license file
│   ├── package.json          # Backend dependencies and scripts
│   ├── README.md             # Backend documentation
│   ├── sanity.json           # Sanity project config
│   ├── tsconfig.json         # TypeScript config (if used)
│   ├── config/               # Sanity configuration files
│   │   └── @sanity/          # Sanity UI and form builder configs
│   ├── plugins/              # Sanity plugins (if any)
│   └── schemas/              # Sanity schemas for content types
│       ├── blog.js           # Blog schema
│       ├── bulletin.js       # Bulletin schema
│       ├── schema.js         # Main schema file
│       ├── thesis.js         # Thesis schema
│       └── documents/        # Document schemas (e.g., author.js)
│           └── author.js     # Author schema
│   └── static/               # Static assets for backend (e.g., favicon)
│       └── favicon.ico
├── frontend/                 # Next.js frontend
│   ├── LICENSE               # Frontend license file
│   ├── next.config.js        # Next.js config
│   ├── package.json          # Frontend dependencies and scripts
│   ├── postcss.config.js     # PostCSS config
│   ├── README.md             # Frontend documentation
│   ├── tailwind.config.js    # Tailwind CSS config
│   ├── components/           # React components
│   │   ├── _Animations.js    # Animation utilities
│   │   ├── BlobBackground.js # Background component
│   │   ├── CardSkeleton.js   # Skeleton loader
│   │   ├── Footer.js         # Footer component
│   │   ├── Navbar.js         # Navbar component
│   │   ├── Prefetcher.js     # Prefetch utility
│   │   ├── TopGradient.js    # Top gradient component
│   │   └── card/             # Card components for blog, bulletin, thesis
│   │       ├── Blog.js
│   │       ├── Bulletin.js
│   │       └── Thesis.js
│   ├── pages/                # Next.js pages
│   │   ├── _app.js           # App entry (global providers, styles)
│   │   ├── index.js          # Home page
│   │   ├── about/            # About section
│   │   │   ├── index.js      # About overview
│   │   │   └── page/         # About subpages
│   │   │       ├── council.js    # Council members page
│   │   │       ├── mis.js        # Management Information Systems page
│   │   │       ├── team.js       # Team page
│   │   ├── blog/             # Blog section
│   │   │   ├── [slug].js     # Dynamic blog post page
│   │   │   └── index.js      # Blog list page
│   │   ├── bulletin/         # Bulletin section
│   │   │   ├── [slug].js     # Dynamic bulletin post page
│   │   │   └── index.js      # Bulletin list page
│   │   └── thesis/           # Thesis section
│   │       ├── [slug].js     # Dynamic thesis post page
│   │       └── index.js      # Thesis list page
│   ├── public/               # Static assets (images, icons)
│   │   ├── Blob.svg
│   │   ├── favicon.ico
│   │   ├── logo.svg
│   │   ├── meshgradient.jpg
│   │   ├── meshgradient1.jpg
│   │   ├── meshgradient2.jpg
│   │   ├── solar_System.png
│   │   ├── vercel.svg
│   │   └── wave.svg
│   └── styles/               # Global and Tailwind styles
│       └── globals.css
└── README.md                 # Project documentation
```

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js) or yarn
- Internet connection (for installing dependencies and running Sanity Studio)

### 1. Clone the Repository
Clone the project to your local machine:
```sh
git clone <repo-url>
cd project-iron-ingot
```

### 2. Install Dependencies
Install dependencies for both backend and frontend:
```sh
cd backend
npm install
cd ../frontend
npm install
```

### 3. Set Up Environment Variables (Optional)
If your project requires environment variables (e.g., API keys), create a `.env.local` file in the `frontend` or `backend` folder as needed. Refer to the documentation or sample files if provided.

Example:
```env
# .env.local (frontend)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-01-01
```

### 4. Run the Backend (Sanity Studio)
Start the Sanity Studio for content management:
```sh
cd backend
npm run dev
```
Sanity Studio will be available at [http://localhost:3333](http://localhost:3333) by default.

### 5. Run the Frontend (Next.js)
Start the Next.js development server:
```sh
cd frontend
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

### 6. Access the Application
- Visit [http://localhost:3000](http://localhost:3000) for the frontend.
- Visit [http://localhost:3333](http://localhost:3333) for the Sanity Studio backend.

---

## Customization
- **Council Members:** Edit `frontend/pages/about/page/council.js` to update council members and class presidents.
- **Content Types:** Modify or add schemas in `backend/schemas/` for new content types.
- **Styling:** Update Tailwind config or CSS files in `frontend/styles/`.

---

## Deployment
- **Frontend:** Can be deployed to Vercel, Netlify, or any Node.js hosting.
- **Backend:** Sanity Studio can be deployed to Sanity's cloud or self-hosted.

---

## License
This project is licensed under the MIT License.

---

## Credits
- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Sanity.io](https://www.sanity.io/).
- Developed by the Computer Science Council.

---

## Demo
- **Live Website:** [https://uccingo.vercel.app/](https://uccingo.vercel.app/)
- **Backend (Sanity Studio):** [https://ucc-ingo.sanity.studio/desk](https://ucc-ingo.sanity.studio/desk)

---

## Screenshots
<!--
Add screenshots or GIFs of your app below. Example:
![Homepage Screenshot](./frontend/public/your-screenshot.png)
-->

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## FAQ / Troubleshooting
- **Q:** The frontend or backend won't start.
  **A:** Make sure you have installed all dependencies in both `frontend` and `backend` folders.
- **Q:** How do I update council members?
  **A:** Edit `frontend/pages/about/page/council.js`.
- **Q:** Where do I manage blog/bulletin/thesis content?
  **A:** Use the Sanity Studio backend.

---

## Contact & Support
- **GitHub:** [Project Repository](https://github.com/computerscience-ucc/project-iron-ingot)
- **Email:** ucc.computersciencecouncil@gmail.com

For backend access, sign in with GitHub using the above email. If you need further help, open an issue on GitHub.
