import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
async function getEventAttendees(app) {
  app.withTypeProvider().get("/events/:eventId/attendees", {
    schema: {
      //O que a rota faz e qual tag (tabela) a ela pertence mais para a documentação 
      summary: "Get event attendees",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
      }),
      querystring: z.object({
        //utilizar o nullish quando for tanto nulo quando undefined o argumento
        query: z.string().nullish(),
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response: {
        200: z.object({
          attendees: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkedInAt: z.date().nullable()
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { pageIndex, query } = request.query;
    const attendees = await prisma.attendee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAtt: true,
        checkIn: {
          select: {
            createdAtt: true
          }
        }
      },
      //se caso possuir algo dentro do query ele vai pesquisar pelo eventId e pelo nome 
      //se não tiver ele só vai pesquisar pelo eventoId
      where: query ? {
        eventId,
        name: {
          contains: query
        }
      } : {
        eventId
      },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createdAtt: "desc"
      }
    });
    return reply.send({
      attendees: attendees.map(
        (attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAtt,
            checkedInAt: attendee.checkIn?.createdAtt ?? null
          };
        }
      )
    });
  });
}

export {
  getEventAttendees
};
