import { atom } from "jotai";
import type { tProject } from "./types";

export const projectsInitStateAtom = atom(false);
export const projectsListAtom = atom<tProject[]>([]);

export const activeProjectIdAtom = atom<Maybe<string>>(null);
export const activeProjectAtom = atom((get) => {
  const activeId = get(activeProjectIdAtom);
  if (!activeId) return null;
  return (
    get(projectsListAtom).find((project) => project.id === activeId) || null
  );
});
export const activeProjectNameAtom = atom(
  (get) => get(activeProjectAtom)?.name ?? null,
);
export const activeProjectPackerSettingsAtom = atom(
  (get) => get(activeProjectAtom)?.packerSettings,
);
export const activeProjectOutputSettingsAtom = atom(
  (get) => get(activeProjectAtom)?.outputSettings,
);

export const addProjectAtom = atom(null, (get, set, project: tProject) => {
  const projects = get(projectsListAtom);
  set(projectsListAtom, projects.concat(project));
});

export const updateProjectAtom = atom(
  null,
  (
    get,
    set,
    id: string,
    updates: Partial<
      Pick<tProject, "name" | "packerSettings" | "outputSettings">
    >,
  ): boolean => {
    let wasUpdated = false;
    set(
      projectsListAtom,
      get(projectsListAtom).map((project) => {
        if (project.id === id) {
          wasUpdated = true;
          return { ...project, ...updates };
        } else {
          return project;
        }
      }),
    );
    return wasUpdated;
  },
);

export const removeProjectAtom = atom(null, (get, set, id: string) => {
  const projects = get(projectsListAtom);
  set(
    projectsListAtom,
    projects.filter((project) => project.id !== id),
  );
  if (get(activeProjectIdAtom) === id) {
    set(activeProjectIdAtom, null);
  }
});
