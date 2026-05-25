import { Router } from "express";\nimport { getProjects } from "../controllers/projectController.js";\nconst router = Router();\nrouter.get("/", getProjects);\nexport default router;
