import { Elysia } from "elysia";
import { id } from "zod/v4/locales";

new Elysia().post("/tasks", { params: { id } });
