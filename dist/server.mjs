import {
  errorHandler
} from "./chunk-TCR7TOQ7.mjs";
import {
  checkIn
} from "./chunk-ECVEQBTT.mjs";
import {
  createEvent
} from "./chunk-LKMRPIOC.mjs";
import "./chunk-KDMJHR3Z.mjs";
import {
  getAttendeeBadge
} from "./chunk-M2JMK7YL.mjs";
import {
  getEventAttendees
} from "./chunk-GZWLZ2VH.mjs";
import {
  getEvent
} from "./chunk-G6MDUCEB.mjs";
import {
  registerForEvent
} from "./chunk-M7GXAAC6.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["aplication/json"],
    produces: ["aplication/json"],
    info: {
      title: "pass-in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass-in constru\xEDda durante o NWL Unite da Rocketseat.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
var PORT = 3333;
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  console.log("HTTP SERVER RUNNING");
});
