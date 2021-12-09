const express = require("express");
const router = express.Router();
const xss = require("xss");
const data = require("../data");
const adminReq = data.admin;
const errorHandler = require("../Errors/errorHandler");

router.get("/", async (req, res) => {
  const getReq = await adminReq.getAllRequests();
  const getReport = await adminReq.getAllReports();
  res.render("admin/main", {
    title: "Admin",
    requests: getReq,
    reports: getReport,
    hasReq: getReq.length > 0 ? true : false,
    hasReport: getReport.length > 0 ? true : false,
    isLoggedIn: req.session.user ? true : false,
  });
});

router.get("/request/:id", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  const getReq = await adminReq.getRequestById(id);
  res.render("admin/request", {
    title: "Admin",
    venue: getReq,
    id: id,
    isLoggedIn: req.session.user ? true : false,
  });
});

router.get("/request/:id/approve", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(400).json({ err: error });
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const updateReq = await adminReq.approveRequest(id);
    res.render("admin/requestStat", {
      title: updateReq.updated ? "Approved" : "Error",
      status: "Venue request successfully approved.",
      succ: updateReq.updated ? true : false,
      isLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.render("admin/requestStat", {
      title: "Error",
      status: "Error updating venue request.",
      succ: false,
      isLoggedIn: req.session.user ? true : false,
    });
  }
});

router.get("/request/:id/decline", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(400).json({ err: error });
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const updateReq = await adminReq.declineRequest(id);
    res.render("admin/requestStat", {
      title: updateReq.updated ? "Declined" : "Error",
      status: "Venue request successfully declined.",
      succ: updateReq.updated ? true : false,
      isLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.render("admin/requestStat", {
      title: "Error",
      status: "Error updating venue request.",
      succ: updateReq.updated ? true : false,
      isLoggedIn: req.session.user ? true : false,
    });
  }
});

router.get("/report/:id", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsExists(array);
  } catch (e) {
    res.status(400).json({ err: e });
    return;
  }
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }
  const getReport = await adminReq.getReportById(id);
  res.render("admin/report", {
    title: "Report",
    report: getReport.reported,
    comment: getReport.reportedComment,
    id: id,
    isLoggedIn: req.session.user ? true : false,
  });
});

router.get("/report/:id/approve", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(400).json({ err: error });
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const updateReq = await adminReq.approveReport(id);
    res.render("admin/requestStat", {
      title: updateReq.updated ? "Approved" : "Error",
      status: "Report successfully approved.",
      succ: updateReq.updated ? true : false,
      isLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.render("admin/requestStat", {
      title: "Error",
      status: "Error updating report.",
      succ: false,
      isLoggedIn: req.session.user ? true : false,
    });
  }
});

router.get("/report/:id/decline", async (req, res) => {
  const id = req.params.id;
  let array = [id];
  try {
    errorHandler.checkIfElementsAreStrings(array);
  } catch (error) {
    return res.status(400).json({ err: error });
  }

  try {
    errorHandler.checkIfElementNotEmptyString(array);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    errorHandler.checkIfValidObjectId(id);
  } catch (error) {
    res.status(400).json({ err: error });
    return;
  }

  try {
    const updateReq = await adminReq.denyReport(id);
    res.render("admin/requestStat", {
      title: updateReq.updated ? "Approved" : "Error",
      status: "Report successfully declined.",
      succ: updateReq.updated ? true : false,
      isLoggedIn: req.session.user ? true : false,
    });
  } catch (error) {
    res.render("admin/requestStat", {
      title: "Error",
      status: "Error updating report.",
      succ: false,
      isLoggedIn: req.session.user ? true : false,
    });
  }
});

module.exports = router;
