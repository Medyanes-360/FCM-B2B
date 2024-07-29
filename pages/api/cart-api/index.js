import {
  getAllData,
  createNewData,
  updateDataByAny,
} from "@/services/serviceOperations";

const tables = [
  "IRSHAR",
  "SIRKETLOG",
  "IRSFIS",
  "STKFIS",
  "HARREFNO",
  "EVRAKNO",
  "ALLORDERS",
];

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      // Fetch data from all tables concurrently
      const promises = tables.map((table) => getAllData(table));
      const results = await Promise.all(promises);

      const data = tables.reduce((acc, table, index) => {
        acc[table] = results[index];
        return acc;
      }, {});

      console.log("GET results: ", data);

      return res.status(200).json({ message: "Method GET", data });
    } catch (error) {
      console.error("Error fetching data:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { table, data } = req.body;

      if (!table || !data) {
        return res
          .status(400)
          .json({ message: "Table name and data are required" });
      }

      if (!tables.includes(table)) {
        return res.status(400).json({ message: "Invalid table name" });
      }

      const result = await createNewData(table, data);

      console.log("POST result: ", result);

      return res
        .status(201)
        .json({ message: "Data added successfully", result });
    } catch (error) {
      console.error("Error adding data:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { table, where, data } = req.body;

      if (!table || !where || !data) {
        return res.status(400).json({
          message: "Table name, where condition, and data are required",
        });
      }

      if (!tables.includes(table)) {
        return res.status(400).json({ message: "Invalid table name" });
      }

      const result = await updateDataByAny(table, where, data);

      console.log("PUT result: ", result);

      return res
        .status(200)
        .json({ message: "Data updated successfully", result });
    } catch (error) {
      console.error("Error updating data:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
