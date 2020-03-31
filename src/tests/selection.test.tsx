import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent } from "./test-utils";
import { App } from "../components/App";
import * as Renderer from "../renderer/renderScene";
import { KEYS } from "../keys";
import { reseed } from "../random";
import { ExcalidrawElement } from "../element/types";

// Unmount ReactDOM from root
ReactDOM.unmountComponentAtNode(document.getElementById("root")!);

const renderScene = jest.spyOn(Renderer, "renderScene");
beforeEach(() => {
  localStorage.clear();
  renderScene.mockClear();
  reseed(7);
});

const { h } = window;

describe("selection element", () => {
  it("create selection element on pointer down", () => {
    const { getByToolName, container } = render(<App />);
    // select tool
    const tool = getByToolName("selection");
    fireEvent.click(tool);

    const canvas = container.querySelector("canvas")!;
    fireEvent.pointerDown(canvas, { clientX: 60, clientY: 100 });

    expect(renderScene).toHaveBeenCalledTimes(1);
    const selectionElement = h.state.selectionElement!;
    expect(selectionElement).not.toBeNull();
    expect(selectionElement.type).toEqual("selection");
    expect([selectionElement.x, selectionElement.y]).toEqual([60, 100]);
    expect([selectionElement.width, selectionElement.height]).toEqual([0, 0]);

    // TODO: There is a memory leak if pointer up is not triggered
    fireEvent.pointerUp(canvas);
  });

  it("resize selection element on pointer move", () => {
    const { getByToolName, container } = render(<App />);
    // select tool
    const tool = getByToolName("selection");
    fireEvent.click(tool);

    const canvas = container.querySelector("canvas")!;
    fireEvent.pointerDown(canvas, { clientX: 60, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 150, clientY: 30 });

    expect(renderScene).toHaveBeenCalledTimes(2);
    const selectionElement = h.state.selectionElement!;
    expect(selectionElement).not.toBeNull();
    expect(selectionElement.type).toEqual("selection");
    expect([selectionElement.x, selectionElement.y]).toEqual([60, 30]);
    expect([selectionElement.width, selectionElement.height]).toEqual([90, 70]);

    // TODO: There is a memory leak if pointer up is not triggered
    fireEvent.pointerUp(canvas);
  });

  it("remove selection element on pointer up", () => {
    const { getByToolName, container } = render(<App />);
    // select tool
    const tool = getByToolName("selection");
    fireEvent.click(tool);

    const canvas = container.querySelector("canvas")!;
    fireEvent.pointerDown(canvas, { clientX: 60, clientY: 100 });
    fireEvent.pointerMove(canvas, { clientX: 150, clientY: 30 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(3);
    expect(h.state.selectionElement).toBeNull();
  });
});

describe("select single element on the scene", () => {
  it("rectangle", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;
    {
      // create element
      const tool = getByToolName("rectangle");
      fireEvent.click(tool);
      fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
      fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
      fireEvent.pointerUp(canvas);
      fireEvent.keyDown(document, { key: KEYS.ESCAPE });
    }

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    // click on a line on the rectangle
    fireEvent.pointerDown(canvas, { clientX: 45, clientY: 20 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(7);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toEqual(1);
    expect(h.state.selectedElementIds[h.elements[0].id]).toBeTruthy();

    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });

  it("diamond", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;
    {
      // create element
      const tool = getByToolName("diamond");
      fireEvent.click(tool);
      fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
      fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
      fireEvent.pointerUp(canvas);
      fireEvent.keyDown(document, { key: KEYS.ESCAPE });
    }

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    // click on a line on the rectangle
    fireEvent.pointerDown(canvas, { clientX: 45, clientY: 20 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(7);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toEqual(1);
    expect(h.state.selectedElementIds[h.elements[0].id]).toBeTruthy();

    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });

  it("ellipse", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;
    {
      // create element
      const tool = getByToolName("ellipse");
      fireEvent.click(tool);
      fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
      fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
      fireEvent.pointerUp(canvas);
      fireEvent.keyDown(document, { key: KEYS.ESCAPE });
    }

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    // click on a line on the rectangle
    fireEvent.pointerDown(canvas, { clientX: 45, clientY: 20 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(7);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toEqual(1);
    expect(h.state.selectedElementIds[h.elements[0].id]).toBeTruthy();

    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });

  it("arrow", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;
    {
      // create element
      const tool = getByToolName("arrow");
      fireEvent.click(tool);
      fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
      fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
      fireEvent.pointerUp(canvas);
      fireEvent.keyDown(document, { key: KEYS.ESCAPE });
    }

    /*
        1 2 3 4 5 6 7 8 9
      1
      2     x
      3
      4       .
      5
      6
      7           x
      8
      9
    */

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    // click on a line on the arrow
    fireEvent.pointerDown(canvas, { clientX: 40, clientY: 40 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(7);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toEqual(1);
    expect(h.state.selectedElementIds[h.elements[0].id]).toBeTruthy();
    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });

  it("arrow escape", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;
    {
      // create element
      const tool = getByToolName("line");
      fireEvent.click(tool);
      fireEvent.pointerDown(canvas, { clientX: 30, clientY: 20 });
      fireEvent.pointerMove(canvas, { clientX: 60, clientY: 70 });
      fireEvent.pointerUp(canvas);
      fireEvent.keyDown(document, { key: KEYS.ESCAPE });
    }

    /*
        1 2 3 4 5 6 7 8 9
      1
      2     x
      3
      4       .
      5
      6
      7           x
      8
      9
    */

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    // click on a line on the arrow
    fireEvent.pointerDown(canvas, { clientX: 40, clientY: 40 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(7);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toEqual(1);
    expect(h.state.selectedElementIds[h.elements[0].id]).toBeTruthy();

    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });
});

describe("select multiple elements on the scene", () => {
  it("select all", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;

    /*
        1 2 3 4 5 6 7 8 9
      1
      2      
      3     🟥
      4       🔶
      5         🟡
      6
      7           
      8
      9
    */
    // create elements
    fireEvent.click(getByToolName("rectangle"));
    fireEvent.pointerDown(canvas, { clientX: 30, clientY: 30 });
    fireEvent.pointerMove(canvas, { clientX: 40, clientY: 40 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    fireEvent.click(getByToolName("diamond"));
    fireEvent.pointerDown(canvas, { clientX: 40, clientY: 40 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 50 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    fireEvent.click(getByToolName("ellipse"));
    fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 60 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    fireEvent.pointerDown(canvas, { clientX: 20, clientY: 20 });
    fireEvent.pointerMove(canvas, { clientX: 70, clientY: 70 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(18);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toBe(3);
    h.elements.forEach((element) => {
      expect(h.state.selectedElementIds[element.id]).toBeTruthy();
    });

    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });

  it("select partials", () => {
    const { getByToolName, container } = render(<App />);
    const canvas = container.querySelector("canvas")!;

    /*
        1 2 3 4 5 6 7 8 9
      1
      2      
      3     🟥
      4       🔶
      5         🟡
      6
      7           
      8
      9
    */
    // create elements
    fireEvent.click(getByToolName("rectangle"));
    fireEvent.pointerDown(canvas, { clientX: 30, clientY: 30 });
    fireEvent.pointerMove(canvas, { clientX: 40, clientY: 40 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    fireEvent.click(getByToolName("diamond"));
    fireEvent.pointerDown(canvas, { clientX: 40, clientY: 40 });
    fireEvent.pointerMove(canvas, { clientX: 50, clientY: 50 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    fireEvent.click(getByToolName("ellipse"));
    fireEvent.pointerDown(canvas, { clientX: 50, clientY: 50 });
    fireEvent.pointerMove(canvas, { clientX: 60, clientY: 60 });
    fireEvent.pointerUp(canvas);
    fireEvent.keyDown(document, { key: KEYS.ESCAPE });

    const tool = getByToolName("selection");
    fireEvent.click(tool);
    // Start dragging from an empty spot
    fireEvent.pointerDown(canvas, { clientX: 55, clientY: 35 });
    fireEvent.pointerMove(canvas, { clientX: 35, clientY: 55 });
    fireEvent.pointerUp(canvas);

    expect(renderScene).toHaveBeenCalledTimes(18);
    expect(h.state.selectionElement).toBeNull();
    expect(h.elements.length).toBe(3);

    const selectedElements: ExcalidrawElement[] = h.elements.filter(
      (element) => h.state.selectedElementIds[element.id],
    );

    expect(selectedElements.length).toBe(1);
    expect(selectedElements[0].type).toEqual("diamond");

    h.elements.forEach((element) => expect(element).toMatchSnapshot());
  });
});
