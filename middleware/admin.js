export default defineNuxtRouteMiddleware(async () => {
  const user = useState("user");
  if (!user.value?.id) {
    const CurrentUser = await $fetch(
      "https://api.inicontent.com/emplois_du_temps/user/current"
    );
    user.value = CurrentUser.result;
    if (!user.value?.id) return navigateTo("/");
    if (user.value.role !== "admin") {
      user.value = null;
      return navigateTo("/");
    }
  }
});
