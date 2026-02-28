# DevEvent - The Hub for Developer Events

DevEvent is a modern, responsive web application designed for developers to discover and create tech events. Whether you're looking for hackathons, meetups, or conferences, DevEvent provides a centralized platform to find the most exciting opportunities in the tech ecosystem.

## 🚀 Features

- **Responsive & Modern UI**: A sleek, dark-themed interface built with Tailwind CSS, featuring glassmorphism and smooth animations.
- **Responsive Navbar**: A mobile-first navigation system with a hidden-on-desktop hamburger menu and right-aligned links.
- **Event Discovery**: An automated listing of events, consistently sorted by date (nearest first) so you never miss a deadline.
- **Event Creation**: A comprehensive form for users to add new events, including details like venue, date, time, and agenda.
- **Booking System**: Integrated event booking functionality for developers to secure their spots.
- **Contact Support**: Built-in contact feature for event lifecycle management (updates/deletions) via a pre-filled email template.
- **Optimized Data Layer**: Specialized serialization logic to ensure seamless data flow between MongoDB (Mongoose) and Next.js Server Components.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components, Cache Components)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [PostHog](https://posthog.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

### Prerequisites

- Node.js installed on your machine.
- A MongoDB database (local or Atlas Atlas).
- Environment variables configured in a `.env` file.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Raphaelcoolj/dev-event.git
    cd dev-event
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Acknowledgement

This project was initially inspired by and based on a course from **JSMastery**. I have since built upon that foundation, implementing numerous custom features, structural improvements, and fixing critical serialization and responsiveness issues to make it a more robust and professional application.

## 🔗 Author

Developed and maintained by **[Raphaelcoolj](https://github.com/Raphaelcoolj)**.
