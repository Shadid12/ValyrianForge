/// <reference types="vite/client" />
declare module "*.jsx" {
  import { FunctionComponent } from "react";
  const Component: FunctionComponent<any>;
  export default Component;
}
