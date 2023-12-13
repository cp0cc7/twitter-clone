
import { createNextRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// export routes for app router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});