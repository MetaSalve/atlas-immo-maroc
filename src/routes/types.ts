
import { RouteObject } from 'react-router-dom';

export interface CustomRouteObject {
  path?: string;
  element?: React.ReactNode;
  authRequired?: boolean;
  children?: CustomRouteObject[];
  index?: boolean;
  caseSensitive?: boolean;
  id?: string;
  handle?: unknown;
  loader?: unknown;
  action?: unknown;
  errorElement?: React.ReactNode;
  shouldRevalidate?: unknown;
}
