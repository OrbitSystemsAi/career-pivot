"use client";

import { styles } from "@/core/design/styles";
import { useOSState } from "@/core/state/OSStateProvider";
import { useUser } from "@/core/user/UserProvider";
import ProfilePhotoControl from "@/modules/home/components/ProfilePhotoControl";

type NavigationItem = {
  label: string;
  moduleId: string;
  viewId: string;
};

export default function D2NavigationFrame() {
  const {
    activeModule,
    activeView,
    setActiveModule,
    setActiveView,
  } = useOSState();
  const { user, updateProfile } = useUser();
  const goalDirections = user.onboarding?.goalDirections ?? [];
  const goalTypes = user.goals.flatMap((goal) => goal.goalTypes);
  const showContracts =
    goalDirections.includes("independent_work") ||
    goalTypes.includes("portfolio");
  const showBusiness =
    user.onboarding?.primaryIntent === "build_business" ||
    goalDirections.some((direction) =>
      [
        "start_business",
        "grow_business",
        "build_multiple_businesses",
      ].includes(direction),
    ) ||
    goalTypes.includes("business");
  const navigationGroups: NavigationItem[][] = [
    [
      { label: "Cover", moduleId: "home", viewId: "overview" },
      { label: "Resume", moduleId: "resume", viewId: "document" },
      { label: "Career", moduleId: "career", viewId: "goal" },
    ],
    [
      { label: "Paths", moduleId: "career", viewId: "market" },
      { label: "Opportunities", moduleId: "opportunity", viewId: "discover" },
      { label: "Jobs", moduleId: "jobs", viewId: "live" },
      ...(showContracts
        ? [{ label: "Contracts", moduleId: "opportunity", viewId: "contracts" }]
        : []),
      ...(showBusiness
        ? [{ label: "Business", moduleId: "opportunity", viewId: "business" }]
        : []),
    ],
    [
      { label: "Interest", moduleId: "network", viewId: "interest" },
      { label: "Groups", moduleId: "network", viewId: "groups" },
      { label: "Network", moduleId: "network", viewId: "map" },
      { label: "Colleagues", moduleId: "network", viewId: "colleagues" },
    ],
    [
      { label: "Stories", moduleId: "home", viewId: "stories" },
      { label: "Social", moduleId: "network", viewId: "outreach" },
    ],
    [{ label: "Agents", moduleId: "agents", viewId: "overview" }],
  ];

  return (
    <nav
      aria-label="Primary navigation"
      className="flex h-full w-48 shrink-0 flex-col overflow-y-auto bg-white shadow-[6px_0_24px_rgba(5,35,43,0.08)]"
    >
      <div className="flex shrink-0 justify-center px-4 py-5">
        <ProfilePhotoControl
          name={user.name}
          image={user.profileImage}
          onChange={(profileImage) => updateProfile({ profileImage })}
          onDelete={() => updateProfile({ profileImage: undefined })}
        />
      </div>

      <div className="flex w-full flex-1 flex-col py-1">
        {navigationGroups.map((group, groupIndex) => (
          <div
            className={groupIndex === 0 ? "" : "border-t border-[#d8e4e7] pt-2"}
            key={group[0].label}
          >
            {group.map((item) => {
              const selected =
                activeModule === item.moduleId && activeView === item.viewId;

              return (
                <button
                  aria-current={selected ? "page" : undefined}
                  className={`${styles.button.nav} ${
                    selected
                      ? styles.button.navSelected
                      : styles.button.navDefault
                  }`}
                  key={item.label}
                  onClick={() => {
                    setActiveModule(item.moduleId);
                    setActiveView(item.viewId);
                  }}
                  type="button"
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
