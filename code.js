figma.showUI(__html__, { width: 300, height: 200 });
const MAX_COLUMNS = 50;
const MAX_ROWS = 50;
figma.ui.onmessage = msg => {
    if (msg.type === "create-grid") {
        let { rows, columns, rowPadding, columnPadding } = msg;
        rows = Math.min(rows, MAX_ROWS);
        columns = Math.min(columns, MAX_COLUMNS);
        const selection = figma.currentPage.selection;
        if (!selection.length) {
            figma.closePlugin();
            figma.notify("Please select either an object or group!");
            return;
        }
        let [selectedElement] = selection;
        if (selection.length > 1) {
            selectedElement = figma.group(selection, selectedElement.parent);
        }
        const nodes = [...selection];
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
