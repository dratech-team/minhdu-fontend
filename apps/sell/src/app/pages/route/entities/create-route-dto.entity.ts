import {Route} from "./route.entity";

export type CreateRouteDto = Omit<Route, 'id'>
