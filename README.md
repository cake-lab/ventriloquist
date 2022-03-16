<h1 align="center">ventriloquist</h1>
<p align="center">ventriloquist is a browser-based VTubing app inspired by <a href="https://www.cs.purdue.edu/cgvlab/papers/popescu/2021ISMARAlterEchoPopescu.pdf">Alter Echo</a></p>
<p align="center">
    <i>
        <a href="https://github.com/belindanju">
            Tian Guo
        </a>
    </i>
</p>
<p align="center">
    <i>
        <a href="https://github.com/jhsul">
            Jack Sullivan
        </a>
    </i>
</p>

## Table of Contents

- [Introduction](#introduction)
- [Installation](#install-locally)
- [Functionality](#functionality)
- [Project Structure](#project-structure)

## Introduction

This project both recreates and expands on [AlterEcho](https://www.cs.purdue.edu/cgvlab/papers/popescu/2021ISMARAlterEchoPopescu.pdf), an avatar-streamer model that supports both one-to-one motion capture and preset animations ("gestures") which are triggered either manually or with poses/facial expressions. It runs entirely in the browser, and heavily leverages the following libraries:

- [mediapipe](https://google.github.io/mediapipe/) is used for face and pose recognition using a webcam. This project uses the [holistic](https://www.npmjs.com/package/@mediapipe/holistic) tracker.
- [kalidokit](https://github.com/yeemachine/kalidokit) is used on top of Mediapipe to calculate both raw position and kinematics for the VTuber model.
- [three-vrm](https://github.com/pixiv/three-vrm) generates the VRM model from three's default `GLTFLoader`.

## Install Locally

This is eventually going to be hosted on some dedicated server (probably through vercel or AWS amplify). In the meantime, you can run it locally by running the following commands in your POSIX shell:

```sh
# Clone and enter the repository
git clone https://github.com/cake-lab/Ventriloquist
cd Ventriloquist

# Install packages
npm i

# Start a local instance (localhost:3000)
npm run build
npm run start
```

## Functionality

The app works by rendering a VRM model in a three.js scene, and controlling it with one of either two mechanisms:

1. One-to-one motion capture, using Kalidokit to calculate VRM coordinates from mediapipe
2. Preset gestures (FBX animations), which are triggered by facial expressions and/or poses

The alternating between one-to-one mocap and preset animations results in what AlterEcho calls a "Loose Coupling" relationship between the user and the VTuber model.

![High-level diagram](public/diagram.png)

<p align="center"><i>Figure 1: A high-level description of the app's control flow</i></p>

## Project Structure

This version of ventriloquist runs on [nextjs](https://nextjs.org/), which defines/enforces much of the folder layout.

```
TODO: Get tree command to not dump the whole node_modules folder

```
