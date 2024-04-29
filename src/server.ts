import fastify from 'fastify';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastifyCors from '@fastify/cors'

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod';
import { createEvent } from './routes/create-event';
import { registerForEvent } from './routes/register-for-events';
import { getEvent } from './routes/get-event';
import { getAttendeeBadge } from './routes/get-attendees-badge';
import { checkIn } from './routes/check-in';
import { getEventAttendees } from './routes/get-event-attendees';
import { errorHandler } from './utils/error-handler';



const app = fastify();

app.register(fastifyCors, {
  origin: '*',
})


//utilizado para documentação que vc acessa pelo navegador através do da url do projeto /docs
//em cada rota dentro do schema tem o summary (indicando o que a rota faz) 
// e tag (a qual tabela do baco de dados pertence)
app.register(fastifySwagger, {
  swagger:{
    consumes: ['aplication/json'],
    produces: ['aplication/json'],
    info:{
      title: 'pass-in',
      description: 'Especificações da API para o back-end da aplicação pass-in construída durante o NWL Unite da Rocketseat.',
      version: '1.0.0',
    }
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const PORT = 3333;


app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

/*
* Status Code 20x => Sucesso
* Status Code 30x => Redirecionamento
* Status Code 40x => Erro do Cliente (Erro em alguma informação enviada por quem está fazendo a chamada a api)
* Status Code 50x => Erro no servidor (Erro INDEPENDENTE do que está sendo enviado ao servidor)
*/

//classe de error que está dentro utils
app.setErrorHandler(errorHandler);

//O tem é utilizado como se fosse uma promessa para entregar
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP SERVER RUNNING');
});