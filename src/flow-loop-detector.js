/**
 * Flow Loop Detector
 *
 * Analysiert Power Automate Flow-Definitionen (JSON-Export) auf potenzielle
 * Trigger-Loops, bei denen ein Flow die eigene Trigger-Quelle modifiziert.
 */

/**
 * Bekannte SharePoint-Aktionen, die Listenelemente ändern
 */
const SHAREPOINT_WRITE_ACTIONS = [
  'UpdateItem',
  'CreateItem',
  'PatchItem',
  'HttpRequest', // kann auch schreibend sein
];

/**
 * Prüft ob ein Flow seine eigene Trigger-Liste modifiziert (Self-Loop)
 * @param {object} flowDefinition - Power Automate Flow JSON
 * @returns {{ hasLoop: boolean, details: string[] }}
 */
function detectSelfLoop(flowDefinition) {
  const details = [];
  const trigger = flowDefinition?.definition?.triggers;
  const actions = flowDefinition?.definition?.actions;

  if (!trigger || !actions) {
    return { hasLoop: false, details: ['Flow-Definition unvollständig'] };
  }

  const triggerName = Object.keys(trigger)[0];
  const triggerConfig = trigger[triggerName];

  // SharePoint-Trigger-Liste ermitteln
  const triggerListId = triggerConfig?.inputs?.parameters?.table
    || triggerConfig?.inputs?.parameters?.dataset;

  if (!triggerListId) {
    return { hasLoop: false, details: ['Kein SharePoint-Trigger erkannt'] };
  }

  let hasLoop = false;

  for (const [actionName, action] of Object.entries(actions)) {
    const actionType = action?.type;
    const apiId = action?.inputs?.host?.apiId || '';
    const operationId = action?.inputs?.host?.operationId || '';

    const isSharePointWrite = apiId.includes('sharepointonline')
      && SHAREPOINT_WRITE_ACTIONS.includes(operationId);

    if (!isSharePointWrite) continue;

    const actionListId = action?.inputs?.parameters?.table
      || action?.inputs?.parameters?.dataset;

    if (actionListId && actionListId === triggerListId) {
      hasLoop = true;
      details.push(
        `Aktion "${actionName}" (${operationId}) schreibt in dieselbe Liste "${triggerListId}", auf die der Trigger hört.`
      );
    }
  }

  return { hasLoop, details };
}

/**
 * Prüft ob zwei Flows sich gegenseitig triggern können (Cross-Loop / Ping-Pong)
 * @param {object} flowA - Power Automate Flow JSON
 * @param {object} flowB - Power Automate Flow JSON
 * @returns {{ hasLoop: boolean, details: string[] }}
 */
function detectCrossLoop(flowA, flowB) {
  const details = [];

  const triggerA = getTriggerList(flowA);
  const triggerB = getTriggerList(flowB);
  const writesA = getWriteLists(flowA);
  const writesB = getWriteLists(flowB);

  if (!triggerA || !triggerB) {
    return { hasLoop: false, details: ['Konnte Trigger-Listen nicht ermitteln'] };
  }

  let hasLoop = false;

  // Flow A schreibt in Trigger-Liste von Flow B?
  if (writesA.includes(triggerB)) {
    details.push(`Flow A schreibt in Liste "${triggerB}", auf die Flow B triggert.`);
    hasLoop = true;
  }

  // Flow B schreibt in Trigger-Liste von Flow A?
  if (writesB.includes(triggerA)) {
    details.push(`Flow B schreibt in Liste "${triggerA}", auf die Flow A triggert.`);
    hasLoop = true;
  }

  if (hasLoop && writesA.includes(triggerB) && writesB.includes(triggerA)) {
    details.push('PING-PONG-LOOP ERKANNT: Beide Flows triggern sich gegenseitig!');
  }

  return { hasLoop, details };
}

/**
 * Prüft ob ein Flow eine Trigger Condition hat
 * @param {object} flowDefinition - Power Automate Flow JSON
 * @returns {{ hasTriggerCondition: boolean, conditions: string[] }}
 */
function checkTriggerConditions(flowDefinition) {
  const trigger = flowDefinition?.definition?.triggers;
  if (!trigger) {
    return { hasTriggerCondition: false, conditions: [] };
  }

  const triggerName = Object.keys(trigger)[0];
  const triggerConfig = trigger[triggerName];
  const conditions = triggerConfig?.conditions || [];

  return {
    hasTriggerCondition: conditions.length > 0,
    conditions: conditions.map(c => c.expression),
  };
}

/**
 * Ermittelt die Trigger-Liste eines Flows
 */
function getTriggerList(flowDefinition) {
  const trigger = flowDefinition?.definition?.triggers;
  if (!trigger) return null;
  const triggerName = Object.keys(trigger)[0];
  return trigger[triggerName]?.inputs?.parameters?.table
    || trigger[triggerName]?.inputs?.parameters?.dataset
    || null;
}

/**
 * Ermittelt alle Listen, in die ein Flow schreibt
 */
function getWriteLists(flowDefinition) {
  const actions = flowDefinition?.definition?.actions || {};
  const lists = [];

  for (const action of Object.values(actions)) {
    const apiId = action?.inputs?.host?.apiId || '';
    const operationId = action?.inputs?.host?.operationId || '';

    const isSharePointWrite = apiId.includes('sharepointonline')
      && SHAREPOINT_WRITE_ACTIONS.includes(operationId);

    if (isSharePointWrite) {
      const listId = action?.inputs?.parameters?.table
        || action?.inputs?.parameters?.dataset;
      if (listId) lists.push(listId);
    }
  }

  return lists;
}

module.exports = {
  detectSelfLoop,
  detectCrossLoop,
  checkTriggerConditions,
  getTriggerList,
  getWriteLists,
};
