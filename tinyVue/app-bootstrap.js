/* ===================================================
   tinyVue 1.0 — App Bootstrap
   Router definitions + mount sequence
   =================================================== */
(function () {
const { createRouter, createApp, createComponentInstance, mountComponent } = window.tinyVue;
const { App, HomeView, AboutView, SkillsView, ExperienceView, EducationView,
        ProjectsView, ProjectDetailView, AchievementsView, ServicesView,
        MultimediaWorksView, ContactView } = window.tinyVueComponents;

const routes = [
  { path: '/', component: HomeView, meta: { title: 'Home' } },
  { path: '/about', component: AboutView, meta: { title: 'About' } },
  { path: '/skills', component: SkillsView, meta: { title: 'Skills' } },
  { path: '/experience', component: ExperienceView, meta: { title: 'Experience' } },
  { path: '/education', component: EducationView, meta: { title: 'Education' } },
  { path: '/projects', component: ProjectsView, meta: { title: 'Projects' } },
  { path: '/project/:id', component: ProjectDetailView, meta: { title: 'Project' } },
  { path: '/multimedia-works', component: MultimediaWorksView, meta: { title: 'Multimedia Works' } },
  { path: '/achievements', component: AchievementsView, meta: { title: 'Achievements' } },
  { path: '/services', component: ServicesView, meta: { title: 'Services' } },
  { path: '/contact', component: ContactView, meta: { title: 'Contact' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  mode: 'hash',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/projects') {
      const savedY = sessionStorage.getItem('projectsScrollY');
      if (savedY) {
        sessionStorage.removeItem('projectsScrollY');
        return { top: parseInt(savedY), behavior: 'smooth' };
      }
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Step 1: Mount App layout
const appEl = document.querySelector('#app');
const appInstance = createComponentInstance(App);
mountComponent(appInstance, appEl);

// Step 2: Init router inside route outlet
const outlet = document.getElementById('route-outlet');
if (outlet) {
  router.init(outlet);
}

if (window.tinyVue.SLIM_DEBUG) {
  console.log('[tinyVue] Bootstrapped', { routes: routes.length });
}
})();
