export type Gesture = {
  name: string;
  url: string;
  animation: THREE.AnimationAction;
  trigger: string;
};

export type User = {
  username: string;
  password?: string; // hashed password only available in server

  // S3 bucket urls
  gestures: string[];
  models: string[];
};
