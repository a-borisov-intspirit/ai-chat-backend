if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express')
const cors = require('cors');
const { router } = require('./routes/index');
const app = express()
const port = 3000

const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  database: 'postgres1',
  user: 'postgres1',
  password: 'postgres1',
  port: 5432,
});
app.use(express.json());

app.use(cors());
app.use('/', router);
// async function connectAndQuery() {
//   try {
//     await client.connect(); // Establish connection
//   } catch (err) {
//     console.error('Database connection or query error', err);
//   } finally {
//     await client.end(); // Close the connection
//   }
// }

// connectAndQuery();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }
// const cron = require('node-cron');

// const cors = require('cors');
// require('./utils/passport');
// const express = require('express');
// const { create } = require('socketcluster-client');
// const config = require('./config');
// const app = express();
// const {ApolloServer} = require('@apollo/server');
// const {expressMiddleware} = require('@apollo/server/express4');
// const {neoSchema} = require('./db/directConnection');
// const runSocketServer = require('./socketServer/server');
// const eetase = require('eetase');
// const http = require('http');
// const {DBRequest} = require('./utils/dbHelpers');
// const {mutationClearAllUnavailable} = require('./utils/queryNeo4j');
// const {Analytics} = require('./mixPanel/init');
// const {router} = require('./routes');
// const helmet = require('helmet');
// const {staticRouter} = require('./services/staticProxy');
// const {setupSocketHandlers} = require("./socketClient/socketClient");
// const {microServiceRouter} = require('./routes/microservices');

// const httpServer = eetase(http.createServer(app));

// const corsOptions = {
//   origin: [process.env.BACKEND_ADDRESS, process.env.FRONT_DOMAIN, 'http://localhost:3000'], // Add any other allowed origins here
//   credentials: true,
// };

// async function main() {
//   app.use(cors(corsOptions));
//   app.use(express.json({
//     limit: '10mb',
//     verify: (req, res, buf) => {
//       req.rawBody = buf // Need rawBody for Stripe Webhook events
//     },
//   }));
//   app.use(express.urlencoded({ extended: true, limit: '10mb' }));
//   if (process.env.NODE_ENV === 'production') {
//     app.use(helmet());
//   } else {
//     const schema = await neoSchema.getSchema();
//     const server = new ApolloServer({
//       schema: schema,
//       cors: {
//         origin: true,
//         methods: ['GET', 'POST', 'OPTIONS'],
//       },
//     });
//     await server.start();
//     app.use('/graphql', expressMiddleware(server));
//   }

//   app.use('/microservice', microServiceRouter);
//   app.use(staticRouter);

//   app.use('/v1', router);

//   runSocketServer(httpServer, app);

//   httpServer.listen(config.port, '0.0.0.0', () =>
//     // eslint-disable-next-line no-console
//     console.log(`Server ready at http://localhost:${config.port}/graphql`),
//   );
//   const socket = create({
//     hostname: config.AI_DOMAIN_NO_PORT,
//     port: 3005,
//   });

//   await setupSocketHandlers(socket)


// }

// // eslint-disable-next-line no-console
// main().then(() => console.log('started'));

// cron.schedule('*/10 * * * *', async () => {
//   try {
//     const query = mutationClearAllUnavailable();
//     await DBRequest(query);
//   } catch (e) {
//     Analytics.log('backend error', {
//       distinct_id: 0,
//       error: e,
//       stack: e.stack,
//       errorMessage: 'cron.schedule',
//     });
//   }
// });
