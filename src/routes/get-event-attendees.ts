import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId/attendees', {
      schema:{
        //O que a rota faz e qual tag (tabela) a ela pertence mais para a documentação 
        summary: 'Get event attendees',
        tags: ['events'],

        params: z.object({
          eventId: z.string().uuid(),
        }),

        querystring: z.object({
          //utilizar o nullish quando for tanto nulo quando undefined o argumento
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number),
        }),

        response:{
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            )
          }),
        } 
      }
    }, async (request, reply) =>{
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;

      const attendees = await prisma.attendee.findMany({
        select:{
          id: true,
          name: true,
          email: true,
          createdAtt: true,
          checkIn:{
            select:{
              createdAtt: true,
            }
          }
        },

        //se caso possuir algo dentro do query ele vai pesquisar pelo eventId e pelo nome 
        //se não tiver ele só vai pesquisar pelo eventoId
        where: query ?{
          eventId,
          name: {
            contains: query,
          }
        } : {
          eventId: eventId,
        },

        take: 10,
        skip: pageIndex * 10,
        orderBy:{
          createdAtt: 'desc',
        }
      })

      //renomeando o retorno para mudar o nome do check-in 
      return reply.send({
        attendees: attendees.map(attendee => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAtt,
            checkedInAt: attendee.checkIn?.createdAtt ?? null,
          }
        }  
        )
      });
    })
}