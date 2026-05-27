import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Workspace from "./models/Workspace.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
import PulseEvent from "./models/PulseEvent.js";
import Message from "./models/Message.js";
import Resource from "./models/Resource.js";
import Collection from "./models/Collection.js";
import Comment from "./models/Comment.js";
import bcrypt from "bcrypt";

dotenv.config();

const seed = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await connectDB();

    console.log("Cleaning database...");
    await Promise.all([
      User.deleteMany({}),
      Workspace.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      PulseEvent.deleteMany({}),
      Message.deleteMany({}),
      Resource.deleteMany({}),
      Collection.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    console.log("Seeding Users...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("collabrix123", salt);

    const userAryan = await User.create({
      name: "Aryan",
      email: "aryan@collabrix.io",
      password: passwordHash,
      avatar: "A",
    });

    const userBhoomi = await User.create({
      name: "Bhoomi",
      email: "bhoomi@collabrix.io",
      password: passwordHash,
      avatar: "B",
    });

    const userViewer = await User.create({
      name: "Viewer Guest",
      email: "viewer@collabrix.io",
      password: passwordHash,
      avatar: "V",
    });

    console.log("Seeding Workspace...");
    const workspace = await Workspace.create({
      name: "Collabrix Platform Hub",
      description: "Central workspace for scaling realtime collaboration engines, security pipelines, and AI sprint execution.",
      owner: userAryan._id,
      members: [
        { user: userAryan._id, role: "owner" },
        { user: userBhoomi._id, role: "admin" },
        { user: userViewer._id, role: "viewer" },
      ],
      invites: [
        {
          token: "seeded_invite_token_pending",
          email: "external_consultant@collabrix.io",
          invitedBy: userAryan._id,
          role: "member",
          status: "pending",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      ]
    });

    console.log("Seeding Project Board...");
    const projectBoard = await Project.create({
      name: "Realtime Engine & Synchronization Service",
      description: "Scaling WebSockets, drag presence, multiplayer state synchronization, and secure invite validation.",
      workspace: workspace._id,
      createdBy: userAryan._id,
    });

    console.log("Seeding Resources & Annotations...");
    const resource1 = await Resource.create({
      title: "JWT Architecture Guide for WebSockets",
      description: "Securing persistent socket connections with token rotation and custom handshakes.",
      url: "https://socket.io/docs/v4/middlewares/",
      type: "docs",
      favicon: "https://socket.io/images/favicon.png",
      previewImage: "https://socket.io/images/logo.svg",
      domain: "socket.io",
      category: "auth",
      tags: ["security", "auth", "sockets"],
      workspace: workspace._id,
      project: projectBoard._id,
      createdBy: userAryan._id,
      isPinned: true,
      views: 42,
      viewedBy: [userAryan._id, userBhoomi._id],
      likes: [userBhoomi._id],
      usageMetadata: [
        { text: "Used to configure server handshake middleware", contextType: "sprint" },
        { text: "Referenced in auth security audits", contextType: "task" }
      ],
      comments: [
        {
          user: userBhoomi._id,
          userName: "Bhoomi",
          text: "Why this matters: In high-scale deployments, continuous token checking inside the event loop is a bottleneck. We must authenticate ONLY during the connection handshake.",
          type: "solution",
        },
        {
          user: userAryan._id,
          userName: "Aryan",
          text: "Agreed. Added to auth check middleware code.",
          type: "note",
        }
      ]
    });

    const resource2 = await Resource.create({
      title: "Socket.IO Scaling in Production Clusters",
      description: "Using Redis adapter to sync socket events across multiple autoscaling node containers.",
      url: "https://socket.io/docs/v4/redis-adapter/",
      type: "article",
      domain: "socket.io",
      category: "realtime",
      tags: ["realtime", "scaling", "devops"],
      workspace: workspace._id,
      project: projectBoard._id,
      createdBy: userBhoomi._id,
      isPinned: true,
      views: 31,
      viewedBy: [userAryan._id, userBhoomi._id],
      likes: [userAryan._id],
      usageMetadata: [
        { text: "Essential for AWS Fargate scaling logic", contextType: "deploy" }
      ],
      comments: [
        {
          user: userBhoomi._id,
          userName: "Bhoomi",
          text: "Note: Ensure sticky sessions are enabled on the load balancer, otherwise connection handshake fails intermittently.",
          type: "caveat",
        }
      ]
    });

    const resource3 = await Resource.create({
      title: "Production Deployment Checklist for Autoscaling Sockets",
      description: "Autoscaling sockets require reverse proxy configurations to handle WebSockets correctly. Includes standard Nginx config template.",
      type: "code-snippet",
      category: "deployment",
      tags: ["deployment", "infrastructure"],
      workspace: workspace._id,
      project: projectBoard._id,
      createdBy: userBhoomi._id,
      codeSnippet: `location /socket.io/ {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;

    proxy_pass http://nodes;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}`,
      usageMetadata: [
        { text: "Production deploy configurations", contextType: "deploy" }
      ],
      comments: [
        {
          user: userBhoomi._id,
          userName: "Bhoomi",
          text: "Tested Nginx proxy configuration. Ensure proxy_read_timeout is increased to prevent sudden silent drops.",
          type: "solution",
        }
      ]
    });

    console.log("Seeding Collections...");
    await Collection.create({
      name: "JWT Auth Architecture",
      description: "Seeded bundle of highly operational blueprints for secure handshake token lifecycle management.",
      workspace: workspace._id,
      resources: [resource1._id],
      createdBy: userAryan._id,
      sprintLink: "Sprint 2",
    });

    await Collection.create({
      name: "Socket.IO Scaling & Production Cluster Pack",
      description: "Auto-scaling WebSockets with Redis adapters and proxy setups.",
      workspace: workspace._id,
      resources: [resource2._id, resource3._id],
      createdBy: userBhoomi._id,
      sprintLink: "Sprint 2",
    });

    console.log("Seeding Tasks...");
    const task1 = await Task.create({
      title: "Design Secure WebSocket Authentication Handshake",
      description: "Implement initial handshake verification with validation of JWT tokens before creating persistent connection. Prevent connection exhaustion attacks by disconnecting unauthenticated requests within 2 seconds.",
      project: projectBoard._id,
      workspace: workspace._id,
      priority: "high",
      status: "done",
      assignee: userAryan._id,
      labels: ["auth", "security"],
      milestone: "Security & Invite Hardening",
      subtasks: [
        { title: "Define custom handshake headers", isCompleted: true },
        { title: "Verify token expiration", isCompleted: true },
        { title: "Write connection exhaustion timeout script", isCompleted: true },
      ],
      dependencies: [],
      blockers: [],
      reviewStage: "Approved",
      deployOrder: 1,
      resources: [resource1._id],
      createdBy: userAryan._id,
    });

    const task2 = await Task.create({
      title: "Implement Multi-node Socket Sync with Redis Adapter",
      description: "Scale state synchronization and drag/viewer presence across multiple Kubernetes nodes. Hook up official Redis pub/sub adapter.",
      project: projectBoard._id,
      workspace: workspace._id,
      priority: "high",
      status: "in-progress",
      assignee: userBhoomi._id,
      labels: ["realtime", "scaling"],
      milestone: "Realtime Scaling MVP",
      subtasks: [
        { title: "Deploy secure Redis instance in cluster", isCompleted: true },
        { title: "Configure adapter inside socket.js engine", isCompleted: false },
        { title: "Perform cluster load test with 5k simulated sockets", isCompleted: false },
      ],
      dependencies: ["Design Secure WebSocket Authentication Handshake"],
      blockers: [],
      reviewStage: "Under Review",
      deployOrder: 2,
      resources: [resource2._id],
      createdBy: userAryan._id,
    });

    const task3 = await Task.create({
      title: "Hardening Viewer Mode Workspace Restrictions",
      description: "Enforce strict read-only modes. Prevent drag presence, task movement, snippet saves, sprint generation, resource modifications, and wiki edits for users with viewer roles.",
      project: projectBoard._id,
      workspace: workspace._id,
      priority: "medium",
      status: "todo",
      assignee: userAryan._id,
      labels: ["rbac", "security"],
      milestone: "Security & Invite Hardening",
      subtasks: [
        { title: "Write global RBAC role restriction middleware", isCompleted: false },
        { title: "Harder client-side interactions on board component", isCompleted: false },
        { title: "Graceful error messages and error boundary logging", isCompleted: false },
      ],
      dependencies: [],
      blockers: [],
      deployOrder: 3,
      createdBy: userAryan._id,
    });

    console.log("Seeding Task Comments...");
    await Comment.create({
      task: task2._id,
      sender: userAryan._id,
      text: "I set up the Redis broker instance on AWS ElastiCache. Ready for testing whenever the socket adapter is configured.",
    });

    await Comment.create({
      task: task2._id,
      sender: userBhoomi._id,
      text: "Awesome! Integrating the socket.io-redis adapter now. Standard configurations require sticky sessions enabled on ALBs.",
    });

    console.log("Seeding Chat Messages...");
    const baseMessageData = {
      project: projectBoard._id,
      workspace: workspace._id,
      createdAt: new Date(Date.now() - 3600 * 1000),
    };

    await Message.create({
      ...baseMessageData,
      sender: userAryan._id,
      text: "Bhoomi, I shared the JWT Auth guide to the dashboard board. Let's make sure our handshakes validate the token correctly.",
      reactions: [{ emoji: "👍", users: [userBhoomi._id] }],
    });

    await Message.create({
      ...baseMessageData,
      sender: userBhoomi._id,
      text: "Perfect, looking at it now. I'll also add the production cluster Nginx setup guidelines for proxy upgrade parameters so websocket connections don't drop.",
      createdAt: new Date(Date.now() - 3400 * 1000),
      reactions: [{ emoji: "🔥", users: [userAryan._id] }],
    });

    await Message.create({
      ...baseMessageData,
      sender: userBhoomi._id,
      text: "System Event: Aryan connected resource 'JWT Architecture Guide for WebSockets' to Sprint 2",
      isSystem: true,
      createdAt: new Date(Date.now() - 3200 * 1000),
    });

    await Message.create({
      ...baseMessageData,
      sender: userAryan._id,
      text: "Nice work Bhoomi! I'm creating a wiki page on Multiplayer Engine Architecture so anyone joining Viewer mode can quickly understand the sync pipelines.",
      createdAt: new Date(Date.now() - 2800 * 1000),
    });

    console.log("Seeding Engineer's Space events...");
    const basePulseData = {
      workspace: workspace._id,
      actor: userAryan._id,
      actorName: "Aryan",
      createdAt: new Date(Date.now() - 7200 * 1000),
    };

    await PulseEvent.create({
      ...basePulseData,
      type: "workspace_created",
      content: "Aryan initialized workspace 'Collabrix Platform Hub'",
      metadata: { projectId: projectBoard._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      actor: userBhoomi._id,
      actorName: "Bhoomi",
      type: "workspace_created",
      content: "Bhoomi joined the workspace as admin",
      createdAt: new Date(Date.now() - 6800 * 1000),
      metadata: { projectId: projectBoard._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      type: "sprint_generated",
      content: "AI Sprint Planner generated Sprint 2 (Security & Invite Hardening)",
      createdAt: new Date(Date.now() - 6000 * 1000),
      metadata: { projectId: projectBoard._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      type: "task_moved",
      content: "Aryan created task: Design Secure WebSocket Authentication Handshake",
      createdAt: new Date(Date.now() - 5400 * 1000),
      metadata: { projectId: projectBoard._id, taskId: task1._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      actor: userBhoomi._id,
      actorName: "Bhoomi",
      type: "resource_shared",
      content: "Bhoomi attached Socket Nginx checklist resource to Production deploy tasks",
      createdAt: new Date(Date.now() - 4800 * 1000),
      metadata: { projectId: projectBoard._id, resourceId: resource3._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      actor: userAryan._id,
      actorName: "Aryan",
      type: "task_moved",
      content: "Aryan completed task: Design Secure WebSocket Authentication Handshake",
      createdAt: new Date(Date.now() - 3600 * 1000),
      metadata: { projectId: projectBoard._id, taskId: task1._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      actor: userAryan._id,
      actorName: "Aryan",
      type: "task_moved",
      content: "Aryan completed task: Define custom handshake headers",
      createdAt: new Date(Date.now() - 3500 * 1000),
      metadata: { projectId: projectBoard._id, taskId: task1._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      actor: userAryan._id,
      actorName: "Aryan",
      type: "task_moved",
      content: "Aryan completed task: Write connection exhaustion timeout script",
      createdAt: new Date(Date.now() - 3400 * 1000),
      metadata: { projectId: projectBoard._id, taskId: task1._id },
    });

    await PulseEvent.create({
      ...basePulseData,
      actor: userBhoomi._id,
      actorName: "Bhoomi",
      type: "temporal_summary",
      content: "AI Code Review generated for: Implement Multi-node Socket Sync with Redis Adapter",
      createdAt: new Date(Date.now() - 1800 * 1000),
      metadata: { projectId: projectBoard._id, taskId: task2._id },
    });

    console.log("Demo Workspace Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();
