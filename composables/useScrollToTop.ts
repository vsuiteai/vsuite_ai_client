export const useScrollToTop = (sectionId: string) => {
  onMounted(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  onUpdated(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
};
