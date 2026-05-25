import { useState } from "react";\nexport default function useWorkspaceStore() { const [workspace, setWorkspace] = useState(null); return { workspace, setWorkspace }; }
