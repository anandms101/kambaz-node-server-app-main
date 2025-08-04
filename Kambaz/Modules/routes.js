import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
  app.get("/api/modules", (req, res) => {
    const { course } = req.query;
    if (course) {
      const modules = modulesDao.findModulesForCourse(course);
      res.json(modules);
    } else {
      const modules = modulesDao.findAllModules();
      res.json(modules);
    }
  });

  app.get("/api/modules/:moduleId", (req, res) => {
    const { moduleId } = req.params;
    const module = modulesDao.findModuleById(moduleId);
    if (module) {
      res.json(module);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  });

  app.post("/api/modules", (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).send("user not authenticated");
      return;
    }
    
    const module = req.body;
    const newModule = modulesDao.createModule(module);
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
    const status = await modulesDao.updateModule(moduleId, moduleUpdates);
    res.send(status);
  });
}
