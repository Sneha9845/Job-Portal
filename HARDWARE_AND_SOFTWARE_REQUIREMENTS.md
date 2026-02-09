
# 2.4 Hardware and Software Requirements

Ensuring the successful development, deployment, and usage of the Job Portal application requires specific hardware and software configurations. These requirements are categorized into two distinct environments: the **Development Environment** (used by the engineering team to build the software) and the **Client/Production Environment** (used by the end-users: the unskilled workers and administrators).

## 2.4.1 Development Environment Requirements

The following configurations were necessary to build, compile, and run the modern Next.js 14 architecture efficiently.

### **Hardware Requirements (Developer Machine)**
*   **Processor (CPU)**: A multi-core processor is essential for handling the heavy compilation tasks of Webpack and Next.js.
    *   *Minimum*: Intel Core i5 (8th Gen) or AMD Ryzen 5.
    *   *Recommended*: Intel Core i7 or Apple M1/M2 Silicon for faster hot-reloading times during development.
*   **Random Access Memory (RAM)**: The development server, coupled with TypeScript type-checking and database connections, consumes significant memory.
    *   *Minimum*: 8 GB RAM.
    *   *Recommended*: 16 GB RAM or higher to run containers (Docker) and browser dev tools simultaneously without lag.
*   **Storage**: A Solid State Drive (SSD) is critical for rapid file I/O operations, significantly reducing the `npm install` and project build times.
    *   *Requirement*: At least 256 GB SSD with 10 GB of free space dedicated to project files and `node_modules`.
*   **Network**: A stable broadband internet connection is required for fetching npm packages, pushing code to GitHub, and connecting to the remote MongoDB Atlas database.

### **Software Requirements (Developer Machine)**
*   **Operating System**: Windows 10/11 (Architecture used in this project), macOS, or Linux (Ubuntu 20.04+).
*   **Node.js Runtime**: The core execution environment.
    *   *Version*: Node.js v18.17.0 or later (Required by Next.js 14).
*   **Package Manager**: `npm` (Node Package Manager) or `pnpm` for managing project dependencies like `mongoose` and `tailwindcss`.
*   **Code Editor / IDE**: Visual Studio Code (VS Code) is the primary editor used, chosen for its excellent TypeScript integration.
    *   *Required Extensions*: ESLint, Prettier, Tailwind CSS IntelliSense, and ES7+ React Snippets.
*   **Version Control**: Git for source code management to track changes and collaborate.
*   **API Client**: Postman or Thunder Client (VS Code extension) for testing backend API routes (e.g., `/api/workers/register`) independently of the frontend.

---

## 2.4.2 Client & Production Environment Requirements

The application is designed to be lightweight and accessible, minimizing the barrier to entry for its target audience.

### **Server-Side (Deployment)**
Since the application uses Next.js serverless functions, traditional dedicated server hardware is not strictly required.
*   **Hosting Platform**: Vercel (recommended) or any cloud provider supporting Node.js (AWS EC2, DigitalOcean).
*   **Database Hosting**: MongoDB Atlas (Cloud) M0 Sandbox or higher cluster tier.
    *   requirements: High availability and daily automated backups.

### **End-User Requirements (The Workers)**
The primary user base consists of unskilled laborers who likely rely on mobile connectivity. The "Hardware" here refers to their personal devices.
*   **Device Context**: The application follows a "Mobile-First" design philosophy.
*   **Hardware**:
    *   Any basic smartphone (Android or iOS) released in the last 5-6 years.
    *   *Minimum Screen Size*: 320px width (older Android devices).
    *   *RAM*: Functionality is optimized to run smoothly even on devices with 2 GB RAM.
*   **Software (Browser)**:
    *   A modern web browser with JavaScript enabled (Google Chrome, Mozilla Firefox, Safari, or Opera Mini).
    *   *Note*: The application utilizes progressive web technologies, so no app store installation is required; it runs directly via a URL.
*   **Network**:
    *   Optimized for 3G/4G speeds. Images and icons (Lucide React) are SVG-based or optimized webp formats to ensure fast loading times in areas with spotty connectivity.

### **End-User Requirements (The Administrators)**
*   **Hardware**: A standard Desktop PC or Laptop is recommended for the Admin Dashboard to visualize data tables and maps comfortably.
*   **Software**: Any standard modern web browser (Edge, Chrome) to access the secured `/admin` routes.
