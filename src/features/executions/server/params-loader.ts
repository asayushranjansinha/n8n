import { createLoader } from "nuqs/server";
import { executionSearchParams } from "../params";

export const executionParamsLoader = createLoader(executionSearchParams);
