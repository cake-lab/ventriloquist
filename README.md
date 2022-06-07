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

## Introduction

Ventriloquist is a browser-based VTubing app built with [kalidokit](https://github.com/yeemachine/kalidokit). Ventriloquist is inspired by [AlterEcho](https://www.cs.purdue.edu/cgvlab/papers/popescu/2021ISMARAlterEchoPopescu.pdf), a loosely-coupled avatar-streamer model which supports both one-to-one motion capture and preset animations ("gestures") which are triggered either manually or with poses/facial expressions.

<p align="center">
    <img src="public/mocap.gif" width="300">
    <img src="public/gangnam.gif" width="300">
</p>
<p align="center">
    Left: Motion capture wave. Right: Custom gesture ("gangnam style" from Mixamo)
</p>

## Functionality

### Loose-Coupling Model

The Alter Echo paper proposes a loose-coupling model between the user and the VTuber model. The model follows the user with one-to-one motion capture, but facial expressions and hand positions can trigger the model to perform preset animations ("gestures").

### Control Flow

There is one model loaded into a [three.js](https://threejs.org/) scene, and its controller switches between one-to-one motion capture and preset animations from [mixamo](https://www.mixamo.com/) based on user-defined triggers.

![High-level diagram](public/diagram.png)

<p align="center"><i>Figure 1: Ventriloquist's general control flow</i></p>

### Packages

Ventriloquist runs mostly in the browser, but it also has a server for things like user presets and static file hosting. It is built with [nextjs](https://nextjs.org/), so both the front- and backend are included in this repository.

In the browser, ventriloquist heavily leverages the following libraries:

- [mediapipe](https://google.github.io/mediapipe/) is used for face and pose recognition using a webcam. This project uses the [holistic](https://www.npmjs.com/package/@mediapipe/holistic) tracker.
- [kalidokit](https://github.com/yeemachine/kalidokit) is used on top of Mediapipe to calculate both raw position and kinematics for the VTuber model.
- [three-vrm](https://github.com/pixiv/three-vrm) generates the VRM model from three's default `GLTFLoader`.

### Gestures

Currently, the only supported gestures are .fbx animations from [mixamo](https://www.mixamo.com/#/). Make sure you select the "Without Skin" option.
