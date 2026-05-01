const express = require("express");
const router = express.Router();
const TraceEvent = require("../models/TraceEvent");

router.get("/:traceId", async (req, res) => {
  const apiKey = req.apiKey;
  const { traceId } = req.params;

  try {
    const root = await TraceEvent.findOne({
      apiKey,
      traceId
    });

    if (!root) return res.json([]);

    const rootTraceId = root.rootTraceId || root.traceId;
    const events = await TraceEvent.find({
      apiKey,
      rootTraceId
    }).sort({ timestamp: 1, createdAt: 1, _id: 1 });

    return res.json(events);
  } catch (error) {
    console.error("Error fetching trace:", error);
    return res.status(500).json({ error: "Trace fetch failed" });
  }
});

// router.get("/traces/:traceId", async (req, res) => {
  //   const apiKey = req.headers["x-api-key"];
  //   const { traceId } = req.params;
  
  //   try {
    //     const result = await TraceEvent.aggregate([
  //       {
  //         $match: {
  //           apiKey,
  //           traceId
  //         }
  //       },
  //       {
  //         $graphLookup: {
  //           from: "traceevents",
  //           startWith: "$traceId",
  //           connectFromField: "traceId",
  //           connectToField: "parentId",
  //           as: "children"
  //         }
  //       }
  //     ]);
  
  //     if (!result.length) {
  //       return res.json([]);
  //     }
  
  //     const root = result[0];
  //     const allEvents = [root, ...root.children];
  
  //     res.json(allEvents);
  
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Trace fetch failed" });
  //   }
  // });
  // router.get("/traces/:traceId", async (req, res) => {
  //   const apiKey = req.headers["x-api-key"];
  //   const { traceId } = req.params;
  
  //   const events = await TraceEvent.find({
  //     apiKey,
  //     $or: [
  //       { traceId },
  //       { parentId: traceId }
  //     ]
  //   });
  
  //   res.json(events);
  // });

  module.exports = router;
