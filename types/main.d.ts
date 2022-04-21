export interface Model {
  name: string;
  url: string;
  owner?: string;
}

export interface Gesture {
  name: string;
  url: string;
  animation?: THREE.AnimationAction;
  owner?: string;
  trigger?: Trigger;
}

export interface Trigger {
  type: "expression" | "keyboard";
  value: {};
}

export interface User {
  username: string;
}
