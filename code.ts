figma.showUI(__html__, { width: 300, height: 200 });

figma.ui.onmessage = msg => {
  if (msg.type === "create-grid") {
    const { rows, columns, rowPadding, columnPadding } = msg;

    const selection = figma.currentPage.selection;

    if (!selection.length) {
      figma.closePlugin();
      return;
    }

    let [selectedElement] = selection;

    if (selection.length > 1) {
      selectedElement = figma.group(selection, selectedElement.parent);
    }

    const nodes: SceneNode[] = [...selection];

    let first = false;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (!first) {
          first = true;
          continue;
        }

        const clone = selectedElement.clone();

        clone.x += (clone.width + rowPadding) * x;
        clone.y += (clone.height + columnPadding) * y;

        selectedElement.parent.appendChild(clone);
        nodes.push(clone);
      }
    }

    figma.currentPage.selection = nodes;
  }
  figma.closePlugin();
};
