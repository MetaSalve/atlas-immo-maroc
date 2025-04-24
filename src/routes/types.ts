
import { RouteObject } from 'react-router-dom';

// Étendre l'interface RouteObject de react-router-dom pour ajouter l'option authRequired
export interface CustomRouteObject extends RouteObject {
  authRequired?: boolean;
  children?: CustomRouteObject[];
}
