import type { SetStateAction } from "react";
import type React from "react";

export interface NavContexType {
    nav: string;
    setNav: React.Dispatch<SetStateAction<string>>;
}
