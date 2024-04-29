 /*Criando um schema utilizando a biblioteca zod para fazer a validação dos dados 
  que o usuário esta passando forma sem fazer pela requisição*/
  
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().nullable(),
  });

  const data = createEventSchema.parse(request.body);


  Métodos http: get, post, put, delete, patch, head, options

  *maneiras de obter os dados*
  * Corpo da requisição => (Request Body), vem através de um formulário por exemplo, formato usado em json
  
  * Parâmetros de busca => (Query Params), vem através da url, exemplo: 
    http://localhost:3333/users?name=Diego

  * Parâmetros de Rota => (Route Params), vem através da url, é uma identificação de recursos exemplo: 
    método delete http://localhost:3333/users/5
