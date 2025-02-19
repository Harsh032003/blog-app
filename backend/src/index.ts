import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'
import { verify,sign, decode  } from 'hono/jwt'

// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiYjMwMGIzMmYtYzJiMi00YWNjLWFlNmQtNWFlMDdjNjdhN2NmIiwidGVuYW50X2lkIjoiYmI0Mjk0ODkzOTI4MmU1NjgyMzNkYjMwZjFjNzY1ODI5MTUxMWFiZDBiOTMyODJiYTIwYzJiNTU0NWIwZGU5NSIsImludGVybmFsX3NlY3JldCI6IjNlYTlhNDYzLWIwMDgtNGMwNS05NWRkLTFlZTA5ODE4NWE1YSJ9.ODfmR7dlchFw-71Nq0GPnazSK5ZK5vTtsG7L9SfT6Lc"

const app = new Hono<{
  Bindings:{
    DATABASE_URL: string
    JWT_KEY: string
  }
}>()



app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);

export default app
