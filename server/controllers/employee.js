const { Employee, Company, Branch } = require("../models");
const { Op } = require("sequelize");
const qs = require("querystring");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const vCardsJS = require("vcards-js");
const xlsx = require("xlsx");
const sendMail = require("../helpers/sendMail");
const Response = require("../helpers/response");
const { validationResult } = require("express-validator");
const { APP_URL, LIMIT_DATA } = process.env;

// Create the directory if it doesn't exist
const qrDir = path.join(__dirname, "..", "..", "uploads", "qr_codes");
if (!fs.existsSync(qrDir)) {
  fs.mkdirSync(qrDir, { recursive: true });
}

// Function to generate and save QR code image
async function generateQRCodeImage(employeeId) {
  const URL = APP_URL || "http://localhost:3001";
  const qrCodeUrl = URL.concat(`/vcard/${employeeId}`);
  // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  // const fileName = `${employeeId}-${uniqueSuffix}.png`;
  // const filePath = path.join(qrDir, fileName);
  const fileName = `${employeeId}.png`;
  const filePath = path.join(qrDir, fileName);

  try {
    await QRCode.toFile(filePath, qrCodeUrl, {
      errorCorrectionLevel: "L",
      margin: 1,
      width: 200, // Customize the size as needed
    });
    // console.log("QR code image saved:", filePath);
    return fileName;
  } catch (err) {
    console.error("Failed to generate QR code:", err);
    throw err;
  }
}

const EmployeeController = {
  createEmployee: async (req, res) => {
    try {
      // console.log(req.body, "--------------");

      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return Response.responseStatus(res, 400, "Validation Failed", errors);
      // }
      const {
        employeeId,
        employeeName,
        designation,
        mobileNumber,
        landline,
        email,
        companyId,
        branchId,
      } = req.body;
      // console.log("employeeId", employeeId);
      const createdBy = req.userData.id;
      const exists = await Employee.findOne({
        where: {
          employee_id: employeeId,
        },
      });

      if (exists)
        return Response.responseStatus(
          res,
          403,
          `An employee with the ID-${employeeId} already exists.`
        );

      const employee_data = {
        employee_id: employeeId,
        employee_name: employeeName,
        designation,
        mobile_number: mobileNumber,
        landline,
        email,
        photo: req.file ? req.file.filename : null,
        qr_code: await generateQRCodeImage(employeeId),
        company_id: companyId,
        branch_id: branchId,
        created_by: createdBy,
      };

      const result = await Employee.create(employee_data);
      if (!result)
        return Response.responseStatus(res, 400, `Failed to create employee`);

      return Response.responseStatus(res, 201, `Employee created successfully`);
    } catch (error) {
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  importEmployees: async (req, res) => {
    try {
      if (!req.file) {
        return Response.responseStatus(res, 400, "File is required");
      }
      const created_by = req.userData.user_id;
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
      const worksheet = workbook.Sheets[sheetName];

      const employeesData = xlsx.utils.sheet_to_json(worksheet);
      // console.log(employeesData);
      const successData = [];
      const failureData = [];
      for (let i = 0; i < employeesData.length; i++) {
        try {
          const employee_id = employeesData[i]["Employee Id"];
          const employee_name = employeesData[i]["Employee Name"];
          const designation = employeesData[i]["Designation"];
          const mobile_number = employeesData[i]["Mobile Number"];
          const landline = employeesData[i]["Landline"] || null;
          const email = employeesData[i]["Email"];
          const photo = null;
          const qr_code = await generateQRCodeImage(employee_id);
          const is_active = employeesData[i]["Active"].toLowerCase() === "yes";
          const company_name = employeesData[i]["Company Name"];
          const branch_name = employeesData[i]["Branch Name"];

          const empIdResult = await Employee.findOne({
            where: {
              employee_id,
            },
          });
          const companyResult = await Company.findOne({
            where: {
              company_name,
            },
          });
          const branchResult = await Branch.findOne({
            where: {
              branch_name,
            },
          });

          // console.log(empIdResult);
          // console.log(companyResult);
          // console.log(branchResult);
          if (empIdResult && !companyResult && !branchResult) {
            failureData.push(employeesData[i]);
          } else {
            const result = await Employee.create({
              employee_id,
              employee_name,
              designation,
              mobile_number,
              landline,
              email,
              photo,
              qr_code,
              is_active,
              company_id: companyResult.id,
              branch_id: branchResult.id,
              created_by,
            });
            if (result) {
              successData.push(employeesData[i]);
            } else {
              failureData.push(employeesData[i]);
            }
          }
        } catch (error) {
          console.log(error);
          failureData.push(employeesData[i]);
        }
      }
      if (successData.length > 0) {
        return Response.responseStatus(res, 200, "Data imported successfully", {
          successData,
          failureData,
        });
      } else {
        return Response.responseStatus(res, 400, "Data import unsuccessful", {
          successData,
          failureData,
        });
      }
    } catch (error) {
      console.log("Error :", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  exportEmployee: async (req, res) => {
    try {
      const employeeData = await Employee.findAll({
        include: ["company", "Branch"],
      });

      let employees = [];

      for (let i = 0; i < employeeData.length; i++) {
        const {
          employee_id,
          employee_name,
          designation,
          mobile_number,
          landline,
          email,
          is_active,
          company,
          Branch,
        } = employeeData[i];

        employees = [
          ...employees,
          {
            "Employee Id": employee_id,
            "Employee Name": employee_name,
            Designation: designation,
            "Mobile Number": mobile_number,
            Landline: landline,
            Email: email,
            Active: is_active ? "Yes" : "No",
            "Company Name": company.company_name,
            "Branch Name": Branch.branch_name,
          },
        ];
      }

      const filename = "EmployeeData.xlsx";
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(employees);
      xlsx.utils.book_append_sheet(wb, ws, "Employees");
      const wbBuffer = xlsx.write(wb, { bookType: "xlsx", type: "buffer" });

      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.send(wbBuffer);
    } catch (error) {
      console.error("Error exporting employee data:", error);
      return Response.responseStatus(res, 500, "Internal server error");
    }
  },

  // listEmployees: async (req, res) => {
  //   try {
  //     const cond = { ...req.query };
  //     // console.log(cond);
  //     cond.field = cond.field || "ep.id";
  //     cond.search = cond.search || "";
  //     cond.page = Number(cond.page) || 1;
  //     cond.limit = Number(cond.limit) || Number(LIMIT_DATA);
  //     cond.dataLimit = cond.limit;
  //     cond.offset = (cond.page - 1) * cond.limit;
  //     cond.sort = cond.sort || "ep.id";
  //     cond.order = cond.order || "ASC";

  //     const pageInfo = {
  //       nextLink: null,
  //       prevLink: null,
  //       totalData: 0,
  //       totalPage: 0,
  //       currentPage: 0,
  //     };

  //     const countData = await Employee.getEmployeesCountByCondition(cond);

  //     pageInfo.totalData = countData[0].totalData;
  //     pageInfo.totalPage = Math.ceil(pageInfo.totalData / cond.limit);
  //     pageInfo.currentPage = cond.page;
  //     const nextQuery = qs.stringify({
  //       ...req.query,
  //       page: cond.page + 1,
  //     });
  //     const prevQuery = qs.stringify({
  //       ...req.query,
  //       page: cond.page - 1,
  //     });
  //     pageInfo.nextLink =
  //       cond.page < pageInfo.totalPage
  //         ? APP_URL.concat(`/api/employees?${nextQuery}`)
  //         : null;
  //     pageInfo.prevLink =
  //       cond.page > 1 ? APP_URL.concat(`/api/employees?${prevQuery}`) : null;

  //     const rows = await Employee.getEmployeesByCondition(cond);

  //     if (rows.length > 0) {
  //       let employeeData = [];
  //       rows.map((row) => {
  //         const {
  //           ep_id,
  //           employee_id,
  //           employee_name,
  //           designation,
  //           mobile_number,
  //           landline,
  //           email,
  //           photo,
  //           is_active,
  //           company_id,
  //           branch_id,
  //           company_name,
  //           company_website,
  //           company_logo,
  //           branch_name,
  //           branch_address,
  //           google_map_link,
  //         } = row;

  //         if (is_active)
  //           employeeData = [
  //             ...employeeData,
  //             {
  //               id: ep_id,
  //               employee_id,
  //               employee_name,
  //               designation,
  //               mobile_number,
  //               landline,
  //               email,
  //               photo: photo ? Buffer.from(photo, "binary").toString() : null,
  //               is_active,
  //               company: {
  //                 company_id: company_id,
  //                 company_name,
  //                 company_website,
  //                 company_logo: company_logo
  //                   ? Buffer.from(company_logo, "binary").toString()
  //                   : null,
  //               },
  //               branch: {
  //                 branch_id: branch_id,
  //                 branch_name,
  //                 branch_address,
  //                 google_map_link,
  //               },
  //             },
  //           ];
  //       });
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         "List of all active employees ",
  //         employeeData,
  //         pageInfo
  //       );
  //     }
  //     return Response.responseStatus(res, 400, "No data found");
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },

  listEmployees: async (req, res) => {
    try {
      //  console.log("req.query", req.query)
      const {
        page = 1,
        size = Number(LIMIT_DATA) || 10,
        sort = "id",
        order = "asc",
        field = "",
        search = "",
      } = req.query;

      const limit = parseInt(size);
      const offset = (page - 1) * limit;

      // ✅ Validate sort field to prevent invalid queries

      // ✅ Validate sort field to prevent invalid queries
      // const allowedFields = [
      //   "ep.id",
      //   "ep.employee_id",
      //   "ep.employee_name",
      //   "ep.designation",
      //   "ep.mobile_number",
      //   "ep.email",
      //   "ep.is_active",
      //   "cp.company_name",
      //   "cpb.branch_name"
      // ];

      // if (!allowedFields.includes(sort)) {
      //   return Response.responseStatus(res, 400, `Invalid sort field: ${sort}`);
      // }

      // Base where clause - only show active employees
      let whereClause = { is_active: true };

      // Include associated models
      let includeClause = [
        {
          model: Company,
          as: "company",
          attributes: ["id", "company_name", "company_website", "company_logo"],
          required: false,
        },
        {
          model: Branch,
          as: "Branch",
          attributes: [
            "id",
            "branch_name",
            "branch_address",
            "google_map_link",
          ],
          required: false,
        },
      ];

      // Handle search functionality
      // if (field && search) {
      //   if (field.includes(".")) {
      //     const [association, search_field] = field.split(".");
      //     if (association == "cp") {
      //       whereClause[search_field] = { [Op.like]: `%${search}%` };
      //     } else {
      //       includeClause = includeClause.map((include) => {
      //         if (include.attributes.includes(search_field)) {
      //            console.log("im workng...............")
      //           include.where = {
      //             [search_field]: { [Op.like]: `%${search}%` },
      //           };
      //           include.required = true;
      //         }
      //         return include;
      //       });
      //     }
      //   }
      // }

      // ✅ Handle sorting properly
      // let orderClause;
      // if (sort.includes(".")) {
      //   const [association, field] = sort.split(".");
      //   const model = association === "company" ? Company : Branch;
      //   orderClause = [[{ model, as: association }, field, order.toUpperCase()]];
      // } else {
      //   orderClause = [[sort, order.toUpperCase()]];
      // }
      // Handle search functionality
      if (field && search) {
        if (field.includes(".")) {
          const [association, search_field] = field.split(".");
          if (association == "ep") {
            whereClause[search_field] = { [Op.like]: `%${search}%` };
          } else {
            includeClause = includeClause.map((include) => {
              if (include.attributes.includes(search_field)) {
                //  console.log("im")
                include.where = {
                  [search_field]: { [Op.like]: `%${search}%` },
                };
                include.required = true;
              }
              return include;
            });
          }
        }
      }

      let orderClause;
      if (sort.includes(".")) {
        const [association, field] = sort.split(".");
        if (association == "ep") {
          orderClause = [[field, order.toUpperCase()]];
        } else {
            //  orderClause = [[field, order.toUpperCase()]];
          const model = field === "company_name" ? Company : Branch;
          const asField = field === "company_name" ? "company" : "branch";
          orderClause = [[{ model, as: asField }, field, order.toUpperCase()]];
        }
      }

      // Count total records matching the criteria
      const countResult = await Employee.count({
        where: whereClause,
        include: includeClause.map((include) => ({
          model: include.model,
          as: include.as,
          required: include.required || false,
          where: include.where || {},
        })),
        distinct: true,
      });
      // Count total records matching the criteria
      // console.log("whereClause", whereClause);

      // Fetch paginated data
      const rows = await Employee.findAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit,
        offset,
        attributes: [
          "id",
          "employee_id",
          "employee_name",
          "designation",
          "mobile_number",
          "landline",
          "email",
          "photo",
          "is_active",
          "company_id",
          "branch_id",
        ],
      });

      const totalPages = Math.ceil(countResult / limit);

      const pageInfo = {
        total_items: countResult,
        total_pages: totalPages,
        current_page: parseInt(page),
        per_page: limit,
        has_next_page: parseInt(page) < totalPages,
        has_prev_page: parseInt(page) > 1,
      };

      if (!rows.length) {
        return Response.responseStatus(res, 404, "No data found", [], pageInfo);
      }

      // Format the employee response
      const employeeData = rows.map((employee) => {
        const emp = employee.toJSON();

        return {
          id: emp.id,
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          designation: emp.designation,
          mobile_number: emp.mobile_number,
          landline: emp.landline,
          email: emp.email,
          photo: emp.photo ? `${APP_URL}/uploads/photos/${emp.photo}` : null,
          is_active: emp.is_active,
          company: emp.company
            ? {
                company_id: emp.company.id,
                company_name: emp.company.company_name,
                company_website: emp.company.company_website,
                company_logo: emp.company.company_logo
                  ? `${APP_URL}/uploads/logos/${emp.company.company_logo}`
                  : null,
              }
            : null,
          branch: emp.Branch
            ? {
                branch_id: emp.Branch.id,
                branch_name: emp.Branch.branch_name,
                branch_address: emp.Branch.branch_address,
                google_map_link: emp.Branch.google_map_link,
              }
            : null,
        };
      });

      return Response.responseStatus(
        res,
        200,
        "List of all active employees retrieved successfully",
        employeeData,
        pageInfo
      );
    } catch (error) {
      console.error("Error in listEmployees:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // getAllActiveEmployeesWithMappedData: async (req, res) => {
  //   try {
  //     const rows = await Employee.getAllActiveEmployeesWithMappedData();
  //     if (rows.length > 0) {
  //       let employeeData = [];
  //       const URL = APP_URL || "http://localhost:3001";

  //       rows.map((row) => {
  //         const {
  //           ep_id,
  //           employee_id,
  //           employee_name,
  //           designation,
  //           mobile_number,
  //           landline,
  //           email,
  //           photo,
  //           qr_code,
  //           is_active,
  //           company_id,
  //           branch_id,
  //           company_name,
  //           company_website,
  //           company_logo,
  //           branch_name,
  //           branch_address,
  //           google_map_link,
  //         } = row;

  //         employeeData = [
  //           ...employeeData,
  //           {
  //             id: ep_id,
  //             employee_id,
  //             employee_name,
  //             designation,
  //             mobile_number,
  //             landline,
  //             email,
  //             // photo: photo ? Buffer.from(photo, "binary").toString() : null,
  //             qr_code_image: qr_code
  //               ? URL.concat(`/uploads/qr_codes/${qr_code}`)
  //               : null,
  //             is_active,
  //             company: {
  //               company_id: company_id,
  //               company_name,
  //               company_website,
  //               // company_logo: company_logo
  //               //   ? Buffer.from(company_logo, "binary").toString()
  //               //   : null,
  //             },
  //             branch: {
  //               branch_id: branch_id,
  //               branch_name,
  //               branch_address,
  //               google_map_link,
  //             },
  //           },
  //         ];
  //       });
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         "List of all active employees ",
  //         employeeData
  //       );
  //     }
  //     return Response.responseStatus(res, 400, "No data found");
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  getAllActiveEmployeesWithMappedData: async (req, res) => {
    try {
      // Fetch all active employees with associated company and branch data
      const rows = await Employee.findAll({
        where: { is_active: true, is_adrenalin: true },
        include: [
          {
            model: Company,
            as: "company",
            attributes: [
              "id",
              "company_name",
              "company_website",
              "company_logo",
            ],
            required: false, // LEFT JOIN - include employees even if no company
          },
          {
            model: Branch,
            as: "Branch", // Using the association alias from the model
            attributes: [
              "id",
              "branch_name",
              "branch_address",
              "google_map_link",
            ],
            required: false, // LEFT JOIN - include employees even if no branch
          },
        ],
        attributes: [
          "id",
          "employee_id",
          "employee_name",
          "designation",
          "mobile_number",
          "landline",
          "email",
          "photo",
          "qr_code",
          "is_active",
          "company_id",
          "branch_id",
        ],
        order: [["employee_name", "ASC"]], // Default ordering by name
      });

      if (!rows.length) {
        return Response.responseStatus(res, 404, "No active employees found");
      }

      const URL = APP_URL || "http://localhost:3001";

      // Helper function to build full URL
      const buildUrl = (folder, filename) =>
        filename ? `${URL}/uploads/${folder}/${filename}` : null;

      // Transform data to match expected response format
      const employeeData = rows.map((employee) => {
        const emp = employee.toJSON();

        return {
          id: emp.id,
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          designation: emp.designation,
          mobile_number: emp.mobile_number,
          landline: emp.landline,
          email: emp.email,
          photo: buildUrl("photos", emp.photo),
          qr_code_image: buildUrl("qr_codes", emp.qr_code),
          is_active: emp.is_active,
          company: emp.company
            ? {
                company_id: emp.company.id,
                company_name: emp.company.company_name,
                company_website: emp.company.company_website,
                company_logo: buildUrl("logos", emp.company.company_logo),
              }
            : {
                company_id: emp.company_id,
                company_name: null,
                company_website: null,
                company_logo: null,
              },
          branch: emp.Branch
            ? {
                branch_id: emp.Branch.id,
                branch_name: emp.Branch.branch_name,
                branch_address: emp.Branch.branch_address,
                google_map_link: emp.Branch.google_map_link,
              }
            : {
                branch_id: emp.branch_id,
                branch_name: null,
                branch_address: null,
                google_map_link: null,
              },
        };
      });

      return Response.responseStatus(
        res,
        200,
        `Successfully retrieved ${employeeData.length} active employees`,
        employeeData
      );
    } catch (error) {
      console.error("Error in getAllActiveEmployeesWithMappedData:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // getAllInActiveEmployeesWithMappedData: async (req, res) => {
  //   try {
  //     const rows = await Employee.getAllInActiveEmployeesWithMappedData();
  //     if (rows.length > 0) {
  //       let employeeData = [];
  //       rows.map((row) => {
  //         const {
  //           ep_id,
  //           employee_id,
  //           employee_name,
  //           designation,
  //           mobile_number,
  //           landline,
  //           email,
  //           photo,
  //           is_active,
  //           company_id,
  //           branch_id,
  //           company_name,
  //           company_website,
  //           company_logo,
  //           branch_name,
  //           branch_address,
  //           google_map_link,
  //         } = row;

  //         employeeData = [
  //           ...employeeData,
  //           {
  //             id: ep_id,
  //             employee_id,
  //             employee_name,
  //             designation,
  //             mobile_number,
  //             landline,
  //             email,
  //             photo: photo ? Buffer.from(photo, "binary").toString() : null,
  //             is_active,
  //             company: {
  //               company_id: company_id,
  //               company_name,
  //               company_website,
  //               company_logo: company_logo
  //                 ? Buffer.from(company_logo, "binary").toString()
  //                 : null,
  //             },
  //             branch: {
  //               branch_id: branch_id,
  //               branch_name,
  //               branch_address,
  //               google_map_link,
  //             },
  //           },
  //         ];
  //       });
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         "List of all Inactive Employees ",
  //         employeeData
  //       );
  //     }
  //     return Response.responseStatus(res, 400, "No data found");
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  getAllInActiveEmployeesWithMappedData: async (req, res) => {
    try {
      // Fetch all inactive employees with associated company and branch data
      const rows = await Employee.findAll({
        where: { is_active: false },
        include: [
          {
            model: Company,
            as: "company",
            attributes: [
              "id",
              "company_name",
              "company_website",
              "company_logo",
            ],
            required: false, // LEFT JOIN - include employees even if no company
          },
          {
            model: Branch,
            as: "Branch", // Using the association alias from the model
            attributes: [
              "id",
              "branch_name",
              "branch_address",
              "google_map_link",
            ],
            required: false, // LEFT JOIN - include employees even if no branch
          },
        ],
        attributes: [
          "id",
          "employee_id",
          "employee_name",
          "designation",
          "mobile_number",
          "landline",
          "email",
          "photo",
          "is_active",
          "company_id",
          "branch_id",
        ],
        order: [["employee_name", "ASC"]], // Default ordering by name
      });

      if (!rows.length) {
        return Response.responseStatus(res, 404, "No inactive employees found");
      }

      const URL = APP_URL || "http://localhost:3001";

      // Helper function to build full URL
      const buildUrl = (folder, filename) =>
        filename ? `${URL}/uploads/${folder}/${filename}` : null;

      // Transform data to match expected response format
      const employeeData = rows.map((employee) => {
        const emp = employee.toJSON();

        return {
          id: emp.id,
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          designation: emp.designation,
          mobile_number: emp.mobile_number,
          landline: emp.landline,
          email: emp.email,
          photo: buildUrl("photos", emp.photo),
          is_active: emp.is_active,
          company: emp.company
            ? {
                company_id: emp.company.id,
                company_name: emp.company.company_name,
                company_website: emp.company.company_website,
                company_logo: buildUrl("logos", emp.company.company_logo),
              }
            : {
                company_id: emp.company_id,
                company_name: null,
                company_website: null,
                company_logo: null,
              },
          branch: emp.Branch
            ? {
                branch_id: emp.Branch.id,
                branch_name: emp.Branch.branch_name,
                branch_address: emp.Branch.branch_address,
                google_map_link: emp.Branch.google_map_link,
              }
            : {
                branch_id: emp.branch_id,
                branch_name: null,
                branch_address: null,
                google_map_link: null,
              },
        };
      });

      return Response.responseStatus(
        res,
        200,
        `Successfully retrieved ${employeeData.length} inactive employees`,
        employeeData
      );
    } catch (error) {
      console.error("Error in getAllInActiveEmployeesWithMappedData:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // getEmployeeByEmployeeIdWithMappedData: async (req, res) => {
  //   try {
  //     const employee_id = req.params.employee_id;

  //     const rows = await Employee.getEmployeeByEmployeeIdWithMappedData(
  //       employee_id
  //     );

  //     if (rows.length > 0) {
  //       const {
  //         id,
  //         employee_id,
  //         employee_name,
  //         designation,
  //         mobile_number,
  //         landline,
  //         email,
  //         photo,
  //         is_active,
  //         company_id,
  //         branch_id,
  //         company_name,
  //         company_website,
  //         company_logo,
  //         branch_name,
  //         branch_address,
  //         google_map_link,
  //       } = rows[0]; // Note the change here, using rows[0] to get the first row

  //       const employeeData = [
  //         {
  //           id,
  //           employee_id,
  //           employee_name,
  //           designation,
  //           mobile_number,
  //           landline,
  //           email,
  //           photo: photo ? Buffer.from(photo, "binary").toString() : null,
  //           is_active,
  //           company: {
  //             company_id: company_id,
  //             company_name,
  //             company_website,
  //             company_logo: company_logo
  //               ? Buffer.from(company_logo, "binary").toString()
  //               : null,
  //           },
  //           branch: {
  //             branch_id: branch_id,
  //             branch_name,
  //             branch_address,
  //             google_map_link,
  //           },
  //         },
  //       ];

  //       return Response.responseStatus(
  //         res,
  //         200,
  //         `Details of Employee (${employee_id})`,
  //         employeeData
  //       );
  //     }

  //     return Response.responseStatus(
  //       res,
  //       400,
  //       `No data found for ${employee_id}`
  //     );
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },

  // updateEmployeeById: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return Response.responseStatus(res, 400, "Validation Failed", errors);
  //     }
  //     const id = req.params.id;
  //     const {
  //       employeeId,
  //       employeeName,
  //       employeeDesignation,
  //       employeeMobileNumber,
  //       employeeLandline,
  //       employeeEmail,
  //       employeePhoto,
  //       employeeCompanyId,
  //       employeeBranchId,
  //       is_active,
  //       modifiedBy,
  //     } = req.body;
  //     const employeeData = {
  //       employee_id: employeeId,
  //       employee_name: employeeName,
  //       designation: employeeDesignation,
  //       mobile_number: employeeMobileNumber,
  //       landline: employeeLandline,
  //       email: employeeEmail,
  //       photo: employeePhoto,
  //       is_active: is_active,
  //       company_id: employeeCompanyId,
  //       branch_id: employeeBranchId,
  //       modified_by: modifiedBy,
  //     };
  //     const result = await Employee.updateEmployeeByCondition(
  //       { id },
  //       employeeData
  //     );
  //     if (result.affectedRows > 0) {
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         "Employee Data updated successfully"
  //       );
  //     }
  //     return Response.responseStatus(res, 400, `Failed to update Employee Data`);
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  getEmployeeByEmployeeIdWithMappedData: async (req, res) => {
    // console.log("im working.........");
    try {
      const { employee_id } = req.params;

      if (!employee_id) {
        return Response.responseStatus(res, 400, "Employee ID is required");
      }

      // Fetch single employee with associated company and branch data
      const employee = await Employee.findOne({
        where: { employee_id: employee_id },
        include: [
          {
            model: Company,
            as: "company",
            attributes: [
              "id",
              "company_name",
              "company_website",
              "company_logo",
            ],
            required: false, // LEFT JOIN - include employee even if no company
          },
          {
            model: Branch,
            as: "Branch", // Using the association alias from the model
            attributes: [
              "id",
              "branch_name",
              "branch_address",
              "google_map_link",
            ],
            required: false, // LEFT JOIN - include employee even if no branch
          },
        ],
        attributes: [
          "id",
          "employee_id",
          "employee_name",
          "designation",
          "mobile_number",
          "landline",
          "email",
          "photo",
          "qr_code",
          "is_active",
          "company_id",
          "branch_id",
        ],
      });

      if (!employee) {
        return Response.responseStatus(
          res,
          404,
          `No employee found with ID: ${employee_id}`
        );
      }

      const URL = APP_URL || "http://localhost:3001";

      // Helper function to build full URL
      const buildUrl = (folder, filename) =>
        filename ? `${URL}/uploads/${folder}/${filename}` : null;

      // Transform data to match expected response format
      const emp = employee.toJSON();

      const employeeData = {
        id: emp.id,
        employee_id: emp.employee_id,
        employee_name: emp.employee_name,
        designation: emp.designation,
        mobile_number: emp.mobile_number,
        landline: emp.landline,
        email: emp.email,
        photo: buildUrl("photos", emp.photo),
        qr_code_image: buildUrl("qr_codes", emp.qr_code),
        is_active: emp.is_active,
        company: emp.company
          ? {
              company_id: emp.company.id,
              company_name: emp.company.company_name,
              company_website: emp.company.company_website,
              company_logo: buildUrl("logos", emp.company.company_logo),
            }
          : {
              company_id: emp.company_id,
              company_name: null,
              company_website: null,
              company_logo: null,
            },
        branch: emp.Branch
          ? {
              branch_id: emp.Branch.id,
              branch_name: emp.Branch.branch_name,
              branch_address: emp.Branch.branch_address,
              google_map_link: emp.Branch.google_map_link,
            }
          : {
              branch_id: emp.branch_id,
              branch_name: null,
              branch_address: null,
              google_map_link: null,
            },
      };

      return Response.responseStatus(
        res,
        200,
        `Details of Employee (${employee_id}) retrieved successfully`,
        employeeData
      );
    } catch (error) {
      console.error("Error in getEmployeeByEmployeeIdWithMappedData:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  // updateEmployeeByEmployeeId: async (req, res) => {
  //   try {
  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return Response.responseStatus(res, 400, "Validation Failed", errors);
  //     }
  //     const employee_id = req.params.employee_id;
  //     const {
  //       employeeId,
  //       employeeName,
  //       designation,
  //       mobileNumber,
  //       landline,
  //       email,
  //       photo,
  //       companyId,
  //       branchId,
  //       modifiedBy,
  //     } = req.body;
  //     const employeeData = {
  //       employee_id: employeeId,
  //       employee_name: employeeName,
  //       designation,
  //       mobile_number: mobileNumber,
  //       landline,
  //       email,
  //       photo,
  //       company_id: companyId,
  //       branch_id: branchId,
  //       modified_by: modifiedBy,
  //     };
  //     const result = await Employee.updateEmployeeByCondition(
  //       { employee_id },
  //       employeeData
  //     );
  //     if (result.affectedRows > 0) {
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         "Employee Data updated successfully"
  //       );
  //     }
  //     return Response.responseStatus(
  //       res,
  //       400,
  //       `Failed to update Employee Data`
  //     );
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  updateEmployeeByEmployeeId: async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Response.responseStatus(res, 400, "Validation Failed", {
          errors: errors.array(),
        });
      }

      const { employee_id } = req.params;
      const modifiedBy = req.userData.id;

      if (!employee_id) {
        return Response.responseStatus(res, 400, "Employee ID is required");
      }
      const {
        employeeId,
        employeeName,
        designation,
        mobileNumber,
        landline,
        email,
        photo,
        companyId,
        branchId,
      } = req.body;

      // Prepare update data - map request fields to database fields
      const employeeData = {
        employee_id: employeeId,
        employee_name: employeeName,
        designation,
        mobile_number: mobileNumber,
        landline,
        email,
        photo: req.file ? req.file.filename : photo,
        company_id: companyId,
        branch_id: branchId,
        modified_by: modifiedBy,
      };

      // Remove undefined fields to avoid updating with null
      Object.keys(employeeData).forEach((key) => {
        if (employeeData[key] === undefined) {
          delete employeeData[key];
        }
      });

      // Perform the update using Sequelize
      const [affectedCount] = await Employee.update(employeeData, {
        where: { employee_id: employee_id },
      });

      if (affectedCount > 0) {
        return Response.responseStatus(
          res,
          200,
          "Employee Data updated successfully"
        );
      }

      return Response.responseStatus(
        res,
        400,
        "Failed to update Employee Data"
      );
    } catch (error) {
      console.error("Error in updateEmployeeByEmployeeId:", error);

      // Handle specific Sequelize errors
      if (error.name === "SequelizeUniqueConstraintError") {
        return Response.responseStatus(res, 409, "Employee ID already exists");
      }

      if (error.name === "SequelizeForeignKeyConstraintError") {
        return Response.responseStatus(
          res,
          400,
          "Invalid company or branch ID"
        );
      }

      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // updateActiveEmployeeByEmployeeId: async (req, res) => {
  //   try {
  //     const employee_id = req.params.employee_id;
  //     const active = req.query.active;

  //     const update = {
  //       is_active: +active,
  //     };

  //     const result = await Employee.updateEmployeeByCondition(
  //       { employee_id },
  //       update
  //     );

  //     if (result.affectedRows > 0) {
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         `Employee ${
  //           Boolean(update.is_active) ? "activated" : "deactived"
  //         } successfully`
  //       );
  //     }
  //     return Response.responseStatus(res, 404, `Failed to update employee`);
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  updateActiveEmployeeByEmployeeId: async (req, res) => {
    try {
      const { employee_id } = req.params;
      const modifiedBy = req.userData.id;
      const { active } = req.query;

      // Validate parameters
      if (!employee_id) {
        return Response.responseStatus(res, 400, "Employee ID is required");
      }

      if (active === undefined || active === null) {
        return Response.responseStatus(res, 400, "Active status is required");
      }

      // Prepare update data (same logic as original)
      const updateData = {
        is_active: +active, // Convert to number like original
        modified_by: modifiedBy,
      };

      // Perform the update using Sequelize
      const [affectedCount] = await Employee.update(updateData, {
        where: { employee_id: employee_id },
      });

      if (affectedCount > 0) {
        return Response.responseStatus(
          res,
          200,
          `Employee ${
            Boolean(updateData.is_active) ? "activated" : "deactived"
          } successfully`
        );
      }

      return Response.responseStatus(res, 404, "Failed to update employee");
    } catch (error) {
      console.error("Error in updateActiveEmployeeByEmployeeId:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // deleteEmployeeById: async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const result = await Employee.deleteEmployeeByCondition({ id });
  //     if (result.affectedRows > 0) {
  //       return Response.responseStatus(
  //         res,
  //         200,
  //         `Employee Data deleted successfully`
  //       );
  //     }
  //     return Response.responseStatus(
  //       res,
  //       404,
  //       `Failed to delete Employee Data`
  //     );
  //   } catch (error) {
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  deleteEmployeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBy = req.userData.id;

      if (!id) {
        return Response.responseStatus(res, 400, "Employee ID is required");
      }

      await Employee.update({ deleted_by: deletedBy }, { where: { id } });
      // Perform soft delete using Sequelize destroy method
      const affectedCount = await Employee.destroy({
        where: { id },
      });

      if (affectedCount > 0) {
        return Response.responseStatus(
          res,
          200,
          "Employee Data deleted successfully"
        );
      }

      return Response.responseStatus(
        res,
        404,
        "Failed to delete Employee Data"
      );
    } catch (error) {
      console.error("Error in deleteEmployeeById:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // deleteEmployeeByEmployeeId: async (req, res) => {
  //   try {
  //     // const employee_id = req.params.employee_id;
  //     const { employee_ids = [] } = req.body;

  //     for (let i = 0; i < employee_ids.length; i++) {
  //       const employee_id = employee_ids[i];
  //       const result = await Employee.deleteEmployeeByCondition({
  //         employee_id,
  //       });
  //       if (!result.affectedRows > 0)
  //         return Response.responseStatus(
  //           res,
  //           404,
  //           `Failed to delete Employees`
  //         );
  //     }
  //     return Response.responseStatus(
  //       res,
  //       200,
  //       `Employees deleted successfully`
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  deleteEmployeeByEmployeeId: async (req, res) => {
    try {
      const { employee_ids = [] } = req.body;
      const deletedBy = req.userData.id;

      // Validate input
      if (!Array.isArray(employee_ids) || employee_ids.length === 0) {
        return Response.responseStatus(
          res,
          400,
          "Employee IDs array is required"
        );
      }

      // Loop through each employee_id like the original
      for (let i = 0; i < employee_ids.length; i++) {
        const employee_id = employee_ids[i];

        await Employee.update(
          { deleted_by: deletedBy },
          { where: { employee_id } }
        );
        const affectedCount = await Employee.destroy({
          where: { employee_id },
        });

        // If any deletion fails, return error (same logic as original)
        if (affectedCount === 0) {
          return Response.responseStatus(
            res,
            404,
            `Failed to delete employee with ID: ${employee_id}`
          );
        }
      }

      return Response.responseStatus(
        res,
        200,
        "Employees deleted successfully"
      );
    } catch (error) {
      console.error("Error in deleteEmployeeByEmployeeId:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  deleteEmployeesById: async (req, res) => {
    try {
      const { employee_ids = [] } = req.body;
      const deletedBy = req.userData.id;

      // Validate input
      if (!Array.isArray(employee_ids) || employee_ids.length === 0) {
        return Response.responseStatus(
          res,
          400,
          "Employee IDs array is required"
        );
      }

      // Loop through each employee_id like the original
      for (let i = 0; i < employee_ids.length; i++) {
        const id = employee_ids[i];

        await Employee.update({ deleted_by: deletedBy }, { where: { id } });
        const affectedCount = await Employee.destroy({
          where: { id },
        });

        // If any deletion fails, return error (same logic as original)
        if (affectedCount === 0) {
          return Response.responseStatus(
            res,
            404,
            `Failed to delete employee with ID: ${id}`
          );
        }
      }

      return Response.responseStatus(
        res,
        200,
        "Employees deleted successfully"
      );
    } catch (error) {
      console.error("Error in deleteEmployeeByEmployeeId:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // getVCardByEmployeeId: async (req, res) => {
  //   try {
  //     const employee_id = req.params.employee_id;

  //     const rows = await Employee.getEmployeeByEmployeeIdWithMappedData(
  //       employee_id
  //     );

  //     if (rows.length > 0) {
  //       const {
  //         id,
  //         employee_id,
  //         employee_name,
  //         designation,
  //         mobile_number,
  //         landline,
  //         email,
  //         photo,
  //         is_active,
  //         company_id,
  //         branch_id,
  //         company_name,
  //         company_website,
  //         company_logo,
  //         branch_name,
  //         branch_address,
  //         google_map_link,
  //       } = rows[0]; // Note the change here, using rows[0] to get the first row

  //       // const employeeData = [
  //       //   {
  //       //     id,
  //       //     employee_id,
  //       //     employee_name,
  //       //     designation,
  //       //     mobile_number,
  //       //     landline,
  //       //     email,
  //       //     photo:photo?Buffer.from(photo, 'binary').toString():null,
  //       //     is_active,
  //       //     company: {
  //       //       company_id: company_id,
  //       //       company_name,
  //       //       company_website,
  //       //       company_logo:company_logo?Buffer.from(company_logo, 'binary').toString():null,
  //       //     },
  //       //     branch: {
  //       //       branch_id: branch_id,
  //       //       branch_name,
  //       //       branch_address,
  //       //       google_map_link,
  //       //     },
  //       //   },
  //       // ];
  //       // Create a new vCard
  //       const vCard = vCardsJS();
  //       vCard.firstName = employee_name;
  //       vCard.email = email;
  //       vCard.cellPhone = mobile_number;

  //       // vCard.saveToFile(`${employee_name}_${Date.now()}.vcf`);

  //       // Convert vCard to a string
  //       const vCardString = vCard.getFormattedString();

  //       // Create a unique filename for the downloaded vCard
  //       const fileName = `${employee_name}.vcf`;

  //       // Write the vCard string to a file
  //       fs.writeFileSync(fileName, vCardString);

  //       // Set response headers for downloading the file
  //       res.setHeader("Content-Type", "text/vcard");
  //       res.setHeader(
  //         "Content-Disposition",
  //         `attachment; filename=${fileName}`
  //       );

  //       // Stream the file to the response
  //       const fileStream = fs.createReadStream(fileName);
  //       fileStream.pipe(res);

  //       // Remove the file after streaming
  //       fileStream.on("end", () => {
  //         fs.unlinkSync(fileName);
  //       });
  //     } else {
  //       return Response.responseStatus(
  //         res,
  //         400,
  //         `No data found for ${employee_id}`
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  getVCardByEmployeeId: async (req, res) => {
    try {
      const { employee_id } = req.params;

      if (!employee_id) {
        return Response.responseStatus(res, 400, "Employee ID is required");
      }

      // Fetch employee with associated company and branch data using Sequelize
      const employee = await Employee.findOne({
        where: { employee_id: employee_id },
        include: [
          {
            model: Company,
            as: "company",
            attributes: [
              "id",
              "company_name",
              "company_website",
              "company_logo",
            ],
            required: false,
          },
          {
            model: Branch,
            as: "Branch",
            attributes: [
              "id",
              "branch_name",
              "branch_address",
              "google_map_link",
            ],
            required: false,
          },
        ],
        attributes: [
          "id",
          "employee_id",
          "employee_name",
          "designation",
          "mobile_number",
          "landline",
          "email",
          "photo",
          "is_active",
          "company_id",
          "branch_id",
        ],
      });

      if (!employee) {
        return Response.responseStatus(
          res,
          404,
          `No employee found with ID: ${employee_id}`
        );
      }

      // Convert to plain object
      const emp = employee.toJSON();

      // Create a new vCard
      const vCard = vCardsJS();
      vCard.firstName = emp.employee_name || "";
      vCard.email = emp.email || "";
      vCard.cellPhone = emp.mobile_number || "";
      vCard.workPhone = emp.landline || "";
      vCard.title = emp.designation || "";

      // Add company information if available
      if (emp.company) {
        vCard.organization = emp.company.company_name || "";
        vCard.url = emp.company.company_website || "";
      }

      // Add address information if available
      if (emp.Branch && emp.Branch.branch_address) {
        vCard.workAddress.label = emp.Branch.branch_name || "";
        vCard.workAddress.street = emp.Branch.branch_address || "";
      }

      // Convert vCard to string
      const vCardString = vCard.getFormattedString();

      // Create filename
      const sanitizedName = emp.employee_name.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `${sanitizedName}_${employee_id}.vcf`;

      // Set response headers for downloading the file
      res.setHeader("Content-Type", "text/vcard; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      // Send the vCard content directly (no temp file)
      res.send(vCardString);
    } catch (error) {
      console.error("Error in getVCardByEmployeeId:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  // syncQRCodeImages: async (req, res) => {
  //   try {
  //     const rows = await Employee.getAllEmployees();
  //     if (rows.length) {
  //       for (let i = 0; i < rows.length; i++) {
  //         const id = rows[i].id;
  //         const employee_id = rows[i].employee_id;
  //         const is_qr_exists = rows[i].qr_code;
  //         if (!is_qr_exists) {
  //           const qr_code = await generateQRCodeImage(employee_id);
  //           await Employee.updateEmployeeById(id, { qr_code });
  //         }
  //       }
  //       return Response.responseStatus(res, 200, "QR code images generated");
  //     }
  //     return Response.responseStatus(res, 400, "No Employees");
  //   } catch (error) {
  //     console.log(error.message);
  //     return Response.responseStatus(res, 500, "Internal server error", {
  //       error: error.message,
  //     });
  //   }
  // },
  syncQRCodeImages: async (req, res) => {
    try {
      // Fetch all employees without QR codes using Sequelize
      const employees = await Employee.findAll({
        where: {
          qr_code: {
            [Op.or]: [null, ""],
          },
        },
        attributes: ["id", "employee_id", "employee_name", "qr_code"],
      });

      if (!employees.length) {
        return Response.responseStatus(
          res,
          200,
          "All employees already have QR codes"
        );
      }

      let generatedCount = 0;
      const results = [];

      // Process each employee
      for (const employee of employees) {
        try {
          const qr_code = await generateQRCodeImage(employee.employee_id);

          if (qr_code) {
            // Update employee with new QR code
            await Employee.update(
              { qr_code: qr_code },
              { where: { id: employee.id } }
            );

            generatedCount++;
            results.push({
              employee_id: employee.employee_id,
              employee_name: employee.employee_name,
              status: "success",
              qr_code: qr_code,
            });
          } else {
            results.push({
              employee_id: employee.employee_id,
              employee_name: employee.employee_name,
              status: "failed",
              error: "QR code generation failed",
            });
          }
        } catch (individualError) {
          console.error(
            `Error processing employee ${employee.employee_id}:`,
            individualError
          );
          results.push({
            employee_id: employee.employee_id,
            employee_name: employee.employee_name,
            status: "error",
            error: individualError.message,
          });
        }
      }

      return Response.responseStatus(
        res,
        200,
        `QR code generation completed. ${generatedCount} out of ${employees.length} QR codes generated successfully`,
        {
          total_processed: employees.length,
          successful: generatedCount,
          failed: employees.length - generatedCount,
          results: results,
        }
      );
    } catch (error) {
      console.error("Error in syncQRCodeImages:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  sendQREmail: async (req, res) => {
    try {
      const { employee_ids = [] } = req.body;

      if (!employee_ids.length) {
        return Response.responseStatus(res, 400, "No employee IDs provided");
      }

      for (const employee_id of employee_ids) {
        const employee = await Employee.findOne({ where: { employee_id } });

        if (!employee) {
          console.warn(`Employee not found: ${employee_id}`);
          continue;
        }

        if (!employee.qr_code) {
          console.warn(`No QR code found for employee: ${employee_id}`);
          continue;
        }

        const qrPath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          "qr_codes",
          employee.qr_code
        );

        const mailSubject = "Your Refex Food Billing QR Code";
        const mailContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${process.env.APP_URL}/assets/Refex-Logo.png" 
                 alt="Refex Contacts" style="max-width: 120px;">
          </div>

          <h2 style="text-align: center; color: #2a2a2a;">Hello ${employee.employee_name},</h2>

          <p>
            We are pleased to share your <strong>personal QR code</strong> for 
            <b>Refex Food Billing System</b>. This QR code is unique to you and 
            must be used at the cafeteria for smooth billing and tracking.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <img src="cid:qrCode" alt="QR Code" style="width: 180px; height: 180px;" />
          </div>

          <p style="font-size: 14px; color: #555;">
            🔒 Please keep this QR code secure and do not share it with others.
          </p>

          <p>
            Regards,<br/>
            <strong>Refex IT Team</strong>
          </p>
        </div>
      `;

        // Attach QR as inline image (so it displays inside email, not just as attachment)
        await sendMail(employee.email, mailSubject, mailContent, [
          {
            filename: employee.qr_code,
            path: qrPath,
            cid: "qrCode", // same as used in <img src="cid:qrCode">
          },
          {
            filename: employee.qr_code,
            path: qrPath, // as normal attachment
          },
        ]);

        // Small delay (to avoid Gmail rate-limit)
        await new Promise((r) => setTimeout(r, 1500));
      }

      return Response.responseStatus(
        res,
        200,
        "QR Emails have been sent successfully"
      );
    } catch (error) {
      console.error("Error in sendQREmail:", error);
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};

module.exports = EmployeeController;
