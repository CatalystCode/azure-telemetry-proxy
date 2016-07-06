var appInsights = require("applicationinsights");
// Connecting to application insights
var instrumentationKey = process.env.AppInsightInstrumentationKey;
var client = appInsights.getClient(instrumentationKey);
module.exports = function (context, message) {
    // Sending all data to application insight analytics
    context.log('message:', message);
    client.trackEvent("telemetry:" + message.id, message.data);
    // Later... Send data to mongodb as well
    // Inform function completion
    context.done();
};
