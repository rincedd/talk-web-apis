import React, { Component, createRef, RefObject } from "react";
import { Heading } from "spectacle";
import CanvasDraw from "react-canvas-draw";

export default class ClientSideFileHandling extends Component<any, any> {
  private canvas: RefObject<CanvasDraw> = createRef();

  handleSave = () => {
    // @ts-ignore
    this.canvas.current?.canvasContainer.children[1].toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "my-image.png";
      link.href = url;

      link.click();
      URL.revokeObjectURL(url);
    });
  };

  render() {
    return (
      <>
        <Heading>generate and download file</Heading>
        <CanvasDraw
          style={{ margin: "0 auto" }}
          backgroundColor="#ffffff"
          brushColor="#f08000"
          canvasWidth={800}
          canvasHeight={400}
          ref={this.canvas}
        />
        <div style={{margin: "0 auto"}}>
        <button className="btn" onClick={() => this.canvas.current?.clear()}>
          Clear
        </button>
        <button className="btn" onClick={this.handleSave}>
          Save
        </button>
        </div>
      </>
    );
  }
}
