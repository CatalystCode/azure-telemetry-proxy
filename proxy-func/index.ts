import appInsights = require("applicationinsights");
import moment = require("moment");

// Connecting to application insights
var instrumentationKey = process.env.AppInsightInstrumentationKey;
var client = appInsights.getClient(instrumentationKey);

// Exporting like this makes sure the JS output is in the format azure function expects it
export = function (context, message: IQueueMessage) {

  // Sending all data to application insight analytics
  context.log('message:', message);

  if (!validateMessage(message)) {
    return context.done(new Error("message is not in the right format"));
  }

  var intent = message.data.intents && message.data.intents[0] || { intent: "NONE", score: 0 };
  var entity = message.data.entities && message.data.entities[0] || { entity: "NONE", score: 0};

  context.bindings.tableBinding = {
    id: message.deviceId,
    key: moment(message.timestamp).unix(),
    query: message.data.query,
    etimestamp: moment(message.timestamp).utc().format(),
    intent: "MISSING", //intent.source_intent, //(basic intent)
    utterance: intent.intent,
    utterance_score: intent.score,
    accepted_by_bot: true, //message.accepted,
    source: message.source,
    main_entity: entity.entity,
    main_entity_score: entity.score
  }

  // Later... Send data to mongodb as well

  // Inform function completion
  context.done();
};

function validateMessage(message: IQueueMessage) {
  return message && message.data && message.data.query;
}