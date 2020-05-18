const API = {
  baseUrl: "https://readerapi.codepolitan.com/articles",
};

const ROUTES = [
  {
    path: "home",
    title: "KepoBro News - Kepoin tentang yang hits saat ini!",
  },
  {
    path: "about",
    title: "KepoBro News - About Developer",
  },
  {
    path: "contact",
    title: "KepoBro News - Contact Developer",
  },
  {
    path: "404",
    title: "KepoBro News - Page Not Found",
  },
];

const methods = {
  fetchArticles: async () => {
    try {
      let articleHtml = "";

      const articleElement = document.querySelector(".Article");
      const { result: articles } = await api.get(API.baseUrl);

      articles.forEach((article) => {
        articleHtml += `
          <div class="card grey lighten-4 z-depth-0">
            <div class="card-image">
              <img src="${article.thumbnail}" alt="${article.title}">
            </div>
          
            <div class="card-content">
              <span class="card-title truncate">
                ${article.title}
              </span>

              <p>${article.description}</p>
            </div>
          </div>
        `;
      });

      articleElement.innerHTML = articleHtml;
    } catch (error) {}
  },

  getSelectedRoute: (path) => {
    return ROUTES.find((route) => {
      return route.path === path || route.path === "404";
    });
  },

  initializeSidebarMenus: () => {
    document.querySelectorAll(".sidenav a").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();

        const page = event.target.getAttribute("href");
        const sidenav = document.querySelector(".sidenav");
        const selectedRoute = methods.getSelectedRoute(page);

        M.Sidenav.getInstance(sidenav).close();
        methods.navigate(selectedRoute);
      });
    });
  },

  initializeButtonLogo: () => {
    const button = document.querySelector("#BtnLogo");
    const page = button.getAttribute("href");
    const selectedRoute = methods.getSelectedRoute(page);

    button.addEventListener("click", (event) => {
      event.preventDefault();

      methods.navigate(selectedRoute);
    });
  },

  loadPage: (page) => {
    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      const content = document.querySelector(".Main .Main-body");

      switch (this.status) {
        case 200: {
          content.innerHTML = xhttp.responseText;

          if (page === "home") methods.fetchArticles();

          break;
        }

        case 404: {
          const selectedRoute = methods.getSelectedRoute("404");
          methods.navigate(selectedRoute);
          break;
        }

        default: {
          content.innerHTML = this.status;
        }
      }
    };

    xhttp.open("GET", `pages/${page}.html`, true);
    xhttp.send();
  },

  navigate: (state) => {
    const { path, title } = state;
    const url = `/#/${path}`;

    history.pushState(state, null, url);

    methods.setDocumentTitle(title);
    methods.loadPage(path);
  },

  registerServiceWorker: () => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("service-worker.js")
          .then(() => console.log("Service worker registration success."))
          .catch((error) => {
            console.error("Error during service worker registration:", error);
          });
      });
    }
  },

  setDocumentTitle: function (title) {
    document.title = title;
  },

  showOfflineToast: function () {
    M.Toast.dismissAll();
    M.toast({
      html: "You are currently offline.",
      classes: "red",
      displayLength: 36000,
      outDuration: 0,
    });
  },

  showOnlineToast: function () {
    M.Toast.dismissAll();
    M.toast({
      html: "Connected",
      classes: "green",
      outDuration: 0,
    });
  },
};

const mounted = () => {
  const path = window.location.hash.substr(2) || "home";
  const { title } = methods.getSelectedRoute(path);
  const sidenav = document.querySelectorAll(".sidenav");

  M.Sidenav.init(sidenav);

  methods.initializeSidebarMenus();
  methods.initializeButtonLogo();
  methods.setDocumentTitle(title);
  methods.loadPage(path);
};

window.addEventListener("popstate", (event) => {
  let { state } = event;

  if (!state) {
    state = methods.getSelectedRoute("home");
  }

  methods.setDocumentTitle(state.title);
  methods.loadPage(state.path);
});

window.addEventListener("offline", () => {
  methods.showOfflineToast();
});

window.addEventListener("online", () => {
  methods.showOnlineToast();
});

document.addEventListener("DOMContentLoaded", mounted());

methods.registerServiceWorker();
