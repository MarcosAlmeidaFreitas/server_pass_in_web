import { FastifyInstance } from "fastify";
import { BadRequest } from "../routes/_errors/bad-request";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler']


export const errorHandler : FastifyErrorHandler = (error, request, reply) => {
  /* Primeiro vamos buscar o erro de validação, que é um erro quando o usuário 
  insere algo de errado como um numero no lugar da string
    *vai verificar se existe algo dentro da variável validation que provem do error 
    se caso existir foi pq teve um erro de validação 
  */
  const { validation, validationContext } = error

  if(error instanceof ZodError){
    return reply.status(400).send({
      message: `Error during validation`,
      errors: error.flatten().fieldErrors,
    })
  }

  //Agora vamos tipar os erros quanto o usuário da um erro dentro da nossa aplicação
  if(error instanceof BadRequest){
    return reply.status(400).send({message: error.message})
  }
  return reply.status(500).send({message: 'Internal server error!'});
}