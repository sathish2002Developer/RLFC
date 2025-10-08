const {Branch} = require("../models");
const Response = require("../helpers/response");
const { validationResult } = require("express-validator");

const BranchController = {
  createBranch: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Response.responseStatus(res, 400, "Validation Failed", errors);
      }

       const { id } = req.userData

      const {
        branch_name,
        branch_address,
        google_map_link,
      } = req.body;

      const BranchData = {
        branch_name,
        branch_address,
        google_map_link,
        created_by: id,
        modified_by: id,
      };

      const result = await Branch.create(BranchData);

      if (result && result.id) {
        return Response.responseStatus(
          res,
          201,
          ` Branch created successfully`,
          result
        );
      }

      return Response.responseStatus(
        res,
        400,
        `Failed to create company branch`
      );
    } catch (error) {
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
 getAllBranch: async (req, res) => {
    try {
      const companyBranchData = await Branch.findAll();

      if (companyBranchData.length > 0) {
        return Response.responseStatus(
          res,
          200,
          "List of all Company Branches",
          companyBranchData
        );
      }

      return Response.responseStatus(res, 400, "No data found");
    } catch (error) {
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

  getBranchByCompanyBranchId: async (req, res) => {
    const branch_id = req.params.branch_id;

    try {
      const companyBranchData = await Branch.findOne({
        where: { id:branch_id },
      });

      if (companyBranchData) {
        return Response.responseStatus(
          res,
          200,
          `Details of Company Branch (${branch_id})`,
          companyBranchData
        );
      }

      return Response.responseStatus(
        res,
        400,
        `No data found for branch ID ${branch_id}`
      );
    } catch (error) {
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
getAllBranchWithCompany: async (req, res) => {
  try {
    // Extract pagination, search, and ordering params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const field = req.query.field || "branch_name"; // field to search on
    const sort = req.query.sort || "branch_name";  // field to sort on
    const order = req.query.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"; // ASC (default) or DESC
    const offset = (page - 1) * limit;

    // Build where condition for search
    const where = search
      ? {
          [field]: {
            [require("sequelize").Op.like]: `%${search}%`,
          },
        }
      : {};

    // Get total count of branches matching search
    const totalCount = await Branch.count({ where });

    if (totalCount === 0) {
      return Response.responseStatus(res, 400, "No data found");
    }

    // Get paginated + sorted branches
    const rows = await Branch.findAll({
      where,
      limit: limit,
      offset: offset,
      order: [[sort, order]], // ✅ dynamic ordering
    });

    // Transform the data
    const companyBranchData = rows.map((row) => {
      const {
        id,
        branch_id,
        branch_name,
        branch_address,
        google_map_link,
      } = row;

      return {
        id,
        branch_id,
        branch_name,
        branch_address,
        google_map_link,
      };
    });

    // Calculate pagination info
    const totalPage = Math.ceil(totalCount / limit);
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;

    const qs = require("qs");
    const nextQuery = qs.stringify({ ...req.query, page: page + 1 });
    const prevQuery = qs.stringify({ ...req.query, page: page - 1 });

    const nextLink = page < totalPage ? `${baseUrl}?${nextQuery}` : null;
    const prevLink = page > 1 ? `${baseUrl}?${prevQuery}` : null;

    // Prepare response with pagination info
    const responseData = {
      status: true,
      status_code: 200,
      message: "List of all Branches",
      info: {
        totalData: totalCount,
        totalPage: totalPage,
        currentPage: page,
        nextLink: nextLink,
        prevLink: prevLink,
      },
      results: companyBranchData,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    const errorResponse = {
      status: false,
      status_code: 500,
      message: "Internal server error",
      error: error.message,
    };

    return res.status(500).json(errorResponse);
  }
},


getBranchByBranchesIdWithCompany: async (req, res) => {
  try {
    const branch_id = req.params.branch_id;

    const row = await Branch.findOne(
      {
        where: { id:branch_id },
      }
  );

    if (row) {
      const {
        id: cpb_id,
        branch_name,
        branch_address,
        google_map_link,
      } = row;

      const companyBranchData = [
        {
          id: cpb_id,
          branch_name,
          branch_address,
          google_map_link,
        },
      ];

      return Response.responseStatus(
        res,
        200,
        `Details of Company Branches (${branch_id})`,
        companyBranchData
      );
    }

    return Response.responseStatus(
      res,
      400,
      `No data found for ${branch_id}`
    );
  } catch (error) {
    return Response.responseStatus(res, 500, "Internal server error", {
      error: error.message,
    });
  }
},


  updateBranchByBranchId: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Response.responseStatus(res, 400, "Validation Failed", errors);
      }
      const modifiedBy = req?.userData?.id;

      const branch_id = req.params.branch_id;

       const {
        branch_name,
        branch_address,
        google_map_link,
      } = req.body;

      const BranchData = {
        branch_name,
        branch_address,
        google_map_link,
        modifiedBy
      };

   
      // Find company
      const branch = await Branch.findOne({ where: { id: branch_id } });
      if (!branch) {
        return Response.responseStatus(res, 404, "Branch not found");
      }

      // Update company
      await branch.update(BranchData);

      // Get current branches from DB
      // const prevBranches = await Branch.findAll({
      //   where: { company_id },
      // });

      // const prevBranchMap = new Map(prevBranches.map((b) => [b.id, b]));

      // const incomingBranchIds = new Set();

      // // Process incoming branches
      // for (const branch of companyBranches) {
      //   if (branch.id && prevBranchMap.has(branch.id)) {
      //     // Update existing branch
      //     await Branch.update(
      //       {
      //         branch_name: branch.companyBranchName,
      //         branch_address: branch.companyBranchAddress,
      //         google_map_link: branch.googleMapLink,
      //         modified_by: modifiedBy,
      //       },
      //       {
      //         where: {
      //           id: branch.id,
      //           company_id,
      //         },
      //       }
      //     );
      //     incomingBranchIds.add(branch.branchId);
      //   } else {
      //     // Create new branch
      //     await Branch.create({
      //       company_id,
      //       branch_name: branch.companyBranchName,
      //       branch_address: branch.companyBranchAddress,
      //       google_map_link: branch.googleMapLink,
      //       created_by: modifiedBy,
      //       modified_by: modifiedBy,
      //     });
      //   }
      // }

      // // Delete branches that are no longer in the incoming list
      // const branchesToDelete = prevBranches.filter(
      //   (branch) => !incomingBranchIds.has(branch.branch_id)
      // );

      // for (const branch of branchesToDelete) {
      //   await branch.destroy(); // soft delete if `paranoid: true`
      // }

      return Response.responseStatus(res, 200, "Branch updated successfully");
    } catch (error) {
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },

//  deleteBranchByCompanyBranchId: async (req, res) => {
//     try {
//       const branch_id = req.params.branch_id;

//       const result = await Branch.destroy({
//         where: { id:branch_id },
//       });

//       if (result > 0) {
//         return Response.responseStatus(
//           res,
//           200,
//           `Company Branch Data deleted successfully`
//         );
//       }

//       return Response.responseStatus(
//         res,
//         404,
//         `Failed to delete Company Branch Data`
//       );
//     } catch (error) {
//       return Response.responseStatus(res, 500, "Internal server error", {
//         error: error.message,
//       });
//     }
//   },

//  deleteBranchByCompanyBranchId: async (req, res) => {
//     try {
//       const branch_id = req.params.branch_id;

//       const result = await Branch.destroy({
//         where: {id: branch_id },
//       });

//       if (result > 0) {
//         return Response.responseStatus(
//           res,
//           200,
//           `Branch Data deleted successfully`
//         );
//       }

//       return Response.responseStatus(
//         res,
//         404,
//         `Failed to delete Company Branch Data`
//       );
//     } catch (error) {
//       return Response.responseStatus(res, 500, "Internal server error", {
//         error: error.message,
//       });
//     }
//   },

    deleteBranchByCompanyBranchId: async (req, res) => {
    try {
      const { branch_ids = [] } = req.body;
      //  console.log("company_ids",company_ids)
      const deletedBy = req?.userData?.id;

      if (!Array.isArray(branch_ids) || branch_ids.length === 0) {
        return Response.responseStatus(res, 400, "No branch IDs provided");
      }

      for (const branch_id of branch_ids) {
        // Check if company exists
        const company = await 
        Branch.findOne({ where: { id: branch_id } });
        if (!company) {
          return Response.responseStatus(
            res,
            404,
            `branch ID ${branch_id} not found`
          );
        }

        // Soft delete all branches for this company
        // await Branch.destroy({
        //   where: { company_id },
        // });.

        // Soft delete the company
        await Branch.update(
          { deleted_by: deletedBy },
          { where: { id: branch_id } }
        );
        const deleted = await Branch.destroy({
          where: { id: branch_id },
        });

        if (!deleted) {
          return Response.responseStatus(
            res,
            404,
            `Failed to delete branch ID ${branch_id}`
          );
        }
      }

      return Response.responseStatus(res, 200, "branch deleted successfully");
    } catch (error) {
      return Response.responseStatus(res, 500, "Internal server error", {
        error: error.message,
      });
    }
  },
};

module.exports = BranchController;
