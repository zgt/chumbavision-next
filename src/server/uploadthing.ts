import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  fetch: globalThis.fetch,
  token: process.env.UPLOADTHING_TOKEN,
});
