# VTubing Project

This project both recreates and expands on [AlterEcho](https://www.cs.purdue.edu/cgvlab/papers/popescu/2021ISMARAlterEchoPopescu.pdf), an avatar-streamer model that supports both one-to-one motion capture and preset animations ("gestures") which are triggered either manually or with poses/facial expressions. It runs entirely in the browser, and heavily leverages the following libraries:

- [mediapipe](https://google.github.io/mediapipe/) is used for face and pose recognition using a webcam. This project uses the [holistic](https://www.npmjs.com/package/@mediapipe/holistic) tracker.
- [kalidokit](https://github.com/yeemachine/kalidokit) is used on top of Mediapipe to calculate both raw position and kinematics for the VTuber model.
- [three-vrm](https://github.com/pixiv/three-vrm) generates the VRM model from three's default `GLTFLoader`.

## Functionality

The app works by rendering a VRM model in a three.js scene, and controlling it with one of either two mechanisms:

1. One-to-one motion capture, using Kalidokit to calculate VRM coordinates from mediapipe
2. Preset gestures (FBX animations), which are triggered by facial expressions and/or poses

The alternating between one-to-one mocap and preset animations results in what AlterEcho calls a "Loose Coupling" relationship between the user and the VTuber model.

![High-level diagram](public/diagram.png)

_Figure 1: A high-level description of the app's control flow_

The application is built on nextjs.

## Install Locally

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
