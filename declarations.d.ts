declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";

declare module "uuid/v1" {
  const uuidv1: () => string;
  export default uuidv1;
}

declare module "react-native-swiper" {
  import { ComponentType } from "react";
  const Swiper: ComponentType<any>;
  export default Swiper;
}
