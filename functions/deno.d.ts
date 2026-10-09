declare namespace Deno {
  export function serve(handler: (req: Request) => Promise<Response> | Response): void;
  export namespace env {
    export function get(key: string): string | undefined;
  }
}

declare module "npm:@supabase/supabase-js@2.57.4" {
  export * from "@supabase/supabase-js";
}
