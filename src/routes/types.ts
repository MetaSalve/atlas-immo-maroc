
import { RouteObject } from 'react-router-dom';

export interface CustomRouteObject extends Omit<RouteObject, 'children'> {
  authRequired?: boolean;
  adminRequired?: boolean;
  subscriptionRequired?: boolean;
  index?: boolean;
  children?: CustomRouteObject[];
}
