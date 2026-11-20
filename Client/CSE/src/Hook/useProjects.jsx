import { useState, useEffect } from "react";
import { handleApiAction } from "../Utils/ApiHandler";

const useProjects = (userId) => {
  const [userProjects, setUserProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return;
      try {
        setProjectsLoading(true);
        const projects = await handleApiAction({ action: "GET", target: "projects" });
        const filtered = projects.filter((p) => p.userId === userId || p.ownerId === userId);
        setUserProjects(filtered);
      } catch (err) {
        console.error("Fetch Projects Error:", err);
        setUserProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  // Add Project
  const handleAddProject = async () => {
    const projectName = prompt("Enter Project Name:");
    if (!projectName) return;
    const location = prompt("Enter Project Location:", "Dhaka, Bangladesh");

    try {
      const newProjectData = {
        userId,
        name: projectName,
        location: location || "N/A",
        status: "Ongoing",
        createdAt: new Date().toISOString(),
      };

      const createdProject = await handleApiAction({
        action: "ADD",
        target: "projects",
        payload: newProjectData,
      });

      if (createdProject) {
        setUserProjects((prev) => [...prev, createdProject]);
        alert("Project added successfully!");
      }
    } catch (error) {
      alert("Failed to add project.");
    }
  };

  // Edit Project
  const handleEditProject = async (project) => {
    const newName = prompt("Update Project Name:", project.name);
    if (!newName) return;

    try {
      const updatedProject = await handleApiAction({
        action: "EDIT",
        target: "projects",
        payload: { id: project.id, name: newName },
      });

      if (updatedProject) {
        setUserProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, ...updatedProject } : p))
        );
        alert("Project updated successfully!");
      }
    } catch (error) {
      alert("Failed to update project.");
    }
  };

  // Delete Project
  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await handleApiAction({
        action: "DELETE",
        target: "projects",
        payload: { id: projectId },
      });

      setUserProjects((prev) => prev.filter((p) => p.id !== projectId));
      alert("Project deleted successfully!");
    } catch (error) {
      alert("Failed to delete project.");
    }
  };

  return {
    userProjects,
    projectsLoading,
    handleAddProject,
    handleEditProject,
    handleDeleteProject,
  };
};

export default useProjects;