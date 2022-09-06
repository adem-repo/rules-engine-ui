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
})
