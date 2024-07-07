import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_STRING: string;
    }
}>();

//SIGN-UP
userRouter.post("/signup", async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const user = await prisma.user.create({
        data: {
          username: body.username,
          password: body.password,
          name: body.name,
        },
      });
      //@ts-ignore
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.text(jwt);
    } catch (e) {
      c.status(411);
      return c.text('Invalid');
    }
  });
  
  //SIGN-IN
  userRouter.post("/api/v1/user/signin", async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try{
      const user = await prisma.user.findUnique({
        where: {
          username: body.username,
          password: body.password
        },
      });
      if (!user) {
        c.status(403); //unauthorized
        return c.json({ error: "user not found" });
      }
      //@ts-ignore
      const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ jwt });
    } catch(e){
      console.log(e);
      c.status(500);
      return c.json({ error: "server error" });
    }
  });