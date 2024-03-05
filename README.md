# OpenMusic

## Overview
OpenMusic is a dynamic web application built upon the Jamstack architectural approach. Leveraging the power of Express, React, and MongoDB, OpenMusic provides a comprehensive platform for musicians to publish their own songs seamlessly. The user interface is crafted with Material UI to ensure a modern and intuitive experience for both artists and audiences.

## Features
- **Jamstack Architecture:** OpenMusic adopts a Jamstack architectural approach, ensuring high performance, security, and scalability.
- **Express & Node.js:** The backend of OpenMusic is powered by Express, providing robust server-side functionality and seamless integration with frontend technologies.
- **React:** The frontend of OpenMusic is developed using React, offering a dynamic and interactive user experience.
- **MongoDB:** OpenMusic utilizes MongoDB as its database solution, enabling efficient storage and retrieval of music data.
- **Material UI:** The user interface of OpenMusic is designed with Material UI, offering a sleek and responsive design that enhances user engagement.

## Prerequisites
To run OpenMusic locally, ensure that you have Node.js installed on your system. Additionally, make sure to set up the required environmental values: MONGODB_URI, JWT_SECRET, and UPLOADS_PATH.

## Getting Started
To get started with OpenMusic, follow these steps:
1. Clone the repository to your local machine.
2. Install the necessary dependencies using npm or yarn.
3. Set up the required environmental values: MONGODB_URI, JWT_SECRET, and UPLOADS_PATH.
4. Start the server using the provided npm scripts.

```bash
# Clone the repository
git clone https://github.com/juhopohjonen/openmusic-app

# Navigate to the projects server directory
cd openmusic-app/server

# Install dependencies
npm install

# Set environmental values
export MONGODB_URI=<your-mongodb-uri>
export JWT_SECRET=<your-jwt-secret>
export UPLOADS_PATH=<your-uploads-path>

# Transpile TypeScript and start the server
npm run build
npm start
```

## Contribution
Contributions to OpenMusic are welcome!