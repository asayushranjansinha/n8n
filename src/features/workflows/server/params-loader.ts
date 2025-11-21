import { createLoader } from "nuqs/server";
import { workflowsSearchParams } from "../params";

export const workflowsParamsLoader = createLoader(workflowsSearchParams);
