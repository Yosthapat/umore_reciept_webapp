function copyComputedStyles(sourceElement, targetElement) {
  const computedStyle = window.getComputedStyle(sourceElement);

  for (const propertyName of computedStyle) {
    targetElement.style.setProperty(
      propertyName,
      computedStyle.getPropertyValue(propertyName),
      computedStyle.getPropertyPriority(propertyName),
    );
  }
}

function cloneNodeWithInlineStyles(sourceNode) {
  if (sourceNode.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(sourceNode.textContent || "");
  }

  if (!(sourceNode instanceof Element)) {
    return sourceNode.cloneNode(false);
  }

  const clonedElement = sourceNode.cloneNode(false);
  copyComputedStyles(sourceNode, clonedElement);

  for (const childNode of sourceNode.childNodes) {
    clonedElement.appendChild(cloneNodeWithInlineStyles(childNode));
  }

  return clonedElement;
}

function createExportContainer(sourceElement) {
  const exportRoot = document.createElement("div");
  exportRoot.style.position = "fixed";
  exportRoot.style.left = "-99999px";
  exportRoot.style.top = "0";
  exportRoot.style.width = `${sourceElement.offsetWidth}px`;
  exportRoot.style.padding = "0";
  exportRoot.style.margin = "0";
  exportRoot.style.backgroundColor = "#ffffff";
  exportRoot.style.zIndex = "-1";

  const clonedElement = cloneNodeWithInlineStyles(sourceElement);
  exportRoot.appendChild(clonedElement);
  document.body.appendChild(exportRoot);

  return { exportRoot, clonedElement };
}

export async function downloadReceiptPdf(element) {
  if (!element) {
    return;
  }

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const { exportRoot, clonedElement } = createExportContainer(element);

  try {
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const imageWidth = pageWidth - margin * 2;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;

    let heightLeft = imageHeight;
    let position = margin;

    pdf.addImage(imageData, "PNG", margin, position, imageWidth, imageHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      position = -(imageHeight - heightLeft) + margin;
      pdf.addPage();
      pdf.addImage(imageData, "PNG", margin, position, imageWidth, imageHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save("receipt-form.pdf");
  } finally {
    exportRoot.remove();
  }
}
