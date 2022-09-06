import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type NodeID = string;
export type EdgeID = string;
export type Edge = {
    originID: NodeID,
    destinationID: NodeID,
    value: any,
}
export interface Graph {
    nodes: { [key: NodeID]: Array<EdgeID> };
    edges: { [key: EdgeID]: Edge };
}

export function addNodeHelper(graph: Graph, id: NodeID): Graph {
    if (graph.nodes[id]) {
        console.log('Node already exists');
        return graph;
    }
    graph.nodes[id] = [];
    return graph
}

export function addEdgeHelper(graph: Graph, edgeID: EdgeID, originID: NodeID, destinationID: NodeID, value: any): Graph {
    if (!graph.nodes[originID] || !graph.nodes[destinationID]) {
        return graph;
    }

    graph.nodes[originID].push(edgeID);
    graph.edges[edgeID] = {
        originID,
        destinationID,
        value,
    };

    return graph;
}

export function removeNodeHelper(graph: Graph, nodeID: NodeID): Graph {
    if (!graph.nodes[nodeID]) {
        return graph;
    }

    for (let edgeID in graph.edges) {
        const edge = graph.edges[edgeID];
        if (edge.originID === nodeID || edge.destinationID === nodeID) {
            removeEdgeHelper(graph, edgeID);
        }
    }

    delete graph.nodes[nodeID];

    return graph;
}

export function removeEdgeHelper(graph: Graph, edgeID: EdgeID): Graph {
    if (!graph.edges[edgeID]) {
        return graph;
    }

    const { originID } = graph.edges[edgeID];

    if (graph.nodes[originID]) {
        graph.nodes[originID].filter(id => id === edgeID);
    }

    delete graph.edges[edgeID]

    return graph;
}

// export function breadthFirstSearch(graph: Graph, start: NodeID, desired: NodeID) {
//     const queue: Array<NodeID> = [start];
//     const visited = new Set();
//
//     while (queue.length > 0) {
//         const node = queue.shift();
//         const edges = graph.nodes.get(node!);
//         edges!.forEach(([, end]) => {
//             if (end === desired) {
//                 console.log('connected!')
//                 return;
//             }
//             if (!visited.has(end)) {
//                 visited.add(end);
//                 queue.push(end);
//                 console.log(end);
//             }
//         })
//     }
// }

// //TODO: fix it
// export function depthFirstSearch(graph: Graph, sourceNodeId: NodeID, node: NodeID) {
//     const edges = graph.nodes.get(sourceNodeId);
//     if (!edges) {
//         return;
//     }
//     for (const edge of edges) {
//         const neighbor = edge[1];
//         depthFirstSearch(graph, neighbor, node);
//     }
// }

const initialState: Graph = {
    nodes: {},
    edges: {},
}

export type AddEdgePayload = {
    edgeID: EdgeID;
    originID: NodeID;
    destinationID: NodeID;
    value: any;
}

export const graphSlice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        addNode: (graph, action: PayloadAction<NodeID>) => {
            graph = {...addNodeHelper(graph, action.payload)};
        },
        removeNode: (graph, action: PayloadAction<NodeID>) => {
            graph = {...removeNodeHelper(graph, action.payload)};
        },
        addEdge: (graph, action: PayloadAction<AddEdgePayload>) => {
            const { edgeID, originID, destinationID, value } = action.payload;
            graph = {...addEdgeHelper(graph, edgeID, originID, destinationID, value)};
        },
        removeEdge: (graph, action: PayloadAction<EdgeID>) => {
            graph = {...removeEdgeHelper(graph, action.payload)};
        }
    },
});

export const { addNode, addEdge, removeNode, removeEdge } = graphSlice.actions
export const getGraph = (graph: Graph) => graph;
export default graphSlice.reducer;
