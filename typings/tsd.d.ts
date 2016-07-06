/// <reference path="node/node.d.ts" />

interface ITelemetry {
	id: string,
	data: {
		query: string,
		timestamp: number,
		intent: string, //(basic intent)
		utterance: string,
		utterance_score: number,
		accepted_by_bot: boolean,
		source: string,
		main_entity: string,
		main_entity_score: number
	}
}

interface IQueueMessage {
  deviceId: string,
  timestamp: number,
  source: string,
  query: string,
  entities: { 
    endIndex: number, 
    entity: string,
    score: number,
    startIndex: number,
    type: string
  }[],
  intents: {
    actions: any,
    intent: string,
    score: number
  }[],
  queryEntities: string[],
  queryIntents: string[]
}