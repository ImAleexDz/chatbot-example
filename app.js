const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

const flowPhone = addKeyword('NAME')
    .addAnswer(
        
            'Ahora, proporciona tu número de teléfono a 10 dígitos\nEjemplo: *5512345678*', {capture: true},
        (ctx, {fallBack, gotoFlow}) => {
            const response = ctx.body
            const regex = /^[0-9]*$/;
            console.log('Mensaje entrante ', response.length)
            if (regex.test(response) && response.length == 10) {
                return gotoFlow(flowBooking)
            } else {
                return fallBack()
            }
        }
    )

const flowSchedule = addKeyword(['agendar', 'agenda'])
    .addAnswer('Necesitamos algunos datos para agendar una consulta\nPor favor, proporciona tu nombre completo \nEjemplo: *Juan Pérez Pérez*', {capture: true},
        (ctx, { fallBack, gotoFlow }) => {
            console.log(ctx.body)
            if (ctx.body) {
                return gotoFlow(flowPhone)
            } else {
                return fallBack()
            }
        },
        [flowPhone]
    )

const flowGracias = addKeyword(['gracias', 'grac', 'grax']).addAnswer(
    [
        'De nada ☺️',
    ],
    null,
    null
)

const flowBooking = addKeyword(['discord']).addAnswer(
    ['Consulta agendada'],
    null,
    null
)

const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
    .addAnswer('🙌 Hola bienvenid@ a *Clínica Médica el Rosario*')
    .addAnswer(
        [
            '¿En qué podemos ayudarte? Escribe tu respuesta:',
            '👉 *agendar* para agendar una consulta',
            '👉 *llamar*  para comunicarte a recepción',
            '👉 *ver menú* para ofrecerte otras opciones',
        ],
        null,
        null,
        [flowSchedule, flowGracias]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
