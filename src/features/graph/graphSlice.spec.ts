import { v4 as uuidv4 } from 'uuid';
import graphReducer, {
    Graph,
    AddEdgePayload,
    addEdge,
    addNode,
    removeNode,
    removeEdge
} from './graphSlice';

describe('graph reducer', () => {
  const initialState: Graph = {
    nodes: {},
    edges: {},
  };

  it('should handle initial state', () => {
    expect(graphReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add node', () => {
    const nodeID = uuidv4();
    const graph = graphReducer(initialState, addNode(nodeID));
    expect(graph.nodes).toHaveProperty(nodeID);
  });

  it('should add edge', () => {
      const nodeID_1 = uuidv4();
      const nodeID_2 = uuidv4();
      const edgeID = uuidv4();
      const addEdgeActionPayload: AddEdgePayload = {
          edgeID,
          originID: nodeID_1,
          destinationID: nodeID_2,
          value: 1,
      }
      const state1 = graphReducer(initialState, addNode(nodeID_1));
      const state2 = graphReducer(state1, addNode(nodeID_2));
      const state3 = graphReducer(state2, addEdge(addEdgeActionPayload));
      expect(state3.nodes).toHaveProperty(nodeID_1);
      expect(state3.nodes).toHaveProperty(nodeID_2);
      expect(state3.nodes[nodeID_1]).toContain(edgeID);
      expect(state3.edges).toHaveProperty(edgeID);
  });

  describe('should remove node', () => {
      let nodeID_1: string, nodeID_2: string, nodeID_3: string, nodeID_4: string;
      let edgeID_1_2: string, edgeID_1_4: string, edgeID_2_3: string, edgeID_3_4: string;
      let graph: Graph;

      beforeEach(() => {
          nodeID_1 = uuidv4();
          nodeID_2 = uuidv4();
          nodeID_3 = uuidv4();
          nodeID_4 = uuidv4();

          edgeID_1_2 = uuidv4();
          edgeID_1_4 = uuidv4();
          edgeID_2_3 = uuidv4();
          edgeID_3_4 = uuidv4();

          graph = {
              nodes: {
                  [nodeID_1]: [nodeID_2, nodeID_4],
                  [nodeID_2]: [nodeID_3],
                  [nodeID_3]: [nodeID_4],
                  [nodeID_4]: []
              },
              edges: {
                  [edgeID_1_2]: {
                      originID: nodeID_1,
                      destinationID: nodeID_2,
                      value: '1-2',
                  },
                  [edgeID_1_4]: {
                      originID: nodeID_1,
                      destinationID: nodeID_4,
                      value: '1-4',
                  },
                  [edgeID_2_3]: {
                      originID: nodeID_2,
                      destinationID: nodeID_3,
                      value: '2-3',
                  },
                  [edgeID_3_4]: {
                      originID: nodeID_3,
                      destinationID: nodeID_4,
                      value: '3-4',
                  },
              }
          }
      })

      it('remove node and out-edges', () => {
          const state = graphReducer(graph, removeNode(nodeID_1));
          expect(state.nodes).not.toHaveProperty(nodeID_1);
          expect(state.edges).not.toHaveProperty(edgeID_1_2);
          expect(state.edges).not.toHaveProperty(edgeID_1_4);
      });

      it('remove node and in-edges', () => {
          const state = graphReducer(graph, removeNode(nodeID_4));
          expect(state.nodes).not.toHaveProperty(nodeID_4);
          expect(state.edges).not.toHaveProperty(edgeID_1_4);
          expect(state.edges).not.toHaveProperty(edgeID_3_4);
      });
  });

  it('should remove edge', () => {
      const nodeID_1 = uuidv4();
      const nodeID_2 = uuidv4();

      const edgeID_1_2 = uuidv4();
      const graph: Graph = {
          nodes: {
              [nodeID_1]: [nodeID_2],
              [nodeID_2]: [],
          },
          edges: {
              [edgeID_1_2]: {
                  originID: nodeID_1,
                  destinationID: nodeID_2,
                  value: '1-2',
              },
          }
      }

      const state = graphReducer(graph, removeEdge(edgeID_1_2));
      expect(state.edges).not.toHaveProperty(edgeID_1_2);
  });

  //TODO: test values
  //TODO: test breadth first search
  //TODO: test depth first search
  //TODO: validate graph
})
