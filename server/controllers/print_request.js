const UserModel = require("../models");

const {
  PrintRequest,
  PrintEmployee,
  Employee,
  User,
  Company,
  Branch,
} = require("../models");
const Response = require("../helpers/response");
const { Op } = require("sequelize");
const PDFDocument = require("pdfkit");
const qs = require("querystring");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const QRCode = require("qrcode");
const { validationResult } = require("express-validator");
const sendMail = require("../helpers/sendMail");
const Role = require("../utils/userTypes");
const { mobileIconBase64, emailIconBase64 } = require("../utils/icons");
const { APP_URL, FRONT_END_URL, LIMIT_DATA, PRINT_ADMIN_MAIL } = process.env;

const allowedSortFields = ["id", "status", "created_at", "modified_at"];
const allowedOrder = ["ASC", "DESC"];


const checkPhoneNumber = (mobile_number) => {
  if (mobile_number &&mobile_number?.length === 12 && mobile_number?.startsWith('91')) {
    // Remove first two digits '91'
    return mobile_number.substring(2);
    // or: return mobile_number.slice(2);
  }
  return mobile_number;
};

const generateMobilityPdf = async (
  res,
  is_send,
  employee_id,
  employee_name
) => {
  let browser;
  try {


   
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
      timeout: 120000, // Increase timeout to 60 seconds
    });

    const page = await browser.newPage();

    // Set viewport to a larger size for better quality
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2, // Higher DPI for better quality
    });

    const website_url = `${APP_URL}/pdf/refex_mobility/${employee_id}`;

    // Open URL in current page
    await page.goto(website_url, { waitUntil: "networkidle0", timeout: 60000 });
    await page.screenshot({
      path: ".png",
    });

    // Ensure fonts are loaded
    await page.evaluateHandle("document.fonts.ready");

    //To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");

    // Wait for QR code to render
    try {
      await page.waitForSelector("canvas, svg", { timeout: 30000 });
    } catch (err) {
      console.warn("⚠️ Warning: canvas or svg not found. Proceeding anyway...");
    }

    if (is_send) {
      try {
        // Define the path to save the PDF
        const uploadsDir = path.join(
          __dirname,
          "../../uploads/approved_vcards"
        );
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `${employee_name}_${employee_id}_${uniqueSuffix}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Generate and save PDF
        await page.pdf({
          path: filePath,
          format: "A4",
          printBackground: true,
          width: "1920px",
          height: "1080px",
        });

        // Read the saved PDF file
        const pdfBuffer = fs.readFileSync(filePath);

        // Set headers and send the PDF
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${employee_name}_${employee_id}.pdf"`,
        });

        res.send(pdfBuffer);

        // Optional: Clean up the file after sending (if you don't need to keep it)
        // fs.unlinkSync(filePath);
      } catch (error) {
        console.error("PDF generation error:", error);
        if (!res.headersSent) {
          res.status(500).send("PDF generation failed");
        }
      }
    } else {
      // const pdfPath = path.join(__dirname, "output.pdf");
      const uploadsDir = path.join(__dirname, "../../uploads/approved_vcards");
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `${employee_name}_${uniqueSuffix}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      // Ensure the uploads directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }

      writeStream = fs.createWriteStream(filePath);

      await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
        // scale: 1.5,
        width: "1920px", // Adjust width to match viewport
        height: "1080px", // Adjust height to match viewport
      });

      return {
        filename: fileName,
        path: filePath,
      };
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};




// const generateDefaultPdf = async (
//   res,
//   is_send,
//   employee_id,
//   employee_name,
//   designation,
//   mobile_number,
//   email,
//   company_logo
// ) => {
//   const URL = APP_URL || "http://loacalhost:3001";
//   const qrCodeUrl = URL.concat(`/vcard/${employee_id}`);
//   const logo = (await company_logo)
//     ? Buffer.from(company_logo, "binary").toString()
//     : null;

//   let adjust = 469;

//   if (employee_name.length > 21) {
//     adjust = adjust - 8;
//   }
//   if (designation.length > 35) {
//     adjust = adjust - 4;
//   }

//   const doc = new PDFDocument({
//     size: "A4", // Set A4 paper size
//     margin: 0, // No margins
//   });

//   doc.registerFont(
//     "Montserrat-SemiBold",
//     path.join(__dirname, "../fonts/Montserrat/static/Montserrat-SemiBold.ttf")
//   );
//   doc.registerFont(
//     "Montserrat-Medium",
//     path.join(__dirname, "../fonts/Montserrat/static/Montserrat-Medium.ttf")
//   );

//   let writeStream;
//   let fileName;
//   let filePath;
//   if (is_send) {
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename="${employee_name}_${employee_id}.pdf"`
//     );
//   } else {
//     // Define the path to save the PDF
//     const uploadsDir = path.join(__dirname, "../../uploads/approved_vcards");
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     fileName = `${employee_name}_${uniqueSuffix}.pdf`;
//     filePath = path.join(uploadsDir, fileName);
//     // Ensure the uploads directory exists
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir);
//     }
//     // Create a write stream to the file
//     writeStream = fs.createWriteStream(filePath);
//   }

//   // Handle errors during PDF creation
//   doc.on("error", (err) => {
//     console.error("PDF generation error:", err);
//     if (!res.headersSent) {
//       return Response.responseStatus(res, 500, "PDF generation failed", {
//         error: err.message,
//       });
//     }
//   });

//   // Pipe the PDF document to the write stream
//   if (is_send) doc.pipe(res);
//   else doc.pipe(writeStream);
//   // Centered rectangle dimensions
//   const rectWidth = 3.5 * 72.5; // 253.75 points
//   const rectHeight = 2 * 73; // 146 points

//   // A4 page dimensions in points
//   const pageWidth = 595.28;
//   const pageHeight = 841.89;

//   // Calculating top-left corner to center the rectangle
//   const rectX = (pageWidth - rectWidth) / 2; // 170.765 points
//   const rectY = (pageHeight - rectHeight) / 2; // 347.945 points

//   // Draw the rectangle centered on the page
//   doc.rect(rectX, rectY, rectWidth, rectHeight).stroke();

//   // Centered image dimensions
//   const imageWidth = 1.5 * 72; // 108 points
//   const imageHeight = 1 * 72; // 72 points

//   // Calculating top-left corner to center the image inside the rectangle
//   const imageX = rectX + (rectWidth - imageWidth) / 2; // 243.64 points
//   const imageY = rectY + (rectHeight - imageHeight) / 2; // 384.945 points

//   // Draw the image centered inside the rectangle
//   doc.image(logo, imageX, imageY - 3, {
//     fit: [imageWidth, imageHeight], // Constrain image size
//     align: "center", // Center horizontally
//     valign: "center", // Center vertically
//   });
//   // End of Front Side of the card -------------------------------------------

//   doc.addPage();
//   // Start of Back Side of the card -----------------------------------------
//   // Draw the rectangle centered on the page
//   doc.rect(rectX, rectY, rectWidth, rectHeight).stroke();

//   // Define padding
//   const padding = 15;

//   // Measure the height of the text block for the first part (name and designation)
//   doc.fontSize(12).font("Montserrat-SemiBold");
//   const nameHeight = doc.heightOfString(employee_name, {
//     width: rectWidth / 1.5 - padding,
//   });
//   doc.fontSize(8).font("Montserrat-Medium");
//   const designationHeight = doc.heightOfString(designation, {
//     width: rectWidth / 1.5 - padding,
//   });
//   const firstPartHeight =
//     nameHeight + designationHeight + doc.currentLineHeight() / 2; // Including line gap

//   // Measure the height of the text block for the second part (mobile number and email)
//   doc.fontSize(8).font("Montserrat-Medium");
//   const mobileHeight = doc.heightOfString(
//     `+91 ${mobile_number.slice(0, 5)} ${mobile_number.slice(5)}`,
//     { width: rectWidth / 1.5 - padding }
//   );
//   const emailHeight = doc.heightOfString(email, {
//     width: rectWidth / 1.5 - padding,
//   });
//   const secondPartHeight =
//     mobileHeight + emailHeight + doc.currentLineHeight() / 2; // Including line gap

//   // Total height of the text blocks including gap
//   const gap = 10; // Gap between the two parts
//   const totalTextHeight = firstPartHeight + secondPartHeight + gap;

//   // Position the text inside the rectangle with padding and center vertically
//   const textWidth = rectWidth / 1.5 - padding; // Allocate half the rectangle width minus padding
//   const textX = rectX + padding;
//   const textY = rectY + (rectHeight - totalTextHeight) / 2 + 2; // Center vertically

//   // Define the gradient colors
//   const gradientColors = ["#345C9B", "#70BB23", "#F1460C"];
//   // Create a linear gradient fill
//   const gradientFill = doc.linearGradient(
//     textX,
//     textY,
//     textX + employee_name.length * 7,
//     textY
//   );
//   gradientFill.stop(0, gradientColors[0]);
//   gradientFill.stop(0.4, gradientColors[1]);
//   gradientFill.stop(1, gradientColors[2]);

//   // Set the gradient fill for the text
//   doc.fill(gradientFill);

//   // Add your gradient-filled text
//   doc
//     .font("Montserrat-SemiBold")
//     .fontSize(12)
//     .text(employee_name, textX, textY - 4, {
//       width: textWidth,
//       align: "left",
//     })
//     .font("Montserrat-Medium", 8)
//     .fillColor("black")
//     .text(designation, {
//       width: textWidth,
//       align: "left",
//     });

//   // Add the gap between the two parts
//   const secondPartY = textY + firstPartHeight + gap;

//   // Size for icons (assuming line height of 9 points font size)
//   const iconSize = 9; // Adjust this if needed
//   const iconMargin = 5; // Margin between icon and text

//   // Add the second part of the text (mobile number and email) with icons
//   doc.image(mobileIconBase64, textX, secondPartY + 0.4, {
//     width: iconSize,
//     height: iconSize,
//   });
//   doc
//     .font("Montserrat-Medium", 8)
//     .text(
//       `+91 ${mobile_number.slice(0, 5)} ${mobile_number.slice(5)}`,
//       textX + iconSize + iconMargin,
//       secondPartY,
//       {
//         width: textWidth - iconSize - iconMargin,
//         // lineGap: 3,
//         align: "left",
//       }
//     );

//   const emailY = secondPartY + mobileHeight + doc.currentLineHeight() / 2;
//   doc.image(emailIconBase64, textX, emailY + 0.5, {
//     width: iconSize + 1,
//     height: iconSize + 1,
//   });
//   doc
//     .font("Montserrat-Medium", 8)
//     .text(email, textX + iconSize + iconMargin, emailY, {
//       width: textWidth - iconSize - iconMargin,
//       align: "left",
//     });

//   // Draw the QR code on the right side of the rectangle
//   const qrCodePath = await QRCode.toDataURL(qrCodeUrl, {
//     errorCorrectionLevel: "L",
//     margin: 0,
//   }); // Path to your QR code image
//   const qrCodeSize = 63; // Size of the QR code (1 inch)
//   const qrX = rectX + rectWidth - qrCodeSize - padding; // 10 points padding from the right edge of the rectangle
//   const qrY = rectY + (rectHeight - qrCodeSize) / 2; // Center vertically within the rectangle

//   doc.image(qrCodePath, qrX, qrY, {
//     fit: [qrCodeSize, qrCodeSize],
//   });

//   doc.end();
//   //   return Response.responseStatus(res, 200, "Employee Data", rows[0]);
//   return {
//     filename: fileName,
//     path: filePath,
//   };
// };
const generateDefaultPdf = async (
  res,
  is_send,
  employee_id,
  employee_name,
  designation,
  mobile_number,
  email,
  company_logo // this is a file name, not base64
) => {
  const URL = APP_URL || "http://localhost:3001";
  const qrCodeUrl = `${URL}/vcard/${employee_id}`;
   const  newMobile =checkPhoneNumber(mobile_number)

  // ✅ Resolve logo path
  let logo = null;
  if (company_logo) {
    try {
      const logoPath = path.join(
        __dirname,
        "../../uploads/logos",
        company_logo
      );
      if (fs.existsSync(logoPath)) {
        logo = logoPath;
      } else {
        console.warn("⚠️ Logo file not found:", logoPath);
      }
    } catch (err) {
      console.error("Error resolving logo path:", err.message);
    }
  }

  let adjust = 469;
  if (employee_name.length > 21) adjust -= 8;
  if (designation.length > 35) adjust -= 4;

  const doc = new PDFDocument({
    size: "A4",
    margin: 0,
  });

  // Register fonts
  doc.registerFont(
    "Montserrat-SemiBold",
    path.join(__dirname, "../fonts/Montserrat/static/Montserrat-SemiBold.ttf")
  );
  doc.registerFont(
    "Montserrat-Medium",
    path.join(__dirname, "../fonts/Montserrat/static/Montserrat-Medium.ttf")
  );

  let writeStream;
  let fileName;
  let filePath;

  if (is_send) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${employee_name}_${employee_id}.pdf"`
    );
  } else {
    const uploadsDir = path.join(__dirname, "../../uploads/approved_vcards");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    fileName = `${employee_name}_${uniqueSuffix}.pdf`;
    filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    writeStream = fs.createWriteStream(filePath);
  }

  doc.on("error", (err) => {
    console.error("PDF generation error:", err);
    if (!res.headersSent) {
      return res.status(500).send({ error: "PDF generation failed" });
    }
  });

  if (is_send) doc.pipe(res);
  else doc.pipe(writeStream);

  // ---------- FRONT SIDE ----------
  const rectWidth = 3.5 * 72.5;
  const rectHeight = 2 * 73;
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const rectX = (pageWidth - rectWidth) / 2;
  const rectY = (pageHeight - rectHeight) / 2;

  doc.rect(rectX, rectY, rectWidth, rectHeight).stroke();

  const imageWidth = 1.5 * 72;
  const imageHeight = 1 * 72;
  const imageX = rectX + (rectWidth - imageWidth) / 2;
  const imageY = rectY + (rectHeight - imageHeight) / 2;

  if (logo) {
    doc.image(logo, imageX, imageY - 3, {
      fit: [imageWidth, imageHeight],
      align: "center",
      valign: "center",
    });
  }

  // ---------- BACK SIDE ----------
  doc.addPage();
  doc.rect(rectX, rectY, rectWidth, rectHeight).stroke();

  const padding = 15;
  const textWidth = rectWidth / 1.5 - padding;
  const textX = rectX + padding;

  // Name & designation block
  doc.fontSize(12).font("Montserrat-SemiBold");
  const nameHeight = doc.heightOfString(employee_name, { width: textWidth });
  doc.fontSize(8).font("Montserrat-Medium");
  const designationHeight = doc.heightOfString(designation, {
    width: textWidth,
  });
  const firstPartHeight =
    nameHeight + designationHeight + doc.currentLineHeight() / 2;

  const mobileText = `+91 ${newMobile?.slice(0, 5)} ${newMobile?.slice(
    5
  )}`;
  const mobileHeight = doc.heightOfString(mobileText, { width: textWidth });
  const emailHeight = doc.heightOfString(email, { width: textWidth });
  const secondPartHeight =
    mobileHeight + emailHeight + doc.currentLineHeight() / 2;

  const gap = 10;
  const totalTextHeight = firstPartHeight + secondPartHeight + gap;
  const textY = rectY + (rectHeight - totalTextHeight) / 2 + 2;

  // Gradient name text
  const gradientFill = doc.linearGradient(
    textX,
    textY,
    textX + employee_name.length * 7,
    textY
  );
  gradientFill.stop(0, "#345C9B").stop(0.4, "#70BB23").stop(1, "#F1460C");

  doc
    .fill(gradientFill)
    .font("Montserrat-SemiBold")
    .fontSize(12)
    .text(employee_name, textX, textY - 4, {
      width: textWidth,
      align: "left",
    });

  doc
    .font("Montserrat-Medium")
    .fontSize(8)
    .fillColor("black")
    .text(designation, {
      width: textWidth,
      align: "left",
    });

  // Mobile and email
  const secondPartY = textY + firstPartHeight + gap;
  const iconSize = 9;
  const iconMargin = 5;

  doc.image(mobileIconBase64, textX, secondPartY + 0.4, {
    width: iconSize,
    height: iconSize,
  });

  doc.text(mobileText, textX + iconSize + iconMargin, secondPartY, {
    width: textWidth - iconSize - iconMargin,
    align: "left",
  });

  const emailY = secondPartY + mobileHeight + doc.currentLineHeight() / 2;

  doc.image(emailIconBase64, textX, emailY + 0.5, {
    width: iconSize + 1,
    height: iconSize + 1,
  });

  doc.text(email, textX + iconSize + iconMargin, emailY, {
    width: textWidth - iconSize - iconMargin,
    align: "left",
  });

  // QR Code
  const qrCodePath = await QRCode.toDataURL(qrCodeUrl, {
    errorCorrectionLevel: "L",
    margin: 0,
  });

  const qrCodeSize = 63;
  const qrX = rectX + rectWidth - qrCodeSize - padding;
  const qrY = rectY + (rectHeight - qrCodeSize) / 2;

  doc.image(qrCodePath, qrX, qrY, {
    fit: [qrCodeSize, qrCodeSize],
  });

  doc.end();

  return is_send ? null : { filename: fileName, path: filePath };
};
const PrintRequestController = {
  createPrintRequest: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Response.responseStatus(res, 400, "Validation Failed", errors);
      }

      const { status = "pending", printEmployees = [] } = req.body;

      const printRequestData = {
        status,
        support_document: req.uploadedFile?.filename,
        created_by: req.userData.id,
        modified_by: req.userData.id,
      };

      // Insert print request
      const result = await PrintRequest.create(printRequestData);

      if (result && result.id) {
        const requestResult = await PrintRequest.findOne({
          where: { id: result.id },
        });
        printEmployees.map(async (id, index) => {
          const printEmployeeData = {
            employee_id: printEmployees[index],
            request_id: requestResult.id,
            status,
          };
          await PrintEmployee.create(printEmployeeData);
        });

        //    const printEmployeeData = {
        //       employee_id: "090042ba-e3f2-4150-b4d9-a31f4d1ed09d",
        //       request_id: requestResult.id,
        //       status,
        //     };

        // // Create printEmployees records

        //     await PrintEmployee.create(printEmployeeData);

        // Fetch user details
        const resultCU = await User.findOne({
          where: { id: req.userData.id },
        });

        const resultCHRO = await User.findAll({
          where: { user_type: Role.Admin },
        });

        // Mail sending (optional)
        let err = 0;

        /*
      await Promise.all(
        resultCHRO.map(async (admin) => {
          const link = FRONT_END_URL;
          const mailSubject = "New Printing Card Request - Action Required";
          const mailContent = `...`; // Email content here

          await sendMail(
            admin.email,
            mailSubject,
            mailContent,
            null,
            async (error, info) => {
              if (error) err++;
            }
          );
        })
      );
      */

        if (err > 0) {
          return Response.responseStatus(
            res,
            201,
            `Print request created. Facing error in mail sending with ${err} CHRO(s).`
          );
        }

        return Response.responseStatus(
          res,
          201,
          `Print request sent successfully`
        );
      }

      return Response.responseStatus(res, 400, `Failed to send print request`);
    } catch (error) {
      console.log(error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  listPrintRequests: async (req, res) => {
    try {
      const {
        field = "id",
        search = "",
        page = 1,
        limit = Number(LIMIT_DATA),
        sort = "id",
        order = "ASC",
      } = req.query;

      const currentPage = Math.max(1, parseInt(page));
      const limitNum = parseInt(limit) || Number(LIMIT_DATA);
      const offset = (currentPage - 1) * limitNum;

      // Allowed fields - map or sanitize fields with dots (e.g. pr.status → status)
      const allowedFields = [
        "id",
        "request_id",
        "status",
        "created_at",
        "modified_at",
      ];

      // Extract the actual column from 'field' and 'sort' (strip prefixes like pr.)
      const cleanField = field.includes(".") ? field.split(".").pop() : field;
      const cleanSort = sort.includes(".") ? sort.split(".").pop() : sort;

      // Validate sort and field
      const validSort = allowedFields.includes(cleanSort) ? cleanSort : "id";
      const validOrder = ["ASC", "DESC"].includes(order.toUpperCase())
        ? order.toUpperCase()
        : "ASC";

      // Build where condition
      const whereCond =
        search && allowedFields.includes(cleanField)
          ? {
              [cleanField]: {
                [Op.like]: `%${search}%`,
              },
              deleted_at: null,
            }
          : { deleted_at: null };

      // Counts for various statuses and total
      const [all, pending, approved, rejected, total] = await Promise.all([
        PrintRequest.count({ where: { deleted_at: null } }),
        PrintRequest.count({ where: { status: "pending", deleted_at: null } }),
        PrintRequest.count({ where: { status: "approved", deleted_at: null } }),
        PrintRequest.count({ where: { status: "rejected", deleted_at: null } }),
        PrintRequest.count({ where: whereCond }),
      ]);

      const totalPage = Math.ceil(total / limitNum);

      const pageInfo = {
        nextLink:
          currentPage < totalPage
            ? `${APP_URL}/api/print_request?${qs.stringify({
                ...req.query,
                page: currentPage + 1,
              })}`
            : null,
        prevLink:
          currentPage > 1
            ? `${APP_URL}/api/print_request?${qs.stringify({
                ...req.query,
                page: currentPage - 1,
              })}`
            : null,
        all,
        pending,
        approved,
        rejected,
        totalData: total,
        totalPage,
        currentPage,
      };

      const requests = await PrintRequest.findAll({
        where: whereCond,
        limit: limitNum,
        offset,
        order: [[validSort, validOrder]],
        include: [
          {
            model: User,
            as: "creator",
            attributes: ["email"],
          },
          {
            model: User,
            as: "modifier",
            attributes: ["email"],
          },
          {
            model: PrintEmployee,
            as: "employees",
            include: [
              {
                model: Employee,
                as: "employee",
                include: [
                  {
                    model: Company,
                    as: "company",
                    attributes: ["id", "company_name"],
                  },
                  {
                    model: Branch,
                    as: "Branch",
                    attributes: ["id", "branch_name"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!requests.length) {
        return Response.responseStatus(
          res,
          400,
          "No data found",
          null,
          pageInfo
        );
      }

      const formatted = requests.map((reqItem) => ({
        id: reqItem.id,
        request_id: reqItem.request_id,
        status: reqItem.status,
        support_document: reqItem.support_document,
        print_employees: (reqItem.employees || []).map((emp) => {
          //  console.log("emp",emp)

          const empInfo = emp.employee || {};

          return {
            id: emp.id,
            employee_id: empInfo.employee_id,
            employee_name: empInfo.employee_name,
            designation: empInfo.designation,
            mobile_number: empInfo.mobile_number,
            email: empInfo.email,
            status: emp.status,
            landline: empInfo.landline,
            photo: empInfo.photo
              ? `${APP_URL}/uploads/photos/${empInfo.photo}`
              : null,
            is_active: empInfo.is_active,
            // status: empInfo.status,
            company: empInfo.company || null,
            branch: empInfo.Branch || null,
          };
        }),
        created: {
          created_by: reqItem.created_by,
          email: reqItem.creator?.email || null,
          created_at: reqItem.created_at,
        },
        modified: {
          modified_by: reqItem.modified_by,
          email: reqItem.modifier?.email || null,
          modified_at: reqItem.modified_at,
        },
      }));

      return Response.responseStatus(
        res,
        200,
        "List of all Print Requests",
        formatted,
        pageInfo
      );
    } catch (error) {
      console.error("Error in listPrintRequests:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  updateStatusPrintRequests: async (req, res) => {
    try {
      const user_id = req.userData.id;
      const { request_id } = req.params;
      const { status = "pending" } = req.query;
      const link = FRONT_END_URL;
      const attachments = [];

      // 1. Update PrintRequest
      const [updatedCount] = await PrintRequest.update(
        { status, modified_by: user_id },
        { where: { id: request_id } }
      );

      if (!updatedCount) {
        return Response.responseStatus(
          res,
          404,
          `Failed to update status for Print Request - ${request_id}`
        );
      }

      // 2. Update PrintEmployee
      await PrintEmployee.update(
        { status },
        { where: { request_id } } // ✅ Corrected key
      );

      // 3. Fetch relevant users
      const requestEntry = await PrintRequest.findOne({
        where: { id: request_id },
      });
      const currentUser = await User.findByPk(user_id);
      const createdUser = await User.findByPk(requestEntry.created_by);

      // 4. If approved, generate PDFs
      if (status === "approved") {
        const printEmployees = await PrintEmployee.findAll({
          where: { request_id },
          include: [
            {
              model: Employee,
              as: "employee",
              include: [
                { model: Company, as: "company" },
                { model: Branch, as: "Branch" },
              ],
            },
          ],
        });

        const pdfPromises = printEmployees.map(async (pe) => {
          const emp = pe.employee; // ✅ use alias "employee"
          if (!emp) return null;

          return emp.company.default_template
            ? await generateDefaultPdf(
                res,
                false,
                emp.employee_id,
                emp.employee_name,
                emp.designation,
                emp.mobile_number,
                emp.email,
                emp.company.company_logo
              )
            : await generateMobilityPdf(
                res,
                false,
                emp.employee_id,
                emp.employee_name
              );
        });

        attachments.push(...(await Promise.all(pdfPromises)));
      }

      // 5. Email to admin
      const adminMailSubject = "Visiting Card Print Request";
      const adminMailContent = `
      <p>Admin, the print request has been <strong>${status.toUpperCase()}</strong> by ${
        currentUser.first_name
      } ${currentUser.last_name}.</p>
      <div style="text-align: center;"><a href="${link}"><img src="${link}/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;"></a></div>`;

      await sendMail(
        PRINT_ADMIN_MAIL,
        adminMailSubject,
        adminMailContent,
        attachments
      );

      // 6. Email to created user
      const mailSubject = "Request Status Update - Refex Contacts";
      const mailContent = `
      <p>Hi ${createdUser.first_name} ${createdUser.last_name},</p>
      <ul>
        <li>Request ID: ${request_id}</li>
        <li>Status Updated To: ${
          status.charAt(0).toUpperCase() + status.slice(1)
        }</li>
        <li>Updated By: ${currentUser.first_name} ${currentUser.last_name}</li>
      </ul>
      <div style="text-align: center;"><a href="${link}"><img src="${link}/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;"></a></div>`;

      await sendMail(createdUser.email, mailSubject, mailContent, attachments);

      return Response.responseStatus(
        res,
        200,
        `Status updated to ${status} for Print Request (${request_id})`
      );
    } catch (error) {
      console.error(error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  updateStatusPrintEmployees: async (req, res) => {
    try {
      const user_id = req.userData.id;
      const { request_id, pe_ids = [], status } = req.body;
      const link = FRONT_END_URL;
      let attachments = [];
      const emp_rows = [];

      // 1. Update selected PrintEmployee statuses
      await PrintEmployee.update({ status }, { where: { id: pe_ids } });

      // 2. Get updated employee_ids for those PE records
      const updatedPEs = await PrintEmployee.findAll({
        where: { id: pe_ids },
        attributes: ["employee_id"],
      });
      updatedPEs.forEach((pe) => emp_rows.push(pe.employee_id));

      // 3. Recount status for all PEs under the request
      const allPEs = await PrintEmployee.findAll({
        where: { request_id },
        attributes: ["status"],
      });

      let approvedCount = 0,
        pendingCount = 0,
        rejectedCount = 0;

      allPEs.forEach(({ status }) => {
        if (status === "approved") approvedCount++;
        else if (status === "pending") pendingCount++;
        else if (status === "rejected") rejectedCount++;
      });

      // 4. Determine max status for PrintRequest
      let maxStatus =
        approvedCount > rejectedCount
          ? approvedCount > pendingCount
            ? "approved"
            : "pending"
          : rejectedCount > pendingCount
          ? "rejected"
          : "pending";

      maxStatus =
        approvedCount === rejectedCount && pendingCount > 1
          ? "pending"
          : maxStatus;

      maxStatus =
        approvedCount === rejectedCount && pendingCount === 0
          ? "approved"
          : maxStatus;

      // 5. Update PrintRequest status
      await PrintRequest.update(
        { status: maxStatus },
        { where: { id: request_id } }
      );

      // 6. Fetch users (modifier and creator)
      const printRequest = await PrintRequest.findOne({
        where: { id: request_id },
      });
      const modifiedUser = await User.findByPk(user_id);
      const createdUser = await User.findByPk(printRequest.created_by);

      // 7. Generate PDFs for approved employees
      if (status === "approved") {
        const employeeDetails = await Employee.findAll({
          where: { id: emp_rows },
          include: [
            {
              model: Company,
              as: "company",
            },
            {
              model: Branch,
              as: "Branch",
            },
          ],
        });

        for (const emp of employeeDetails) {
          const {
            id,
            employee_id,
            employee_name,
            designation,
            mobile_number,
            email,
            default_template,
            company_logo,
          } = emp;

          if (default_template) {
            attachments.push(
              await generateDefaultPdf(
                res,
                false,
                employee_id,
                employee_name,
                designation,
                mobile_number,
                email,
                company_logo
              )
            );
          } else {
            attachments.push(
              await generateMobilityPdf(res, false, employee_id, employee_name)
            );
          }
        }

        // 8. Send admin email with attachments
        const adminMailSubject = "Visiting Card Print Request";
        const adminMailContent = `
        <p>Dear Admin,</p>
        <p>The visiting card print request has been approved by <strong>${modifiedUser.first_name} ${modifiedUser.last_name}</strong>.</p>
        <p>Please find the attached PDFs for printing the cards.</p>
        <a href="${link}"><img src="${link}/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;"></a>
        <p>Regards,<br/>Refex Contacts Team</p>`;

        await sendMail(
          PRINT_ADMIN_MAIL,
          adminMailSubject,
          adminMailContent,
          attachments
        );

        // 9. Send user email with attachments
        const userMailSubject = "Request Status Update - Refex Contacts";
        const userMailContent = `
        <p>Hi ${createdUser.first_name} ${createdUser.last_name},</p>
        <p>Your request <strong>${request_id}</strong> has been updated to <strong>${status}</strong>.</p>
        <p>Updated Employees: ${emp_rows.join(", ")}</p>
        <p>Updated By: ${modifiedUser.first_name} ${modifiedUser.last_name}</p>
        <p>You can log in to view more details. <a href="${link}">Click here</a></p>
        <a href="${link}"><img src="${link}/assets/Refex-Logo.png" style="max-width: 100px;"></a>
        <p>Regards,<br/>Refex Contacts Team</p>`;

        await sendMail(
          createdUser.email,
          userMailSubject,
          userMailContent,
          attachments
        );
      } else {
        // If not approved, send email without attachments
        const mailSubject = "Request Status Update - Refex Contacts";
        const mailContent = `
        <p>Hi ${createdUser.first_name} ${createdUser.last_name},</p>
        <p>Status for request <strong>${request_id}</strong> updated to <strong>${status}</strong> by ${modifiedUser.first_name} ${modifiedUser.last_name}.</p>
        <a href="${link}"><img src="${link}/assets/Refex-Logo.png" style="max-width: 100px;"></a>
        <p>Regards,<br/>Refex Contacts Team</p>`;

        await sendMail(createdUser.email, mailSubject, mailContent);
      }

      return Response.responseStatus(
        res,
        200,
        `Status updated to ${status} for selected employees.`
      );
    } catch (error) {
      console.error(error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
  // updateStatusPrintEmployees: async (req, res) => {
  //   try {
  //     const { user_id } = req.userData;
  //     const { request_id, pe_ids = [], status } = req.body;
  //     const link = `${FRONT_END_URL}`;
  //     let attachments = [];
  //     const emp_rows = [];
  //     let approvedCount = 0;
  //     let pendingCount = 0;
  //     let rejectedCount = 0;

  //     for (let i = 0; i < pe_ids.length; i++) {
  //       const pe_id = pe_ids[i];
  //       await PrintEmployeeModel.updatePrintEmployeeById(pe_id, { status });
  //       const resultPE = await PrintEmployeeModel.getPrintEmployeeByCondition({
  //         "pe.id": pe_id,
  //       });
  //       emp_rows.push(resultPE[0].employee_id);
  //     }
  //     const resultEMPRows =
  //       await PrintEmployeeModel.getPrintEmployeeByCondition({ request_id });
  //     for (let i = 0; i < resultEMPRows.length; i++) {
  //       const { status } = resultEMPRows[i];
  //       if (status === "approved") {
  //         approvedCount++;
  //       } else if (status === "pending") {
  //         pendingCount++;
  //       } else if (status === "rejected") {
  //         rejectedCount++;
  //       }
  //     }
  //     let maxStatus =
  //       approvedCount > rejectedCount
  //         ? approvedCount > pendingCount
  //           ? "approved"
  //           : "pending"
  //         : rejectedCount > pendingCount
  //         ? "rejected"
  //         : "pending";
  //     maxStatus =
  //       approvedCount === rejectedCount && pendingCount > 1
  //         ? "pending"
  //         : maxStatus;
  //     maxStatus =
  //       approvedCount === rejectedCount && pendingCount === 0
  //         ? "approved"
  //         : maxStatus;

  //     await PrintRequestModel.updateRequestByCondition(
  //       { request_id },
  //       { status: maxStatus }
  //     );

  //     const resultPR = await PrintRequestModel.getRequestsByCondition({
  //       request_id,
  //     });
  //     const resultMU = await UserModel.getUsersByCondition({
  //       user_id,
  //     });
  //     const resultCU = await UserModel.getUsersByCondition({
  //       user_id: resultPR[0].created_by,
  //     });
  //     // console.log(status);
  //     // console.log(emp_rows);
  //     if (status === "approved") {
  //       for (let i = 0; i < emp_rows.length; i++) {
  //         const employee_id = emp_rows[i];

  //         const ep_rows = await EmployeeModel.getEmployeeByCondition({
  //           "ep.employee_id": employee_id,
  //           // "ep.is_active": 1,
  //         });

  //         if (ep_rows.length > 0) {
  //           const {
  //             ep_id,
  //             employee_id,
  //             employee_name,
  //             designation,
  //             mobile_number,
  //             landline,
  //             email,
  //             photo,
  //             is_active,
  //             company_id,
  //             branch_id,
  //             company_name,
  //             company_website,
  //             company_logo,
  //             default_template,
  //             branch_name,
  //             branch_address,
  //             google_map_link,
  //           } = ep_rows[0];

  //           if (default_template) {
  //             attachments.push(
  //               await generateDefaultPdf(
  //                 res,
  //                 false,
  //                 employee_id,
  //                 employee_name,
  //                 designation,
  //                 mobile_number,
  //                 email,
  //                 company_logo
  //               )
  //             );
  //           } else {
  //             attachments.push(
  //               await generateMobilityPdf(
  //                 res,
  //                 false,
  //                 employee_id,
  //                 employee_name
  //               )
  //             );
  //           }
  //         }
  //       }

  //       const adminMailSubject = "Visiting Card Print Request"; //- ${resultMU[0].user_type}
  //       const adminMailContent = `
  //       <p>Dear Admin,</p>

  //       <p>We hope this message finds you well. We are pleased to inform you that the visiting card print request has been approved by <strong>${resultMU[0].first_name} ${resultMU[0].last_name}</strong>.</p>

  //       <p>Please find the attached PDF with the details required for printing the visiting cards.</p>

  //       <p>If you have any questions or concerns, please feel free to reach out to our support team at helpdesk@refex.co.in</p>

  //       <div style="text-align: center;">
  //           <a href="${link}">
  //               <img src="${link}/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;">
  //           </a>
  //       </div>

  //       <p>Thank you for your attention to this request.</p>

  //       <p>Best regards,</p>
  //       <p>Refex Contacts Team</p>`;

  //       // <p>You can view the updated status by logging in to the Refex Contacts app. Click <a href="${link}">here</a> to access your account.</p>

  //       // Navigate to the 'Requests' section to find the specific request and review the latest status and comments provided by the ${resultMU[0].user_type}.

  //       await sendMail(
  //         PRINT_ADMIN_MAIL,
  //         // "kumarmurugesh14032001@gmail.com",
  //         adminMailSubject,
  //         adminMailContent,
  //         attachments,
  //         async (error, info) => {
  //           if (error) {
  //             console.log(error);
  //             // return Response.responseStatus(
  //             //   res,
  //             //   200,
  //             //   `Status updated to ${status} for Print Request (${request_id}). Facing error in sending mail to ${resultCU[0].email}`
  //             // );
  //           }
  //         }
  //       );

  //       const mailSubject = "Request Status Update - Refex Contacts"; //(${resultMU[0].user_type})
  //       const mailContent = `<p>Hi ${resultCU[0].first_name} ${
  //         resultCU[0].last_name
  //       },</p>
  //   <p>We are writing to inform you about an important update regarding a request in Refex Contacts.</p>
  //   <p><strong>Request Details:</strong></p>
  //   <ul>
  //       <li><strong>Request ID:</strong> ${request_id}</li>
  //       <li><strong>Status Updated To:</strong> ${
  //         status.charAt(0).toUpperCase() + status.slice(1)
  //       }</li>
  //       <li><strong>Selected Employee IDs:</strong> ${emp_rows}</li>
  //       <li><strong>Updated By:</strong> ${resultMU[0].first_name} ${
  //         resultMU[0].last_name
  //       }</li>
  //   </ul>
  //   <p>You can view the updated status by logging in to the Refex Contacts app. Click <a href="${link}">here</a> to access your account.</p>

  //   <p>Please find the attached PDF for printing the visiting cards.</p>

  //   <p>Navigate to the 'Requests' section to find the specific request and review the latest status and comments provided by the CHRO. If you have any questions or concerns, please feel free to reach out to our support team at helpdesk@refex.co.in</p>

  //   <div style="text-align: center;">
  //       <a href="${link}">
  //           <img src="${link}/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;">
  //       </a>
  //   </div>

  //   <p>Thank you for your attention to this update.</p>
  //   <p>Best regards,</p>
  //   <p>Refex Contacts Team</p>`;

  //       await sendMail(
  //         resultCU[0].email,
  //         mailSubject,
  //         mailContent,
  //         attachments,
  //         async (error, info) => {
  //           if (error) {
  //             return Response.responseStatus(
  //               res,
  //               200,
  //               `Status updated to ${status} for Print Request (${request_id}). Facing error in sending mail to ${resultCU[0].email}`
  //             );
  //           }
  //         }
  //       );
  //     } else {
  //       const mailSubject = "Request Status Update - Refex Contacts"; //(${resultMU[0].user_type})
  //       const mailContent = `<p>Hi ${resultCU[0].first_name} ${
  //         resultCU[0].last_name
  //       },</p>
  // <p>We are writing to inform you about an important update regarding a request in Refex Contacts.</p>
  // <p><strong>Request Details:</strong></p>
  // <ul>
  //     <li><strong>Request ID:</strong> ${request_id}</li>
  //     <li><strong>Status Updated To:</strong> ${
  //       status.charAt(0).toUpperCase() + status.slice(1)
  //     }</li>
  //     <li><strong>Updated By:</strong> ${resultMU[0].first_name} ${
  //         resultMU[0].last_name
  //       }</li>
  // </ul>
  // <p>You can view the updated status by logging in to the Refex Contacts app. Click <a href="${link}">here</a> to access your account.</p>
  // <p>Navigate to the 'Requests' section to find the specific request and review the latest status and comments provided by the CHRO. If you have any questions or concerns, please feel free to reach out to our support team at helpdesk@refex.co.in</p>
  // <div style="text-align: center;">
  //     <a href="${link}">
  //         <img src="${link}/assets/Refex-Logo.png" alt="Refex Contacts" style="max-width: 100px;">
  //     </a>
  // </div>
  // <p>Thank you for your attention to this update.</p>
  // <p>Best regards,</p>
  // <p>Refex Contacts Team</p>`;

  //       await sendMail(
  //         resultCU[0].email,
  //         mailSubject,
  //         mailContent,
  //         null,
  //         async (error, info) => {
  //           if (error) {
  //             return Response.responseStatus(
  //               res,
  //               200,
  //               `Status updated to ${status} for Print Request (${request_id}). Facing error in sending mail to ${resultCU[0].email}`
  //             );
  //           }
  //         }
  //       );
  //     }

  //     return Response.responseStatus(
  //       res,
  //       200,
  //       `Status updated to ${status} for selected employees.`
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  generateVCardPDF: async (req, res) => {
    try {
      const { employee_id } = req.params;

      // Fetch employee with related data using Sequelize
      const employee = await Employee.findOne({
        where: { employee_id },
        include: [
          { model: Company, as: "company" },
          { model: Branch, as: "Branch" },
        ],
      });

      if (!employee) {
        if (!res.headersSent) {
          return Response.responseStatus(res, 400, "No employee data found");
        }
        return;
      }

      const {
        employee_name,
        designation,
        mobile_number,
        landline,
        email,
        company: { company_logo, default_template } = {}, // optional chaining
      } = employee;

      // Generate and return PDF directly
      if (default_template) {
        await generateDefaultPdf(
          res,
          true,
          employee_id,
          employee_name,
          designation,
          mobile_number,
          email,
          company_logo
        );
      } else {
        await generateMobilityPdf(res, true, employee_id, employee_name);
      }
    } catch (error) {
      console.error("Error in generateVCardPDF:", error);

      if (!res.headersSent) {
        return Response.responseStatus(res, 500, "Internal server error", {
          error: error.message,
        });
      }
    }
  },

  deletePrintRequest: async (req, res) => {
    try {
      const { request_ids = [] } = req.body;

      if (!Array.isArray(request_ids) || request_ids.length === 0) {
        return Response.responseStatus(res, 400, "No request IDs provided");
      }

      // Delete related PrintEmployee records first (to handle foreign key constraints)
      await PrintEmployee.destroy({
        where: {
          request_id: request_ids,
        },
      });

      // Delete from PrintRequest table
      const deletedCount = await PrintRequest.destroy({
        where: {
          id: request_ids,
        },
      });

      if (deletedCount === 0) {
        return Response.responseStatus(
          res,
          400,
          "No print requests were deleted"
        );
      }

      return Response.responseStatus(
        res,
        200,
        "Print requests deleted successfully"
      );
    } catch (error) {
      console.error("Error in deletePrintRequest:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};

module.exports = PrintRequestController;
