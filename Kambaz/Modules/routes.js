import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
  app.get("/api/modules", async (req, res) => {
    const { course } = req.query;
    if (course) {
      const modules = await modulesDao.findModulesForCourse(course);
      res.json(modules);
    } else {
      const modules = await modulesDao.findAllModules();
      res.json(modules);
    }
  });

  app.get("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const module = await modulesDao.findModuleById(moduleId);
    if (module) {
      res.json(module);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  });

  app.post("/api/modules", async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).send("user not authenticated");
      return;
    }
    
    const module = req.body;
    const newModule = await modulesDao.createModule(module);
    res.json(newModule);
  });

  app.delete("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const status = await modulesDao.deleteModule(moduleId);
    res.send(status);
  });
  
  app.put("/api/modules/:moduleId", async (req, res) => {
    const { moduleId } = req.params;
    const moduleUpdates = req.body;
    
    try {
      const status = await modulesDao.updateModule(moduleId, moduleUpdates);
      res.json(status);
    } catch (error) {
      console.error("Error updating module:", error.message);
      res.status(404).json({ message: error.message });
    }
  });
}
