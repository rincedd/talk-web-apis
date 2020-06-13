import React, { Component } from "react";
import {
  forceCollide,
  forceSimulation,
  forceX,
  forceY,
  interpolateViridis,
  select,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3";
import { Client, ClientManager } from "./client-manager";

const CIRCLE_RADIUS = 15;

type NodeType = SimulationNodeDatum & Client;

export class BubbleChart extends Component<{ clientManager: ClientManager }> {
  private simulation: Simulation<
    NodeType,
    SimulationLinkDatum<NodeType>
  > = forceSimulation<NodeType, SimulationLinkDatum<NodeType>>([]);
  private svg: SVGSVGElement | null = null;
  private updateSimulation = () =>
    this.simulation.nodes(this.getNodes()).alpha(1).restart();

  getNodes(): NodeType[] {
    return this.props.clientManager.getClients();
  }

  componentDidMount() {
    this.simulation = forceSimulation(this.getNodes())
      .velocityDecay(0.01)
      .force("x", forceX().strength(0.004))
      .force("y", forceY().strength(0.004))
      .force("collide", forceCollide().radius(CIRCLE_RADIUS).strength(0.5))
      .on("tick", () => requestAnimationFrame(() => this.renderBubbleChart()));

    this.props.clientManager.on("update", this.updateSimulation);
    this.adjustOrigin();
  }

  componentWillUnmount() {
    this.props.clientManager.removeListener("update", this.updateSimulation);
  }

  private adjustOrigin() {
    this.svg
      ?.querySelector("g")
      ?.setAttribute(
        "transform",
        `translate(${this.svg.clientWidth / 2}, ${this.svg.clientHeight / 2})`
      );
  }

  private renderBubbleChart() {
    if (!this.svg) {
      return;
    }
    // @ts-ignore
    const circles = select(this.svg)
      .select("g")
      .selectAll("circle")
      .data(this.getNodes(), function (d: NodeType) {
        // @ts-ignore
        return d.id ? d.id : this?.id;
      })
      .attr("cx", (d: NodeType) => d.x)
      .attr("cy", (d: NodeType) => d.y)
      .classed("charging", (d: Client) => d.charging)
      .style("fill", (d: Client) =>
        d.batteryLevel ? interpolateViridis(d.batteryLevel) : "#aaa"
      );
    circles
      .enter()
      .append("circle")
      .classed("node", true)
      .attr("r", 0.1 * CIRCLE_RADIUS)
      .attr("cx", (d: NodeType) => d.x)
      .attr("cy", (d: NodeType) => d.y)
      .transition()
      .duration(250)
      .attr("r", CIRCLE_RADIUS);
  }

  render() {
    return (
      <svg className="bubble-chart" ref={(e) => (this.svg = e)}>
        <g />
      </svg>
    );
  }
}
