import type { ModuleDefinition } from "@/core/types/module";
import {
  HomeDashboard,
  HomeDirectionPanel,
  HomeIdentityPanel,
  HomeMomentumPanel,
  HomeNextPanel,
  HomeProofPanel,
  HomeStrengthPanel,
  ProfileEditor,
} from "@/modules/home";

export const homeModule: ModuleDefinition = {
  id: "home",
  name: "Home",
  description: "Your Best Work",
  icon: "⌂",
  metrics: [
    { label: "Profile", value: "Best of Me" },
    { label: "Strength", value: "Visible" },
    { label: "Proof", value: "Connected" },
    { label: "Direction", value: "Clear" },
  ],
  views: [
    { label: "Overview", id: "overview" },
    { label: "Profile", id: "profile" },
  ],
  panels: {
    visualization: HomeDashboard,
    utilityTop: HomeIdentityPanel,
    utilityMiddle: HomeDirectionPanel,
    utilityBottom: HomeProofPanel,
    bottomLeft: HomeStrengthPanel,
    bottomCenter: HomeMomentumPanel,
    bottomRight: HomeNextPanel,
  },
  viewPanels: {
    profile: { visualization: ProfileEditor },
  },
  shell: {
    showBottomWorkspace: false,
  },
};
