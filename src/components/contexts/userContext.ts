import { User } from "@/types/User";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);
