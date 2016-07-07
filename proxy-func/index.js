var appInsights = require("applicationinsights");
var moment = require("moment");
// Connecting to application insights
var instrumentationKey = process.env.AppInsightInstrumentationKey;
var client = appInsights.getClient(instrumentationKey);
function validateMessage(message) {
    return message && message.data && message.data.query;
}
module.exports = function (context, message) {
    // Sending all data to application insight analytics
    context.log('message:', message);
    if (!validateMessage(message)) {
        return context.done(new Error("message is not in the right format"));
    }
    var intent = message.data.intents && message.data.intents[0] || { intent: "NONE", score: 0 };
    var entity = message.data.entities && message.data.entities[0] || { entity: "NONE", score: 0 };
    context.bindings.tableBinding = {
        partitionKey: message.deviceId,
        rowKey: moment(message.timestamp).unix(),
        query: message.data.query,
        etimestamp: moment(message.timestamp).utc().format(),
        intent: "MISSING",
        utterance: intent.intent,
        utterance_score: intent.score,
        accepted_by_bot: true,
        source: message.source,
        main_entity: entity.entity,
        main_entity_score: entity.score
    };
    // Later... Send data to mongodb as well
    // Inform function completion
    context.done();
};
