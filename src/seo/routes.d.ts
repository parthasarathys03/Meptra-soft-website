import type { RouteSeo } from "./config";

export const routes: RouteSeo[];
export const ORIGIN: string;
export function getRoute(pathname: string): RouteSeo;
