fetch("./data.json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    buildSections(data, "map");
  });

const buildSections = (data) => {
  const myOffcanvas = document.getElementById('offcanvasWithBackdrop');
  const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas);

  const myDiagram = new go.Diagram("myDiagramDiv",
  {
    "undoManager.isEnabled": true,
    layout: new go.TreeLayout()
  });

  myDiagram.nodeTemplate = new go.Node("Horizontal", { background: "#EDB309" })
      .add(new go.TextBlock("Default Text", { margin: 12, stroke: "black", font: "bold 16px sans-serif" })
      .bind("text", "name"));

    myDiagram.linkTemplate = new go.Link({ routing: go.Link.Orthogonal, corner: 5 })
      .add(new go.Shape({ strokeWidth: 3, stroke: "black" }))
      .add(new go.Shape({  toArrow: "Standard", stroke: "black"  }))
          
  myDiagram.model = new go.TreeModel(data);

  myDiagram.commit(d => {
    d.nodes.each(node => {
      node.click = ((e) => {
        const offCanvasTitle = document.getElementById('offcanvas-title');
        const offCanvasBody = document.getElementById('offcanvas-body');
        offCanvasTitle.innerText = node.data.name;
        offCanvasBody.innerHTML = `<div>${node.data.breadcrumb ?? ""}${node.data.definition ?? ""}${node.data.foundation ?? ""}</div>`;
        bsOffcanvas.show();
      });
    });
  }, "bsOffcanvas");

  const lay = myDiagram.layout;
  lay.angle = 0;
  lay.layerSpacing = 30;
  lay.treeStyle = go.TreeLayout.StyleLayered;
  lay.layerStyle = go.TreeLayout.LayerIndividual;
  lay.alignment = go.TreeLayout.AlignmentCenterChildren;
}