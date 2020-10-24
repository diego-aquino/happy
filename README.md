<p align="center">
  <img src="./.github/logo.svg" alt="Happy" width="300">
</p>
<p align="center">
  Visit orphanages and bring joy to eager-for-love children
</p>

---

<p align="center">
    <a href="https://github.com/diego-aquino">
        <img alt="Author: Diego Aquino" src="https://img.shields.io/badge/author-Diego%20Aquino-FFD666">
    </a>
    <img alt="Language Count" src="https://img.shields.io/github/languages/count/diego-aquino/proffy.svg?color=FFD666">
    <a href="./LICENSE">
        <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-FFD666">
    </a>
    <img alt="NLW #3" src="https://img.shields.io/badge/-NLW%20%233-FFD666">
</p>

<p align="center">
    <a href="#rocket-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#gear-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#computer-try-it">Try it</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#newspaper_roll-license">License</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#handshake-acknowledgments">Acknowledgments</a>
</p>

<!-- <img alt="Demonstration Gif" src=".github/demo.gif"> -->

## :rocket: Features

- Welcoming **landing page**
- In-app, realtime, and interactive **map**
- **Registration of orphanages**, with support to details such as name and opening hours, images and location (selected directly from the in-app map)
- **Orphanage details** page, showing information about the organization and instructions for visitors
- **Web** and **Mobile** versions

> ***Extras:***
  - Support to contact orphanages directly via **Whatsapp**
  - **Validation** on orphanages registration (to ensure that all entered fields are valid)

## :gear: Technologies

The main technologies used in this project are the following:

- [**TypeScript**](https://www.typescriptlang.org/)
- [ReactJS](https://reactjs.org/)
- [React Native](https://reactnative.dev/) + [Expo](https://expo.io/)
- [Node.js](https://nodejs.org/en/) + [SQLite3](https://www.npmjs.com/package/sqlite3)

## :computer: Try it

To clone and run this application, you'll need [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/) installed on your computer. Then, from your command line:
```bash
git clone https://github.com/diego-aquino/happy.git
cd happy/
```

### :wrench: Running locally
This project is a divided into three parts: **backend**, **web** and **mobile**.

#### :yellow_circle: Backend

To use the **web** and the **mobile** versions, you will need to start the backend.

1. Access `/backend` and install its dependencies
    ```bash
    cd backend
    yarn
    ```

2. Initiate the Backend development server
    ```bash
    yarn dev
    ```

#### :large_blue_circle: Web

With the backend running, you can start the Web version. In order to do that, open a **new** terminal and do the following steps:

1. Access `/web` and install its dependencies
    ```bash
    cd web
    yarn
    ```

2. Initiate the Web development server
    ```bash
    yarn start
    ```

Then, a new browser tab will open up at `https://localhost:3000` with *Happy Web*!

#### :red_circle: Mobile

With the backend running, you can also start the Mobile version. To do that, open a **new** terminal and follow these steps:

1. Access `/mobile` and install its dependencies
    ```bash
    cd web
    yarn
    ```
2. Install `expo-cli` globally
    ```bash
    yarn global add expo-cli
    ```

3. Initiate the Expo server
    ```bash
    yarn start
    ```
The Expo Dev Tools will open up in a new browser tab. If you have the [Expo Client](https://expo.io/tools#client) app installed on your smartphone, go to the app and scan the QRCode on the screen of your computer. After that, you'll be connected to *Happy Mobile*!

## :newspaper_roll: License

This project if under MIT License. Check [LICENSE](./LICENSE) for more information.

## :handshake: Acknowledgments

This application was developed during the **Next Level Week #3**, an online event hosted by [Rocketseat](https://rocketseat.com.br/), designed to help devs hone their abilities by building a real project from scratch, while growing and sharing knowledge with the community.
Especial thanks to [Rocketseat](https://rocketseat.com.br/) for creating such a rich learning environment!

---

Made by [Diego Aquino](https://github.com/diego-aquino/) :sunglasses:. [Connect with me!](https://www.linkedin.com/in/diego-aquino) :wave:
