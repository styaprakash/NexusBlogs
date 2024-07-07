import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

//SIGN-UP
app.route("/api/v1/user", userRouter);
//SIGN-IN
app.route("/api/v1/blog", blogRouter);
export default app;
