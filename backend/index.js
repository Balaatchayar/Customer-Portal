require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const xml2js = require("xml2js");
const https = require("https");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const parseXML = async (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  return await parser.parseStringPromise(xml);
};

const createSOAPRequest = (functionName, params) => {
  const body = Object.entries(params)
    .map(([key, value]) => `<${key}>${value}</${key}>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
      <soap:Header/>
      <soap:Body>
        <n0:${functionName}>
          ${body}
        </n0:${functionName}>
      </soap:Body>
    </soap:Envelope>`;
};

const sendSOAPRequest = async (url, functionName, params) => {
  const xmlRequest = createSOAPRequest(functionName, params);
  console.log(`📤 Sending SOAP request to ${url}`);
  console.log("🧾 Request XML:\n", xmlRequest);

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const authHeader = `Basic ${Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString("base64")}`;

  try {
    const response = await axios.post(url, xmlRequest, {
      headers: {
        "Content-Type": "application/soap+xml",
        Authorization: authHeader,
        Cookie: "sap-usercontext=sap-client=100",
      },
      httpsAgent,
    });

    console.log("📥 Raw SOAP response:\n", response.data);
    return await parseXML(response.data);
  } catch (error) {
    console.error("🚨 SOAP Request Error:", error.message);
    if (error.response) {
      console.error("🔴 Status:", error.response.status);
      console.error("🔴 Body:", error.response.data);
    }
    throw error;
  }
};

const handleSAPResponse = (data, functionName, res, label) => {
  const body = data?.["env:Envelope"]?.["env:Body"];

  if (body?.["env:Fault"]) {
    console.error(`❌ SOAP Fault in ${label}:`, body["env:Fault"]);
    return res.status(500).json({ message: "SAP Fault", fault: body["env:Fault"] });
  }

  const result = body?.[`n0:${functionName}Response`];
  if (!result) {
    console.warn(`⚠️ Unexpected response structure in ${label}`);
    return res.status(500).json({ message: "Unexpected SAP response format" });
  }

  return res.status(200).json(result);
};

// Login Route
app.post("/login", async (req, res) => {
  const { customerId, password } = req.body;
  if (!customerId || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const paddedCustomerId = customerId.padStart(10, "0");
    const data = await sendSOAPRequest(
      process.env.SAP_LOGIN_URL,
      "ZgrhCustLoginFm",
      { ICustomerId: paddedCustomerId, IPassword: password }
    );

    const body = data?.["env:Envelope"]?.["env:Body"];
    if (body?.["env:Fault"]) {
      console.error("❌ SOAP Fault in login:", body["env:Fault"]);
      return res.status(500).json({ message: "SAP Fault", fault: body["env:Fault"] });
    }

    const responseObj = body?.["n0:ZgrhCustLoginFmResponse"];
    const status = responseObj?.["EStatus"];
    const message = responseObj?.["EMessage"];

    if (status === "X" || message?.toLowerCase().includes("success")) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Login failed", sapMessage: message });
    }
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Generic SAP Route Creator
const createRoute = (path, functionName, envKey) => {
  app.post(path, async (req, res) => {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ message: "Missing customerId" });
    }

    try {
      const paddedCustomerId = customerId.padStart(10, "0");
      const data = await sendSOAPRequest(
        process.env[envKey],
        functionName,
        { ICustomerId: paddedCustomerId }
      );
      handleSAPResponse(data, functionName, res, path);
    } catch (error) {
      console.error(`🔥 Error in ${path}:`, error.message);
      res.status(500).json({ message: `Failed to fetch ${path} data`, error: error.message });
    }
  });
};
// PDF Route
app.get("/invoice-pdf/:billingNumber", async (req, res) => {
  const billingNumber = req.params.billingNumber;

  const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
                   xmlns:n0="urn:sap-com:document:sap:soap:functions:mc-style">
      <soap:Header/>
      <soap:Body>
        <n0:ZgrhCustPdfFm>
          <InvoiceNo>${billingNumber}</InvoiceNo>
        </n0:ZgrhCustPdfFm>
      </soap:Body>
    </soap:Envelope>`;

  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const authHeader = `Basic ${Buffer.from(`${process.env.SAP_USERNAME}:${process.env.SAP_PASSWORD}`).toString("base64")}`;

  try {
    const response = await axios.post(
      process.env.SAP_PDF_URL,
      soapBody,
      {
        headers: {
          "Content-Type": "application/soap+xml",
          Authorization: authHeader,
          Cookie: "sap-usercontext=sap-client=100"
        },
        httpsAgent
      }
    );

    // Parse XML response
    const parsed = await parseXML(response.data);
    let base64pdf =
      parsed?.["env:Envelope"]?.["env:Body"]?.["n0:ZgrhCustPdfFmResponse"]?.["EPdfBase64"];

    if (!base64pdf) {
      return res.status(404).json({ message: "PDF not found or empty." });
    }

    // Clean base64 (remove newlines/spaces if any)
    base64pdf = base64pdf.replace(/(\r\n|\n|\r|\s)/gm, "");

    const binaryPdf = Buffer.from(base64pdf, "base64");

    // Force download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${billingNumber}.pdf`
    );
    res.send(binaryPdf);
  } catch (error) {
    console.error("🔥 Error fetching PDF:", error.message);
    if (error.response) {
      console.error("🔴 Status:", error.response.status);
      console.error("🔴 Body:", error.response.data);
    }
    res.status(500).json({ message: "Failed to retrieve PDF", error: error.message });
  }
});



// Define SAP Routes
createRoute("/profile", "ZgrhCustProfileFm", "SAP_PROFILE_URL");
createRoute("/aging", "ZgrhCustAgingFm", "SAP_AGING_URL");
createRoute("/deliveries", "ZgrhCustDeliveriesFm", "SAP_DELIVERIES_URL");
createRoute("/inquiry", "ZgrhCustInquiryFm", "SAP_INQUIRY_URL");
createRoute("/invoices", "ZgrhCustInvoicesFm", "SAP_INVOICES_URL");
createRoute("/memos", "ZgrhCustMemosFm", "SAP_MEMOS_URL");
createRoute("/sales", "ZgrhCustSalesFm", "SAP_SALES_URL");
createRoute("/overall", "ZgrhCustOverallFm", "SAP_OVERALL_URL");

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
