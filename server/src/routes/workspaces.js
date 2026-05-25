import { Router } from "express";\nimport { getWorkspaces } from "../controllers/workspaceController.js";\nconst router = Router();\nrouter.get("/", getWorkspaces);\nexport default router;
