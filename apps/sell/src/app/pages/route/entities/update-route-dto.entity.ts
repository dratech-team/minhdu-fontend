import {Route} from "./route.entity";

export type UpdateRouteDto = Omit<Partial<Route>, 'id'>
