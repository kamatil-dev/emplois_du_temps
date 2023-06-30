export default defineNuxtRouteMiddleware(async () => {
  const user = useState("user");
  if (user.value && user.value.id) return navigateTo("/emplois");
  const CurrentUser = await $fetch(
    "https://api.inicontent.com/emplois_du_temps/user/current"
  );
  user.value = CurrentUser.result ?? null;
  if (user.value && user.value.id) return navigateTo("/emplois");
});
