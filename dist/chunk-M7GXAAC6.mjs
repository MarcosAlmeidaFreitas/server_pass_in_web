import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/register-for-events.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendees", {
    schema: {
      summary: "Register an attendee",
      tags: ["attendees"],
      body: z.object({
        name: z.string().min(4),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().uuid()
      }),
      response: {
        201: z.object({
          attendeeId: z.number()
        })
      }
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const { name, email } = request.body;
    const attendeeForEmail = await prisma.attendee.findUnique({
      where: {
        eventId_email: {
          email,
          eventId
        }
      }
    });
    if (attendeeForEmail !== null) {
      throw new BadRequest("This e-mail is already registered for this event");
    }
    const [amountOfAttendeesForEvent, event] = await Promise.all([
      //Contando a quantidade de pessoas inscritas no evento
      prisma.attendee.count({
        where: {
          eventId
        }
      }),
      /*buscando o evento para descobrir o máximo de pessoa que podem se cadastrar para fazer
        a verificação de quantas estão inscritas e quantas vagas ainda existem disponíveis
      */
      prisma.event.findUnique({
        where: {
          id: eventId
        }
      })
    ]);
    if (event?.maximumAttendees && amountOfAttendeesForEvent >= event.maximumAttendees) {
      throw new BadRequest("The maximum number of attendees for this event has been reached");
    }
    const attendee = await prisma.attendee.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.code(201).send({ attendeeId: attendee.id });
  });
}

export {
  registerForEvent
};
