# VSCT Photography Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Contentful](https://img.shields.io/badge/Contentful-2D4F92?style=for-the-badge&logo=contentful&logoColor=white)](https://www.contentful.com/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)

A modern, responsive photography portfolio website built using Next.js for the frontend and Contentful as a headless CMS for managing photo galleries and content.

## ✨ Features

- **Dynamic Galleries:** Photo galleries are fetched dynamically from Contentful.
- **Content Management:** Easily update galleries, photos, and site text via the Contentful interface.
- **Responsive Design:** Optimized for viewing on various screen sizes using Tailwind CSS.
- **Fast Performance:** Leverages Next.js features like Static Site Generation (SSG) or Server-Side Rendering (SSR) for optimal loading speeds (dependent on implementation within `[slug].js` and `index.js`).
- **Clean Codebase:** Structured using standard Next.js conventions and linted with ESLint.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **CMS:** [Contentful](https://www.contentful.com/) (Headless)
- **Language:** JavaScript
- **Linting:** [ESLint](https://eslint.org/)
- **Package Manager:** npm

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Contentful](https://www.contentful.com/) account and a Space set up with your desired content models (e.g., Gallery, Photo).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd vsct-photography
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project. Add your Contentful API keys and Space ID:

    ```plaintext
    # .env.local

    CONTENTFUL_SPACE_ID=<your_space_id>
    CONTENTFUL_ACCESS_TOKEN=<your_delivery_api_access_token>
    # Optional: Add preview token if using Contentful preview API
    # CONTENTFUL_PREVIEW_ACCESS_TOKEN=<your_preview_api_access_token>
    # Optional: Specify environment if not 'master'
    # CONTENTFUL_ENVIRONMENT=master
    ```

    - You can find your Space ID and create API keys in your Contentful Space settings under `Settings` > `API keys`. Use the _Content Delivery API_ access token for `CONTENTFUL_ACCESS_TOKEN`.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌱 Environment Variables

This project requires the following environment variables to connect to Contentful:

- `CONTENTFUL_SPACE_ID`: Your Contentful Space ID.
- `CONTENTFUL_ACCESS_TOKEN`: Your Contentful Content Delivery API (CDA) Access Token.
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` (Optional): Your Contentful Content Preview API (CPA) Access Token, if you intend to fetch draft content.
- `CONTENTFUL_ENVIRONMENT` (Optional): The Contentful environment you want to use (defaults typically to `master`).

Make sure these are set in your `.env.local` file for local development and configured in your deployment environment.

## 🚀 Pushing to Production

[Vercel](https://vercel.com/) is a recommended platform for deploying Next.js applications.

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Configure the Environment Variables (as listed above) in the Vercel project settings.
4.  Deploy! Vercel will automatically build and deploy your site.

## 📄 License

(Optional: Specify your license here, e.g., MIT)
