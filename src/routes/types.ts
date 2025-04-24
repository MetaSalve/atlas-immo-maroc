
import { RouteObject } from 'react-router-dom';

export interface CustomRouteObject extends RouteObject {
  authRequired?: boolean;
  children?: CustomRouteObject[];
}
