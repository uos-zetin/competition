import { userRepository } from "../api";

import { createUserService } from "./service";

export const userService = createUserService({ userRepository });
