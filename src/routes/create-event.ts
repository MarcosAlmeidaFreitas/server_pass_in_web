import { ZodTypeProvider } from "fastify-type-provider-zod";
/* O Zod é um verificador de objeto, pois estamos passando um objeto com alguns detalhes 
que precisam ser verificados se o usuário está passando certinho se ele está passando texto
em vez de um numero por exemplo*/
import { z } from 'zod';

//importando a integração do zod para o fastify
import { generateSlug } from '../utils/generate-slug';
//importando a conexão do banco de dados
import { prisma } from '../lib/prisma'
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createEvent(app : FastifyInstance){
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/events', {
    schema: {
      summary: 'Create an event',
      tags: ['events'],

      body: z.object({
        title: z.string({invalid_type_error: 'O título deve ser um texto'}).min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().nullable(),
      }),

      response: {
        201: z.object({
          eventId: z.string().uuid(),
        })
      }
    }
  }, async (request, reply) => {

    const data = request.body;

    //utilizando a função generateSlug dentro de src/util para retirar acentuações e espaços
    const slug = generateSlug(data.title);

    //verificando no banco se o identificador de evento já existe.
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug,
      }
    });

    if (eventWithSameSlug !== null) {
      throw new BadRequest('Another event with same title already exists');
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        details: data.details,
        maximumAttendees: data.maximumAttendees,
        slug,
      },
    });

    return reply.code(201).send({ eventId: event.id });
  });
}


