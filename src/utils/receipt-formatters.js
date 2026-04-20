export function createEmptyItem() {
  return {
    id: crypto.randomUUID(),
    date: "",
    description: "",
    amount: "",
    note: "",
  };
}

export function parseAmount(value) {
  const parsedAmount = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(parsedAmount) ? 0 : parsedAmount;
}

export function sanitizeAmountInput(value) {
  const normalizedValue = String(value).replace(/,/g, "").replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = normalizedValue.split(".");
  const decimalPart = decimalParts.join("");

  if (normalizedValue.startsWith(".")) {
    return `0.${decimalPart.slice(0, 2)}`;
  }

  if (decimalParts.length === 0) {
    return integerPart;
  }

  return `${integerPart}.${decimalPart.slice(0, 2)}`;
}

export function normalizeAmountForDisplay(value) {
  const sanitizedAmount = sanitizeAmountInput(value);
  if (!sanitizedAmount) {
    return "";
  }

  return formatAmount(sanitizedAmount) || sanitizedAmount;
}

export function validateReceiptItem(item) {
  const errors = {};

  if (!item.date) {
    errors.date = "กรุณาระบุวันที่";
  }

  if (!item.description.trim()) {
    errors.description = "กรุณาระบุรายละเอียดรายการ";
  }

  if (!item.amount) {
    errors.amount = "กรุณาระบุจำนวนเงิน";
  } else if (parseAmount(item.amount) <= 0) {
    errors.amount = "จำนวนเงินต้องมากกว่า 0";
  }

  return errors;
}

export function formatAmount(value) {
  const parsedAmount = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(parsedAmount) || !value) {
    return "";
  }

  return parsedAmount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatThaiLongDate(dateString) {
  if (!dateString) {
    return "........../........../..........";
  }

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateString;
  }

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = thaiMonths[parsedDate.getMonth()];
  const year = parsedDate.getFullYear() + 543;

  return `${day} ${month} ${year}`;
}

export function numberToThaiText(value) {
  const parsedNumber = Number(value);
  if (!Number.isFinite(parsedNumber) || parsedNumber < 0) {
    return "";
  }

  if (parsedNumber === 0) {
    return "ศูนย์บาทถ้วน";
  }

  const digitText = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const positionText = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  function convertInteger(integerString) {
    if (!integerString || Number(integerString) === 0) {
      return "";
    }

    let convertedText = "";
    const integerLength = integerString.length;

    for (let index = 0; index < integerLength; index += 1) {
      const digit = Number(integerString[index]);
      if (digit === 0) {
        continue;
      }

      const position = integerLength - index - 1;

      if (position === 0) {
        convertedText += digit === 1 && integerLength > 1 ? "เอ็ด" : digitText[digit];
        continue;
      }

      if (position === 1) {
        if (digit === 1) {
          convertedText += "สิบ";
        } else if (digit === 2) {
          convertedText += "ยี่สิบ";
        } else {
          convertedText += `${digitText[digit]}สิบ`;
        }
        continue;
      }

      convertedText += `${digitText[digit]}${positionText[position]}`;
    }

    return convertedText;
  }

  function convertMillions(integerString) {
    if (integerString.length <= 6) {
      return convertInteger(integerString);
    }

    const head = integerString.slice(0, -6);
    const tail = integerString.slice(-6);
    return `${convertMillions(head)}ล้าน${convertInteger(tail)}`;
  }

  const [bahtPartRaw, satangPartRaw = "00"] = parsedNumber.toFixed(2).split(".");
  const bahtText = convertMillions(bahtPartRaw);
  const satangText = convertInteger(satangPartRaw);

  if (satangPartRaw === "00") {
    return `${bahtText}บาทถ้วน`;
  }

  return `${bahtText}บาท${satangText}สตางค์`;
}
