var appInsights = require("applicationinsights");
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
    var telemetryMessage = {
        id: message.deviceId,
        data: {
            textquery: message.data.query,
            timestamp: message.timestamp,
            intent: "MISSING",
            utterance: intent.intent,
            utterance_score: intent.score,
            accepted_by_bot: true,
            source: message.source,
            main_entity: entity.entity,
            main_entity_score: entity.score
        }
    };
    client.trackEvent("RBT:" + telemetryMessage.id, telemetryMessage.data);
    // Later... Send data to mongodb as well
    // Inform function completion
    context.done();
};
