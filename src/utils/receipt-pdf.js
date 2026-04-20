let styleResolverElement = null;

function getStyleResolverElement() {
  if (!styleResolverElement) {
    styleResolverElement = document.createElement("div");
    styleResolverElement.style.position = "fixed";
    styleResolverElement.style.left = "-99999px";
    styleResolverElement.style.top = "0";
    styleResolverElement.style.visibility = "hidden";
    document.body.appendChild(styleResolverElement);
  }

  return styleResolverElement;
}

function normalizeStyleValue(propertyName, propertyValue) {
  if (!propertyValue.includes("oklch(") && !propertyValue.includes("color-mix(")) {
    return propertyValue;
  }

  const resolverElement = getStyleResolverElement();
  resolverElement.style.removeProperty(propertyName);
  resolverElement.style.setProperty(propertyName, propertyValue);

  const resolvedValue = window.getComputedStyle(resolverElement).getPropertyValue(propertyName);
  resolverElement.style.removeProperty(propertyName);

  return resolvedValue || propertyValue;
}

function copyComputedStyles(sourceElement, targetElement) {
  const computedStyle = window.getComputedStyle(sourceElement);

  for (const propertyName of computedStyle) {
    const propertyValue = normalizeStyleValue(
      propertyName,
      computedStyle.getPropertyValue(propertyName),
    );

    targetElement.style.setProperty(
      propertyName,
      propertyValue,
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
  clonedElement.removeAttribute("class");
  clonedElement.removeAttribute("style");
  copyComputedStyles(sourceNode, clonedElement);

  for (const childNode of sourceNode.childNodes) {
    clonedElement.appendChild(cloneNodeWithInlineStyles(childNode));
  }

  return clonedElement;
}

function createExportContainer(sourceElement) {
  const clonedElement = cloneNodeWithInlineStyles(sourceElement);
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-99999px";
  iframe.style.top = "0";
  iframe.style.width = `${sourceElement.offsetWidth}px`;
  iframe.style.height = `${sourceElement.offsetHeight}px`;
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentDocument;
  if (!iframeDocument) {
    iframe.remove();
    throw new Error("Unable to create export document.");
  }

  iframeDocument.open();
  iframeDocument.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }
        </style>
      </head>
      <body></body>
    </html>
  `);
  iframeDocument.close();

  iframeDocument.body.appendChild(clonedElement);

  return { exportRoot: iframe, clonedElement };
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
      onclone: (clonedDocument) => {
        clonedDocument
          .querySelectorAll('style, link[rel="stylesheet"]')
          .forEach((styleNode) => styleNode.remove());
      },
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
