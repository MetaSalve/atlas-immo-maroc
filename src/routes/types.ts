
import { RouteObject } from 'react-router-dom';

export interface CustomRouteObject extends Omit<RouteObject, 'children'> {
  authRequired?: boolean;
  children?: CustomRouteObject[];
}
