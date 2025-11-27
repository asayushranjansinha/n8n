import { createLoader } from "nuqs/server";
import { credentialsSearchParams } from "../params";

export const credentialsParamsLoader = createLoader(credentialsSearchParams);
