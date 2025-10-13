import type { ClientEnv } from "./env-config";

declare namespace NodeJS {
  interface ProcessEnv extends ClientEnv {}
}