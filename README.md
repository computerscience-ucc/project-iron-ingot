# Project Iron Ingot

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vercel Deploy](https://img.shields.io/badge/demo-vercel-blue?logo=vercel)](https://uccingo.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/computerscience-ucc/project-iron-ingot)

## Overview
Project Iron Ingot is a full-stack web application designed for the Computer Science Council. It features a modern frontend built with Next.js and Tailwind CSS, and a backend powered by Sanity.io for content management. The project is organized into two main folders: `frontend` and `backend`.

---

## 🛠️ Tech Stack & Architecture

### Frontend Technologies
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Next.js** | 12+ | React framework for production | [Next.js Docs](https://nextjs.org/docs) |
| **React** | 18+ | UI library for building components | [React Docs](https://reactjs.org/docs) |
| **Tailwind CSS** | 3+ | Utility-first CSS framework | [Tailwind Docs](https://tailwindcss.com/docs) |
| **Framer Motion** | 6+ | Animation library | [Framer Motion Docs](https://www.framer.com/motion/) |
| **JavaScript (ES6+)** | Latest | Programming language | [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |

### Backend Technologies
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| **Sanity.io** | Latest | Headless CMS & content platform | [Sanity Docs](https://www.sanity.io/docs) |
| **Sanity Studio** | 3+ | Content editing interface | [Studio Docs](https://www.sanity.io/docs/sanity-studio) |
| **GROQ** | Latest | Query language for Sanity | [GROQ Docs](https://www.sanity.io/docs/groq) |

### Development & Build Tools
| Tool | Purpose | Configuration File |
|------|---------|-------------------|
| **npm/yarn** | Package management | `package.json` |
| **ESLint** | Code linting | `.eslintrc.json` |
| **PostCSS** | CSS processing | `postcss.config.js` |
| **Git** | Version control | `.gitignore` |
| **VS Code** | Development environment | `.vscode/settings.json` |

### Deployment & Hosting
| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Vercel** | Frontend hosting & deployment | `vercel.json` |
| **Sanity Cloud** | Backend CMS hosting | `sanity.json` |
| **GitHub** | Source code repository | Repository settings |
| **Custom Domain** | Production URL | DNS configuration |

### Key Dependencies

#### Frontend Dependencies (`frontend/package.json`)
```json
{
  "dependencies": {
    "next": "^12.2.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^6.5.1",
    "@sanity/client": "^3.3.6",
    "@sanity/image-url": "^1.0.1"
  },
  "devDependencies": {
    "@types/node": "^18.6.1",
    "autoprefixer": "^10.4.7",
    "eslint": "^8.20.0",
    "eslint-config-next": "^12.2.2",
    "postcss": "^8.4.14",
    "tailwindcss": "^3.1.6"
  }
}
```

#### Backend Dependencies (`backend/package.json`)
```json
{
  "dependencies": {
    "@sanity/base": "^2.34.0",
    "@sanity/core": "^2.34.0",
    "@sanity/default-layout": "^2.34.0",
    "@sanity/default-login": "^2.34.0",
    "@sanity/desk-tool": "^2.34.0",
    "@sanity/vision": "^2.34.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  }
}
```

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Users/Clients │    │   GitHub Repo   │    │   Developers    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Vercel (CDN)   │◄───┤  Auto Deploy   │    │ Local Dev Env   │
│  Next.js App    │    │   on Push      │    │ localhost:3000  │
└─────────┬───────┘    └─────────────────┘    └─────────────────┘
          │
          ▼ API Calls
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Sanity Cloud   │◄───┤ Sanity Studio   │◄───┤   Content Team  │
│   Content API   │    │   CMS Admin     │    │   Editors       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow Architecture

```
Frontend (Next.js)
     │
     ▼ GROQ Queries
Sanity Client
     │
     ▼ HTTP/HTTPS
Sanity API
     │
     ▼
Content Lake (Sanity Cloud)
     ▲
     │ Content Updates
Sanity Studio
     ▲
     │
Content Editors
```

### Security Features
- **HTTPS Everywhere**: All communications encrypted
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data protection
- **Sanity Permissions**: Role-based content access
- **Vercel Security**: Built-in security headers

### Performance Optimizations
- **Static Site Generation (SSG)**: Pre-built pages for faster loading
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic bundle splitting
- **CDN Distribution**: Global content delivery via Vercel
- **Caching Strategy**: Browser and API response caching

---

## Features
- **Council Members Page:** Displays a list of council members and class presidents with their roles.
- **Blog, Bulletin, and Thesis Sections:** Dynamic content managed via Sanity backend.
- **Modern UI:** Responsive design using Tailwind CSS.
- **Content Management:** Easily update content through Sanity Studio.

---

## 🚀 Future Plans & Development Roadmap

### Current Development Status
The **uccingo.vercel.app** website is currently in active development. We are continuously studying and improving how to fully utilize this platform to serve the Computer Science community better.

### 📋 Upcoming Features

#### 1. **Workshop Outputs & Documentation** 📚
- **Workshop Repository**: Archive of all conducted workshops with materials and outcomes
- **Learning Resources**: Downloadable resources, tutorials, and guides from workshops
- **Participant Feedback**: Collection and display of workshop evaluations and testimonials
- **Workshop Calendar**: Schedule of upcoming workshops and events

#### 2. **Project Showcases** 🎯
- **Featured Projects**: Spotlight on outstanding student and committee projects
- **Project Categories**: Organized by technology stack, complexity, and academic level
- **Interactive Demos**: Live previews and demonstrations of web-based projects
- **Success Stories**: Case studies of impactful projects and their outcomes

#### 3. **Future Events Management** 📅
- **Event Calendar**: Interactive calendar showing upcoming CS council events
- **Event Registration**: Online registration system for workshops, seminars, and activities
- **Event Announcements**: Automated notifications for new events and updates
- **Past Events Archive**: Historical record of all council activities

#### 4. **Gallery of Projects** 🏆
*This is our most exciting planned feature!*

**Vision**: Create a comprehensive showcase platform where Computer Science students can proudly display their academic projects, capstone works, and personal coding achievements to inspire and be inspired by their peers.

**Key Components**:
- **Student Project Portfolio**: Individual student profiles with their project collections
- **Capstone Showcase**: Dedicated section for final year capstone projects
- **Programming Portfolio**: Code snippets, algorithms, and mini-projects
- **Innovation Hub**: Creative and innovative student solutions
- **Collaboration Board**: Platform for students to find project collaborators

**Benefits**:
- 🌟 **Inspiration**: Help students discover new ideas and approaches
- 🤝 **Networking**: Connect students with similar interests and skills
- 📈 **Career Development**: Build portfolios for internships and job applications
- 🎓 **Academic Recognition**: Showcase academic excellence and achievements
- 💡 **Knowledge Sharing**: Learn from others' code and project structures

### 🎯 Target Implementation Timeline

#### Phase 1: Content Foundation (Q1 2025)
- [ ] Workshop materials upload system
- [ ] Basic project submission forms
- [ ] Event management backend
- [ ] User authentication system

#### Phase 2: Gallery Development (Q2 2025)
- [ ] Student profile creation
- [ ] Project upload and categorization
- [ ] Search and filter functionality
- [ ] Rating and comment system

#### Phase 3: Community Features (Q3 2025)
- [ ] Student collaboration tools
- [ ] Project collaboration matching
- [ ] Mentorship program integration
- [ ] Achievement badges and recognition

#### Phase 4: Advanced Features (Q4 2025)
- [ ] AI-powered project recommendations
- [ ] Code syntax highlighting and previews
- [ ] Integration with GitHub repositories
- [ ] Mobile app development

### 🛠️ Technical Implementation Plans

#### Gallery of Projects - Technical Architecture
```
Gallery System Architecture:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Student User  │    │  Project Upload │    │ Admin Approval  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Authentication  │    │ File Management │    │Content Moderation│
│    System       │    │   & Storage     │    │    Queue        │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Sanity CMS    │◄──►│ Project Gallery │◄──►│ Public Gallery  │
│   (Backend)     │    │   Database      │    │   (Frontend)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Planned Schema Extensions
```javascript
// New Sanity schemas to be added:

// Student Profile Schema
export default {
  name: 'student',
  title: 'Student Profile',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full Name', type: 'string' },
    { name: 'studentId', title: 'Student ID', type: 'string' },
    { name: 'yearLevel', title: 'Year Level', type: 'string' },
    { name: 'specialization', title: 'Specialization', type: 'string' },
    { name: 'bio', title: 'Biography', type: 'text' },
    { name: 'skills', title: 'Technical Skills', type: 'array' },
    { name: 'socialLinks', title: 'Social Media Links', type: 'object' }
  ]
}

// Project Schema
export default {
  name: 'project',
  title: 'Student Project',
  type: 'document',
  fields: [
    { name: 'title', title: 'Project Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'techStack', title: 'Technology Stack', type: 'array' },
    { name: 'githubLink', title: 'GitHub Repository', type: 'url' },
    { name: 'liveDemo', title: 'Live Demo URL', type: 'url' },
    { name: 'screenshots', title: 'Project Screenshots', type: 'array' },
    { name: 'student', title: 'Student', type: 'reference', to: [{ type: 'student' }] }
  ]
}

// Workshop Schema
export default {
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  fields: [
    { name: 'title', title: 'Workshop Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'date', title: 'Workshop Date', type: 'datetime' },
    { name: 'facilitator', title: 'Facilitator', type: 'string' },
    { name: 'materials', title: 'Workshop Materials', type: 'array' },
    { name: 'participants', title: 'Participants', type: 'number' },
    { name: 'outcomes', title: 'Learning Outcomes', type: 'array' }
  ]
}
```

### 🌐 Community Impact Goals

#### For Students:
- **Portfolio Building**: Help students create professional project portfolios
- **Skill Recognition**: Showcase programming and technical skills
- **Peer Learning**: Learn from others' coding styles and project approaches
- **Career Preparation**: Build impressive portfolios for job applications

#### For the Department:
- **Academic Excellence**: Highlight the quality of CS education
- **Student Achievements**: Showcase student accomplishments to stakeholders
- **Industry Relations**: Demonstrate student capabilities to potential employers
- **Continuous Improvement**: Track project trends and skill development

#### For the Institution:
- **Reputation Building**: Showcase innovative student projects externally
- **Alumni Network**: Connect current students with successful graduates
- **Research Opportunities**: Identify potential research collaborations
- **Community Engagement**: Strengthen ties with the local tech community

### 📞 Get Involved

We're actively seeking:
- **Student Contributors**: Help us build features and test the platform
- **Project Submissions**: Share your projects to be featured in our beta gallery
- **Feedback Providers**: Share ideas and suggestions for improvement
- **Beta Testers**: Test new features before official release

**Contact us** to be part of this exciting development journey!

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

### System Requirements
- **Node.js** (v18.x or higher recommended) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control - [Download here](https://git-scm.com/)
- **Internet connection** (for installing dependencies and running Sanity Studio)
- **Code Editor** (VS Code recommended)

### Project Architecture
This project follows a **monorepo structure** with separate frontend and backend:
- **Frontend**: Next.js React application with Tailwind CSS
- **Backend**: Sanity.io headless CMS for content management
- **Database**: Sanity's cloud-hosted content lake
- **Deployment**: Frontend on Vercel, Backend on Sanity Cloud

---

## 📋 Complete Setup Guide

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/computerscience-ucc/project-iron-ingot.git

# Navigate to project directory
cd project-iron-ingot

# Check the project structure
ls -la
```

### Step 2: Backend Setup (Sanity Studio)
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Check if sanity.json exists and is properly configured
cat sanity.json

# Start Sanity Studio in development mode
npm run dev
```

**Expected Output:**
- Sanity Studio will be available at: `http://localhost:3333`
- You should see the Sanity Studio login interface

### Step 3: Frontend Setup (Next.js)
Open a **new terminal window** and run:
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install frontend dependencies
npm install

# Check package.json for available scripts
cat package.json

# Start Next.js development server
npm run dev
```

**Expected Output:**
- Next.js app will be available at: `http://localhost:3000`
- You should see the homepage with navigation

### Step 4: Environment Configuration
Create environment files for both frontend and backend:

#### Frontend Environment (.env.local)
```bash
# In the frontend directory, create .env.local
cd frontend
touch .env.local
```

Add the following content to `frontend/.env.local`:
```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-01-01

# Optional: Add your custom environment variables
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Backend Environment (if needed)
```bash
# In the backend directory, create .env (if required)
cd backend
touch .env
```

### Step 5: Content Management Setup
1. **Access Sanity Studio**: Open `http://localhost:3333`
2. **Login**: Use your GitHub account or create a Sanity account
3. **Configure Schemas**: The project includes pre-configured schemas for:
   - Blog posts
   - Bulletin announcements
   - Thesis submissions
   - Author information

### Step 6: Verify Installation
Run these commands to ensure everything is working:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# In backend directory - check Sanity CLI
cd backend
npx sanity --version

# In frontend directory - check Next.js installation
cd frontend
npx next --version
```

---

## 🚀 Running the Project

### Development Mode
1. **Start Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Access Applications**:
   - **Frontend**: http://localhost:3000
   - **Backend (CMS)**: http://localhost:3333

### Production Build
```bash
# Build frontend for production
cd frontend
npm run build

# Start production server
npm start

# Build and deploy Sanity Studio
cd backend
npm run build
npm run deploy
```

### Common Development Commands
```bash
# Frontend commands
cd frontend
npm run dev          # Start development server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues

# Backend commands
cd backend
npm run dev          # Start Sanity Studio
npm run build        # Build Sanity Studio
npm run deploy       # Deploy to Sanity Cloud
```

---

## 🔧 Configuration Files

### Next.js Configuration (`frontend/next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['cdn.sanity.io'], // For Sanity images
  },
}

module.exports = nextConfig
```

### Tailwind Configuration (`frontend/tailwind.config.js`)
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  },
  plugins: [],
}
```

---

## 🎨 Customization Guide

### Updating Council Members
Edit the council members directly in the code:
```javascript
// frontend/pages/about/page/council.js
const councilMembers = [
  {
    name: "New Member Name",
    position: "New Position",
    // Add more member details
  }
]
```

### Adding New Content Types
1. **Backend Schema Creation**:
```javascript
// backend/schemas/yourNewSchema.js
export default {
  name: 'yourNewSchema',
  title: 'Your New Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }
  ]
}
```

2. **Frontend Component Creation**:
```javascript
// frontend/components/card/YourNewCard.js
export default function YourNewCard({ data }) {
  return (
    <div className="card">
      <h3>{data.title}</h3>
      {/* Your component JSX */}
    </div>
  )
}
```

### Styling Customization
**Tailwind Configuration**:
```javascript
// frontend/tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1e40af',
        'custom-gray': '#6b7280',
      },
      fontFamily: {
        'custom': ['Your Font', 'sans-serif'],
      }
    }
  }
}
```

**Global Styles**:
```css
/* frontend/styles/globals.css */
.your-custom-class {
  /* Your custom styles */
  @apply bg-blue-500 text-white p-4 rounded;
}
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**:
   - **Root Directory**: `frontend`
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **Environment Variables** (in Vercel Dashboard):
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2023-01-01
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build completion
   - Your site will be available at `https://your-app.vercel.app`

### Backend Deployment (Sanity Cloud)
1. **Deploy Studio**:
```bash
cd backend
npm run build
npm run deploy
```

2. **Access Deployed Studio**:
   - Your studio will be available at `https://your-project.sanity.studio`
   - Configure CORS settings in Sanity dashboard

### Custom Domain Setup
1. **Vercel Custom Domain**:
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Sanity Custom Domain** (Optional):
   - Configure in Sanity project settings
   - Set up CNAME record for your domain

### Environment-Specific Deployments
```bash
# Production deployment
npm run build && npm run start

# Staging deployment with different Sanity dataset
NEXT_PUBLIC_SANITY_DATASET=staging npm run dev
```

---

## 🔧 Troubleshooting & FAQ

### Common Issues

#### Build Failures
**Issue**: `Command "yarn run build" exited with 1`
**Solutions**:
1. Check Node.js version (use 18.x or higher)
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Ensure all environment variables are set correctly

#### Sanity Connection Issues
**Issue**: Cannot connect to Sanity backend
**Solutions**:
1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` in environment variables
2. Check Sanity project settings and CORS configuration
3. Ensure Sanity Studio is deployed and accessible

#### Styling Issues
**Issue**: Tailwind CSS not working
**Solutions**:
1. Check if Tailwind is properly imported in `globals.css`
2. Verify `tailwind.config.js` content paths
3. Clear Next.js cache: `rm -rf .next`

### Performance Optimization
```javascript
// next.config.js optimizations
module.exports = {
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
    modern: true,
  }
}
```

### Development Tips
- Use Next.js development tools for debugging
- Enable Sanity's real-time preview for content editing
- Use React DevTools for component inspection
- Implement proper error boundaries for production

---

### Frequently Asked Questions

**Q: How do I update council members?**
A: Edit `frontend/pages/about/page/council.js` directly or create a Sanity schema for dynamic management.

**Q: Can I add new sections to the website?**
A: Yes! Create new schemas in `backend/schemas/` and corresponding pages in `frontend/pages/`.

**Q: How do I customize the design?**
A: Modify `frontend/tailwind.config.js` and `frontend/styles/globals.css` for styling changes.

**Q: Is the website mobile-responsive?**
A: Yes, the website is built with mobile-first responsive design using Tailwind CSS.

**Q: How do I backup my content?**
A: Use Sanity's export functionality: `sanity dataset export production backup.tar.gz`

### Sanity Configuration (`backend/sanity.json`)
```json
{
  "root": true,
  "project": {
    "name": "Project Iron Ingot Backend"
  },
  "api": {
    "projectId": "your_project_id",
    "dataset": "production"
  }
}
```

---

## 📚 Project Documentation

### Application Features
- **🏛️ Council Members Management**: Display council members, their roles, and class presidents
- **📝 Blog System**: Dynamic blog posts managed through Sanity CMS
- **📢 Bulletin Board**: Announcements and notices for the Computer Science Council
- **🎓 Thesis Repository**: Academic thesis submissions and browsing
- **🎨 Modern UI/UX**: Responsive design with smooth animations using Framer Motion
- **⚡ Performance Optimized**: Built with Next.js for server-side rendering and optimal performance

### Technology Stack
#### Frontend
- **Framework**: Next.js 12+ (React-based)
- **Styling**: Tailwind CSS for utility-first styling
- **Animations**: Framer Motion for smooth page transitions
- **Routing**: Next.js file-based routing system
- **State Management**: React hooks and context (if applicable)
- **Image Optimization**: Next.js built-in image optimization

#### Backend
- **CMS**: Sanity.io headless content management system
- **Real-time**: Sanity's real-time database capabilities
- **Media Management**: Sanity's built-in asset management
- **Schema Management**: Structured content types and relationships
- **API**: Auto-generated GraphQL and REST APIs

#### Deployment & DevOps
- **Frontend Hosting**: Vercel (optimized for Next.js)
- **Backend Hosting**: Sanity Cloud
- **Version Control**: Git with GitHub
- **CI/CD**: Automatic deployments via Vercel

### Directory Structure Explained
```
project-iron-ingot/
├── 🗂️ backend/                    # Sanity CMS Backend
│   ├── 📄 sanity.json             # Sanity project configuration
│   ├── 📄 package.json            # Backend dependencies
│   ├── 🗂️ schemas/                # Content type definitions
│   │   ├── 📝 blog.js             # Blog post schema
│   │   ├── 📢 bulletin.js         # Bulletin schema
│   │   ├── 🎓 thesis.js           # Thesis schema
│   │   └── 👤 documents/author.js # Author information schema
│   └── 🗂️ static/                 # Static assets for backend
├── 🗂️ frontend/                   # Next.js Frontend Application
│   ├── 📄 package.json            # Frontend dependencies & scripts
│   ├── ⚙️ next.config.js          # Next.js configuration
│   ├── 🎨 tailwind.config.js      # Tailwind CSS configuration
│   ├── 🧩 components/             # Reusable React components
│   │   ├── 🎬 _Animations.js      # Animation utilities
│   │   ├── 🌐 Navbar.js           # Navigation component
│   │   ├── 🦶 Footer.js           # Footer component
│   │   └── 🗂️ card/              # Card components for content types
│   ├── 📄 pages/                  # Next.js pages (auto-routing)
│   │   ├── 🏠 index.js            # Homepage
│   │   ├── 🏛️ about/council.js    # Council members page
│   │   ├── 📝 blog/[slug].js      # Dynamic blog post pages
│   │   ├── 📢 bulletin/[slug].js  # Dynamic bulletin pages
│   │   └── 🎓 thesis/[slug].js    # Dynamic thesis pages
│   ├── 🖼️ public/                 # Static assets (images, icons)
│   └── 🎨 styles/globals.css      # Global CSS styles
└── 📖 README.md                   # Project documentation (this file)
```

---

## 🛠️ Development Workflow

### Adding New Content Types
1. **Create Schema** in `backend/schemas/`:
```javascript
// backend/schemas/newContentType.js
export default {
  name: 'newContentType',
  title: 'New Content Type',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    // Add more fields as needed
  ]
}
```

2. **Register Schema** in `backend/schemas/schema.js`:
```javascript
import newContentType from './newContentType'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    // Existing schemas...
    newContentType,
  ]),
})
```

3. **Create Frontend Page** in `frontend/pages/`:
```javascript
// frontend/pages/new-content/index.js
import { useState, useEffect } from 'react'

export default function NewContentPage() {
  // Fetch data from Sanity
  // Render content
}
```

### Adding New Pages
1. Create a new file in `frontend/pages/` directory
2. Export a React component as default
3. Use Next.js routing conventions (`[slug].js` for dynamic routes)
4. Add navigation links in `frontend/components/Navbar.js`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use the existing color scheme defined in the design

### Content Management
- Access Sanity Studio at `http://localhost:3333`
- Create, edit, and publish content through the visual interface
- Content changes are reflected immediately on the frontend
- Use Sanity's real-time collaboration features for team editing

---
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
