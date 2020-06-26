import {createContext} from "react";
import {ClientManager} from "./client-manager";

export const ClientManagerContext = createContext<ClientManager|null>(null)
