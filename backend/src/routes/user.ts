import { Hono } from "hono";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

import { sign, verify } from "hono/jwt";
import { signupInput, signinInput } from "@harsh_saini/blog-common";

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_KEY: string
      }
}>();



// userRouter.use('/*', async (c,next)=>{
//     // get the header 
//     // verify the header
//     // if correct we can proceedand if not then 403 status code
  
//     const header = c.req.header("Authorization") || "";
//     const token = header.split(" ")[1];
  
//     const res = await verify(token, c.env.JWT_KEY)
  
//     if(res.id){
//       // c.set('userId', res.id);
//       await next()
//     }else{
//       c.status(403);
//       return c.json({error: "unauthorized"})
//     }
//   })


userRouter.post('/signup', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch (error) {
    return c.json({ message: "Invalid JSON format" }, 400);
  }

  const { success } =  signupInput.safeParse(body);
  if (!success) {
    return c.json({ message: "Invalid inputs" }, 400);
  }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  
    }).$extends(withAccelerate())
  
    try{
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name
        },
      })
  
      const token = await sign({id: user.id}, c.env.JWT_KEY);
  
    return c.json({
      jwt: token
    })
  
    }catch(e){
      c.status(411);
      return c.text("User already exists with this email");
    } 
  })
  
userRouter.post("/signin", async (c)=>{
    const body = await c.req.json();
    const {success} = signinInput.safeParse(body);
    if(!success){
      c.status(411);
      return c.json({
        message: "Invalid inputs"
      })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    
    try{
      const user = await prisma.user.findUnique({
        where:{
          email: body.email,
          password: body.password
        }
      });
    
      if(!user){
        c.status(403);
        return c.json({
          error: "User not found"
        });
      }
    
      const jwt = await sign({id: user.id}, c.env.JWT_KEY);
    
      return c.json({
        jwt
      });
  
    }catch(e){
      c.status(411);
      return c.text("Invalid");
    }
    
  })