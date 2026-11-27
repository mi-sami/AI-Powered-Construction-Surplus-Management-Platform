import Tesseract from "tesseract.js";

export const verifyDocumentContent = async (
  imageDataUrl,
  type,
  enteredDocNo = ""
) => {
  const {
    data: { text },
  } = await Tesseract.recognize(imageDataUrl, "eng+ben");

  const normalizedText = text.toLowerCase().replace(/\s+/g, " ");
  const digitsOnlyText = text.replace(/\D/g, "");

  if (type === "Individual") {
    const nidKeywords = [
      "national id",
      "nid",
      "government of the people",
      "people's republic of bangladesh",
      "date of birth",
      "id no",
      "blood group",
      "জাতীয় পরিচয়",
      "পরিচয় পত্র",
      "গণপ্রজাতন্ত্রী বাংলাদেশ",
      "জন্ম তারিখ",
    ];

    const hasNidKeyword = nidKeywords.some((kw) =>
      normalizedText.includes(kw)
    );
    const hasNidNumberPattern = /\b\d{10}\b|\b\d{13}\b|\b\d{17}\b/.test(
      digitsOnlyText
    );

    const cleanEnteredNid = (enteredDocNo || "").replace(/\D/g, "");
    const matchesEnteredNid =
      cleanEnteredNid.length >= 10
        ? digitsOnlyText.includes(cleanEnteredNid)
        : true;

    if (!hasNidKeyword && !hasNidNumberPattern) {
      return {
        valid: false,
        message:
          "Invalid NID image! Please upload a clear photo of an official NID card.",
      };
    }

    if (!matchesEnteredNid) {
      return {
        valid: false,
        message:
          "Uploaded NID number does not match the NID No. entered above.",
      };
    }

    return { valid: true };
  }

  // Company -> Trade License Verification
  const licenseKeywords = [
    "trade license",
    "trade licence",
    "license no",
    "licence no",
    "city corporation",
    "municipality",
    "pourashava",
    "union parishad",
    "business",
    "proprietor",
    "ট্রেড লাইসেন্স",
    "লাইসেন্স নং",
    "সিটি কর্পোরেশন",
    "পৌরসভা",
    "ইউনিয়ন পরিষদ",
  ];

  const hasLicenseKeyword = licenseKeywords.some((kw) =>
    normalizedText.includes(kw)
  );

  const cleanEnteredLicense = (enteredDocNo || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const cleanOcrAlphaNum = normalizedText.replace(/[^a-z0-9]/g, "");

  const matchesEnteredLicense =
    cleanEnteredLicense.length >= 4
      ? cleanOcrAlphaNum.includes(cleanEnteredLicense)
      : true;

  if (!hasLicenseKeyword) {
    return {
      valid: false,
      message:
        "Invalid Trade License! Please upload a clear image of an official Trade License document.",
    };
  }

  if (!matchesEnteredLicense) {
    return {
      valid: false,
      message:
        "Uploaded document does not match the Trade License No. entered above.",
    };
  }

  return { valid: true };
};

export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Only image files (JPG, PNG, WEBP) are allowed."));
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      reject(new Error("Image size must be less than 3MB."));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });