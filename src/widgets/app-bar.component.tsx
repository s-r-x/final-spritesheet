import { useTranslation } from "@/i18n/use-translation";
import { activeProjectAtom } from "@/projects/projects.atom";
import { useOpenProjectEditor } from "@/projects/use-project-editor";
import { Menu, ActionIcon, Flex, useMantineColorScheme } from "@mantine/core";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { Menu as MenuIcon } from "lucide-react";
import { useCreateProject } from "@/projects/use-create-project";
import { useProjectsList } from "@/projects/use-projects-list";
import { useRemoveProject } from "@/projects/use-remove-project";
import { useLanguage } from "@/i18n/use-language";
import { SUPPORTED_LANGUAGES } from "#config";
import { useMutation } from "@/common/hooks/use-mutation";
import { useExportDb, useImportDb } from "@/persistence/use-db";

const i18nNs = "app_menu.";
const PackerAppBar = () => {
  const { mutation: importDbMut, upload: uploadBackup } = useImportDb();
  const exportDb = useExportDb();
  const exportDbMut = useMutation(exportDb, {
    showLoadingBar: true,
  });
  const activeProject = useAtomValue(activeProjectAtom);
  const navigate = useNavigate();
  const openProjectEditor = useOpenProjectEditor();
  const createProject = useCreateProject();
  const createProjectMut = useMutation(createProject, {
    showLoadingBar: true,
    onSuccess({ project }) {
      navigate({
        to: "/projects/{-$projectId}",
        params: {
          projectId: project.id,
        },
      });
    },
  });
  const projectsList = useProjectsList();
  const removeProject = useRemoveProject();
  const removeProjectMut = useMutation(removeProject, {
    showLoadingBar: true,
    confirm: true,
  });
  const [, setLang] = useLanguage();
  const { setColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  return (
    <Flex justify="space-between" align="center">
      {activeProject && <span>{activeProject.name}</span>}
      <Menu width={200} position="right-start">
        <Menu.Target>
          <ActionIcon aria-label={t("open_menu")} variant="transparent">
            <MenuIcon />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>{t(i18nNs + "show_projects_list")}</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              {projectsList.map((project) => (
                <Menu.Item key={project.id}>
                  <Link
                    to="/projects/{-$projectId}"
                    params={{
                      projectId: project.id,
                    }}
                  >
                    {project.name}
                  </Link>
                </Menu.Item>
              ))}
            </Menu.Sub.Dropdown>
          </Menu.Sub>
          <Menu.Item
            disabled={createProjectMut.isLoading}
            onClick={() => createProjectMut.mutate()}
          >
            {t(i18nNs + "new_project")}
          </Menu.Item>
          {activeProject && (
            <>
              <Menu.Item onClick={() => openProjectEditor(activeProject.id)}>
                {t(i18nNs + "edit_project")}
              </Menu.Item>
              <Menu.Item
                disabled={removeProjectMut.isLoading}
                onClick={() => {
                  removeProjectMut.mutate(activeProject.id);
                }}
              >
                {t(i18nNs + "remove_project")}
              </Menu.Item>
            </>
          )}
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>{t(i18nNs + "prefs")}</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              <Menu.Sub>
                <Menu.Sub.Target>
                  <Menu.Sub.Item>{t(i18nNs + "lang")}</Menu.Sub.Item>
                </Menu.Sub.Target>
                <Menu.Sub.Dropdown>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <Menu.Item key={l.value} onClick={() => setLang(l.value)}>
                      {l.label}
                    </Menu.Item>
                  ))}
                </Menu.Sub.Dropdown>
              </Menu.Sub>
              <Menu.Sub>
                <Menu.Sub.Target>
                  <Menu.Sub.Item>{t(i18nNs + "theme")}</Menu.Sub.Item>
                </Menu.Sub.Target>

                <Menu.Sub.Dropdown>
                  <Menu.Item onClick={() => setColorScheme("dark")}>
                    {t(i18nNs + "theme_dark")}
                  </Menu.Item>
                  <Menu.Item onClick={() => setColorScheme("light")}>
                    {t(i18nNs + "theme_light")}
                  </Menu.Item>
                  <Menu.Item onClick={() => setColorScheme("auto")}>
                    {t(i18nNs + "theme_system")}
                  </Menu.Item>
                </Menu.Sub.Dropdown>
              </Menu.Sub>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
          <Menu.Item
            disabled={exportDbMut.isLoading}
            onClick={() => exportDbMut.mutate()}
          >
            {t("backup.create_backup")}
          </Menu.Item>
          <Menu.Item disabled={importDbMut.isLoading} onClick={uploadBackup}>
            {t("backup.restore_from_backup")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};
export default PackerAppBar;
