// wagmi.config.ts
import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
var wagmi_config_default = defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    foundry({
      artifacts: "out/",
      include: ["FartherToken.sol/**", "FartherAirdrop.sol/**"]
    }),
    react()
  ]
});
export {
  wagmi_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsid2FnbWkuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9Vc2Vycy9tYXN1cmthL2NvZGUvZmFydGhlci9wYWNrYWdlcy9wcm90b2NvbC93YWdtaS5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL1VzZXJzL21hc3Vya2EvY29kZS9mYXJ0aGVyL3BhY2thZ2VzL3Byb3RvY29sXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9Vc2Vycy9tYXN1cmthL2NvZGUvZmFydGhlci9wYWNrYWdlcy9wcm90b2NvbC93YWdtaS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwiQHdhZ21pL2NsaVwiO1xuaW1wb3J0IHsgZm91bmRyeSwgcmVhY3QgfSBmcm9tIFwiQHdhZ21pL2NsaS9wbHVnaW5zXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIG91dDogXCJzcmMvZ2VuZXJhdGVkLnRzXCIsXG4gIGNvbnRyYWN0czogW10sXG4gIHBsdWdpbnM6IFtcbiAgICBmb3VuZHJ5KHtcbiAgICAgIGFydGlmYWN0czogXCJvdXQvXCIsXG4gICAgICBpbmNsdWRlOiBbXCJGYXJ0aGVyVG9rZW4uc29sLyoqXCIsIFwiRmFydGhlckFpcmRyb3Auc29sLyoqXCJdLFxuICAgIH0pLFxuICAgIHJlYWN0KCksXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVIsU0FBUyxvQkFBb0I7QUFDcFQsU0FBUyxTQUFTLGFBQWE7QUFFL0IsSUFBTyx1QkFBUSxhQUFhO0FBQUEsRUFDMUIsS0FBSztBQUFBLEVBQ0wsV0FBVyxDQUFDO0FBQUEsRUFDWixTQUFTO0FBQUEsSUFDUCxRQUFRO0FBQUEsTUFDTixXQUFXO0FBQUEsTUFDWCxTQUFTLENBQUMsdUJBQXVCLHVCQUF1QjtBQUFBLElBQzFELENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
