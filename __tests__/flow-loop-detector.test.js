const {
  detectSelfLoop,
  detectCrossLoop,
  checkTriggerConditions,
  getTriggerList,
  getWriteLists,
} = require('../src/flow-loop-detector');

// Hilfsfunktion: Minimale Flow-Definition erstellen
function makeFlow({ triggerList, writeLists = [], triggerConditions = [] }) {
  const actions = {};
  writeLists.forEach((list, i) => {
    actions[`UpdateItem_${i}`] = {
      type: 'OpenApiConnection',
      inputs: {
        host: {
          apiId: '/providers/Microsoft.PowerApps/apis/shared_sharepointonline',
          operationId: 'UpdateItem',
        },
        parameters: { table: list },
      },
    };
  });

  return {
    definition: {
      triggers: {
        'When_an_item_is_created_or_modified': {
          type: 'OpenApiConnectionWebhook',
          inputs: {
            parameters: { table: triggerList },
          },
          conditions: triggerConditions,
        },
      },
      actions,
    },
  };
}

describe('detectSelfLoop', () => {
  test('erkennt Self-Loop wenn Flow seine eigene Trigger-Liste beschreibt', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: ['Sendungsliste'],
    });
    const result = detectSelfLoop(flow);
    expect(result.hasLoop).toBe(true);
    expect(result.details.length).toBeGreaterThan(0);
    expect(result.details[0]).toContain('Sendungsliste');
  });

  test('kein Self-Loop wenn Flow in andere Liste schreibt', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: ['Content-Verzeichnis'],
    });
    const result = detectSelfLoop(flow);
    expect(result.hasLoop).toBe(false);
  });

  test('kein Self-Loop wenn Flow keine Schreibaktionen hat', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: [],
    });
    const result = detectSelfLoop(flow);
    expect(result.hasLoop).toBe(false);
  });

  test('gibt Hinweis bei unvollständiger Definition', () => {
    const result = detectSelfLoop({});
    expect(result.hasLoop).toBe(false);
    expect(result.details[0]).toContain('unvollständig');
  });
});

describe('detectCrossLoop', () => {
  test('erkennt Ping-Pong-Loop zwischen zwei Flows', () => {
    const flowA = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: ['Content-Verzeichnis'],
    });
    const flowB = makeFlow({
      triggerList: 'Content-Verzeichnis',
      writeLists: ['Sendungsliste'],
    });
    const result = detectCrossLoop(flowA, flowB);
    expect(result.hasLoop).toBe(true);
    expect(result.details).toEqual(
      expect.arrayContaining([
        expect.stringContaining('PING-PONG-LOOP'),
      ])
    );
  });

  test('erkennt einseitigen Cross-Loop', () => {
    const flowA = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: ['Content-Verzeichnis'],
    });
    const flowB = makeFlow({
      triggerList: 'Content-Verzeichnis',
      writeLists: ['Archiv-Liste'], // schreibt NICHT zurück in Sendungsliste
    });
    const result = detectCrossLoop(flowA, flowB);
    expect(result.hasLoop).toBe(true); // A triggert B
    expect(result.details).not.toEqual(
      expect.arrayContaining([
        expect.stringContaining('PING-PONG'),
      ])
    );
  });

  test('kein Cross-Loop wenn Flows unabhängig sind', () => {
    const flowA = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: ['Archiv-Liste'],
    });
    const flowB = makeFlow({
      triggerList: 'Content-Verzeichnis',
      writeLists: ['Planungsliste'],
    });
    const result = detectCrossLoop(flowA, flowB);
    expect(result.hasLoop).toBe(false);
  });
});

describe('checkTriggerConditions', () => {
  test('erkennt vorhandene Trigger Conditions', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
      triggerConditions: [
        { expression: "@not(equals(triggerOutputs()?['body/Editor/Email'], 'flow@wdr.de'))" },
      ],
    });
    const result = checkTriggerConditions(flow);
    expect(result.hasTriggerCondition).toBe(true);
    expect(result.conditions).toHaveLength(1);
    expect(result.conditions[0]).toContain('Editor/Email');
  });

  test('erkennt fehlende Trigger Conditions', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
    });
    const result = checkTriggerConditions(flow);
    expect(result.hasTriggerCondition).toBe(false);
    expect(result.conditions).toHaveLength(0);
  });
});

describe('getTriggerList', () => {
  test('gibt Trigger-Liste zurück', () => {
    const flow = makeFlow({ triggerList: 'Sendungsliste' });
    expect(getTriggerList(flow)).toBe('Sendungsliste');
  });

  test('gibt null bei fehlender Definition', () => {
    expect(getTriggerList({})).toBeNull();
  });
});

describe('getWriteLists', () => {
  test('gibt alle beschriebenen Listen zurück', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: ['Content-Verzeichnis', 'Archiv-Liste'],
    });
    const lists = getWriteLists(flow);
    expect(lists).toEqual(['Content-Verzeichnis', 'Archiv-Liste']);
  });

  test('gibt leeres Array wenn keine Schreibaktionen', () => {
    const flow = makeFlow({
      triggerList: 'Sendungsliste',
      writeLists: [],
    });
    expect(getWriteLists(flow)).toEqual([]);
  });
});
