const module = {
    id: 101, name: "NodeJS ",
    description: " NodeJS server with ExpressJS learning !",
    course: "Web Dev", 
  };
  export default function Module(app) {
    app.get("/lab5/module", (req, res) => {
      res.json(module);
    });
    app.get("/lab5/module/name", (req, res) => {
        res.json(module.name);
      });
      app.get("/lab5/module/name/:newName", (req, res) => {
        const { newName } = req.params;
        module.name = newName;
        res.json(module);
      });

      app.get("/lab5/module/description/:newDescription", (req, res) => {
        const { newDescription } = req.params;
        module.description = newDescription;
        res.json(module);
      });
    
    
  };
  
  